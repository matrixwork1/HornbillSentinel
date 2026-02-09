param(
  [string]$Email = $("jwt_tester_0@example.com" -f ([DateTime]::UtcNow.ToFileTimeUtc())),
  [string]$Password = "Str0ng!JwtTesT1234",
  [string]$ApiBase = "http://localhost:5001"
)

function Write-Step([string]$text) {
  Write-Host ("`n=== {0} ===" -f $text)
}
function Write-Ok([string]$text) {
  Write-Host ("[OK] {0}" -f $text)
}
function Write-Fail([string]$text) {
  Write-Host ("[FAIL] {0}" -f $text)
}
function Get-CsrfToken($session, $apiBase) {
  try {
    $res = Invoke-WebRequest -Uri "$apiBase/api/csrf-token" -WebSession $session -UseBasicParsing | ConvertFrom-Json
    return $res.csrfToken
  } catch {
    throw "Failed to obtain CSRF token: $($_.Exception.Message)"
  }
}

Write-Step "Initialize session and obtain CSRF"
$s = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$csrf = Get-CsrfToken -session $s -apiBase $ApiBase
Write-Ok "CSRF token: $csrf"

Write-Step "Register user (if new)"
$registerBody = @{
  firstName = "JwtTester"
  email = $Email
  password = $Password
} | ConvertTo-Json
try {
  $reg = Invoke-WebRequest -Uri "$ApiBase/api/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -Headers @{ "X-CSRF-Token" = $csrf } -WebSession $s -UseBasicParsing
  if ($reg.StatusCode -eq 201) {
    Write-Ok "Registration successful for $Email"
  } else {
    Write-Host $reg.Content
  }
} catch {
  Write-Host "Registration response: $($_.Exception.Response.StatusCode.value__) $($_.Exception.Message)"
  Write-Ok "Skip registration if user exists"
}

Write-Step "Login (sets httpOnly cookies)"
$loginBody = @{ email = $Email; password = $Password } | ConvertTo-Json
$login = Invoke-WebRequest -Uri "$ApiBase/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -Headers @{ "X-CSRF-Token" = $csrf } -WebSession $s -UseBasicParsing
if ($login.StatusCode -eq 200) {
  Write-Ok "Login OK"
} else {
  Write-Fail "Login failed: $($login.StatusCode)"
  exit 1
}

Write-Step "List issued cookies"
$cookies = $s.Cookies.GetCookies($ApiBase)
$cookies | Select-Object Name, Value, Domain, Path, HttpOnly | Format-Table -AutoSize

Write-Step "Authenticated /me via cookies"
$me = Invoke-WebRequest -Uri "$ApiBase/api/auth/me" -WebSession $s -UseBasicParsing
if ($me.StatusCode -eq 200) {
  Write-Ok "GET /me OK"
  $me.Content | Write-Host
} else {
  Write-Fail "GET /me failed: $($me.StatusCode)"
}

Write-Step "Negative: login without CSRF"
$sNoCsrf = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$loginNoCsrfBody = @{ email = $Email; password = $Password } | ConvertTo-Json
try {
  $loginNoCsrf = Invoke-WebRequest -Uri "$ApiBase/api/auth/login" -Method POST -Body $loginNoCsrfBody -ContentType "application/json" -WebSession $sNoCsrf -UseBasicParsing
  Write-Fail "Login without CSRF unexpectedly succeeded: $($loginNoCsrf.StatusCode)"
} catch {
  Write-Ok "Login without CSRF blocked as expected: $($_.Exception.Response.StatusCode.value__)"
}

Write-Step "Negative: /me with NO_TOKEN (fresh session)"
$sFresh = New-Object Microsoft.PowerShell.Commands.WebRequestSession
try {
  $meFresh = Invoke-WebRequest -Uri "$ApiBase/api/auth/me" -WebSession $sFresh -UseBasicParsing
  Write-Fail "Fresh /me unexpectedly succeeded: $($meFresh.StatusCode)"
} catch {
  Write-Ok "Fresh /me blocked as expected (NO_TOKEN): $($_.Exception.Response.StatusCode.value__)"
}

Write-Step "Negative: /me with tampered x-auth-token"
try {
  $meBad = Invoke-WebRequest -Uri "$ApiBase/api/auth/me" -Headers @{ "x-auth-token" = "bad.token.value" } -WebSession $s -UseBasicParsing
  Write-Fail "Tampered header /me unexpectedly succeeded: $($meBad.StatusCode)"
} catch {
  Write-Ok "Tampered /me blocked (INVALID_TOKEN): $($_.Exception.Response.StatusCode.value__)"
}

Write-Step "Refresh access token (no CSRF required)"
$refresh = Invoke-WebRequest -Uri "$ApiBase/api/auth/refresh" -Method POST -WebSession $s -UseBasicParsing
if ($refresh.StatusCode -eq 200) {
  Write-Ok "Refresh OK"
} else {
  Write-Fail "Refresh failed: $($refresh.StatusCode)"
}

Write-Step "List cookies after refresh"
$cookies2 = $s.Cookies.GetCookies($ApiBase)
$cookies2 | Select-Object Name, Value, Domain, Path, HttpOnly | Format-Table -AutoSize

Write-Step "Authenticated /me after refresh"
$cookieSet = $s.Cookies.GetCookies($ApiBase)
$tokenVal = $null
if ($cookieSet['accessToken']) { $tokenVal = $cookieSet['accessToken'].Value } elseif ($cookieSet['token']) { $tokenVal = $cookieSet['token'].Value }
$me2 = Invoke-WebRequest -Uri "$ApiBase/api/auth/me" -Headers @{ 'x-auth-token' = $tokenVal } -WebSession $s -UseBasicParsing
if ($me2.StatusCode -eq 200) {
  Write-Ok "GET /me after refresh OK"
} else {
  Write-Fail "GET /me after refresh failed: $($me2.StatusCode)"
}

Write-Step "Logout (revokes refreshToken and clears cookies)"
$csrf2 = Get-CsrfToken -session $s -apiBase $ApiBase
$cookieSet = $s.Cookies.GetCookies($ApiBase)
$tokenVal = $null
if ($cookieSet['accessToken']) { $tokenVal = $cookieSet['accessToken'].Value } elseif ($cookieSet['token']) { $tokenVal = $cookieSet['token'].Value }
$logout = Invoke-WebRequest -Uri "$ApiBase/api/auth/logout" -Method POST -Headers @{ "X-CSRF-Token" = $csrf2; 'x-auth-token' = $tokenVal } -WebSession $s -UseBasicParsing
if ($logout.StatusCode -eq 200) {
  Write-Ok "Logout OK"
} else {
  Write-Fail "Logout failed: $($logout.StatusCode)"
}

Write-Step "Refresh should now fail (INVALID_REFRESH_TOKEN)"
try {
  $refresh2 = Invoke-WebRequest -Uri "$ApiBase/api/auth/refresh" -Method POST -WebSession $s -UseBasicParsing
  Write-Fail "Refresh after logout unexpectedly succeeded: $($refresh2.StatusCode)"
} catch {
  Write-Ok "Refresh after logout blocked as expected: $($_.Exception.Response.StatusCode.value__)"
}

Write-Ok "JWT security tests completed"

