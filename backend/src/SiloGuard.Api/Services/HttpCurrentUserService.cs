using System.Security.Claims;
using SiloGuard.Data.Common;

namespace SiloGuard.Api.Services;

public class HttpCurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _accessor;

    public HttpCurrentUserService(IHttpContextAccessor accessor) => _accessor = accessor;

    public int? UserId
    {
        get
        {
            var sub = _accessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? _accessor.HttpContext?.User?.FindFirstValue("sub");
            return int.TryParse(sub, out var id) ? id : null;
        }
    }
}
