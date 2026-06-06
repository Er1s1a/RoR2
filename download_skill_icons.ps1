$ErrorActionPreference = "Continue"
$htmlFile = "D:\雨2小程序\index.html"
$iconsDir = "D:\雨2小程序\icons"

if (-not (Test-Path $iconsDir)) { New-Item -ItemType Directory -Path $iconsDir | Out-Null }

$html = Get-Content $htmlFile -Raw
$survMatch = [regex]::Match($html, 'var SURVIVORS = \[([\s\S]*?)\];')
if (-not $survMatch.Success) { Write-Host "SURVIVORS not found"; exit 1 }

$skills = [regex]::Matches($survMatch.Groups[1].Value, 'en:"([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Where-Object { $_ -ne '-' } | Select-Object -Unique

Write-Host "Found $($skills.Count) unique skills."

$downloaded = 0

foreach ($skillName in $skills) {
    $skillFile = $skillName -replace ' ', '_' -replace "'", ''
    $saveName = "skill_$skillFile" -replace "'", '' -replace '\.', '' -replace ',', '' -replace '"', '' -replace ' ', '_'
    $saveFile = Join-Path $iconsDir "$saveName.webp"
    
    if (Test-Path $saveFile) {
        Write-Host "SKIP: $saveName (exists)"
        continue
    }
    
    try {
        $apiUrl = "https://riskofrain2.wiki.gg/api.php?action=query&titles=File:$skillFile.png&prop=imageinfo&iiprop=url&format=json"
        $apiResp = Invoke-RestMethod -Uri $apiUrl -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" -TimeoutSec 15
        $pages = $apiResp.query.pages
        if (-not $pages) { Write-Host "FAIL: $saveName (no pages)"; continue }
        $page = $pages.PSObject.Properties.Value | Select-Object -First 1
        if ($page.imagerepository -ne 'local' -or -not $page.imageinfo) {
            Write-Host "MISS: $saveName"
            continue
        }
        $imgUrl = $page.imageinfo[0].url
        Invoke-WebRequest -Uri $imgUrl -OutFile $saveFile -UserAgent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" -TimeoutSec 30
        $size = (Get-Item $saveFile).Length
        Write-Host "OK: $saveName ($size bytes)"
        $downloaded++
        Start-Sleep -Milliseconds 200
    } catch {
        Write-Host "ERR: $saveName - $_"
    }
}

Write-Host "`nDone! $downloaded downloaded."
