import { describe, it, expect } from "vitest";
import { htmlToMarkdown, createConverter } from "./converter.js";

describe("htmlToMarkdown", () => {
  it("converts a simple paragraph", () => {
    expect(htmlToMarkdown("<p>Hello world</p>")).toBe("Hello world");
  });

  it("converts headings with atx style", () => {
    expect(htmlToMarkdown("<h1>Title</h1>")).toBe("# Title");
    expect(htmlToMarkdown("<h2>Subtitle</h2>")).toBe("## Subtitle");
    expect(htmlToMarkdown("<h3>Section</h3>")).toBe("### Section");
  });

  it("converts bold text", () => {
    expect(htmlToMarkdown("<strong>bold</strong>")).toBe("**bold**");
    expect(htmlToMarkdown("<b>bold</b>")).toBe("**bold**");
  });

  it("converts italic text", () => {
    expect(htmlToMarkdown("<em>italic</em>")).toBe("*italic*");
    expect(htmlToMarkdown("<i>italic</i>")).toBe("*italic*");
  });

  it("converts links", () => {
    expect(htmlToMarkdown('<a href="https://example.com">Example</a>')).toBe(
      "[Example](https://example.com)"
    );
  });

  it("converts unordered lists", () => {
    const html = "<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>";
    const result = htmlToMarkdown(html);
    expect(result).toContain("Item 1");
    expect(result).toContain("Item 2");
    expect(result).toContain("Item 3");
    expect(result.split("\n")).toHaveLength(3);
  });

  it("converts ordered lists", () => {
    const html = "<ol><li>First</li><li>Second</li><li>Third</li></ol>";
    const result = htmlToMarkdown(html);
    expect(result).toContain("1.");
    expect(result).toContain("First");
    expect(result).toContain("2.");
    expect(result).toContain("Second");
    expect(result).toContain("3.");
    expect(result).toContain("Third");
  });

  it("converts inline code", () => {
    expect(htmlToMarkdown("<code>const x = 1</code>")).toBe("`const x = 1`");
  });

  it("converts images", () => {
    expect(
      htmlToMarkdown('<img src="image.png" alt="An image">')
    ).toBe("![An image](image.png)");
  });

  it("converts blockquotes", () => {
    expect(htmlToMarkdown("<blockquote>A quote</blockquote>")).toBe(
      "> A quote"
    );
  });

  it("converts horizontal rules", () => {
    expect(htmlToMarkdown("<hr>")).toBe("* * *");
  });

  it("handles nested HTML", () => {
    const html =
      "<div><h1>Title</h1><p>Text with <strong>bold</strong> and <em>italic</em>.</p></div>";
    const result = htmlToMarkdown(html);
    expect(result).toContain("# Title");
    expect(result).toContain("**bold**");
    expect(result).toContain("*italic*");
  });

  it("handles empty input", () => {
    expect(htmlToMarkdown("")).toBe("");
  });
});

describe("createConverter", () => {
  it("creates a converter with default options", () => {
    const converter = createConverter();
    expect(converter).toBeDefined();
    expect(converter.turndown("<p>test</p>")).toBe("test");
  });

  it("respects custom bullet marker option", () => {
    const converter = createConverter({ bulletListMarker: "*" });
    const result = converter.turndown(
      "<ul><li>Item 1</li><li>Item 2</li></ul>"
    );
    expect(result).toMatch(/^\*/m);
  });

  it("respects setext heading style", () => {
    const converter = createConverter({ headingStyle: "setext" });
    const h1 = converter.turndown("<h1>Title</h1>");
    expect(h1).toContain("=");
  });
});
