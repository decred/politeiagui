import React from "react";
import parse from "html-react-parser";
import { diffTrimmedLines } from "diff";
import { renderToStaticMarkup } from "react-dom/server";
import { MarkdownRenderer } from "../Markdown";

function joinDiffLines(diff) {
  return diff.reduce((acc, line) => {
    if (line.added) {
      return `${acc} <span class="added" data-testid="md-line-added">${line.value}</span>`;
    }
    if (line.removed) {
      return `${acc} <span class="removed" data-testid="md-line-removed">${line.value}</span>`;
    }
    return `${acc} ${line.value}`;
  }, "");
}

const escapeStr = "\n\n--- Diff --- \n\n";

export function getDiffHTML(oldText, newText) {
  const oldMarkdown = renderToStaticMarkup(
    <MarkdownRenderer body={escapeStr + oldText + escapeStr} isDiff={true} />
  );
  const newMarkdown = renderToStaticMarkup(
    <MarkdownRenderer body={escapeStr + newText + escapeStr} isDiff={true} />
  );
  const diff = diffTrimmedLines(oldMarkdown, newMarkdown);
  return joinDiffLines(diff);
}

export function DiffHTML({ oldText, newText }) {
  const html = getDiffHTML(oldText, newText);
  return parse(html);
}
