using SiloGuard.Business.Dtos.Common;
using SiloGuard.Business.Exceptions;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class LecturaService : ILecturaService
{
    private readonly ISiloRepository _silos;
    private readonly ISensorReadingRepository _readings;

    public LecturaService(ISiloRepository silos, ISensorReadingRepository readings)
    {
        _silos = silos;
        _readings = readings;
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
}
