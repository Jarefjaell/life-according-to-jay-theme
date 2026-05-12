# life-according-to-jay-theme

The Ghost theme behind [lifeaccordingtojay.com](https://lifeaccordingtojay.com).

> Hand-built on Ghost. Custom theme, vanilla CSS and JS. No frameworks, no shortcuts.

Handlebars templates served by Ghost(Pro). Built for the site, not packaged for general reuse.

## Structure

```
src/         Theme source (Handlebars + CSS + JS)
build.ps1    Builds src/ into a Ghost-ready zip in dist/
dist/        Built zips (gitignored)
```

## Building locally

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

Produces `dist/life-according-to-jay-v<version>.zip`. Upload through Ghost admin under Settings → Design → Change theme.

The script writes zip entries with explicit forward-slash separators because PowerShell's built-in archive tools default to backslashes on Windows, which Ghost's Linux uploader rejects.

## License

No license. Public for visibility, not packaged for redistribution or reuse.

---

Jakob Jarefjäll · [lifeaccordingtojay.com](https://lifeaccordingtojay.com) · [LinkedIn](https://linkedin.com/in/im-jakob)
