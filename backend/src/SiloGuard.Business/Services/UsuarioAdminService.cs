using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

// Solo la usa AdminController ([Authorize(Roles = "Admin")]) — demuestra que las rutas
// protegidas por rol realmente restringen el acceso (rubrica Parte 5.2).
public class UsuarioAdminService : IUsuarioAdminService
{
    private readonly IUsuarioRepository _usuarios;

    public UsuarioAdminService(IUsuarioRepository usuarios) => _usuarios = usuarios;

    public Task<List<User>> ListUsuariosAsync(CancellationToken ct = default) => _usuarios.ListAllAsync(ct);
}
