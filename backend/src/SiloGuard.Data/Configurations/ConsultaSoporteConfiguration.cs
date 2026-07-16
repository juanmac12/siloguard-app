using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Configurations;

public class ConsultaSoporteConfiguration : IEntityTypeConfiguration<ConsultaSoporte>
{
    public void Configure(EntityTypeBuilder<ConsultaSoporte> builder)
    {
        builder.ToTable("ConsultasSoporte");
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Mensaje).IsRequired().HasMaxLength(1000);
        builder.Property(c => c.Estado).IsRequired().HasMaxLength(20);

        builder.HasOne(c => c.Alerta)
            .WithMany()
            .HasForeignKey(c => c.AlertaId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.Tecnico)
            .WithMany(t => t.Consultas)
            .HasForeignKey(c => c.TecnicoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
