using FluentValidation;
using SiloGuard.Business.Dtos.Silos;

namespace SiloGuard.Business.Validators;

public class SiloUpdateRequestValidator : AbstractValidator<SiloUpdateRequest>
{
    public SiloUpdateRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Grain).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Storage).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Acopio).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Tons).GreaterThan(0);
    }
}
