# Script de prueba para API de Impuestos Springfield
# Ejecutar línea por línea o todo el script

Write-Host "=== 1. Crear Token ===" -ForegroundColor Cyan
$randomToken = "token-$(Get-Random -Minimum 1000 -Maximum 9999)"
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/token" -Method POST -ContentType "application/json" -Body "{`"token`":`"$randomToken`"}"
$tokenId = $response.id
Write-Host "Token creado: $tokenId" -ForegroundColor Green
Write-Host "Peticiones restantes: $($response.reqLeft)" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== 2. Crear Personajes ===" -ForegroundColor Cyan
$homero = Invoke-RestMethod -Uri "http://localhost:3000/api/character" -Method POST -Headers @{"x-token-id"=$tokenId; "Content-Type"="application/json"} -Body '{"name":"Homero Simpson","salary":4500,"employee":true}'
Write-Host "Creado: $($homero.name) (ID: $($homero.id))" -ForegroundColor Green

$moe = Invoke-RestMethod -Uri "http://localhost:3000/api/character" -Method POST -Headers @{"x-token-id"=$tokenId; "Content-Type"="application/json"} -Body '{"name":"Moe Szyslak","salary":7500,"employee":false}'
Write-Host "Creado: $($moe.name) (ID: $($moe.id))" -ForegroundColor Green

$krusty = Invoke-RestMethod -Uri "http://localhost:3000/api/character" -Method POST -Headers @{"x-token-id"=$tokenId; "Content-Type"="application/json"} -Body '{"name":"Krusty","salary":12000,"employee":false}'
Write-Host "Creado: $($krusty.name) (ID: $($krusty.id))" -ForegroundColor Green
Write-Host ""

Write-Host "=== 3. Crear Locaciones ===" -ForegroundColor Cyan
$casa = Invoke-RestMethod -Uri "http://localhost:3000/api/location" -Method POST -Headers @{"x-token-id"=$tokenId; "Content-Type"="application/json"} -Body "{`"name`":`"Casa Homer`",`"type`":`"Casa`",`"cost`":350000,`"ownerId`":$($homero.id)}"
Write-Host "Creada: $($casa.name) - Dueño ID: $($homero.id)" -ForegroundColor Green

$taberna = Invoke-RestMethod -Uri "http://localhost:3000/api/location" -Method POST -Headers @{"x-token-id"=$tokenId; "Content-Type"="application/json"} -Body "{`"name`":`"Taberna`",`"type`":`"Entretenimiento`",`"cost`":1200000,`"ownerId`":$($moe.id)}"
Write-Host "Creada: $($taberna.name) - Dueño ID: $($moe.id)" -ForegroundColor Green
Write-Host ""

Write-Host "=== 4. Agregar Favoritos ===" -ForegroundColor Cyan
Invoke-RestMethod -Uri "http://localhost:3000/api/character/$($moe.id)/favorites/$($casa.id)" -Method PATCH -Headers @{"x-token-id"=$tokenId} | Out-Null
Write-Host "Moe marcó Casa Homer como favorita" -ForegroundColor Green

Invoke-RestMethod -Uri "http://localhost:3000/api/character/$($homero.id)/favorites/$($taberna.id)" -Method PATCH -Headers @{"x-token-id"=$tokenId} | Out-Null
Write-Host "Homero marcó Taberna como favorita" -ForegroundColor Green
Write-Host ""

Write-Host "=== 5. Calcular Impuestos ===" -ForegroundColor Cyan
$taxHomero = Invoke-RestMethod -Uri "http://localhost:3000/api/character/$($homero.id)/taxes" -Headers @{"x-token-id"=$tokenId}
Write-Host "Homero (empleado, casa $350,000): $($taxHomero.taxDebt)" -ForegroundColor Yellow

$taxMoe = Invoke-RestMethod -Uri "http://localhost:3000/api/character/$($moe.id)/taxes" -Headers @{"x-token-id"=$tokenId}
Write-Host "Moe (no empleado, taberna $1,200,000): $($taxMoe.taxDebt)" -ForegroundColor Yellow

$taxKrusty = Invoke-RestMethod -Uri "http://localhost:3000/api/character/$($krusty.id)/taxes" -Headers @{"x-token-id"=$tokenId}
Write-Host "Krusty (sin propiedad): $($taxKrusty.taxDebt)" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== 6. Ver Locaciones con Favoritos ===" -ForegroundColor Cyan
$locations = Invoke-RestMethod -Uri "http://localhost:3000/api/location" -Headers @{"x-token-id"=$tokenId}
foreach ($loc in $locations) {
    Write-Host "$($loc.name) - Visitantes favoritos: $($loc.favCharacters.Count)" -ForegroundColor Magenta
    foreach ($char in $loc.favCharacters) {
        Write-Host "  - $($char.name)" -ForegroundColor White
    }
}
Write-Host ""

Write-Host "=== Prueba Completada ===" -ForegroundColor Green
Write-Host "Token ID usado: $tokenId" -ForegroundColor Gray
