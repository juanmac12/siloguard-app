using SiloGuard.Business.Dtos.Perfil;
using SiloGuard.Business.Exceptions;
using SiloGuard.Business.Sanitization;
using SiloGuard.Business.Security;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class PerfilService : IPerfilService
{
    private readonly IUsuarioRepository _usuarios;
    private readonly IUnitOfWork _uow;
    private readonly IInputSanitizer _sanitizer;
    private readonly IPasswordHasher _passwordHasher;

    public PerfilService(IUsuarioRepository usuarios, IUnitOfWork uow, IInputSanitizer sanitizer, IPasswordHasher passwordHasher)
    {
        _usuarios = usuarios;
        _uow = uow;
        _sanitizer = sanitizer;
        _passwordHasher = passwordHasher;
    }

    public async Task<User> GetAsync(int userId, CancellationToken ct = default) =>
        await _usuarios.GetByIdAsync(userId, ct) ?? throw new NotFoundException("No se encontró el perfil.");

    public async Task<User> UpdateAsync(int userId, PerfilUpdateRequest request, CancellationToken ct = default)
    {
        var user = await _usuarios.GetByIdAsync(userId, ct) ?? throw new NotFoundException("No se encontró el perfil.");

        user.Name = _sanitizer.Sanitize(request.Name) ?? user.Name;
        user.Phone = _sanitizer.Sanitize(request.Phone);
        user.FarmName = _sanitizer.Sanitize(request.FarmName) ?? user.FarmName;
        user.FarmLoc = _sanitizer.Sanitize(request.FarmLoc);
        user.FarmHa = request.FarmHa;

        await _uow.SaveChangesAsync(ct);
        return user;
    }

    public async Task CambiarPasswordAsync(int userId, CambiarPasswordRequest request, CancellationToken ct = default)
    {
        var user = await _usuarios.GetByIdAsync(userId, ct) ?? throw new NotFoundException("No se encontró el perfil.");

        // Re-autenticación antes de una operación sensible: exigimos la contraseña actual.
        // Se responde 409 (no 401) para que el cliente no interprete "sesión vencida" y desloguee.
        if (!_passwordHasher.Verify(request.CurrentPassword, user.PasswordHash))
            throw new ConflictException("La contraseña actual no es correcta.");

        user.PasswordHash = _passwordHasher.Hash(request.NewPassword);
        await _uow.SaveChangesAsync(ct);
    }
}
