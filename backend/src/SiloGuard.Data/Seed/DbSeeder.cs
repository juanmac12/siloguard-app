using Microsoft.EntityFrameworkCore;
using SiloGuard.Data.Entities;

namespace SiloGuard.Data.Seed;

// Datos de arranque para desarrollo: roles, usuarios demo, silos (alineados a los mocks
// que ya tenia el frontend) y varios cientos de lecturas de sensores por silo, para que
// el paginado de /api/silos/{id}/lecturas tenga datos reales que paginar (rubrica Parte 1.4).
public static class DbSeeder
{
    public static async Task SeedAsync(SiloGuardDbContext db)
    {
        await SeedCoreAsync(db);

        // Las tablas agregadas despues del seed original se siembran aparte y de forma
        // idempotente, para que una base ya poblada tambien las reciba al actualizar.
        await SeedExtrasAsync(db);

        // Los datos demo envejecen: si el seed corrio hace dias, los rangos 24h/48h/7d
        // del historial quedan vacios y el dashboard muestra "ultima lectura hace N dias".
        // Este re-anclado corre en cada arranque (solo Development llama al seeder) y
        // desplaza los timestamps para que la lectura mas reciente sea "ahora".
        await RefreshDemoTimestampsAsync(db);
    }

    private static async Task RefreshDemoTimestampsAsync(SiloGuardDbContext db)
    {
        var now = DateTime.UtcNow;
        var maxTs = await db.SensorReadings.MaxAsync(r => (DateTime?)r.Timestamp);
        if (maxTs is null) return;

        var drift = now - maxTs.Value;
        if (drift < TimeSpan.FromHours(2)) return; // datos suficientemente frescos

        // ExecuteUpdate corre como UPDATE directo en la DB (sin pasar por el change
        // tracker), asi que no dispara auditoria ni pisa CreatedAt/UpdatedAt de negocio.
        await db.SensorReadings
            .ExecuteUpdateAsync(s => s.SetProperty(r => r.Timestamp, r => r.Timestamp + drift));

        await db.Silos
            .Where(s => s.LastReadingAt != null)
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.LastReadingAt, x => x.LastReadingAt + drift));

        await db.Alerts
            .ExecuteUpdateAsync(s => s
                .SetProperty(a => a.CreatedAt, a => a.CreatedAt + drift)
                .SetProperty(a => a.ResolvedAt, a => a.ResolvedAt + drift));
    }

    private static async Task SeedCoreAsync(SiloGuardDbContext db)
    {
        if (await db.Users.AnyAsync()) return;

        var productor = new Role { Name = "Productor" };
        var admin = new Role { Name = "Admin" };
        db.Roles.AddRange(productor, admin);
        await db.SaveChangesAsync();

        var now = DateTime.UtcNow;

        var devUser = new User
        {
            Name = "Juan Manuel Cantero",
            Email = "dev@siloguard.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Demo1234"),
            Phone = "+54 9 341 555-0123",
            FarmName = "Estancia La Esperanza",
            FarmLoc = "Pergamino, Buenos Aires",
            FarmHa = 320,
            CreatedAt = now,
            UpdatedAt = now,
        };

        var adminUser = new User
        {
            Name = "Admin SiloGuard",
            Email = "admin@siloguard.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin1234"),
            FarmName = "SiloGuard",
            CreatedAt = now,
            UpdatedAt = now,
        };

        db.Users.AddRange(devUser, adminUser);
        await db.SaveChangesAsync();

        // adminUser tiene los dos roles: demuestra que UserRoles es una relacion N-N real.
        db.UserRoles.AddRange(
            new UserRole { UserId = devUser.Id, RoleId = productor.Id },
            new UserRole { UserId = adminUser.Id, RoleId = productor.Id },
            new UserRole { UserId = adminUser.Id, RoleId = admin.Id }
        );
        await db.SaveChangesAsync();

        var silosSeed = new[]
        {
            new { Name = "Silo Norte", Grain = "Soja", Tons = 180m, Acopio = "15 mar 2024", Status = "ok", Storage = "Silo fijo", Temp = 22.1m, Hum = 13.8m, Co2 = 420m },
            new { Name = "Silo Sur", Grain = "Maíz", Tons = 240m, Acopio = "20 feb 2024", Status = "critical", Storage = "Silo fijo", Temp = 42.3m, Hum = 15.1m, Co2 = 890m },
            new { Name = "Silo Este", Grain = "Trigo", Tons = 95m, Acopio = "10 ene 2024", Status = "warn", Storage = "Silobolsa", Temp = 28.4m, Hum = 18.2m, Co2 = 550m },
            new { Name = "Silo Oeste", Grain = "Soja", Tons = 210m, Acopio = "5 mar 2024", Status = "ok", Storage = "Silo fijo", Temp = 21.8m, Hum = 13.2m, Co2 = 390m },
            new { Name = "Silo 5", Grain = "Girasol", Tons = 120m, Acopio = "25 feb 2024", Status = "ok", Storage = "Silobolsa", Temp = 23.0m, Hum = 12.9m, Co2 = 410m },
            new { Name = "Silo 6", Grain = "Maíz", Tons = 155m, Acopio = "12 mar 2024", Status = "warn", Storage = "Silo fijo", Temp = 30.1m, Hum = 16.8m, Co2 = 620m },
        };

        var silos = new List<Silo>();
        foreach (var s in silosSeed)
        {
            var silo = new Silo
            {
                UserId = devUser.Id,
                Name = s.Name,
                Grain = s.Grain,
                Tons = s.Tons,
                Acopio = s.Acopio,
                Storage = s.Storage,
                Status = s.Status,
                LastCo2 = s.Co2,
                LastTemp = s.Temp,
                LastHum = s.Hum,
                LastReadingAt = now,
                CreatedAt = now,
                UpdatedAt = now,
            };
            silos.Add(silo);
        }
        db.Silos.AddRange(silos);
        await db.SaveChangesAsync();

        // Historial: una lectura por hora durante 7 dias por silo (168 * 6 = 1008 filas),
        // con una leve variacion aleatoria alrededor del ultimo valor conocido del silo.
        var random = new Random(12345);
        var readings = new List<SensorReading>();
        foreach (var (silo, seed) in silos.Zip(silosSeed))
        {
            for (var hoursAgo = 168; hoursAgo >= 0; hoursAgo--)
            {
                var jitter = (decimal)(random.NextDouble() * 2 - 1); // [-1, 1]
                readings.Add(new SensorReading
                {
                    SiloId = silo.Id,
                    Timestamp = now.AddHours(-hoursAgo),
                    Temp = Math.Round(seed.Temp + jitter * 1.5m, 1),
                    Hum = Math.Round(seed.Hum + jitter, 1),
                    Co2 = Math.Round(seed.Co2 + jitter * 15m, 0),
                });
            }
        }
        db.SensorReadings.AddRange(readings);
        await db.SaveChangesAsync();

        var siloByName = silos.ToDictionary(s => s.Name);
        var alerts = new List<Alert>
        {
            new()
            {
                SiloId = siloByName["Silo Sur"].Id, Sensor = "temp", Value = "42.3", Unit = "°C", Threshold = "35°C",
                Variant = "critical", Title = "Temperatura crítica", Estimate = "Crítico en 24 h",
                Action = "Inspección presencial inmediata",
                Description = "La temperatura superó los 38°C y continúa en ascenso. Patrón compatible con inicio de fermentación.",
                Status = "active", CreatedAt = now.AddHours(-2),
            },
            new()
            {
                SiloId = siloByName["Silo Este"].Id, Sensor = "humidity", Value = "18.2", Unit = "%", Threshold = "16%",
                Variant = "warning", Title = "Humedad elevada", Estimate = "Riesgo en 48-72 h",
                Action = "Verificar ventilación y activar aireación",
                Description = "La humedad del grano llegó al 18.2%, por encima del umbral seguro del 16%.",
                Status = "active", CreatedAt = now.AddHours(-5),
            },
            new()
            {
                SiloId = siloByName["Silo 6"].Id, Sensor = "co2", Value = "620", Unit = "ppm", Threshold = "600 ppm",
                Variant = "warning", Title = "CO₂ en ascenso", Estimate = "Monitorear cada hora",
                Action = "Activar aireación preventiva",
                Description = "Nivel de CO₂ en 620 ppm y subiendo. Indica actividad respiratoria elevada.",
                Status = "active", CreatedAt = now.AddHours(-1),
            },
            new()
            {
                SiloId = siloByName["Silo Norte"].Id, Sensor = "temp", Value = "31.0", Unit = "°C", Threshold = "35°C",
                Variant = "resolved", Title = "Temperatura elevada (resuelta)",
                Description = "La temperatura volvió a niveles normales tras encender la aireación por 4 horas.",
                Status = "resolved", ResolutionNote = "Encendí aireación a las 14:30 por 4 horas.",
                CreatedAt = now.AddDays(-2), ResolvedAt = now.AddDays(-2).AddHours(4),
            },
            new()
            {
                SiloId = siloByName["Silo Oeste"].Id, Sensor = "co2", Value = "680", Unit = "ppm", Threshold = "600 ppm",
                Variant = "resolved", Title = "CO₂ elevado (resuelto)",
                Description = "Elevación de CO₂ detectada y resuelta. Los valores volvieron a la normalidad en 6 hs.",
                Status = "resolved", ResolutionNote = "Inspeccioné el silo y activé la aireación.",
                CreatedAt = now.AddDays(-5), ResolvedAt = now.AddDays(-5).AddHours(6),
            },
        };
        db.Alerts.AddRange(alerts);
        await db.SaveChangesAsync();

        // Lotes demo (Pasaporte de Calidad): uno en monitoreo y uno finalizado, para que el
        // tab Pasaporte no arranque vacio. Los promedios se toman de la ultima lectura del silo.
        var siloNorte = siloByName["Silo Norte"];
        var siloOeste = siloByName["Silo Oeste"];
        var lotes = new List<Lote>
        {
            new()
            {
                SiloId = siloNorte.Id,
                Codigo = $"SG-{now.Year}-{siloNorte.Id:X4}",
                Name = $"Lote {siloNorte.Grain} Norte",
                Grain = siloNorte.Grain,
                Tons = siloNorte.Tons,
                StartAt = now.AddDays(-45),
                EndAt = null,
                Status = "monitoring",
                AvgCo2 = siloNorte.LastCo2,
                AvgTemp = siloNorte.LastTemp,
                AvgHum = siloNorte.LastHum,
                Score = 92,
                AlertsResolved = 1,
            },
            new()
            {
                SiloId = siloOeste.Id,
                Codigo = $"SG-{now.Year}-{siloOeste.Id + 100:X4}",
                Name = $"Lote {siloOeste.Grain} Oeste",
                Grain = siloOeste.Grain,
                Tons = siloOeste.Tons,
                StartAt = now.AddDays(-120),
                EndAt = now.AddDays(-15),
                Status = "finalized",
                AvgCo2 = siloOeste.LastCo2,
                AvgTemp = siloOeste.LastTemp,
                AvgHum = siloOeste.LastHum,
                Score = 94,
                AlertsResolved = 1,
            },
        };
        db.Lotes.AddRange(lotes);
        await db.SaveChangesAsync();
    }

    private static async Task SeedExtrasAsync(SiloGuardDbContext db)
    {
        var now = DateTime.UtcNow;

        // Tecnicos de contacto (pantalla "Contactar tecnico").
        if (!await db.Tecnicos.AnyAsync())
        {
            db.Tecnicos.AddRange(
                new Tecnico { Nombre = "Ing. Agr. Marcela Ríos", Telefono = "+54 9 362 455-1122", Horario = "Lun a Sáb, 7:00 a 20:00", Activo = true },
                new Tecnico { Nombre = "Téc. Hernán Duarte", Telefono = "+54 9 362 455-3344", Horario = "Lun a Vie, 8:00 a 18:00", Activo = true }
            );
            await db.SaveChangesAsync();
        }

        // Destinatarios del Pasaporte de Calidad (bancos / acopios / compradores).
        if (!await db.Destinatarios.AnyAsync())
        {
            db.Destinatarios.AddRange(
                new Destinatario { Nombre = "Banco Nación — Agro", Tipo = "banco", Contacto = "agro@bna.com.ar" },
                new Destinatario { Nombre = "Acopio Cooperativa Charata", Tipo = "acopio", Contacto = "+54 9 3731 42-5566" },
                new Destinatario { Nombre = "Molinos del Litoral S.A.", Tipo = "comprador", Contacto = "compras@molinoslitoral.com" },
                new Destinatario { Nombre = "AgroExport Rosario", Tipo = "comprador", Contacto = "trading@agroexport.com" }
            );
            await db.SaveChangesAsync();
        }

        // Umbrales personalizados de ejemplo para un silo (el resto usa los recomendados).
        if (!await db.Umbrales.AnyAsync())
        {
            var siloSur = await db.Silos.FirstOrDefaultAsync(s => s.Name == "Silo Sur");
            if (siloSur is not null)
            {
                db.Umbrales.AddRange(
                    new Umbral { SiloId = siloSur.Id, Variable = "temp", Warn = 26m, Crit = 33m },
                    new Umbral { SiloId = siloSur.Id, Variable = "hum", Warn = 15m, Crit = 19m },
                    new Umbral { SiloId = siloSur.Id, Variable = "co2", Warn = 550m, Crit = 750m }
                );
                await db.SaveChangesAsync();
            }
        }

        // Un pasaporte ya compartido (fila N-N de muestra) sobre el lote finalizado.
        if (!await db.LoteDestinatarios.AnyAsync())
        {
            var loteFinalizado = await db.Lotes.FirstOrDefaultAsync(l => l.Status == "finalized");
            var banco = await db.Destinatarios.FirstOrDefaultAsync(d => d.Tipo == "banco");
            if (loteFinalizado is not null && banco is not null)
            {
                db.LoteDestinatarios.Add(new LoteDestinatario
                {
                    LoteId = loteFinalizado.Id,
                    DestinatarioId = banco.Id,
                    CompartidoAt = now.AddDays(-10),
                });
                await db.SaveChangesAsync();
            }
        }
    }
}
