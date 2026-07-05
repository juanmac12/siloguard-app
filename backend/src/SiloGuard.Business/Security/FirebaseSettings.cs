namespace SiloGuard.Business.Security;

public class FirebaseSettings
{
    public string CredentialsPath { get; set; } = string.Empty;

    // Emails que no requieren email_verified en Firebase (p.ej. el usuario seed de la demo,
    // que se crea directo en la base y nunca pasó por el registro con Firebase).
    public string[] VerificationBypassEmails { get; set; } = [];
}
