using System.Text.RegularExpressions;

namespace SiloGuard.Business.Sanitization;

public partial class HtmlInputSanitizer : IInputSanitizer
{
    public string? Sanitize(string? input)
    {
        if (string.IsNullOrEmpty(input)) return input;

        var withoutTags = TagRegex().Replace(input, string.Empty);
        return withoutTags.Trim();
    }

    [GeneratedRegex("<[^>]*>")]
    private static partial Regex TagRegex();
}
