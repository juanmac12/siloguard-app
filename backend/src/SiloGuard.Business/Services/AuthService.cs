using SiloGuard.Business.Dtos.Auth;
using SiloGuard.Business.Exceptions;
using SiloGuard.Business.Sanitization;
using SiloGuard.Business.Security;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarios;
    private readonly IRoleRepository _roles;
    private readonly IUnitOfWork _uow;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokens;
    private readonly IInputSanitizer _sanitizer;
    private readonly IFirebaseAuthService _firebaseAuth;

    public AuthService(
        IUsuarioRepository usuarios,
        IRoleRepository roles,
        IUnitOfWork uow,
        IPasswordHasher hasher,
        ITokenService tokens,
        IInputSanitizer sanitizer,
        IFirebaseAuthService firebaseAuth)
    {
        _usuarios = usuarios;
        _roles = roles;
        _uow = uow;
        _hasher = hasher;
        _tokens = tokens;
        _sanitizer = sanitizer;
        _firebaseAuth = firebaseAuth;
    }

    public async Task<AuthResult> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        if (await _usuarios.EmailExistsAsync(request.Email, ct))
            throw new ConflictException("Ya existe una cuenta con ese email.");

        var productorRole = await _roles.GetByNameAsync("Productor", ct)
            ?? throw new NotFoundException("No se encontró el rol por defecto.");

        var user = new User
        {
            Name = _sanitizer.Sanitize(request.Name) ?? string.Empty,
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = _hasher.Hash(request.Password),
            Phone = _sanitizer.Sanitize(request.Phone),
            FarmName = _sanitizer.Sanitize(request.FarmName) ?? string.Empty,
            FarmLoc = _sanitizer.Sanitize(request.FarmLoc),
            FarmHa = request.FarmHa,
        };

        await _usuarios.AddAsync(user, ct);
        await _uow.SaveChangesAsync(ct);

        user.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = productorRole.Id });
        await _uow.SaveChangesAsync(ct);

        var token = _tokens.GenerateToken(user, [productorRole.Name]);
        return new AuthResult { Token = token, UserId = user.Id, Name = user.Name, Email = user.Email };
    }

    public async Task<AuthResult> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _usuarios.GetByEmailAsync(request.Email.Trim().ToLowerInvariant(), ct);
        if (user is null || !_hasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAppException("Email o contraseña incorrectos.");

        if (!await _firebaseAuth.IsEmailVerifiedAsync(user.Email, ct))
            throw new UnauthorizedAppException(
                "Verificá tu email antes de iniciar sesión. Revisá el correo que te enviamos al registrarte.");

        var roles = await _usuarios.GetRoleNamesAsync(user.Id, ct);
        var token = _tokens.GenerateToken(user, roles);
        return new AuthResult { Token = token, UserId = user.Id, Name = user.Name, Email = user.Email };
    }
}
