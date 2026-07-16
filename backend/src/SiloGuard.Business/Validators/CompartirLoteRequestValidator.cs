using FluentValidation;
using SiloGuard.Business.Dtos.Lotes;

namespace SiloGuard.Business.Validators;

public class CompartirLoteRequestValidator : AbstractValidator<CompartirLoteRequest>
{
    public CompartirLoteRequestValidator()
    {
        RuleFor(x => x.DestinatarioIds)
            .NotEmpty().WithMessage("Elegí al menos un destinatario.");

        RuleForEach(x => x.DestinatarioIds).GreaterThan(0);
    }
}
