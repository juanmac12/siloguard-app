using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public interface IRoleRepository
{
    Task<Role?> GetByNameAsync(string name, CancellationToken ct = default);
}
