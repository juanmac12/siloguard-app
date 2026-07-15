using SiloGuard.Business.Dtos.Auth;
using SiloGuard.Business.Dtos.Lotes;
using SiloGuard.Business.Dtos.Perfil;
using SiloGuard.Business.Dtos.Silos;
using SiloGuard.Business.Validators;

namespace SiloGuard.Tests;

// Validaciones de entrada (rubrica 2.2): reglas de FluentValidation por endpoint.
public class ValidatorTests
{
    [Fact]
    public void Register_RechazaPasswordCorto_Y_EmailInvalido()
    {
        var validator = new RegisterRequestValidator();

        var invalido = validator.Validate(new RegisterRequest
        {
            Name = "Juan",
            Email = "no-es-un-email",
            Password = "corta",
            FarmName = "La Esperanza",
        });

        Assert.False(invalido.IsValid);
        Assert.Contains(invalido.Errors, e => e.PropertyName == nameof(RegisterRequest.Email));
        Assert.Contains(invalido.Errors, e => e.PropertyName == nameof(RegisterRequest.Password));
    }

    [Fact]
    public void Umbrales_ExigeExactamenteTresVariablesSinRepetir()
    {
        var validator = new UmbralesUpdateRequestValidator();

        var soloDos = validator.Validate(new UmbralesUpdateRequest
        {
            Items =
            [
                new UmbralItem { Variable = "temp", Warn = 28, Crit = 35 },
                new UmbralItem { Variable = "hum", Warn = 16, Crit = 20 },
            ],
        });
        Assert.False(soloDos.IsValid);

        var repetidas = validator.Validate(new UmbralesUpdateRequest
        {
            Items =
            [
                new UmbralItem { Variable = "temp", Warn = 28, Crit = 35 },
                new UmbralItem { Variable = "temp", Warn = 30, Crit = 40 },
                new UmbralItem { Variable = "co2", Warn = 600, Crit = 800 },
            ],
        });
        Assert.False(repetidas.IsValid);

        var valido = validator.Validate(new UmbralesUpdateRequest
        {
            Items =
            [
                new UmbralItem { Variable = "temp", Warn = 28, Crit = 35 },
                new UmbralItem { Variable = "hum", Warn = 16, Crit = 20 },
                new UmbralItem { Variable = "co2", Warn = 600, Crit = 800 },
            ],
        });
        Assert.True(valido.IsValid);
    }

    [Fact]
    public void Umbrales_WarnMayorQueCrit_PasaLaValidacion_PorqueLoRechazaLaBase()
    {
        // Decision de diseño: la regla Warn < Crit vive como check constraint en la DB
        // para que el rollback transaccional del PUT sea demostrable (Parte 4.3).
        var validator = new UmbralesUpdateRequestValidator();

        var result = validator.Validate(new UmbralesUpdateRequest
        {
            Items =
            [
                new UmbralItem { Variable = "temp", Warn = 40, Crit = 30 },
                new UmbralItem { Variable = "hum", Warn = 16, Crit = 20 },
                new UmbralItem { Variable = "co2", Warn = 600, Crit = 800 },
            ],
        });

        Assert.True(result.IsValid);
    }

    [Fact]
    public void CompartirLote_RechazaListaVacia()
    {
        var validator = new CompartirLoteRequestValidator();

        Assert.False(validator.Validate(new CompartirLoteRequest()).IsValid);
        Assert.True(validator.Validate(new CompartirLoteRequest { DestinatarioIds = [1, 2] }).IsValid);
    }

    [Fact]
    public void Preferencias_ExigeRangoHorarioValidoSoloConSilencioActivo()
    {
        var validator = new PreferenciasUpdateRequestValidator();

        // Sin silencio nocturno, el rango no es obligatorio.
        Assert.True(validator.Validate(new PreferenciasUpdateRequest { SilencioNocturno = false }).IsValid);

        // Con silencio activo, exige formato HH:mm.
        var malFormato = validator.Validate(new PreferenciasUpdateRequest
        {
            SilencioNocturno = true,
            SilencioDesde = "25:99",
            SilencioHasta = "07:00",
        });
        Assert.False(malFormato.IsValid);

        var ok = validator.Validate(new PreferenciasUpdateRequest
        {
            SilencioNocturno = true,
            SilencioDesde = "22:00",
            SilencioHasta = "07:00",
        });
        Assert.True(ok.IsValid);
    }
}
