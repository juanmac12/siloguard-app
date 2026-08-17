using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using SiloGuard.Api.Extensions;
using SiloGuard.Api.Filters;
using SiloGuard.Api.Middleware;
using SiloGuard.Data;
using SiloGuard.Data.Seed;

var builder = WebApplication.CreateBuilder(args);

// Railway (y hosts similares) asignan el puerto público por variable de entorno PORT.
// launchSettings.json solo aplica a `dotnet run` local; en el contenedor productivo
// (ENTRYPOINT del Dockerfile, sin perfiles) hay que leerlo a mano y decirle a Kestrel
// dónde escuchar. Si PORT no está seteada (dev local, docker-compose), no se toca nada.
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrWhiteSpace(port))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
});

builder.Services.AddAppData(builder.Configuration);
builder.Services.AddAppServices();
builder.Services.AddFirebaseAuth(builder.Configuration);
builder.Services.AddJwtAuth(builder.Configuration);
builder.Services.AddCorsDev();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "SiloGuard API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Pegá el JWT devuelto por /api/auth/login (sin el prefijo 'Bearer ').",
    });

    options.AddSecurityRequirement(_ => new OpenApiSecurityRequirement
    {
        { new OpenApiSecuritySchemeReference("Bearer", null), new List<string>() },
    });
});

var app = builder.Build();

// Primer middleware del pipeline: envuelve cualquier excepcion de las capas inferiores.
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Swagger queda expuesto en todos los entornos (no solo Development): la rúbrica
// del TP pide poder mostrarlo como evidencia contra el deploy público.
app.UseSwagger();
app.UseSwaggerUI();

// Migraciones y seed corren siempre (no solo en Development): en un deploy nuevo
// (Railway) la base gestionada arranca vacía y necesita el esquema antes del primer
// request. DbSeeder es idempotente (chequea si ya hay usuarios antes de insertar).
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SiloGuardDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db);
}

app.UseCors("Dev");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check publico (sin auth): confirma que la API esta viva. Util como
// primera evidencia en la defensa y para chequeos externos (Docker/monitoreo).
app.MapGet("/health", () => Results.Ok(new
{
    status = "ok",
    service = "SiloGuard.Api",
    timestamp = DateTime.UtcNow,
}));

app.Run();
