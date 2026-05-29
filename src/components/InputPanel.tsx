import { useClipboardPaste } from "../hooks/useClipboardPaste";

type InputPanelProps = {
  value: string;
  onChange: (value: string) => void;
  onPasteConvert: (source: string, markdown: string) => void;
};

export function InputPanel({
  value,
  onChange,
  onPasteConvert,
}: InputPanelProps) {
  const handlePaste = useClipboardPaste(onPasteConvert);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <label
        htmlFor="html-input"
        className="text-sm font-medium text-[var(--foreground)]"
      >
        Input
      </label>
      <textarea
        id="html-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder="ChatGPT, Claude, Gemini, Cursor 등의 답변을 붙여넣으세요."
        className="min-h-[200px] flex-1 resize-none rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] p-3 text-sm leading-relaxed text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
      />
    </div>
  );
}
