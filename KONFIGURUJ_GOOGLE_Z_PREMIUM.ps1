param(
    [string]$PremiumEnvPath = ""
)
$ErrorActionPreference = 'Stop'
$studioRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$studioEnv = Join-Path $studioRoot '.env'
if ([string]::IsNullOrWhiteSpace($PremiumEnvPath)) {
    Add-Type -AssemblyName System.Windows.Forms
    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.Title = 'Wybierz plik .env z KALTRUCK Premium'
    $dialog.Filter = 'Pliki konfiguracji|*.env;*.env.local;*.txt|Wszystkie pliki|*.*'
    $dialog.FileName = '.env'
    if ($dialog.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) {
        Write-Host 'Nie wybrano pliku. Zmian nie zapisano.'
        exit 0
    }
    $PremiumEnvPath = $dialog.FileName
}
if (-not (Test-Path -LiteralPath $PremiumEnvPath -PathType Leaf)) {
    throw 'Nie znaleziono pliku .env Premium.'
}
$values = @{}
foreach ($line in [System.IO.File]::ReadAllLines($PremiumEnvPath)) {
    if ($line -match '^\s*(?:export\s+)?(PUBLIC_GOOGLE_MAPS_API_KEY|PUBLIC_GOOGLE_PLACE_ID)\s*=\s*(.*)$') {
        $value = $Matches[2].Trim()
        if ($value.Length -ge 2 -and (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'")))) {
            $value = $value.Substring(1, $value.Length - 2)
        } elseif ($value.Contains(' #')) {
            $value = $value.Split(@(' #'), [System.StringSplitOptions]::None)[0].Trim()
        }
        $values[$Matches[1]] = $value
    }
}
if (-not $values['PUBLIC_GOOGLE_MAPS_API_KEY']) {
    throw 'Wybrany plik nie zawiera PUBLIC_GOOGLE_MAPS_API_KEY. Skonfiguruj wartosc we wlasnym Google Cloud.'
}
if (-not $values['PUBLIC_GOOGLE_PLACE_ID']) {
    $values['PUBLIC_GOOGLE_PLACE_ID'] = 'ChIJhbMF0yh3HEcRVTtOsPxz9eM'
}
$existing = @()
if (Test-Path -LiteralPath $studioEnv -PathType Leaf) {
    $existing = @([System.IO.File]::ReadAllLines($studioEnv) | Where-Object { $_ -notmatch '^\s*(?:export\s+)?PUBLIC_GOOGLE_(MAPS_API_KEY|PLACE_ID)\s*=' })
}
$updated = @($existing) + @(
    "PUBLIC_GOOGLE_MAPS_API_KEY=$($values['PUBLIC_GOOGLE_MAPS_API_KEY'])",
    "PUBLIC_GOOGLE_PLACE_ID=$($values['PUBLIC_GOOGLE_PLACE_ID'])"
)
[System.IO.File]::WriteAllText($studioEnv, (($updated -join [Environment]::NewLine) + [Environment]::NewLine), (New-Object System.Text.UTF8Encoding($false)))
Write-Host 'Konfiguracja Google zapisana lokalnie w Studio (.env). Klucz nie zostal wyswietlony.'
Write-Host 'Uruchom ponownie npm run dev. Upewnij sie, ze klucz zezwala na http://localhost:4321/*.'
