using Microsoft.EntityFrameworkCore;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Repositories;

public class PreferenciasRepository : IPreferenciasRepository
{
    private readonly SiloGuardDbContext _db;

    public PreferenciasRepository(SiloGuardDbContext db) => _db = db;

    public Task<PreferenciasNotificacion?> GetByUserAsync(int userId, CancellationToken ct = default) =>
        _db.PreferenciasNotificaciones.FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public async Task AddAsync(PreferenciasNotificacion prefs, CancellationToken ct = default) =>
        await _db.PreferenciasNotificaciones.AddAsync(prefs, ct);
}
