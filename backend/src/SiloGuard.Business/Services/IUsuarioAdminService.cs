using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public interface IUsuarioAdminService
{
    Task<List<User>> ListUsuariosAsync(CancellationToken ct = default);
}
