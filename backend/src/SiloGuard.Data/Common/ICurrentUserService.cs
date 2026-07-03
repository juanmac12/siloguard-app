namespace SiloGuard.Data.Common;

// Abstraccion minima para que el DbContext pueda saber "quien" hizo un cambio (auditoria)
// sin que SiloGuard.Data dependa de ASP.NET Core / HttpContext. La implementacion real
// vive en SiloGuard.Api (HttpCurrentUserService), que si conoce el HttpContext.
public interface ICurrentUserService
{
    int? UserId { get; }
}
