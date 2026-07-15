using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public interface IUmbralRepository
{
    Task<List<Umbral>> ListBySiloAsync(int siloId, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<Umbral> umbrales, CancellationToken ct = default);
    void RemoveRange(IEnumerable<Umbral> umbrales);
}
