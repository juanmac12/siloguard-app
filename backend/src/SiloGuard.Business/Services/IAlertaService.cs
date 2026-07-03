using SiloGuard.Business.Dtos.Alertas;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public interface IAlertaService
{
    Task<List<Alert>> ListAsync(int userId, string? status, string? variant, CancellationToken ct = default);
    Task<Alert> GetAsync(int userId, int alertId, CancellationToken ct = default);
    Task<Alert> ResolverAsync(int userId, int alertId, ResolverAlertaRequest request, CancellationToken ct = default);
}
