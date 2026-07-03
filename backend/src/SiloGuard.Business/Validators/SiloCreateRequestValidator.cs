using FluentValidation;
using SiloGuard.Business.Dtos.Silos;

namespace SiloGuard.Business.Validators;

public class SiloCreateRequestValidator : AbstractValidator<SiloCreateRequest>
{
    public SiloCreateRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Grain).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Storage).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Acopio).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Tons).GreaterThan(0).WithMessage("El tonelaje debe ser mayor a 0.");

        // Rango deliberadamente MAS AMPLIO que los check constraints de la base
        // (SensorReadingConfiguration: Temp -50..150, Hum 0..100, Co2 >= 0). Solo filtra
        // valores absurdos (ej. NaN/overflow) aca; un valor "plausible pero invalido"
        // (ej. 999°C) pasa esta validacion y es la base la que lo rechaza — asi el
        // rollback transaccional de SiloService.CreateAsync es un camino real y
        // demostrable, no algo que la validacion de FluentValidation ya intercepta antes.
        RuleFor(x => x.InitialTemp).InclusiveBetween(-1000, 1000);
        RuleFor(x => x.InitialHum).InclusiveBetween(-1000, 1000);
        RuleFor(x => x.InitialCo2).InclusiveBetween(-1000, 100000);
    }
}
