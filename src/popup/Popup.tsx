import { useCallback, useEffect, useRef, useState } from "react";
import { InputPanel } from "../components/InputPanel";
import { OutputPanel } from "../components/OutputPanel";
import { Toast } from "../components/Toast";
import { Toolbar } from "../components/Toolbar";
import {
  copyMarkdownToClipboard,
  readClipboardPayload,
} from "../lib/clipboard";
import { convertSourceToMarkdown } from "../lib/markdownConverter";
import {
  clearExtensionState,
  loadExtensionState,
  saveExtensionState,
} from "../lib/storage";

const TOAST_DURATION_MS = 2000;

export function Popup() {
  const [input, setInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const skipNextSave = useRef(false);

  const persistState = useCallback(async (nextInput: string, nextMarkdown: string) => {
    await saveExtensionState({ input: nextInput, markdown: nextMarkdown });
  }, []);

  const applyConversion = useCallback(
    (source: string, converted?: string) => {
      const result = converted ?? convertSourceToMarkdown(source);
      setInput(source);
      setMarkdown(result);
      void persistState(source, result);
    },
    [persistState],
  );

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      const stored = await loadExtensionState();
      const clipboard = await readClipboardPayload();

      if (cancelled) {
        return;
      }

      skipNextSave.current = true;

      if (clipboard && clipboard.source.trim()) {
        setInput(clipboard.source);
        setMarkdown(clipboard.markdown);
        await persistState(clipboard.source, clipboard.markdown);
      } else {
        setInput(stored.input);
        setMarkdown(stored.markdown);
      }

      setReady(true);
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [persistState]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    void persistState(input, markdown);
  }, [input, markdown, ready, persistState]);

  useEffect(() => {
    if (!toastVisible) {
      return;
    }
    const timer = window.setTimeout(() => {
      setToastVisible(false);
    }, TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  const handleConvert = useCallback(() => {
    applyConversion(input);
  }, [applyConversion, input]);

  const handlePasteConvert = useCallback(
    (source: string, converted: string) => {
      applyConversion(source, converted);
    },
    [applyConversion],
  );

  const handleClear = useCallback(async () => {
    skipNextSave.current = true;
    setInput("");
    setMarkdown("");
    await clearExtensionState();
    showToast("내용을 지웠습니다.");
  }, [showToast]);

  const handleCopy = useCallback(async () => {
    if (!markdown.trim()) {
      return;
    }
    try {
      await copyMarkdownToClipboard(markdown);
      showToast("Markdown이 클립보드에 복사되었습니다.");
    } catch {
      showToast("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
    }
  }, [markdown, showToast]);

  if (!ready) {
    return (
      <div className="popup-root items-center justify-center p-6 text-sm text-[var(--muted)]">
        불러오는 중…
      </div>
    );
  }

  return (
    <div className="popup-root">
      <header className="shrink-0 space-y-1 px-4 pb-3 pt-4">
        <h1 className="text-lg font-bold tracking-tight">AI Response → Markdown</h1>
        <p className="text-xs text-[var(--muted)]">
          복사한 AI 답변을 붙여넣거나, 클립보드 내용이 자동 변환됩니다.
        </p>
      </header>

      <div className="shrink-0 px-4 pb-3">
        <Toolbar
          onConvert={handleConvert}
          onCopy={handleCopy}
          onClear={handleClear}
          copyDisabled={!markdown.trim()}
        />
      </div>

      <div className="popup-body">
        <InputPanel
          value={input}
          onChange={setInput}
          onPasteConvert={handlePasteConvert}
        />
        <OutputPanel value={markdown} onChange={setMarkdown} />
      </div>

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}
