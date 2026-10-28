<#
Envia as alterações deste projeto para o repositório GitHub configurado.

Exemplo:
  powershell -ExecutionPolicy Bypass -File .\Sincronizar-Escala.ps1 -Mensagem "Atualiza Escala Pediatria"
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$Mensagem,

  [string]$Repositorio = "https://github.com/marcovaladares2/escala.git",
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

function Invoke-Git {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Argumentos)
  & git @Argumentos
  if ($LASTEXITCODE -ne 0) {
    throw "O comando Git falhou: git $($Argumentos -join ' ')"
  }
}

function Update-Distribution {
  $distPath = Join-Path $PSScriptRoot "dist"
  if (-not (Test-Path -LiteralPath $distPath)) {
    New-Item -ItemType Directory -Path $distPath | Out-Null
  }

  foreach ($arquivo in @("index.html", "manifest.webmanifest", "sw.js")) {
    $origem = Join-Path $PSScriptRoot $arquivo
    if (Test-Path -LiteralPath $origem) {
      Copy-Item -LiteralPath $origem -Destination (Join-Path $distPath $arquivo) -Force
    }
  }

  foreach ($pasta in @("css", "js", "icons", "assets")) {
    $origem = Join-Path $PSScriptRoot $pasta
    if (Test-Path -LiteralPath $origem) {
      Copy-Item -Path (Join-Path $origem "*") -Destination (Join-Path $distPath $pasta) -Recurse -Force
    }
  }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git não foi encontrado. Instale o Git para Windows e execute este comando novamente."
}

$novoRepositorio = -not (Test-Path -LiteralPath ".git")
if ($novoRepositorio) {
  Invoke-Git init
  Invoke-Git branch -M $Branch
  Invoke-Git remote add origin $Repositorio
  Write-Host "Repositório Git inicializado e conectado a origin."
} else {
  $origin = (& git remote get-url origin 2>$null).Trim()
  if ($LASTEXITCODE -ne 0 -or -not $origin) {
    Invoke-Git remote add origin $Repositorio
} elseif ($origin -ne $Repositorio) {
  throw "O remote origin aponta para '$origin', diferente do repositório esperado '$Repositorio'. Nenhum envio foi feito."
}
}

Update-Distribution

$alteracoes = & git status --porcelain
if (-not $alteracoes) {
  Write-Host "Nenhuma alteração para enviar."
  exit 0
}

Invoke-Git add --all
Invoke-Git commit -m $Mensagem

# Em uma primeira publicação, o GitHub pode já conter um README ou outro
# histórico. A integração é feita localmente e sem sobrescrever o remoto.
Invoke-Git fetch origin $Branch
$referenciaRemota = & git rev-parse --verify "refs/remotes/origin/$Branch" 2>$null
if ($LASTEXITCODE -eq 0 -and $referenciaRemota) {
  & git merge "origin/$Branch" --allow-unrelated-histories --no-edit
  if ($LASTEXITCODE -ne 0) {
    & git merge --abort 2>$null
    throw "Houve conflito ao integrar o histórico remoto. Nenhum arquivo foi enviado ao GitHub; resolva os conflitos locais e execute o script novamente."
  }
}

Invoke-Git push -u origin $Branch

Write-Host "Sincronização concluída: $Repositorio ($Branch)"
