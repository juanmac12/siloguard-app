using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Configurations;

public class LoteDestinatarioConfiguration : IEntityTypeConfiguration<LoteDestinatario>
{
    public void Configure(EntityTypeBuilder<LoteDestinatario> builder)
    {
        builder.ToTable("LoteDestinatarios");

        // PK compuesta: la marca clasica de una tabla intermedia N-N (como UserRoles).
        builder.HasKey(ld => new { ld.LoteId, ld.DestinatarioId });

        builder.HasOne(ld => ld.Lote)
            .WithMany(l => l.Destinatarios)
            .HasForeignKey(ld => ld.LoteId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ld => ld.Destinatario)
            .WithMany(d => d.LotesCompartidos)
            .HasForeignKey(ld => ld.DestinatarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
