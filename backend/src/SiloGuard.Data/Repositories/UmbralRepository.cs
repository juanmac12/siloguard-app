using Microsoft.EntityFrameworkCore;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Repositories;

public class UmbralRepository : IUmbralRepository
{
    private readonly SiloGuardDbContext _db;

    public UmbralRepository(SiloGuardDbContext db) => _db = db;

    public Task<List<Umbral>> ListBySiloAsync(int siloId, CancellationToken ct = default) =>
        _db.Umbrales.Where(u => u.SiloId == siloId).OrderBy(u => u.Variable).ToListAsync(ct);

    public async Task AddRangeAsync(IEnumerable<Umbral> umbrales, CancellationToken ct = default) =>
        await _db.Umbrales.AddRangeAsync(umbrales, ct);

    public void RemoveRange(IEnumerable<Umbral> umbrales) => _db.Umbrales.RemoveRange(umbrales);
}
