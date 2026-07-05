using SiloGuard.Business.Dtos.Perfil;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public interface IPerfilService
{
    Task<User> GetAsync(int userId, CancellationToken ct = default);
    Task<User> UpdateAsync(int userId, PerfilUpdateRequest request, CancellationToken ct = default);
    Task CambiarPasswordAsync(int userId, CambiarPasswordRequest request, CancellationToken ct = default);
}
