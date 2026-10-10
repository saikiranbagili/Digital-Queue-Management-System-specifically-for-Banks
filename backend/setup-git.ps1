# BankQ Backend Git Setup Script
param(
    [string]$RepoUrl = ""
)

Write-Host "Setting up BankQ Backend repository..." -ForegroundColor Cyan
Set-Location "C:\Users\NIKHITHA\.gemini\antigravity-ide\scratch\digital-queue-management-system\backend"

if (-not (Test-Path ".git")) {
    git init -b main
}

git add .
git commit -m "feat: initial commit for BankQ backend (Spring Boot)"

if ($RepoUrl -ne "") {
    git remote remove origin -ErrorAction SilentlyContinue
    git remote add origin $RepoUrl
    git push -u origin main
    Write-Host "Backend pushed to $RepoUrl" -ForegroundColor Green
} else {
    Write-Host "To push, run:" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/bankq-backend.git" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Yellow
}
