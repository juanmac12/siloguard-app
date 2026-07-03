using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Configurations;

public class SiloConfiguration : IEntityTypeConfiguration<Silo>
{
    public void Configure(EntityTypeBuilder<Silo> builder)
    {
        builder.ToTable("Silos");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name).IsRequired().HasMaxLength(200);
        builder.Property(s => s.Grain).IsRequired().HasMaxLength(100);
        builder.Property(s => s.Storage).IsRequired().HasMaxLength(50);
        builder.Property(s => s.Status).IsRequired().HasMaxLength(20);
        builder.Property(s => s.Acopio).IsRequired().HasMaxLength(100);

        builder.Property(s => s.Tons).HasColumnType("decimal(10,2)");
        builder.Property(s => s.LastCo2).HasColumnType("decimal(10,2)");
        builder.Property(s => s.LastTemp).HasColumnType("decimal(10,2)");
        builder.Property(s => s.LastHum).HasColumnType("decimal(10,2)");

        builder.HasOne(s => s.User)
            .WithMany(u => u.Silos)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
