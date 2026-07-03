using FluentValidation;
using SiloGuard.Business.Dtos.Alertas;

namespace SiloGuard.Business.Validators;

public class ResolverAlertaRequestValidator : AbstractValidator<ResolverAlertaRequest>
{
    public ResolverAlertaRequestValidator()
    {
        RuleFor(x => x.ResolutionNote).MaximumLength(1000);
        RuleFor(x => x.ResolutionReason).MaximumLength(200);
    }
}
