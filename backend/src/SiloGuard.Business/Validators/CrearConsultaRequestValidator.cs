using FluentValidation;
using SiloGuard.Business.Dtos.Soporte;

namespace SiloGuard.Business.Validators;

public class CrearConsultaRequestValidator : AbstractValidator<CrearConsultaRequest>
{
    public CrearConsultaRequestValidator()
    {
        RuleFor(x => x.Mensaje)
            .NotEmpty().WithMessage("Escribí tu consulta.")
            .MaximumLength(1000);

        RuleFor(x => x.TecnicoId).GreaterThan(0).When(x => x.TecnicoId.HasValue);
    }
}
