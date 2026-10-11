param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Query
)

$java = "C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot\bin\java.exe"
$pgJar = "C:\Users\NIKHITHA\.m2\repository\org\postgresql\postgresql\42.6.2\postgresql-42.6.2.jar"

if (-not (Test-Path $java)) {
    Write-Host "Java not found at $java" -ForegroundColor Red
    exit 1
}

if ($Query) {
    $queryString = $Query -join " "
    & $java -cp ".;$pgJar" QueryDatabase $queryString
} else {
    & $java -cp ".;$pgJar" QueryDatabase
}
