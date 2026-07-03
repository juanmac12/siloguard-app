using FluentValidation;
using SiloGuard.Business.Dtos.Perfil;

namespace SiloGuard.Business.Validators;

public class PerfilUpdateRequestValidator : AbstractValidator<PerfilUpdateRequest>
{
    public PerfilUpdateRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.FarmName).NotEmpty().MaximumLength(200);
        RuleFor(x => x.FarmHa).GreaterThan(0).When(x => x.FarmHa.HasValue);
    }
}
