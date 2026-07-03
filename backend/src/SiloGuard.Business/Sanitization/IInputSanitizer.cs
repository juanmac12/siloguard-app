namespace SiloGuard.Business.Sanitization;

public interface IInputSanitizer
{
    // Limpia un campo de texto libre antes de persistirlo: quita tags HTML y
    // escapa caracteres especiales, para que un valor como "<script>alert(1)</script>"
    // nunca quede guardado (ni se pueda ejecutar) tal cual (rubrica Parte 5.3, OWASP XSS).
    string? Sanitize(string? input);
}
