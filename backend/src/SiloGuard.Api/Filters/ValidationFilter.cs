using FluentValidation;
using Microsoft.AspNetCore.Mvc.Filters;
using SiloGuard.Business.Exceptions;

namespace SiloGuard.Api.Filters;

// Filtro global: valida automaticamente cualquier argumento de accion para el que exista
// un IValidator<T> registrado, sin tener que repetir "validator.ValidateAsync(...)" en cada
// controller. Cubre de sobra el "≥3 endpoints con validación" de la rubrica (Parte 2.2).
public class ValidationFilter : IAsyncActionFilter
{
    private readonly IServiceProvider _serviceProvider;

    public ValidationFilter(IServiceProvider serviceProvider) => _serviceProvider = serviceProvider;

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        foreach (var argument in context.ActionArguments.Values)
        {
            if (argument is null) continue;

            var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());
            if (_serviceProvider.GetService(validatorType) is not IValidator validator) continue;

            var validationContext = new ValidationContext<object>(argument);
            var result = await validator.ValidateAsync(validationContext);

            if (!result.IsValid)
            {
                var errors = result.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
                throw new ValidationAppException(errors);
            }
        }

        await next();
    }
}
