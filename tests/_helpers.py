"""测试辅助：按路径加载 examples/ 下以数字开头的脚本。

演示脚本无法用普通 `import 03_memory` 导入（标识符不能以数字开头），
统一用本模块加载；main() 由 `if __name__ == "__main__"` 守卫，不会被执行。
"""
import importlib.util
from pathlib import Path

from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import AIMessage
from langchain_core.outputs import ChatGeneration, ChatResult

EXAMPLES = Path(__file__).resolve().parent.parent / "examples"


def load_example(filename: str):
    """加载并返回 examples/<filename> 模块对象。"""
    path = EXAMPLES / filename
    mod_name = filename.rsplit(".", 1)[0]
    spec = importlib.util.spec_from_file_location(mod_name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class StubChatModel(BaseChatModel):
    """离线测试用的假 ChatModel：按 responses 顺序循环返回 AIMessage。

    避免依赖真实 LLM / 第三方 fake chat model 的版本差异。
    """

    responses: list[str] = []

    @property
    def _llm_type(self) -> str:
        return "stub"

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        if not hasattr(self, "_i"):
            self._i = 0
        content = self.responses[self._i % len(self.responses)]
        self._i += 1
        return ChatResult(
            generations=[ChatGeneration(message=AIMessage(content=content))]
        )
