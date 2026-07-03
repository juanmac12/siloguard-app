using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Security;

public interface ITokenService
{
    string GenerateToken(User user, IEnumerable<string> roles);
}
