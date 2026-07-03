using System.Text.Json;
using SiloGuard.Api.DTOs.Common;
using SiloGuard.Business.Exceptions;

namespace SiloGuard.Api.Middleware;

// Primer middleware del pipeline (ver Program.cs): envuelve toda excepcion no capturada
// mas abajo. Nunca serializa ex.Message/ex.StackTrace de una excepcion no prevista hacia
// el cliente — eso solo se loguea server-side (rubrica Parte 2.4).
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleAsync(context, ex);
        }
    }

    private async Task HandleAsync(HttpContext context, Exception ex)
    {
        var (statusCode, response) = ex switch
        {
            ValidationAppException validationEx => (StatusCodes.Status400BadRequest, new ErrorResponse
            {
                StatusCode = StatusCodes.Status400BadRequest,
                Message = validationEx.Message,
                Errors = validationEx.Errors,
            }),
            NotFoundException notFoundEx => (StatusCodes.Status404NotFound, new ErrorResponse
            {
                StatusCode = StatusCodes.Status404NotFound,
                Message = notFoundEx.Message,
            }),
            ConflictException conflictEx => (StatusCodes.Status409Conflict, new ErrorResponse
            {
                StatusCode = StatusCodes.Status409Conflict,
                Message = conflictEx.Message,
            }),
            UnauthorizedAppException unauthorizedEx => (StatusCodes.Status401Unauthorized, new ErrorResponse
            {
                StatusCode = StatusCodes.Status401Unauthorized,
                Message = unauthorizedEx.Message,
            }),
            ForbiddenAppException forbiddenEx => (StatusCodes.Status403Forbidden, new ErrorResponse
            {
                StatusCode = StatusCodes.Status403Forbidden,
                Message = forbiddenEx.Message,
            }),
            _ => (StatusCodes.Status500InternalServerError, (ErrorResponse?)null),
        };

        if (response is null)
        {
            // Excepcion no prevista: el detalle completo (stack trace, mensaje interno)
            // queda SOLO en el log del servidor, nunca en la respuesta HTTP.
            _logger.LogError(ex, "Unhandled exception. TraceId={TraceId}", context.TraceIdentifier);
            response = new ErrorResponse
            {
                StatusCode = StatusCodes.Status500InternalServerError,
                Message = "Ocurrió un error interno. Contactá al administrador.",
                TraceId = context.TraceIdentifier,
            };
        }
        else
        {
            _logger.LogWarning(ex, "Handled business exception: {Message}", ex.Message);
        }

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        }));
    }
}
