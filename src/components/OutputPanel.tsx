"use client";

type OutputPanelProps = {
  value: string;
  onChange: (value: string) => void;
};

export function OutputPanel({ value, onChange }: OutputPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <label
        htmlFor="markdown-output"
        className="text-sm font-medium text-[var(--foreground)]"
      >
        Output
      </label>
      <textarea
        id="markdown-output"
        readOnly={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="변환된 Markdown이 여기에 표시됩니다."
        className="min-h-[280px] flex-1 resize-none rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] p-4 font-mono text-sm leading-relaxed text-[var(--foreground)] outline-none focus:ring-2 focus:ring-[var(--accent)] md:min-h-[400px]"
      />
    </div>
  );
}
