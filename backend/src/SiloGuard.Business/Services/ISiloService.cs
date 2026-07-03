using SiloGuard.Business.Dtos.Silos;
using SiloGuard.Data.Entities;

namespace SiloGuard.Business.Services;

public interface ISiloService
{
    Task<List<Silo>> ListAsync(int userId, CancellationToken ct = default);
    Task<Silo> GetAsync(int userId, int siloId, CancellationToken ct = default);
    Task<Silo> CreateAsync(int userId, SiloCreateRequest request, CancellationToken ct = default);
    Task<Silo> UpdateAsync(int userId, int siloId, SiloUpdateRequest request, CancellationToken ct = default);
    Task DeleteAsync(int userId, int siloId, CancellationToken ct = default);
}
