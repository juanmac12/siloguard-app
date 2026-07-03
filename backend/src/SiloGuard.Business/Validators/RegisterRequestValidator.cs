using FluentValidation;
using SiloGuard.Business.Dtos.Auth;

namespace SiloGuard.Business.Validators;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8)
            .WithMessage("La contraseña debe tener al menos 8 caracteres.");
        RuleFor(x => x.FarmName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.FarmHa).GreaterThan(0).When(x => x.FarmHa.HasValue);
    }
}
