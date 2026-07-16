using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Configurations;

public class UmbralConfiguration : IEntityTypeConfiguration<Umbral>
{
    public void Configure(EntityTypeBuilder<Umbral> builder)
    {
        // El check Warn < Crit tambien sirve para la demo de rollback transaccional
        // (Parte 4.3): un PUT con warn >= crit hace fallar el INSERT y revierte todo.
        builder.ToTable("Umbrales", t =>
        {
            t.HasCheckConstraint("CK_Umbral_WarnLtCrit", "\"Warn\" < \"Crit\"");
            t.HasCheckConstraint("CK_Umbral_Warn_Positive", "\"Warn\" > 0");
        });
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Variable).IsRequired().HasMaxLength(10);
        builder.Property(u => u.Warn).HasColumnType("decimal(10,2)");
        builder.Property(u => u.Crit).HasColumnType("decimal(10,2)");

        // Un silo tiene a lo sumo un umbral por variable.
        builder.HasIndex(u => new { u.SiloId, u.Variable }).IsUnique();

        builder.HasOne(u => u.Silo)
            .WithMany(s => s.Umbrales)
            .HasForeignKey(u => u.SiloId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
