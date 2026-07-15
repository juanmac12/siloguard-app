using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Configurations;

public class DestinatarioConfiguration : IEntityTypeConfiguration<Destinatario>
{
    public void Configure(EntityTypeBuilder<Destinatario> builder)
    {
        builder.ToTable("Destinatarios");
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Nombre).IsRequired().HasMaxLength(200);
        builder.Property(d => d.Tipo).IsRequired().HasMaxLength(20);
        builder.Property(d => d.Contacto).HasMaxLength(200);
    }
}
