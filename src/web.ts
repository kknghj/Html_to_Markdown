import { htmlToMarkdown } from "./converter.js";

const input = document.getElementById("input") as HTMLTextAreaElement;
const output = document.getElementById("output") as HTMLTextAreaElement;
const convertBtn = document.getElementById("convertBtn") as HTMLButtonElement;
const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
const copyBtn = document.getElementById("copyBtn") as HTMLButtonElement;

function convert(): void {
  const html = input.value;
  output.value = html.trim() ? htmlToMarkdown(html) : "";
}

convertBtn.addEventListener("click", convert);

clearBtn.addEventListener("click", () => {
  input.value = "";
  output.value = "";
  input.focus();
});

copyBtn.addEventListener("click", () => {
  if (!output.value) return;
  navigator.clipboard.writeText(output.value).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = original), 1500);
  });
});

input.addEventListener("input", convert);

convert();
