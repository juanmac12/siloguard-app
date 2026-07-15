using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Configurations;

public class PreferenciasNotificacionConfiguration : IEntityTypeConfiguration<PreferenciasNotificacion>
{
    public void Configure(EntityTypeBuilder<PreferenciasNotificacion> builder)
    {
        builder.ToTable("PreferenciasNotificaciones");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.SilencioDesde).HasMaxLength(5);
        builder.Property(p => p.SilencioHasta).HasMaxLength(5);

        // FK unica -> relacion 1-1 real con Users.
        builder.HasIndex(p => p.UserId).IsUnique();

        builder.HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
