using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public record PagedReadings(List<SensorReading> Items, int TotalCount);

public record ReadingAverages(decimal Co2, decimal Temp, decimal Hum, int Count);

public interface ISensorReadingRepository
{
    Task AddAsync(SensorReading reading, CancellationToken ct = default);
    Task<PagedReadings> GetPagedAsync(int siloId, DateTime since, int page, int pageSize, CancellationToken ct = default);
    Task<ReadingAverages> GetAveragesAsync(int siloId, DateTime from, DateTime to, CancellationToken ct = default);
}
