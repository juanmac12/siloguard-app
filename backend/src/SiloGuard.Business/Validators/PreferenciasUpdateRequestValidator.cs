using System.Text.RegularExpressions;
using FluentValidation;
using SiloGuard.Business.Dtos.Perfil;

namespace SiloGuard.Business.Validators;

public partial class PreferenciasUpdateRequestValidator : AbstractValidator<PreferenciasUpdateRequest>
{
    public PreferenciasUpdateRequestValidator()
    {
        When(x => x.SilencioNocturno, () =>
        {
            RuleFor(x => x.SilencioDesde)
                .NotEmpty().WithMessage("Indicá la hora de inicio del silencio nocturno.")
                .Must(BeValidTime).WithMessage("Formato de hora inválido (esperado HH:mm).");

            RuleFor(x => x.SilencioHasta)
                .NotEmpty().WithMessage("Indicá la hora de fin del silencio nocturno.")
                .Must(BeValidTime).WithMessage("Formato de hora inválido (esperado HH:mm).");
        });
    }

    private static bool BeValidTime(string? value) =>
        value is not null && TimeRegex().IsMatch(value);

    [GeneratedRegex("^([01][0-9]|2[0-3]):[0-5][0-9]$")]
    private static partial Regex TimeRegex();
}
