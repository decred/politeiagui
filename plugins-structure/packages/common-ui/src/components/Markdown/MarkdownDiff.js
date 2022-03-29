import React from "react";
import parse from "html-react-parser";
import { diffArrays } from "diff";
import { renderToStaticMarkup } from "react-dom/server";
import { parse as parseNode } from "node-html-parser";
import { MarkdownRenderer } from ".";

function splitRawMdLines(mdText = "") {
  const splitted = mdText
    .replace(/\\n/g, "&#32;")
    .replace(/<p>(.*?)<\/p>/g, "&#10;<p>$1</p>&#10;")
    .replace(/<h1>(.*?)<\/h1>/g, "&#10;<h1>$1</h1>&#10;")
    .replace(/<h2>(.*?)<\/h2>/g, "&#10;<h2>$1</h2>&#10;")
    .replace(/<h3>(.*?)<\/h3>/g, "&#10;<h3>$1</h3>&#10;")
    .replace(/<h4>(.*?)<\/h4>/g, "&#10;<h4>$1</h4>&#10;")
    .replace(/<h5>(.*?)<\/h5>/g, "&#10;<h5>$1</h5>&#10;")
    .replace(/<h6>(.*?)<\/h6>/g, "&#10;<h6>$1</h6>&#10;")
    .replace(
      /<blockquote>(.*?)<\/blockquote>/g,
      "&#10;<blockquote>$1</blockquote>&#10;"
    )
    .split("&#10;");
  return splitted;
}

function joinDiffArrays(diff = []) {
  const joined = diff.reduce((acc, el) => {
    const value = el.value.join("").replace(/&#32;/g, "\n");
    if (el.removed) {
      return `${acc}<div class="removed" data-testid="md-line-removed">${value}</div>`;
    }
    if (el.added) {
      return `${acc}<div class="added" data-testid="md-line-added">${value}</div>`;
    }
    return `${acc}${value}`;
  }, "");
  return joined;
}

export function getDiffHTML(oldText = "", newText = "") {
  const oldMarkdown = renderToStaticMarkup(
    <MarkdownRenderer body={oldText} isDiff={true} />
  );
  const newMarkdown = renderToStaticMarkup(
    <MarkdownRenderer body={newText} isDiff={true} />
  );

  const oldNode = parseNode(oldMarkdown).firstChild.firstChild.innerHTML;
  const newNode = parseNode(newMarkdown).firstChild.firstChild.innerHTML;

  const oldSplitted = splitRawMdLines(oldNode);
  const newSplitted = splitRawMdLines(newNode);

  const diff = diffArrays(oldSplitted, newSplitted);
  return joinDiffArrays(diff);
}

export function MarkdownDiffHTML({ oldText, newText }) {
  const html = getDiffHTML(oldText, newText);
  return (
    <div>
      <div className="markdown-body markdown-diff">{parse(html)}</div>
    </div>
  );
}
