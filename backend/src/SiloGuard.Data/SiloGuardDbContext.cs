using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using SiloGuard.Data.Common;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data;

public class SiloGuardDbContext : DbContext
{
    private readonly ICurrentUserService? _currentUser;

    public SiloGuardDbContext(DbContextOptions<SiloGuardDbContext> options, ICurrentUserService? currentUser = null)
        : base(options)
    {
        _currentUser = currentUser;
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Silo> Silos => Set<Silo>();
    public DbSet<SensorReading> SensorReadings => Set<SensorReading>();
    public DbSet<Alert> Alerts => Set<Alert>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SiloGuardDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var auditEntries = new List<AuditLog>();

        foreach (var entry in ChangeTracker.Entries())
        {
            StampTimestamps(entry, now);

            if (entry.Entity is Silo or Alert)
            {
                var action = entry.State switch
                {
                    EntityState.Added => "Added",
                    EntityState.Modified => "Modified",
                    EntityState.Deleted => "Deleted",
                    _ => null,
                };

                if (action is not null)
                {
                    auditEntries.Add(new AuditLog
                    {
                        EntityName = entry.Entity.GetType().Name,
                        EntityId = GetEntityId(entry),
                        Action = action,
                        UserId = _currentUser?.UserId,
                        Timestamp = now,
                    });
                }
            }
        }

        if (auditEntries.Count > 0)
        {
            AuditLogs.AddRange(auditEntries);
        }

        return base.SaveChangesAsync(cancellationToken);
    }

    private static void StampTimestamps(EntityEntry entry, DateTime now)
    {
        switch (entry.Entity)
        {
            case User user:
                if (entry.State == EntityState.Added) user.CreatedAt = now;
                if (entry.State is EntityState.Added or EntityState.Modified) user.UpdatedAt = now;
                break;
            case Silo silo:
                if (entry.State == EntityState.Added) silo.CreatedAt = now;
                if (entry.State is EntityState.Added or EntityState.Modified) silo.UpdatedAt = now;
                break;
        }
    }

    private static string GetEntityId(EntityEntry entry)
    {
        var idProperty = entry.Properties.FirstOrDefault(p => p.Metadata.Name == "Id");
        return idProperty?.CurrentValue?.ToString() ?? "?";
    }
}
