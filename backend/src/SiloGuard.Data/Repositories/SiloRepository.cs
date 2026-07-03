using Microsoft.EntityFrameworkCore;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Repositories;

public class SiloRepository : ISiloRepository
{
    private readonly SiloGuardDbContext _db;

    public SiloRepository(SiloGuardDbContext db) => _db = db;

    public Task<List<Silo>> ListByUserAsync(int userId, CancellationToken ct = default) =>
        _db.Silos.Where(s => s.UserId == userId).OrderBy(s => s.Name).ToListAsync(ct);

    public Task<Silo?> GetByIdAsync(int id, CancellationToken ct = default) =>
        _db.Silos.FirstOrDefaultAsync(s => s.Id == id, ct);

    public async Task AddAsync(Silo silo, CancellationToken ct = default) =>
        await _db.Silos.AddAsync(silo, ct);

    public void Remove(Silo silo) => _db.Silos.Remove(silo);
}
