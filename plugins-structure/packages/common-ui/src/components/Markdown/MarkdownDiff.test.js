import React from "react";
import { DiffHTML } from "./MarkdownDiff";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import trim from "lodash/trim";

describe("Given DiffHTML", () => {
  describe("when headers are different", () => {
    const newHeaders =
      "# Header 1\n## Header 2\n### Header 3\n##### common header\n\n";
    const oldHeaders =
      "# Header 1 ADD\n## Header 2\n#### Header 4\n##### common header\n\n";
    it("should return correct diff", () => {
      render(<DiffHTML oldText={oldHeaders} newText={newHeaders} />);
      const h2 = screen.getAllByText("Header 2");
      expect(h2).toHaveLength(1);
      const h1 = screen.getAllByText("Header 1");
      const h1Add = screen.getAllByText("Header 1 ADD");
      expect(h1).toHaveLength(1);
      expect(h1Add).toHaveLength(1);
      const commonHeader = screen.getAllByText("common header");
      expect(commonHeader).toHaveLength(1);

      expect(screen.getAllByTestId("md-line-added")).toHaveLength(2);
      expect(screen.getAllByTestId("md-line-removed")).toHaveLength(2);
    });
  });
  describe("when paragraphs are different", () => {
    const newParagraph = "Paragraph 1\n\nAnother P";
    const oldParagraph = "Paragraph 2\n\nAnother P";
    it("should return correct diff", () => {
      render(<DiffHTML oldText={oldParagraph} newText={newParagraph} />);
      const linesAdded = screen.getAllByTestId("md-line-added");
      const linesRemoved = screen.getAllByTestId("md-line-removed");
      expect(linesAdded).toHaveLength(1);
      expect(linesRemoved).toHaveLength(1);
      expect(screen.getAllByText("Another P")).toHaveLength(1);
    });
  });
  describe("when paragraphs are replaced by headers", () => {
    const paragraph = "My Text";
    const header = "# My Text";
    it("should return correct diff", () => {
      render(<DiffHTML oldText={paragraph} newText={header} />);
      const removedParagraph = screen.getByTestId("md-line-removed");
      const addedHeader = screen.getByTestId("md-line-added");
      // Removed element: <p>My Text</p>
      expect(removedParagraph).toHaveTextContent("My Text");
      expect(removedParagraph.firstChild.nodeName).toEqual("P");
      // Added element: <h1>My Text</h1>
      expect(addedHeader).toHaveTextContent("My Text");
      expect(addedHeader.firstChild.nodeName).toEqual("H1");
    });
  });
  describe("when texts are equal", () => {
    const text = "Sed porttitor lectus nibh.";
    it("should not return any diff", () => {
      render(<DiffHTML oldText={text} newText={text} />);
      expect(screen.queryAllByTestId("md-line-removed")).toHaveLength(0);
      expect(screen.queryAllByTestId("md-line-added")).toHaveLength(0);
      const textElement = screen.getByText(text);
      expect(textElement.nodeName).toEqual("P");
    });
  });
  describe("when old text is empty", () => {
    const text = "Sed porttitor lectus nibh.";
    it("should return all new text marked as added", () => {
      render(<DiffHTML oldText="" newText={text} />);
      expect(screen.queryAllByTestId("md-line-removed")).toHaveLength(0);
      expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
      const textElement = screen.getByText(text);
      expect(textElement.parentElement.className).toEqual("added");
    });
  });
  describe("when new text is empty", () => {
    const text = "Sed porttitor lectus nibh.";
    it("should return all new text marked as removed", () => {
      render(<DiffHTML oldText={text} newText="" />);
      expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
      expect(screen.queryAllByTestId("md-line-added")).toHaveLength(0);
      const textElement = screen.getByText(text);
      expect(textElement.parentElement.className).toEqual("removed");
    });
  });
  describe("when links are different", () => {
    describe("given different link labels", () => {
      const oldLink = "[my link](http://mylink.com)";
      const newLink = "[my new link](http://mylink.com)";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={oldLink} newText={newLink} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getByText("my link");
        expect(oldElement.getAttribute("href")).toEqual("http://mylink.com");
        expect(oldElement.parentNode.parentNode).toHaveClass("removed");
        const newElement = screen.getByText("my new link");
        expect(newElement.getAttribute("href")).toEqual("http://mylink.com");
        expect(newElement.parentNode.parentNode).toHaveClass("added");
      });
    });
    describe("given different link values", () => {
      const oldLink = "[my link](http://mylink.com)";
      const newLink = "[my link](http://mylinknew.com)";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={oldLink} newText={newLink} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getAllByText("my link")[0];
        expect(oldElement.getAttribute("href")).toEqual("http://mylink.com");
        expect(oldElement.parentNode.parentNode).toHaveClass("removed");
        const newElement = screen.getAllByText("my link")[1];
        expect(newElement.getAttribute("href")).toEqual("http://mylinknew.com");
        expect(newElement.parentNode.parentNode).toHaveClass("added");
      });
    });
    describe("given different html raw links", () => {
      const link = "<a href='javascript:void(0)'>my link</a>";
      it("should render html content as text, not as element", () => {
        render(<DiffHTML oldText={link} newText="" />);
        const removedLines = screen.getAllByTestId("md-line-removed");
        expect(removedLines).toHaveLength(1);
        const oldElement = screen.queryByText("my link");
        expect(oldElement.nodeName).toEqual("P");
        const rawLinkParagraph = removedLines[0].firstChild;
        expect(rawLinkParagraph.nodeName).toEqual("P");
        expect(rawLinkParagraph.firstChild.textContent).toEqual("my link");
        expect(rawLinkParagraph.firstChild.nodeName).toEqual("#text");
      });
    });
    describe("given equal html raw links", () => {
      const link = "<a href='javascript:void(0)'>my link</a>";
      it("should render html content as text, not as element", () => {
        render(<DiffHTML oldText={link} newText={link} />);
        const removedLines = screen.queryAllByTestId("md-line-removed");
        const addedLines = screen.queryAllByTestId("md-line-added");
        expect(removedLines).toHaveLength(0);
        expect(addedLines).toHaveLength(0);
        const renderedElement = screen.getByText("my link");
        expect(renderedElement.nodeName).toEqual("P");
        const element = screen.queryByText(link);
        expect(element).toBeFalsy();
      });
    });
  });
  describe("when using strong texts", () => {
    describe("given different strong texts", () => {
      const oldText = "**old**";
      const newText = "**new**";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={oldText} newText={newText} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getByText("old");
        const newElement = screen.getByText("new");
        expect(oldElement.nodeName).toEqual("STRONG");
        expect(oldElement.parentElement.parentElement).toHaveClass("removed");
        expect(newElement.nodeName).toEqual("STRONG");
        expect(newElement.parentElement.parentElement).toHaveClass("added");
      });
    });
    describe("given same text, but one strong and other regular", () => {
      const oldText = "**old**";
      const newText = "old";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={oldText} newText={newText} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getAllByText("old")[0];
        const newElement = screen.getAllByText("old")[1];
        expect(oldElement.nodeName).toEqual("STRONG");
        expect(oldElement.parentElement.parentElement).toHaveClass("removed");
        expect(newElement.nodeName).toEqual("P");
        expect(newElement.parentElement).toHaveClass("added");
      });
    });
  });
  describe("when using italic texts", () => {
    describe("given different italic texts", () => {
      const oldText = "*old*";
      const newText = "*new*";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={oldText} newText={newText} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getByText("old");
        const newElement = screen.getByText("new");
        expect(oldElement.nodeName).toEqual("EM");
        expect(oldElement.parentElement.parentElement).toHaveClass("removed");
        expect(newElement.nodeName).toEqual("EM");
        expect(newElement.parentElement.parentElement).toHaveClass("added");
      });
    });
    describe("given same text, but one italic and other regular", () => {
      const oldText = "*old*";
      const newText = "old";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={oldText} newText={newText} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getAllByText("old")[0];
        const newElement = screen.getAllByText("old")[1];
        expect(oldElement.nodeName).toEqual("EM");
        expect(oldElement.parentElement.parentElement).toHaveClass("removed");
        expect(newElement.nodeName).toEqual("P");
        expect(newElement.parentElement).toHaveClass("added");
      });
    });
  });
  describe("when using blockcodes", () => {
    describe("given different blockcodes", () => {
      const block1 = "```\ncode1\n```";
      const block2 = "```\ncode2\n```";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={block1} newText={block2} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getByText("code1");
        const newElement = screen.getByText("code2");
        expect(oldElement.nodeName).toEqual("CODE");
        expect(newElement.nodeName).toEqual("CODE");
      });
    });
    describe("given some blockcode replaced by regular text", () => {
      const block1 = "```\ncode1\n```";
      const block2 = "code1";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={block1} newText={block2} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getAllByText("code1")[0];
        const newElement = screen.getAllByText("code1")[1];
        expect(oldElement.nodeName).toEqual("CODE");
        expect(newElement.nodeName).toEqual("P");
      });
    });
    describe("given some blockcode text addition", () => {
      const block1 = "```\ncode1\n```";
      const block2 = "```\ncode1 and another text\n```";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={block1} newText={block2} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getByText("code1");
        const newElement = screen.getByText("code1 and another text");
        expect(oldElement.nodeName).toEqual("CODE");
        expect(newElement.nodeName).toEqual("CODE");
      });
    });
  });
  describe("when using inline code", () => {
    describe("given two different inline codes", () => {
      const code1 = "`code1`";
      const code2 = "`code2`";
      it("should return the correct diff", () => {
        render(<DiffHTML oldText={code1} newText={code2} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getByText("code1");
        const newElement = screen.getByText("code2");
        expect(oldElement.nodeName).toEqual("CODE");
        expect(newElement.nodeName).toEqual("CODE");
      });
    });
    describe("given some code replaced by regular text", () => {
      const code1 = "`code1`";
      const code2 = "code1";
      it("should return the correct diff", () => {
        render(<DiffHTML oldText={code1} newText={code2} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getAllByText("code1")[0];
        const newElement = screen.getAllByText("code1")[1];
        expect(oldElement.nodeName).toEqual("CODE");
        expect(newElement.nodeName).toEqual("P");
      });
    });
  });
  describe("when using code blocks", () => {
    describe("given some code block text addition", () => {
      const block1 = "```\ncode1\n```";
      const block2 = "```\ncode1 and another text\n```";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={block1} newText={block2} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getByText("code1");
        const newElement = screen.getByText("code1 and another text");
        expect(oldElement.nodeName).toEqual("CODE");
        expect(newElement.nodeName).toEqual("CODE");
      });
    });
    describe("given some code block text changes", () => {
      const block1 = "```\ncode1\n```";
      const block2 = "```\ncode2\n```";
      it("should return correct diff", () => {
        render(<DiffHTML oldText={block1} newText={block2} />);
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        const oldElement = screen.getByText("code1");
        const newElement = screen.getByText("code2");
        expect(oldElement.nodeName).toEqual("CODE");
        expect(newElement.nodeName).toEqual("CODE");
      });
    });
  });
  describe("when using multiple tag changes for same content", () => {
    const content = "Content";
    const cases = [
      {
        name: "h1 by h2",
        oldText: `# ${content}`,
        newText: `## ${content}`,
        removedNode: "H1",
        addedNode: "H2",
      },
      {
        name: "h2 by h3",
        oldText: `## ${content}`,
        newText: `### ${content}`,
        removedNode: "H2",
        addedNode: "H3",
      },
      {
        name: "h3 by h4",
        oldText: `### ${content}`,
        newText: `#### ${content}`,
        removedNode: "H3",
        addedNode: "H4",
      },
      {
        name: "h4 by h5",
        oldText: `#### ${content}`,
        newText: `##### ${content}`,
        removedNode: "H4",
        addedNode: "H5",
      },
      {
        name: "h5 by h6",
        oldText: `##### ${content}`,
        newText: `###### ${content}`,
        removedNode: "H5",
        addedNode: "H6",
      },
      {
        name: "code by strong",
        oldText: `\`${content}\``,
        newText: `**${content}**`,
        removedNode: "CODE",
        addedNode: "STRONG",
      },
      {
        name: "code by em",
        oldText: `\`${content}\``,
        newText: `*${content}*`,
        removedNode: "CODE",
        addedNode: "EM",
      },
      {
        name: "em by strong",
        oldText: `*${content}*`,
        newText: `**${content}**`,
        removedNode: "EM",
        addedNode: "STRONG",
      },
      {
        name: "em by code",
        oldText: `*${content}*`,
        newText: `\`${content}\``,
        removedNode: "EM",
        addedNode: "CODE",
      },
      {
        name: "strong by em",
        oldText: `**${content}**`,
        newText: `*${content}*`,
        removedNode: "STRONG",
        addedNode: "EM",
      },
      {
        name: "strong by code",
        oldText: `**${content}**`,
        newText: `\`${content}\``,
        removedNode: "STRONG",
        addedNode: "CODE",
      },
      {
        name: "blockquote by paragraph",
        oldText: `> ${content}`,
        newText: content,
        removedNode: "BLOCKQUOTE",
        addedNode: "P",
      },
      {
        name: "blockquote by nested blockquote",
        oldText: `> ${content}`,
        newText: `> > ${content}`,
        removedNode: "BLOCKQUOTE",
        addedNode: "BLOCKQUOTE",
      },
      {
        name: "blockquote by header",
        oldText: `> ${content}`,
        newText: `# ${content}`,
        removedNode: "BLOCKQUOTE",
        addedNode: "H1",
      },
      {
        name: "link by paragraph",
        oldText: `[${content}](http://link.com)`,
        newText: content,
        removedNode: "A",
        addedNode: "P",
      },
      {
        name: "link by header",
        oldText: `[${content}](http://link.com)`,
        newText: `# ${content}`,
        removedNode: "A",
        addedNode: "H1",
      },
      {
        name: "link by header link",
        oldText: `[${content}](http://link.com)`,
        newText: `# [${content}](http://link.com)`,
        removedNode: "A",
        addedNode: "A",
      },
      {
        name: "link by code",
        oldText: `[${content}](http://link.com)`,
        newText: `\`${content}\``,
        removedNode: "A",
        addedNode: "CODE",
      },
      {
        name: "ordered list by paragraph",
        oldText: `1. ${content}`,
        newText: content,
        removedNode: "LI",
        addedNode: "P",
      },
      {
        name: "unordered list by paragraph",
        oldText: `- ${content}`,
        newText: content,
        removedNode: "LI",
        addedNode: "P",
      },
      {
        name: "code block by paragraph",
        oldText: `\`\`\`\n${content}\n\`\`\``,
        newText: content,
        removedNode: "CODE",
        addedNode: "P",
      },
    ];
    for (const testCase of cases) {
      it(`should replace ${testCase.name}`, () => {
        render(
          <DiffHTML oldText={testCase.oldText} newText={testCase.newText} />
        );
        // assert rendered diff
        expect(screen.getAllByTestId("md-line-removed")).toHaveLength(1);
        expect(screen.getAllByTestId("md-line-added")).toHaveLength(1);
        // query by same content. Should return 2 elements: old and new
        const [oldElement, newElement] = screen.getAllByText(content);
        // assert node replacement
        expect(oldElement.nodeName).toEqual(testCase.removedNode);
        expect(newElement.nodeName).toEqual(testCase.addedNode);
        // prevent unexpected additional chars rendering
        expect(trim(oldElement.textContent, "\n ")).toEqual(content);
        expect(trim(newElement.textContent, "\n ")).toEqual(content);
      });
    }
  });
});
