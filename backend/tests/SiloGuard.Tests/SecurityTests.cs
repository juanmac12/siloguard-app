using SiloGuard.Business.Sanitization;
using SiloGuard.Business.Security;

namespace SiloGuard.Tests;

// Seguridad: hash de contraseñas (rubrica 1.3) y sanitizacion anti-XSS (rubrica 5.3).
public class SecurityTests
{
    private readonly BCryptPasswordHasher _hasher = new();
    private readonly HtmlInputSanitizer _sanitizer = new();

    [Fact]
    public void Hash_GeneraSaltDistintoPorPassword()
    {
        var hash1 = _hasher.Hash("Demo1234");
        var hash2 = _hasher.Hash("Demo1234");

        // Mismo password, hashes distintos → el salt esta embebido y es aleatorio.
        Assert.NotEqual(hash1, hash2);
        Assert.StartsWith("$2", hash1); // formato BCrypt "$2a$..."
    }

    [Fact]
    public void Verify_AceptaPasswordCorrecto_Y_RechazaIncorrecto()
    {
        var hash = _hasher.Hash("Demo1234");

        Assert.True(_hasher.Verify("Demo1234", hash));
        Assert.False(_hasher.Verify("otraClave99", hash));
    }

    [Theory]
    [InlineData("<script>alert(1)</script>", "alert(1)")]
    [InlineData("Silo <b>Norte</b>", "Silo Norte")]
    [InlineData("  sin tags  ", "sin tags")]
    [InlineData("<img src=x onerror=alert(1)>", "")]
    public void Sanitize_EliminaTagsHtml(string input, string expected)
    {
        Assert.Equal(expected, _sanitizer.Sanitize(input));
    }

    [Fact]
    public void Sanitize_PreservaNullYVacio()
    {
        Assert.Null(_sanitizer.Sanitize(null));
        Assert.Equal("", _sanitizer.Sanitize(""));
    }
}
