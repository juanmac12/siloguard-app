using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Configurations;

public class TecnicoConfiguration : IEntityTypeConfiguration<Tecnico>
{
    public void Configure(EntityTypeBuilder<Tecnico> builder)
    {
        builder.ToTable("Tecnicos");
        builder.HasKey(t => t.Id);

        builder.Property(t => t.Nombre).IsRequired().HasMaxLength(200);
        builder.Property(t => t.Telefono).IsRequired().HasMaxLength(50);
        builder.Property(t => t.Horario).IsRequired().HasMaxLength(100);
    }
}
