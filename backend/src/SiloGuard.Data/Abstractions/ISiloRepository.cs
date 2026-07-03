using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public interface ISiloRepository
{
    Task<List<Silo>> ListByUserAsync(int userId, CancellationToken ct = default);
    Task<Silo?> GetByIdAsync(int id, CancellationToken ct = default);
    Task AddAsync(Silo silo, CancellationToken ct = default);
    void Remove(Silo silo);
}
