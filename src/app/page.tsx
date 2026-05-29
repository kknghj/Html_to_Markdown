"use client";

import { useCallback, useEffect, useState } from "react";
import { InputPanel } from "@/components/InputPanel";
import { OutputPanel } from "@/components/OutputPanel";
import { Toast } from "@/components/Toast";
import { Toolbar } from "@/components/Toolbar";
import {
  convertHtmlToMarkdown,
  convertPlainTextToMarkdown,
} from "@/lib/markdownConverter";
import { SAMPLE_HTML } from "@/lib/sampleHtml";

const TOAST_DURATION_MS = 2000;

function looksLikeHtml(value: string): boolean {
  const trimmed = value.trim();
  return /<[a-z][\s\S]*>/i.test(trimmed);
}

export default function HomePage() {
  const [input, setInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const runConversion = useCallback((source: string) => {
    const trimmed = source.trim();
    if (!trimmed) {
      setMarkdown("");
      return;
    }
    const result = looksLikeHtml(trimmed)
      ? convertHtmlToMarkdown(trimmed)
      : convertPlainTextToMarkdown(trimmed);
    setMarkdown(result);
  }, []);

  const handleConvert = useCallback(() => {
    runConversion(input);
  }, [input, runConversion]);

  const handlePasteConvert = useCallback(
    (source: string, converted: string) => {
      setInput(source);
      setMarkdown(converted);
    },
    [],
  );

  const handleLoadSample = useCallback(() => {
    setInput(SAMPLE_HTML);
    setMarkdown(convertHtmlToMarkdown(SAMPLE_HTML));
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  useEffect(() => {
    if (!toastVisible) {
      return;
    }
    const timer = window.setTimeout(() => {
      setToastVisible(false);
    }, TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toastVisible]);

  const handleCopy = useCallback(async () => {
    if (!markdown.trim()) {
      return;
    }
    try {
      await navigator.clipboard.writeText(markdown);
      showToast("Markdown이 클립보드에 복사되었습니다.");
    } catch {
      showToast("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
    }
  }, [markdown, showToast]);

  useEffect(() => {
    runConversion(input);
  }, [input, runConversion]);

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          AI Response → Markdown
        </h1>
        <p className="text-sm text-[var(--muted)] md:text-base">
          Convert copied AI answers into clean Markdown
        </p>
      </header>

      <Toolbar
        onConvert={handleConvert}
        onCopy={handleCopy}
        onLoadSample={handleLoadSample}
        copyDisabled={!markdown.trim()}
      />

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <InputPanel
          value={input}
          onChange={setInput}
          onPasteConvert={handlePasteConvert}
        />
        <OutputPanel value={markdown} onChange={setMarkdown} />
      </div>

      <Toast message={toastMessage} visible={toastVisible} />
    </main>
  );
}
