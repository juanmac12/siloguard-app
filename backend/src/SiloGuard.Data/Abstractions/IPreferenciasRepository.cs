using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public interface IPreferenciasRepository
{
    Task<PreferenciasNotificacion?> GetByUserAsync(int userId, CancellationToken ct = default);
    Task AddAsync(PreferenciasNotificacion prefs, CancellationToken ct = default);
}
