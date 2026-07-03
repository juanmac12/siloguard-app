using System.Security.Claims;
using SiloGuard.Business.Exceptions;

namespace SiloGuard.Api.Extensions;

public static class ControllerBaseExtensions
{
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? user.FindFirstValue("sub");
        if (int.TryParse(sub, out var id)) return id;
        throw new UnauthorizedAppException("Token inválido.");
    }
}
