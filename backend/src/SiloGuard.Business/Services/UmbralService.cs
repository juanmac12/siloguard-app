using SiloGuard.Business.Dtos.Silos;
using SiloGuard.Business.Exceptions;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class UmbralService : IUmbralService
{
    private readonly IUmbralRepository _umbrales;
    private readonly ISiloRepository _silos;
    private readonly IUnitOfWork _uow;

    // Umbrales recomendados (mismos defaults que usaba la app en el prototipo).
    private static readonly (string Variable, decimal Warn, decimal Crit)[] Recomendados =
    [
        ("co2", 600m, 800m),
        ("hum", 16m, 20m),
        ("temp", 28m, 35m),
    ];

    public UmbralService(IUmbralRepository umbrales, ISiloRepository silos, IUnitOfWork uow)
    {
        _umbrales = umbrales;
        _silos = silos;
        _uow = uow;
    }

    public async Task<(List<Umbral> Items, bool IsCustom)> GetAsync(int userId, int siloId, CancellationToken ct = default)
    {
        var silo = await GetOwnedSiloAsync(userId, siloId, ct);

        var custom = await _umbrales.ListBySiloAsync(silo.Id, ct);
        if (custom.Count > 0) return (custom, true);

        // Sin personalizacion: se devuelven los recomendados (no se persisten).
        var defaults = Recomendados
            .Select(r => new Umbral { SiloId = silo.Id, Variable = r.Variable, Warn = r.Warn, Crit = r.Crit })
            .ToList();
        return (defaults, false);
    }

    public async Task<List<Umbral>> UpdateAsync(int userId, int siloId, UmbralesUpdateRequest request, CancellationToken ct = default)
    {
        var silo = await GetOwnedSiloAsync(userId, siloId, ct);

        // Maestro-detalle transaccional: se reemplazan los 3 detalles (umbrales) del
        // maestro (silo) en bloque. Si un INSERT viola el check Warn < Crit de la base,
        // el rollback deshace tambien el DELETE previo — nunca queda un silo sin umbrales
        // a medias (rubrica Parte 4.2 / 4.3).
        await _uow.BeginTransactionAsync(ct);
        try
        {
            var existentes = await _umbrales.ListBySiloAsync(silo.Id, ct);
            _umbrales.RemoveRange(existentes);
            await _uow.SaveChangesAsync(ct);

            var nuevos = request.Items
                .Select(i => new Umbral { SiloId = silo.Id, Variable = i.Variable, Warn = i.Warn, Crit = i.Crit })
                .ToList();
            await _umbrales.AddRangeAsync(nuevos, ct);
            await _uow.SaveChangesAsync(ct);

            await _uow.CommitAsync(ct);
            return nuevos;
        }
        catch
        {
            await _uow.RollbackAsync(ct);
            throw new ConflictException(
                "No se pudieron guardar los umbrales: verificá que cada valor de advertencia sea menor que el crítico.");
        }
    }

    public async Task RestoreAsync(int userId, int siloId, CancellationToken ct = default)
    {
        var silo = await GetOwnedSiloAsync(userId, siloId, ct);

        var existentes = await _umbrales.ListBySiloAsync(silo.Id, ct);
        if (existentes.Count == 0) return; // ya esta en recomendados

        _umbrales.RemoveRange(existentes);
        await _uow.SaveChangesAsync(ct);
    }

    private async Task<Silo> GetOwnedSiloAsync(int userId, int siloId, CancellationToken ct)
    {
        var silo = await _silos.GetByIdAsync(siloId, ct)
            ?? throw new NotFoundException("No se encontró el silo.");

        if (silo.UserId != userId)
            throw new ForbiddenAppException("No tenés acceso a este silo.");

        return silo;
    }
}
