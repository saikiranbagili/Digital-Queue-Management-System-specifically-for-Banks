# BankQ Git Setup & Push Script
param(
    [string]$RepoUrl = ""
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   BankQ — GitHub Repository Setup       " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Check if git is available
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "`n[!] Git is not found in your system PATH." -ForegroundColor Yellow
    Write-Host "Please download and install Git from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "Or install GitHub Desktop from: https://desktop.github.com" -ForegroundColor White
    Write-Host "After installation, open a new PowerShell window and run this script again." -ForegroundColor White
    exit 1
}

# Navigate to project root
Set-Location "C:\Users\NIKHITHA\.gemini\antigravity-ide\scratch\digital-queue-management-system"

Write-Host "`n[1/4] Initializing Git repository..." -ForegroundColor Green
if (-not (Test-Path ".git")) {
    git init -b main
}

Write-Host "[2/4] Staging files (excluding build artifacts and logs)..." -ForegroundColor Green
git add .

Write-Host "[3/4] Creating initial commit..." -ForegroundColor Green
git commit -m "feat: complete BankQ digital queue management system (frontend + backend)"

if ($RepoUrl -ne "") {
    Write-Host "[4/4] Setting remote origin and pushing to GitHub..." -ForegroundColor Green
    git remote remove origin -ErrorAction SilentlyContinue
    git remote add origin $RepoUrl
    git push -u origin main
    Write-Host "`n[✓] Repository successfully pushed to GitHub: $RepoUrl" -ForegroundColor Cyan
} else {
    Write-Host "`n[✓] Local Git repository is ready!" -ForegroundColor Green
    Write-Host "To link your GitHub repository, run:" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Yellow
}
