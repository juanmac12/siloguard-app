using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Configurations;

public class SensorReadingConfiguration : IEntityTypeConfiguration<SensorReading>
{
    public void Configure(EntityTypeBuilder<SensorReading> builder)
    {
        // Check constraints de rango: ademas de validar datos, son la base de la demo de
        // rollback transaccional (Parte 4.3) — un valor fuera de rango hace fallar el INSERT.
        builder.ToTable("SensorReadings", t =>
        {
            t.HasCheckConstraint("CK_SensorReading_Temp_Range", "\"Temp\" BETWEEN -50 AND 150");
            t.HasCheckConstraint("CK_SensorReading_Hum_Range", "\"Hum\" BETWEEN 0 AND 100");
            t.HasCheckConstraint("CK_SensorReading_Co2_Range", "\"Co2\" >= 0");
        });
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Co2).HasColumnType("decimal(10,2)");
        builder.Property(r => r.Temp).HasColumnType("decimal(10,2)");
        builder.Property(r => r.Hum).HasColumnType("decimal(10,2)");

        builder.HasIndex(r => new { r.SiloId, r.Timestamp });

        builder.HasOne(r => r.Silo)
            .WithMany(s => s.Readings)
            .HasForeignKey(r => r.SiloId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
