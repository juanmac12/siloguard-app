namespace SiloGuard.Business.Exceptions;

// Excepcion base de negocio. El mensaje esta pensado para mostrarse tal cual al cliente
// (sin detalles tecnicos) — lo captura SiloGuard.Api.Middleware.ExceptionHandlingMiddleware.
public abstract class AppException : Exception
{
    protected AppException(string message) : base(message) { }
}

public class NotFoundException : AppException
{
    public NotFoundException(string message) : base(message) { }
}

public class ConflictException : AppException
{
    public ConflictException(string message) : base(message) { }
}

public class UnauthorizedAppException : AppException
{
    public UnauthorizedAppException(string message) : base(message) { }
}

public class ForbiddenAppException : AppException
{
    public ForbiddenAppException(string message) : base(message) { }
}

public class ValidationAppException : AppException
{
    public IDictionary<string, string[]> Errors { get; }

    public ValidationAppException(IDictionary<string, string[]> errors) : base("Uno o más campos no son válidos.")
    {
        Errors = errors;
    }
}
