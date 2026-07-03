using Microsoft.EntityFrameworkCore;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Repositories;

public class SensorReadingRepository : ISensorReadingRepository
{
    private readonly SiloGuardDbContext _db;

    public SensorReadingRepository(SiloGuardDbContext db) => _db = db;

    public async Task AddAsync(SensorReading reading, CancellationToken ct = default) =>
        await _db.SensorReadings.AddAsync(reading, ct);

    public async Task<PagedReadings> GetPagedAsync(int siloId, DateTime since, int page, int pageSize, CancellationToken ct = default)
    {
        var query = _db.SensorReadings
            .Where(r => r.SiloId == siloId && r.Timestamp >= since)
            .OrderByDescending(r => r.Timestamp);

        var total = await query.CountAsync(ct);
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync(ct);

        return new PagedReadings(items, total);
    }
}
