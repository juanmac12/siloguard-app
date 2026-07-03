using Microsoft.EntityFrameworkCore;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Repositories;

public class AlertaRepository : IAlertaRepository
{
    private readonly SiloGuardDbContext _db;

    public AlertaRepository(SiloGuardDbContext db) => _db = db;

    public async Task<List<Alert>> ListByUserAsync(int userId, string? status, string? variant, CancellationToken ct = default)
    {
        var query = _db.Alerts.Include(a => a.Silo)
            .Where(a => a.Silo.UserId == userId);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(a => a.Status == status);

        if (!string.IsNullOrWhiteSpace(variant))
            query = query.Where(a => a.Variant == variant);

        return await query.OrderByDescending(a => a.CreatedAt).AsNoTracking().ToListAsync(ct);
    }

    public Task<Alert?> GetByIdForUserAsync(int id, int userId, CancellationToken ct = default) =>
        _db.Alerts.Include(a => a.Silo)
            .FirstOrDefaultAsync(a => a.Id == id && a.Silo.UserId == userId, ct);
}
