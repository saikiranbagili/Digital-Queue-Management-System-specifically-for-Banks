# Branch Token Isolation Verification Test

function Get-Or-CreateToken($userToken, $reqBody, $label) {
    try {
        $tok = Invoke-RestMethod -Uri 'http://localhost:8080/api/customer/tokens' -Method Post -Headers @{ Authorization = "Bearer $userToken" } -Body $reqBody -ContentType 'application/json'
        Write-Host "$label Token Created:" $tok.tokenNumber "| Branch:" $tok.branch "| Status:" $tok.status "| People Ahead:" $tok.peopleAhead
    } catch {
        # Fetch current tokens if already created
        $tokens = Invoke-RestMethod -Uri 'http://localhost:8080/api/customer/tokens' -Method Get -Headers @{ Authorization = "Bearer $userToken" }
        $tok = $tokens | Select-Object -First 1
        Write-Host "$label Token (Existing):" $tok.tokenNumber "| Branch:" $tok.branch "| Status:" $tok.status "| People Ahead:" $tok.peopleAhead
    }
}

# 1. HDFC Bank - Madhapur customer 1
$hdfcBody = @{
    name = 'HDFC Customer'
    email = 'hdfc_user1@test.com'
    password = 'password123'
    role = 'CUSTOMER'
    bankName = 'HDFC Bank'
    branch = 'Madhapur'
    accountNumber = 'HDFC112233'
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/register' -Method Post -Body $hdfcBody -ContentType 'application/json'
    $tokenHdfc = $res.token
} catch {
    $login = @{ email = 'hdfc_user1@test.com'; password = 'password123' } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $login -ContentType 'application/json'
    $tokenHdfc = $res.token
}

# 2. ICICI Bank - Banjara Hills customer 1
$iciciBody = @{
    name = 'ICICI Customer'
    email = 'icici_user1@test.com'
    password = 'password123'
    role = 'CUSTOMER'
    bankName = 'ICICI Bank'
    branch = 'Banjara Hills'
    accountNumber = 'ICICI445566'
} | ConvertTo-Json

try {
    $res2 = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/register' -Method Post -Body $iciciBody -ContentType 'application/json'
    $tokenIcici = $res2.token
} catch {
    $login2 = @{ email = 'icici_user1@test.com'; password = 'password123' } | ConvertTo-Json
    $res2 = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $login2 -ContentType 'application/json'
    $tokenIcici = $res2.token
}

# 3. HDFC Bank - Madhapur customer 2
$hdfc2Body = @{
    name = 'HDFC Customer Two'
    email = 'hdfc_user2@test.com'
    password = 'password123'
    role = 'CUSTOMER'
    bankName = 'HDFC Bank'
    branch = 'Madhapur'
    accountNumber = 'HDFC778899'
} | ConvertTo-Json

try {
    $res3 = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/register' -Method Post -Body $hdfc2Body -ContentType 'application/json'
    $tokenHdfc2 = $res3.token
} catch {
    $login3 = @{ email = 'hdfc_user2@test.com'; password = 'password123' } | ConvertTo-Json
    $res3 = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method Post -Body $login3 -ContentType 'application/json'
    $tokenHdfc2 = $res3.token
}

# Request tokens
$tokHdfcReq = @{ serviceName = 'Cash Deposit'; branch = 'Madhapur' } | ConvertTo-Json
$tokIciciReq = @{ serviceName = 'Cash Deposit'; branch = 'Banjara Hills' } | ConvertTo-Json

Get-Or-CreateToken $tokenHdfc $tokHdfcReq "HDFC Madhapur (User 1)"
Get-Or-CreateToken $tokenHdfc2 $tokHdfcReq "HDFC Madhapur (User 2)"
Get-Or-CreateToken $tokenIcici $tokIciciReq "ICICI Banjara Hills (User 1)"
