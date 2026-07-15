using System.Text.RegularExpressions;
using SiloGuard.Business.Dtos.Lotes;
using SiloGuard.Business.Exceptions;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class LoteService : ILoteService
{
    private readonly ILoteRepository _lotes;
    private readonly ISiloRepository _silos;
    private readonly ISensorReadingRepository _readings;
    private readonly IAlertaRepository _alertas;
    private readonly IDestinatarioRepository _destinatarios;
    private readonly IUnitOfWork _uow;

    public LoteService(
        ILoteRepository lotes,
        ISiloRepository silos,
        ISensorReadingRepository readings,
        IAlertaRepository alertas,
        IDestinatarioRepository destinatarios,
        IUnitOfWork uow)
    {
        _lotes = lotes;
        _silos = silos;
        _readings = readings;
        _alertas = alertas;
        _destinatarios = destinatarios;
        _uow = uow;
    }

    public Task<List<Lote>> ListAsync(int userId, CancellationToken ct = default) =>
        _lotes.ListByUserAsync(userId, ct);

    public async Task<Lote> GetAsync(int userId, int loteId, CancellationToken ct = default) =>
        await GetOwnedAsync(userId, loteId, ct);

    public async Task<Lote> IniciarAsync(int userId, int siloId, CancellationToken ct = default)
    {
        var silo = await GetOwnedSiloAsync(userId, siloId, ct);

        var active = await _lotes.GetActiveBySiloAsync(siloId, ct);
        if (active is not null)
            throw new ConflictException("El silo ya tiene un lote en monitoreo. Finalizalo antes de iniciar otro.");

        var now = DateTime.UtcNow;
        var lote = new Lote
        {
            SiloId = siloId,
            Silo = silo,
            Name = $"Lote {silo.Grain} {StripSiloPrefix(silo.Name)}".Trim(),
            Grain = silo.Grain,
            Tons = silo.Tons,
            StartAt = now,
            Status = "monitoring",
            // Snapshot inicial del pasaporte a partir de la ultima lectura conocida del silo.
            AvgCo2 = silo.LastCo2,
            AvgTemp = silo.LastTemp,
            AvgHum = silo.LastHum,
            Score = ComputeScore(silo.LastTemp, silo.LastHum, silo.LastCo2),
            AlertsResolved = 0,
        };

        await _lotes.AddAsync(lote, ct);
        await _uow.SaveChangesAsync(ct); // necesario para obtener lote.Id
        lote.Codigo = $"SG-{now.Year}-{lote.Id:X4}";
        await _uow.SaveChangesAsync(ct);

        return lote;
    }

    public async Task<Lote> FinalizarAsync(int userId, int loteId, CancellationToken ct = default)
    {
        var lote = await GetOwnedAsync(userId, loteId, ct);
        if (lote.Status == "finalized")
            throw new ConflictException("El lote ya está finalizado.");

        var now = DateTime.UtcNow;

        // Operacion compuesta: lee las lecturas de la ventana (detalle) para computar el
        // pasaporte y actualiza el lote (cabecera) en una sola transaccion.
        await _uow.BeginTransactionAsync(ct);
        try
        {
            var avg = await _readings.GetAveragesAsync(lote.SiloId, lote.StartAt, now, ct);
            var resolved = await _alertas.CountResolvedAsync(lote.SiloId, lote.StartAt, now, ct);

            if (avg.Count > 0)
            {
                lote.AvgCo2 = avg.Co2;
                lote.AvgTemp = avg.Temp;
                lote.AvgHum = avg.Hum;
            }

            lote.Score = ComputeScore(lote.AvgTemp, lote.AvgHum, lote.AvgCo2);
            lote.AlertsResolved = resolved;
            lote.EndAt = now;
            lote.Status = "finalized";

            await _uow.SaveChangesAsync(ct);
            await _uow.CommitAsync(ct);
        }
        catch
        {
            await _uow.RollbackAsync(ct);
            throw;
        }

        return lote;
    }

    public Task<List<Destinatario>> ListDestinatariosCatalogoAsync(CancellationToken ct = default) =>
        _destinatarios.ListAsync(ct);

    public async Task<List<LoteDestinatario>> ListDestinatariosDeLoteAsync(int userId, int loteId, CancellationToken ct = default)
    {
        var lote = await GetOwnedAsync(userId, loteId, ct);
        return await _destinatarios.ListSharesByLoteAsync(lote.Id, ct);
    }

    public async Task<List<LoteDestinatario>> CompartirAsync(int userId, int loteId, CompartirLoteRequest request, CancellationToken ct = default)
    {
        var lote = await GetOwnedAsync(userId, loteId, ct);

        var destinatarios = await _destinatarios.GetByIdsAsync(request.DestinatarioIds, ct);
        if (destinatarios.Count != request.DestinatarioIds.Distinct().Count())
            throw new NotFoundException("Alguno de los destinatarios no existe.");

        // Alta N-N transaccional: se insertan todas las filas de LoteDestinatarios juntas
        // (idempotente: los destinatarios que ya tenian el pasaporte no se duplican).
        var existentes = await _destinatarios.ListSharesByLoteAsync(lote.Id, ct);
        var yaCompartidos = existentes.Select(e => e.DestinatarioId).ToHashSet();
        var ahora = DateTime.UtcNow;

        var nuevos = destinatarios
            .Where(d => !yaCompartidos.Contains(d.Id))
            .Select(d => new LoteDestinatario
            {
                LoteId = lote.Id,
                DestinatarioId = d.Id,
                Destinatario = d,
                CompartidoAt = ahora,
            })
            .ToList();

        if (nuevos.Count > 0)
        {
            await _uow.BeginTransactionAsync(ct);
            try
            {
                await _destinatarios.AddSharesAsync(nuevos, ct);
                await _uow.SaveChangesAsync(ct);
                await _uow.CommitAsync(ct);
            }
            catch
            {
                await _uow.RollbackAsync(ct);
                throw;
            }
        }

        return await _destinatarios.ListSharesByLoteAsync(lote.Id, ct);
    }

    private async Task<Lote> GetOwnedAsync(int userId, int loteId, CancellationToken ct)
    {
        var lote = await _lotes.GetByIdAsync(loteId, ct)
            ?? throw new NotFoundException("No se encontró el lote.");

        if (lote.Silo.UserId != userId)
            throw new ForbiddenAppException("No tenés acceso a este lote.");

        return lote;
    }

    private async Task<Silo> GetOwnedSiloAsync(int userId, int siloId, CancellationToken ct)
    {
        var silo = await _silos.GetByIdAsync(siloId, ct)
            ?? throw new NotFoundException("No se encontró el silo.");

        if (silo.UserId != userId)
            throw new ForbiddenAppException("No tenés acceso a este silo.");

        return silo;
    }

    // Puntaje de calidad 0-100 alineado con ComputeStatus de SiloService: penaliza por
    // umbrales de warn/critical de cada sensor.
    private static int ComputeScore(decimal temp, decimal hum, decimal co2)
    {
        var score = 100;

        if (temp > 35) score -= 25;
        else if (temp > 27) score -= 10;

        if (hum > 16) score -= 12;

        if (co2 > 800) score -= 25;
        else if (co2 > 550) score -= 10;

        return Math.Clamp(score, 0, 100);
    }

    private static string StripSiloPrefix(string name) =>
        Regex.Replace(name, "^Silo\\s*", "", RegexOptions.IgnoreCase).Trim();
}
