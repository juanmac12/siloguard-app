using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Configurations;

public class LoteConfiguration : IEntityTypeConfiguration<Lote>
{
    public void Configure(EntityTypeBuilder<Lote> builder)
    {
        builder.ToTable("Lotes");
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Codigo).IsRequired().HasMaxLength(30);
        builder.Property(l => l.Name).IsRequired().HasMaxLength(200);
        builder.Property(l => l.Grain).IsRequired().HasMaxLength(100);
        builder.Property(l => l.Status).IsRequired().HasMaxLength(20);

        builder.Property(l => l.Tons).HasColumnType("decimal(10,2)");
        builder.Property(l => l.AvgCo2).HasColumnType("decimal(10,2)");
        builder.Property(l => l.AvgTemp).HasColumnType("decimal(10,2)");
        builder.Property(l => l.AvgHum).HasColumnType("decimal(10,2)");

        builder.HasOne(l => l.Silo)
            .WithMany(s => s.Lotes)
            .HasForeignKey(l => l.SiloId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
