# BankQ Frontend Git Setup Script
param(
    [string]$RepoUrl = ""
)

Write-Host "Setting up BankQ Frontend repository..." -ForegroundColor Cyan
Set-Location "C:\Users\NIKHITHA\.gemini\antigravity-ide\scratch\digital-queue-management-system\frontend"

if (-not (Test-Path ".git")) {
    git init -b main
}

git add .
git commit -m "feat: initial commit for BankQ frontend (React + Vite)"

if ($RepoUrl -ne "") {
    git remote remove origin -ErrorAction SilentlyContinue
    git remote add origin $RepoUrl
    git push -u origin main
    Write-Host "Frontend pushed to $RepoUrl" -ForegroundColor Green
} else {
    Write-Host "To push, run:" -ForegroundColor White
    Write-Host "  git remote add origin https://github.com/YOUR_USERNAME/bankq-frontend.git" -ForegroundColor Yellow
    Write-Host "  git push -u origin main" -ForegroundColor Yellow
}
