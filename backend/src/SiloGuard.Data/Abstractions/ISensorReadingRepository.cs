using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public record PagedReadings(List<SensorReading> Items, int TotalCount);

public interface ISensorReadingRepository
{
    Task AddAsync(SensorReading reading, CancellationToken ct = default);
    Task<PagedReadings> GetPagedAsync(int siloId, DateTime since, int page, int pageSize, CancellationToken ct = default);
}
