using FluentValidation;
using SiloGuard.Business.Dtos.Lecturas;

namespace SiloGuard.Business.Validators;

public class LecturaCreateRequestValidator : AbstractValidator<LecturaCreateRequest>
{
    public LecturaCreateRequestValidator()
    {
        // Mismo criterio que SiloCreateRequestValidator: rango deliberadamente mas amplio
        // que los check constraints de la base (SensorReadingConfiguration: Temp -50..150,
        // Hum 0..100, Co2 >= 0), para que sea la base la que rechace un valor fuera de
        // rango con un 409 y no esta validacion.
        RuleFor(x => x.Temp).InclusiveBetween(-1000, 1000);
        RuleFor(x => x.Hum).InclusiveBetween(-1000, 1000);
        RuleFor(x => x.Co2).InclusiveBetween(-1000, 100000);
    }
}
