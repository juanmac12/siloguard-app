using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Abstractions;

public interface IUsuarioRepository
{
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken ct = default);
    Task<List<string>> GetRoleNamesAsync(int userId, CancellationToken ct = default);
    Task AddAsync(User user, CancellationToken ct = default);
    Task<List<User>> ListAllAsync(CancellationToken ct = default);
}
