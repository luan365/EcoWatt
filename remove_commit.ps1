#!/usr/bin/env pwsh
# Script para remover o commit com a chave de API do Gemini

cd "c:\Users\luanf\OneDrive\Documentos\Codes\EcoWatt"

# Forçar fechamento de qualquer processo git
Stop-Process -Name "git" -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

# Remover o commit usando reset hard
git reset --hard e41cece~1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Commit removido com sucesso!"
    git log --oneline | Select-Object -First 5
} else {
    Write-Host "✗ Erro ao remover o commit"
}
