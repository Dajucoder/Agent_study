# Makefile.ps1 — Windows PowerShell 等价物
# 用法（在项目根目录）：
#   powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 help
#   powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 check
#   powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 run-04
#   powershell -ExecutionPolicy Bypass -File .\Makefile.ps1 test
#
# 如果你有 GNU Make，推荐直接用 Makefile。

param(
    [Parameter(Position = 0)]
    [string]$Target = "help"
)

$ErrorActionPreference = "Stop"
$env:PYTHONIOENCODING = "utf-8"
$Py = ".\.venv\Scripts\python.exe"

function Show-Help {
    Write-Host "可用命令：" -ForegroundColor Cyan
    Write-Host "  setup     同步依赖（建议使用 requirements.lock）"
    Write-Host "  check     跑 00_check.py 验证环境"
    Write-Host "  run-00..06 跑对应章节示例"
    Write-Host "  test      跑 pytest 单元测试"
    Write-Host "  lint      跑 ruff 检查（如已安装）"
    Write-Host "  clean     清理临时文件"
}

switch ($Target) {
    "help"   { Show-Help }
    "setup"  { & $Py -m pip install -r requirements.lock }
    "check"  { & $Py examples/00_check.py }
    "run-00" { & $Py examples/00_check.py }
    "run-01" { & $Py examples/01_models_prompts.py }
    "run-02" { & $Py examples/02_chains.py }
    "run-03" { & $Py examples/03_memory.py }
    "run-04" { & $Py examples/04_rag.py }
    "run-05" { & $Py examples/05_agents.py }
    "run-06" { $env:DEV = "1"; & $Py examples/06_langserve.py }
    "test"   { & $Py -m pytest tests/ -q }
    "lint"   { & ruff check examples/ tests/ }
    "clean"  {
        Remove-Item -Recurse -Force -ErrorAction SilentlyContinue `
            examples/__pycache__, tests/__pycache__, .pytest_cache, .ruff_cache, data/chroma
    }
    default { Write-Host "未知目标: $Target" -ForegroundColor Red; Show-Help; exit 1 }
}
