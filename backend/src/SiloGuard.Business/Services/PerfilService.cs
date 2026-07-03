using SiloGuard.Business.Dtos.Perfil;
using SiloGuard.Business.Exceptions;
using SiloGuard.Business.Sanitization;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class PerfilService : IPerfilService
{
    private readonly IUsuarioRepository _usuarios;
    private readonly IUnitOfWork _uow;
    private readonly IInputSanitizer _sanitizer;

    public PerfilService(IUsuarioRepository usuarios, IUnitOfWork uow, IInputSanitizer sanitizer)
    {
        _usuarios = usuarios;
        _uow = uow;
        _sanitizer = sanitizer;
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
}
