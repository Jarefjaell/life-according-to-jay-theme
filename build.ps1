# Life According to Jay - theme build script
#
# Reads version from src/package.json and produces
# dist/life-according-to-jay-v<version>.zip ready for upload
# to Ghost admin > Settings > Design > Change theme.
#
# Writes zip entries manually with forward-slash path separators.
# This avoids two known issues:
#  - PowerShell's built-in Compress-Archive cmdlet writes
#    backslash separators on Windows (PowerShell 5.1)
#  - .NET Framework's ZipFile.CreateFromDirectory has the same
#    bug, so Add-Type + CreateFromDirectory does not fix it
#  - PowerShell 7+ on .NET Core writes forward slashes correctly,
#    but we cannot assume a specific PowerShell version
#
# Manual entry writing produces spec-compliant output on every
# version. Ghost's Linux uploader requires forward slashes.
#
# Usage from this folder:
#   powershell -ExecutionPolicy Bypass -File .\build.ps1
#
# The zip contains a single root folder named
# life-according-to-jay-v<version> with all theme files inside,
# matching the Ghost convention.

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$here    = Split-Path -Parent $MyInvocation.MyCommand.Path
$srcDir  = Join-Path $here 'src'
$distDir = Join-Path $here 'dist'

if (-not (Test-Path $srcDir)) {
    Write-Host "src/ not found at $srcDir" -ForegroundColor Red
    exit 1
}

$pkgPath = Join-Path $srcDir 'package.json'
if (-not (Test-Path $pkgPath)) {
    Write-Host "src/package.json not found" -ForegroundColor Red
    exit 1
}

$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$version  = $pkg.version
$rootName = "life-according-to-jay-v$version"
$zipName  = "$rootName.zip"
$zipPath  = Join-Path $distDir $zipName

if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir | Out-Null
}

if (Test-Path $zipPath) {
    Write-Host "Overwriting existing $zipName" -ForegroundColor Yellow
    Remove-Item $zipPath -Force
}

# Build zip entry by entry with explicit forward-slash names.
# Each entry is named "<rootName>/<relative path within src/>"
# with backslashes replaced by forward slashes.
$srcDirFull = (Resolve-Path $srcDir).Path
$prefixLen  = $srcDirFull.Length + 1

$zip = [System.IO.Compression.ZipFile]::Open(
    $zipPath,
    [System.IO.Compression.ZipArchiveMode]::Create
)

try {
    $files = Get-ChildItem -Path $srcDirFull -Recurse -File

    foreach ($file in $files) {
        $relative = $file.FullName.Substring($prefixLen) -replace '\\', '/'
        $entryName = "$rootName/$relative"

        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $zip,
            $file.FullName,
            $entryName,
            [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    }
}
finally {
    $zip.Dispose()
}

$size = (Get-Item $zipPath).Length
$count = $files.Count

Write-Host ""
Write-Host "Built: $zipName" -ForegroundColor Green
Write-Host "  files: $count"
Write-Host "  size:  $([math]::Round($size / 1KB, 1)) KB"
Write-Host "  path:  $zipPath"
Write-Host ""
Write-Host "Upload via Ghost admin > Settings > Design > Change theme"
