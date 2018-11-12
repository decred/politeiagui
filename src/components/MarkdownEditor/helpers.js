const CHAR_CODES = {
  newline: 10
};

const finderResult = (mistake, message = "") => ({ mistake, message });

function iterateOverStringCharsCode(str, callback) {
  for (let i = 0, len = str.length; i < len; i++) {
    callback(str.charCodeAt(i), i);
  }
}

function tryingParagraphWithOneNewline(value) {
  const { newline } = CHAR_CODES;
  let thereAreASingleNewline = false;
  iterateOverStringCharsCode(value, (charCode, index) => {
    const nextCharCode = value.charCodeAt(index + 1);
    const prevCharCode = value.charCodeAt(index - 1);
    if (
      charCode === newline &&
      nextCharCode &&
      nextCharCode !== newline &&
      prevCharCode !== newline
    ) {
      thereAreASingleNewline = true;
    }
  });
  return finderResult(
    thereAreASingleNewline,
    "You should press Enter twice to create separate paragraphs of text"
  );
}

const mistakeFinders = [tryingParagraphWithOneNewline];

export function applyMistakeFinders(value) {
  const findersResults = mistakeFinders.map(f => f(value));
  const anyMistake = findersResults.filter(r => r.mistake).length > 0;
  return {
    findersResults,
    anyMistake
  };
}

export function getPreviewContent(className) {
  const previewContent = document.querySelector(`.${className}`).firstChild;
  const nodeList = previewContent.childNodes;
  const paragraphNodes = generateParagraphNodesArray(nodeList);
  const concatedString = generateConcatedStringFromTextNodes(paragraphNodes);
  return concatedString;
}

function generateParagraphNodesArray(nodeList) {
  const paragraphNodes = [];
  for (const node of nodeList) {
    if (node.nodeName === "P") {
      paragraphNodes.push(node);
    }
  }
  return paragraphNodes;
}

function generateConcatedStringFromTextNodes(paragraphNodes) {
  const validTextChunks = paragraphNodes.reduce((acc, node) => {
    const childrens = node.childNodes;
    for (const child of childrens) {
      if (child.nodeName === "#text") {
        acc += child.nodeValue;
      }
    }
    return acc;
  }, "");
  return validTextChunks;
}
