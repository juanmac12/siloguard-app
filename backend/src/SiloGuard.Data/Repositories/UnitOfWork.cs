using Microsoft.EntityFrameworkCore.Storage;
using SiloGuard.Data.Abstractions;

namespace SiloGuard.Data.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly SiloGuardDbContext _db;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(SiloGuardDbContext db)
    {
        _db = db;
    }

    public Task SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);

    public async Task BeginTransactionAsync(CancellationToken ct = default)
    {
        _transaction = await _db.Database.BeginTransactionAsync(ct);
    }

    public async Task CommitAsync(CancellationToken ct = default)
    {
        if (_transaction is null) return;
        await _transaction.CommitAsync(ct);
        await _transaction.DisposeAsync();
        _transaction = null;
    }

    public async Task RollbackAsync(CancellationToken ct = default)
    {
        if (_transaction is null) return;
        await _transaction.RollbackAsync(ct);
        await _transaction.DisposeAsync();
        _transaction = null;
    }
}
