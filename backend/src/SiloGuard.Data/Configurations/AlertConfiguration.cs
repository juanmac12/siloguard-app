using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Configurations;

public class AlertConfiguration : IEntityTypeConfiguration<Alert>
{
    public void Configure(EntityTypeBuilder<Alert> builder)
    {
        builder.ToTable("Alerts");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Sensor).IsRequired().HasMaxLength(20);
        builder.Property(a => a.Value).IsRequired().HasMaxLength(50);
        builder.Property(a => a.Unit).IsRequired().HasMaxLength(20);
        builder.Property(a => a.Threshold).IsRequired().HasMaxLength(50);
        builder.Property(a => a.Variant).IsRequired().HasMaxLength(20);
        builder.Property(a => a.Title).IsRequired().HasMaxLength(200);
        builder.Property(a => a.Description).IsRequired().HasMaxLength(1000);
        builder.Property(a => a.Status).IsRequired().HasMaxLength(20);
        builder.Property(a => a.ResolutionNote).HasMaxLength(1000);
        builder.Property(a => a.ResolutionReason).HasMaxLength(200);

        builder.HasIndex(a => new { a.SiloId, a.Status });

        builder.HasOne(a => a.Silo)
            .WithMany(s => s.Alerts)
            .HasForeignKey(a => a.SiloId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
