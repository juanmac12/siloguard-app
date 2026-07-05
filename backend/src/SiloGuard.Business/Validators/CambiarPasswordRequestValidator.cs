using FluentValidation;
using SiloGuard.Business.Dtos.Perfil;

namespace SiloGuard.Business.Validators;

public class CambiarPasswordRequestValidator : AbstractValidator<CambiarPasswordRequest>
{
    public CambiarPasswordRequestValidator()
    {
        RuleFor(x => x.CurrentPassword).NotEmpty()
            .WithMessage("Ingresá tu contraseña actual.");
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(8)
            .WithMessage("La contraseña nueva debe tener al menos 8 caracteres.");
        RuleFor(x => x.NewPassword).NotEqual(x => x.CurrentPassword)
            .WithMessage("La contraseña nueva debe ser distinta a la actual.");
    }
}
