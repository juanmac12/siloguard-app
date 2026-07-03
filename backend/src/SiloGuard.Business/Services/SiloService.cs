using SiloGuard.Business.Dtos.Silos;
using SiloGuard.Business.Exceptions;
using SiloGuard.Business.Sanitization;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class SiloService : ISiloService
{
    private readonly ISiloRepository _silos;
    private readonly ISensorReadingRepository _readings;
    private readonly IUnitOfWork _uow;
    private readonly IInputSanitizer _sanitizer;

    public SiloService(
        ISiloRepository silos,
        ISensorReadingRepository readings,
        IUnitOfWork uow,
        IInputSanitizer sanitizer)
    {
        _silos = silos;
        _readings = readings;
        _uow = uow;
        _sanitizer = sanitizer;
    }

    public Task<List<Silo>> ListAsync(int userId, CancellationToken ct = default) =>
        _silos.ListByUserAsync(userId, ct);

    public async Task<Silo> GetAsync(int userId, int siloId, CancellationToken ct = default) =>
        await GetOwnedAsync(userId, siloId, ct);

    public async Task<Silo> CreateAsync(int userId, SiloCreateRequest request, CancellationToken ct = default)
    {
        var silo = new Silo
        {
            UserId = userId,
            Name = _sanitizer.Sanitize(request.Name) ?? string.Empty,
            Grain = _sanitizer.Sanitize(request.Grain) ?? string.Empty,
            Tons = request.Tons,
            Acopio = _sanitizer.Sanitize(request.Acopio) ?? string.Empty,
            Storage = _sanitizer.Sanitize(request.Storage) ?? string.Empty,
            Status = ComputeStatus(request.InitialTemp, request.InitialHum, request.InitialCo2),
            LastTemp = request.InitialTemp,
            LastHum = request.InitialHum,
            LastCo2 = request.InitialCo2,
            LastReadingAt = DateTime.UtcNow,
        };

        // Transaccion maestro-detalle: Silo (cabecera) + SensorReading inicial (detalle).
        // Si la lectura viola un check constraint de rango, el rollback deshace TAMBIEN
        // el Silo insertado en el paso anterior — no debe quedar un silo huerfano.
        await _uow.BeginTransactionAsync(ct);
        try
        {
            await _silos.AddAsync(silo, ct);
            await _uow.SaveChangesAsync(ct); // necesario para obtener silo.Id

            await _readings.AddAsync(new SensorReading
            {
                SiloId = silo.Id,
                Timestamp = DateTime.UtcNow,
                Temp = request.InitialTemp,
                Hum = request.InitialHum,
                Co2 = request.InitialCo2,
            }, ct);
            await _uow.SaveChangesAsync(ct);

            await _uow.CommitAsync(ct);
        }
        catch
        {
            await _uow.RollbackAsync(ct);
            throw new ConflictException("No se pudo crear el silo: la lectura inicial está fuera de rango.");
        }

        return silo;
    }

    public async Task<Silo> UpdateAsync(int userId, int siloId, SiloUpdateRequest request, CancellationToken ct = default)
    {
        var silo = await GetOwnedAsync(userId, siloId, ct);

        silo.Name = _sanitizer.Sanitize(request.Name) ?? silo.Name;
        silo.Grain = _sanitizer.Sanitize(request.Grain) ?? silo.Grain;
        silo.Tons = request.Tons;
        silo.Acopio = _sanitizer.Sanitize(request.Acopio) ?? silo.Acopio;
        silo.Storage = _sanitizer.Sanitize(request.Storage) ?? silo.Storage;

        await _uow.SaveChangesAsync(ct);
        return silo;
    }

    public async Task DeleteAsync(int userId, int siloId, CancellationToken ct = default)
    {
        var silo = await GetOwnedAsync(userId, siloId, ct);
        _silos.Remove(silo); // cascada configurada en SiloConfiguration: borra tambien Readings y Alerts
        await _uow.SaveChangesAsync(ct);
    }

    private async Task<Silo> GetOwnedAsync(int userId, int siloId, CancellationToken ct)
    {
        var silo = await _silos.GetByIdAsync(siloId, ct)
            ?? throw new NotFoundException("No se encontró el silo.");

        if (silo.UserId != userId)
            throw new ForbiddenAppException("No tenés acceso a este silo.");

        return silo;
    }

    private static string ComputeStatus(decimal temp, decimal hum, decimal co2)
    {
        if (temp > 35 || co2 > 800) return "critical";
        if (temp > 27 || hum > 16 || co2 > 550) return "warn";
        return "ok";
    }
}
