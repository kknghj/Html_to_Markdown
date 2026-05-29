type ToolbarProps = {
  onConvert: () => void;
  onCopy: () => void;
  onClear: () => void;
  copyDisabled: boolean;
};

export function Toolbar({
  onConvert,
  onCopy,
  onClear,
  copyDisabled,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onConvert}
        className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
      >
        Convert
      </button>
      <button
        type="button"
        onClick={onCopy}
        disabled={copyDisabled}
        className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--panel-border)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Copy Markdown
      </button>
      <button
        type="button"
        onClick={onClear}
        className="rounded-lg border border-[var(--panel-border)] bg-[var(--panel-bg)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
      >
        Clear
      </button>
    </div>
  );
}
