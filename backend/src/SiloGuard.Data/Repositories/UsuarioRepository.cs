using Microsoft.EntityFrameworkCore;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly SiloGuardDbContext _db;

    public UsuarioRepository(SiloGuardDbContext db) => _db = db;

    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default) =>
        _db.Users.FirstOrDefaultAsync(u => u.Email == email, ct);

    public Task<User?> GetByIdAsync(int id, CancellationToken ct = default) =>
        _db.Users.FirstOrDefaultAsync(u => u.Id == id, ct);

    public Task<bool> EmailExistsAsync(string email, CancellationToken ct = default) =>
        _db.Users.AnyAsync(u => u.Email == email, ct);

    public Task<List<string>> GetRoleNamesAsync(int userId, CancellationToken ct = default) =>
        _db.UserRoles.Where(ur => ur.UserId == userId).Select(ur => ur.Role.Name).ToListAsync(ct);

    public async Task AddAsync(User user, CancellationToken ct = default) =>
        await _db.Users.AddAsync(user, ct);

    public Task<List<User>> ListAllAsync(CancellationToken ct = default) =>
        _db.Users.AsNoTracking().ToListAsync(ct);
}
