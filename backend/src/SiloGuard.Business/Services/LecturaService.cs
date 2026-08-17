using SiloGuard.Business.Dtos.Common;
using SiloGuard.Business.Dtos.Lecturas;
using SiloGuard.Business.Exceptions;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class LecturaService : ILecturaService
{
    private readonly ISiloRepository _silos;
    private readonly ISensorReadingRepository _readings;
    private readonly IUnitOfWork _uow;

    public LecturaService(ISiloRepository silos, ISensorReadingRepository readings, IUnitOfWork uow)
    {
        _silos = silos;
        _readings = readings;
        _uow = uow;
    }

    public async Task<PagedResult<SensorReading>> GetPagedAsync(
        int userId, int siloId, string range, int page, int pageSize, CancellationToken ct = default)
    {
        var silo = await _silos.GetByIdAsync(siloId, ct) ?? throw new NotFoundException("No se encontró el silo.");
        if (silo.UserId != userId) throw new ForbiddenAppException("No tenés acceso a este silo.");

        var since = range switch
        {
            "24h" => DateTime.UtcNow.AddHours(-24),
            "48h" => DateTime.UtcNow.AddHours(-48),
            "7d" => DateTime.UtcNow.AddDays(-7),
            _ => DateTime.UtcNow.AddHours(-24),
        };

        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 200);

        var (items, total) = await _readings.GetPagedAsync(siloId, since, page, pageSize, ct);
        return new PagedResult<SensorReading>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total,
        };
    }

    public async Task<SensorReading> AddAsync(
        int userId, int siloId, LecturaCreateRequest request, CancellationToken ct = default)
    {
        var silo = await _silos.GetByIdAsync(siloId, ct) ?? throw new NotFoundException("No se encontró el silo.");
        if (silo.UserId != userId) throw new ForbiddenAppException("No tenés acceso a este silo.");

        var reading = new SensorReading
        {
            SiloId = siloId,
            Timestamp = DateTime.UtcNow,
            Co2 = request.Co2,
            Temp = request.Temp,
            Hum = request.Hum,
        };

        // Cachea la ultima lectura en el Silo (dashboard/lista la leen de ahi sin
        // recalcular sobre SensorReadings) y recalcula el status con el mismo
        // heuristico que usa el alta inicial del silo.
        silo.LastCo2 = request.Co2;
        silo.LastTemp = request.Temp;
        silo.LastHum = request.Hum;
        silo.LastReadingAt = reading.Timestamp;
        silo.Status = SiloService.ComputeStatus(request.Temp, request.Hum, request.Co2);

        try
        {
            await _readings.AddAsync(reading, ct);
            await _uow.SaveChangesAsync(ct);
        }
        catch
        {
            // Igual que SiloService.CreateAsync: un check constraint de la base (rango de
            // Temp/Hum/Co2) rechaza el INSERT antes que se pueda traducir a una excepcion
            // de EF Core propia — Business no debe importar Microsoft.EntityFrameworkCore
            // para tipar el catch, asi que se generaliza a un 409.
            throw new ConflictException("No se pudo registrar la lectura: el valor está fuera de rango.");
        }

        return reading;
    }
}
