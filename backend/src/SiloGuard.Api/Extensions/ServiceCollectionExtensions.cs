using System.Text;
using FirebaseAdmin;
using FluentValidation;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SiloGuard.Api.Services;
using SiloGuard.Business.Security;
using SiloGuard.Business.Sanitization;
using SiloGuard.Business.Services;
using SiloGuard.Business.Validators;
using SiloGuard.Data;
using SiloGuard.Data.Abstractions;
using SiloGuard.Data.Common;
using SiloGuard.Data.Repositories;

namespace SiloGuard.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddAppData(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<SiloGuardDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("Default")));

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUserService, HttpCurrentUserService>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<ISiloRepository, SiloRepository>();
        services.AddScoped<ISensorReadingRepository, SensorReadingRepository>();
        services.AddScoped<IAlertaRepository, AlertaRepository>();

        return services;
    }

    public static IServiceCollection AddAppServices(this IServiceCollection services)
    {
        services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
        services.AddSingleton<ITokenService, JwtTokenService>();
        services.AddSingleton<IInputSanitizer, HtmlInputSanitizer>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IPerfilService, PerfilService>();
        services.AddScoped<ISiloService, SiloService>();
        services.AddScoped<ILecturaService, LecturaService>();
        services.AddScoped<IAlertaService, AlertaService>();
        services.AddScoped<IUsuarioAdminService, UsuarioAdminService>();

        services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

        return services;
    }

    // Firebase Admin solo se usa para chequear email_verified en el login (Registro
    // e verificación de email los maneja el cliente con el SDK de Firebase). Sin
    // credenciales configuradas queda "apagado" (ver FirebaseAuthService) para no
    // romper el arranque en entornos donde todavía no se cargó el service account.
    public static IServiceCollection AddFirebaseAuth(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<FirebaseSettings>(configuration.GetSection("Firebase"));
        var settings = configuration.GetSection("Firebase").Get<FirebaseSettings>() ?? new FirebaseSettings();

        if (FirebaseApp.DefaultInstance is null
            && !string.IsNullOrWhiteSpace(settings.CredentialsPath)
            && File.Exists(settings.CredentialsPath))
        {
            var credential = CredentialFactory.FromFile<ServiceAccountCredential>(settings.CredentialsPath)
                .ToGoogleCredential();

            FirebaseApp.Create(new AppOptions { Credential = credential });
        }

        services.AddSingleton<IFirebaseAuthService, FirebaseAuthService>();

        return services;
    }

    public static IServiceCollection AddJwtAuth(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));
        var jwt = configuration.GetSection("Jwt").Get<JwtSettings>() ?? new JwtSettings();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwt.Issuer,
                ValidAudience = jwt.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key)),
            };
        });

        services.AddAuthorization();

        return services;
    }

    public static IServiceCollection AddCorsDev(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("Dev", policy =>
                policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        });

        return services;
    }
}
