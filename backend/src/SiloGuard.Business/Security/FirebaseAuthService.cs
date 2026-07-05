using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace SiloGuard.Business.Security;

// Puente hacia Firebase Admin SDK: el único uso es chequear si el usuario verificó
// su email (el registro y el envío del correo de verificación los hace el cliente
// con el SDK de Firebase). El login sigue siendo 100% propio (JWT + BCrypt).
public class FirebaseAuthService : IFirebaseAuthService
{
    private readonly FirebaseSettings _settings;
    private readonly ILogger<FirebaseAuthService> _logger;

    public FirebaseAuthService(IOptions<FirebaseSettings> settings, ILogger<FirebaseAuthService> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<bool> IsEmailVerifiedAsync(string email, CancellationToken ct = default)
    {
        if (_settings.VerificationBypassEmails.Contains(email, StringComparer.OrdinalIgnoreCase))
            return true;

        if (FirebaseApp.DefaultInstance is null)
        {
            _logger.LogWarning(
                "Firebase Admin no está configurado (falta Firebase:CredentialsPath) — se omite la verificación de email para {Email}.",
                email);
            return true;
        }

        try
        {
            var user = await FirebaseAuth.DefaultInstance.GetUserByEmailAsync(email, ct);
            return user.EmailVerified;
        }
        catch (FirebaseAuthException ex) when (ex.AuthErrorCode is AuthErrorCode.UserNotFound or AuthErrorCode.EmailNotFound)
        {
            return false;
        }
    }
}
