# Final cleanup script for Real Estate Price Predictor

Write-Host "Performing final cleanup..." -ForegroundColor Cyan

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

# Remove redundant files
Write-Host "`nRemoving redundant files..." -ForegroundColor Cyan

# Remove the older ExcelToJson.js as it's replaced by DataConverter.js
Remove-FileIfExists "D:/Emerging_assignment/Real_estate/price_predicter/src/conversion/ExcelToJson.js" "Redundant ExcelToJson component"

# Remove any conversion scripts
Remove-FileIfExists "D:/Emerging_assignment/Real_estate/price_predicter/convertExcel.js" "Root conversion script"
Remove-FileIfExists "D:/Emerging_assignment/Real_estate/price_predicter/scripts/convertExcel.js" "Scripts folder conversion script"

# Cleanup empty directories
$emptyDirs = @(
    "D:/Emerging_assignment/Real_estate/price_predicter/scripts",
    "D:/Emerging_assignment/Real_estate/price_predicter/src/scripts"
)

foreach ($dir in $emptyDirs) {
    if (Test-Path $dir) {
        # Check if directory is empty
        $isEmpty = (Get-ChildItem -Path $dir -Force).Count -eq 0
        if ($isEmpty) {
            Remove-Item -Path $dir -Force -Recurse
            Write-Host "✅ Removed empty directory: $dir" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Directory not empty, skipping: $dir" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️ Directory not found: $dir" -ForegroundColor Yellow
    }
}

Write-Host "`nVerifying essential files exist..." -ForegroundColor Cyan

# Check that essential files still exist
$essentialFiles = @(
    "D:/Emerging_assignment/Real_estate/price_predicter/src/utils/DataHandler.js",
    "D:/Emerging_assignment/Real_estate/price_predicter/src/components/DataConverter.js",
    "D:/Emerging_assignment/Real_estate/price_predicter/src/conversion/converted.json",
    "D:/Emerging_assignment/Real_estate/price_predicter/src/App.js"
)

foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Verified: $file exists" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing essential file: $file" -ForegroundColor Red
    }
}

Write-Host "`nCleanup completed. Project structure has been optimized." -ForegroundColor Cyan
Write-Host "`nYou can now start your application with: npm start" -ForegroundColor Cyan
