namespace SiloGuard.Business.Security;

public interface IFirebaseAuthService
{
    Task<bool> IsEmailVerifiedAsync(string email, CancellationToken ct = default);
}
