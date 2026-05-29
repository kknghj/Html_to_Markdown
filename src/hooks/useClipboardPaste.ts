import { useCallback } from "react";
import {
  convertHtmlToMarkdown,
  convertPlainTextToMarkdown,
} from "../lib/markdownConverter";

export function useClipboardPaste(
  onPasteConvert: (source: string, markdown: string) => void,
): (event: React.ClipboardEvent<HTMLTextAreaElement>) => void {
  return useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const clipboardData = event.clipboardData;
      const html = clipboardData.getData("text/html");

      if (html) {
        event.preventDefault();
        onPasteConvert(html, convertHtmlToMarkdown(html));
        return;
      }

      const plain = clipboardData.getData("text/plain");
      if (plain) {
        event.preventDefault();
        onPasteConvert(plain, convertPlainTextToMarkdown(plain));
      }
    },
    [onPasteConvert],
  );
}
