using FluentValidation;
using SiloGuard.Business.Dtos.Silos;

namespace SiloGuard.Business.Validators;

public class UmbralesUpdateRequestValidator : AbstractValidator<UmbralesUpdateRequest>
{
    private static readonly string[] Variables = ["temp", "hum", "co2"];

    public UmbralesUpdateRequestValidator()
    {
        RuleFor(x => x.Items)
            .Must(items => items.Count == 3)
            .WithMessage("Se esperan exactamente 3 umbrales: temp, hum y co2.");

        RuleFor(x => x.Items)
            .Must(items => items.Select(i => i.Variable).Distinct().Count() == items.Count)
            .WithMessage("No puede haber variables repetidas.");

        RuleForEach(x => x.Items).ChildRules(item =>
        {
            item.RuleFor(i => i.Variable)
                .Must(v => Variables.Contains(v))
                .WithMessage("La variable debe ser temp, hum o co2.");

            // Solo rangos absurdos: la regla Warn < Crit vive como check constraint en la
            // base (CK_Umbral_WarnLtCrit) a proposito, para que el rollback transaccional
            // del PUT sea un camino demostrable y no algo que FluentValidation intercepta.
            item.RuleFor(i => i.Warn).InclusiveBetween(0.01m, 100000m);
            item.RuleFor(i => i.Crit).InclusiveBetween(0.01m, 100000m);
        });
    }
}
