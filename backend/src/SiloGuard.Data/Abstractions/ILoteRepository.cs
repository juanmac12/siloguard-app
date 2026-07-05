using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public interface ILoteRepository
{
    Task<List<Lote>> ListByUserAsync(int userId, CancellationToken ct = default);
    Task<Lote?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<Lote?> GetActiveBySiloAsync(int siloId, CancellationToken ct = default);
    Task AddAsync(Lote lote, CancellationToken ct = default);
}
