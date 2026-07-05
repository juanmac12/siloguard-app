using Microsoft.EntityFrameworkCore;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Repositories;

public class LoteRepository : ILoteRepository
{
    private readonly SiloGuardDbContext _db;

    public LoteRepository(SiloGuardDbContext db) => _db = db;

    public Task<List<Lote>> ListByUserAsync(int userId, CancellationToken ct = default) =>
        _db.Lotes
            .Include(l => l.Silo)
            .Where(l => l.Silo.UserId == userId)
            .OrderByDescending(l => l.StartAt)
            .ToListAsync(ct);

    public Task<Lote?> GetByIdAsync(int id, CancellationToken ct = default) =>
        _db.Lotes.Include(l => l.Silo).FirstOrDefaultAsync(l => l.Id == id, ct);

    public Task<Lote?> GetActiveBySiloAsync(int siloId, CancellationToken ct = default) =>
        _db.Lotes.FirstOrDefaultAsync(l => l.SiloId == siloId && l.Status == "monitoring", ct);

    public async Task AddAsync(Lote lote, CancellationToken ct = default) =>
        await _db.Lotes.AddAsync(lote, ct);
}
