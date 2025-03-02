# Cleanup UI-related files for Excel converter

Write-Host "Removing Excel converter UI components..." -ForegroundColor Cyan

# Function to safely remove a file if it exists
function Remove-FileIfExists {
    param (
        [string]$FilePath,
        [string]$Description
    )
    
    if (Test-Path $FilePath) {
        Remove-Item -Path $FilePath -Force
        Write-Host "✅ Removed: $Description" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Not found: $Description" -ForegroundColor Yellow
    }
}

# Remove UI-related CSS files
$cssFiles = @(
    "D:/Emerging_assignment/Real_estate/price_predicter/src/styles/ExcelConverter.css",
    "D:/Emerging_assignment/Real_estate/price_predicter/src/styles/DataDisplay.css",
    "D:/Emerging_assignment/Real_estate/price_predicter/src/styles/UploadForm.css"
)

foreach ($file in $cssFiles) {
    Remove-FileIfExists $file "CSS file"
}

# Remove UI-related component files
$componentFiles = @(
    "D:/Emerging_assignment/Real_estate/price_predicter/src/components/ExcelUploader.js",
    "D:/Emerging_assignment/Real_estate/price_predicter/src/components/ExcelPreview.js",
    "D:/Emerging_assignment/Real_estate/price_predicter/src/components/DataDisplay.js",
    "D:/Emerging_assignment/Real_estate/price_predicter/src/components/UploadForm.js"
)

foreach ($file in $componentFiles) {
    Remove-FileIfExists $file "Component file"
}

# Check if styles directory is empty after removal
$stylesDir = "D:/Emerging_assignment/Real_estate/price_predicter/src/styles"
if (Test-Path $stylesDir) {
    $isEmpty = (Get-ChildItem -Path $stylesDir -Force).Count -eq 0
    if ($isEmpty) {
        Remove-Item -Path $stylesDir -Force -Recurse
        Write-Host "✅ Removed empty styles directory" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Styles directory not empty, keeping remaining files" -ForegroundColor Yellow
    }
}

Write-Host "`nUI cleanup completed. App has been simplified." -ForegroundColor Cyan
Write-Host "Run 'npm start' to view the simplified application." -ForegroundColor Cyan
