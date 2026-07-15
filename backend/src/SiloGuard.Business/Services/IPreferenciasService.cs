using SiloGuard.Business.Dtos.Perfil;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public interface IPreferenciasService
{
    /// Preferencias del usuario; si nunca configuró, se crean con los defaults.
    Task<PreferenciasNotificacion> GetAsync(int userId, CancellationToken ct = default);
    Task<PreferenciasNotificacion> UpdateAsync(int userId, PreferenciasUpdateRequest request, CancellationToken ct = default);
}
