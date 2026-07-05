using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public interface IAlertaRepository
{
    Task<List<Alert>> ListByUserAsync(int userId, string? status, string? variant, CancellationToken ct = default);
    Task<Alert?> GetByIdForUserAsync(int id, int userId, CancellationToken ct = default);
    Task<int> CountResolvedAsync(int siloId, DateTime from, DateTime to, CancellationToken ct = default);
}
