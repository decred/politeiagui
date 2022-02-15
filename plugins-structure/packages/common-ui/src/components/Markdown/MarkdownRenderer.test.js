import React from "react";
import { render, screen } from "@testing-library/react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import "@testing-library/jest-dom";

describe("Given MarkdownRenderer component", () => {
  let spyConsole;
  beforeEach(() => {
    spyConsole = jest.spyOn(console, "warn").mockImplementation();
  });
  afterEach(() => {
    spyConsole.mockRestore();
  });
  it("should render markdown simple text", async () => {
    render(<MarkdownRenderer body={"Lorem ipsum"} />);
    expect(await screen.findByTestId("markdown-renderer")).toHaveTextContent(
      "Lorem ipsum"
    );
  });
  it("should render markdown headers", () => {
    const headersText =
      "# Header 1 \n ## Header 2 \n ### Header 3 \n #### Header 4 \n ##### Header 5 \n ###### Header 6";
    render(<MarkdownRenderer body={headersText} />);
    const h1 = screen.getByText("Header 1");
    expect(h1.nodeName).toEqual("H1");
    const h2 = screen.getByText("Header 2");
    expect(h2.nodeName).toEqual("H2");
    const h3 = screen.getByText("Header 3");
    expect(h3.nodeName).toEqual("H3");
    const h4 = screen.getByText("Header 4");
    expect(h4.nodeName).toEqual("H4");
    const h5 = screen.getByText("Header 5");
    expect(h5.nodeName).toEqual("H5");
    const h6 = screen.getByText("Header 6");
    expect(h6.nodeName).toEqual("H6");
  });
  it("should render valid links", () => {
    const validLink = "[valid link](https://validlink.com)";
    render(<MarkdownRenderer body={validLink} />);
    const link = screen.getByText("valid link");
    expect(link.nodeName).toEqual("A");
    expect(link).toHaveAttribute("href", "https://validlink.com");
  });
  it("should render valid image references as links if renderImages is false", () => {
    const validImage = "![valid image](https://validimage.com)";
    render(<MarkdownRenderer body={validImage} renderImages={false} />);
    const image = screen.getByText("valid image");
    expect(image.nodeName).toEqual("A");
    expect(image).toHaveAttribute("href", "https://validimage.com");
  });
  it("should render valid images", () => {
    const validImage = "![valid image](https://validimage.com)";
    render(<MarkdownRenderer body={validImage} />);
    const image = screen.getByAltText("valid image");
    expect(image.nodeName).toEqual("IMG");
    expect(image).toHaveAttribute("src", "https://validimage.com");
  });
  describe("Given a XSS attack", () => {
    let spyConsoleWarn;
    beforeEach(() => {
      spyConsoleWarn = jest.spyOn(console, "warn").mockImplementation();
    });
    afterEach(() => {
      spyConsoleWarn.mockRestore();
    });
    it("should not render malicious links, and convert them instead", () => {
      const maliciousLink = "[xss link](javascript:void(0))";
      render(<MarkdownRenderer body={maliciousLink} />);
      let link = screen.getByRole("link");
      // Eslint disable script url checking
      // eslint-disable-next-line no-script-url
      expect(link).not.toHaveAttribute("href", "javascript:void(0)");
      expect(link).toHaveAttribute("href", "x-javascript:void(0)");
    });
    it("should not render malicious images, and convert them instead", () => {
      const malformedimage = "![xss image](javascript:void(0))";
      render(<MarkdownRenderer body={malformedimage} />);
      const image = screen.getByRole("img");
      // Eslint disable script url checking
      // eslint-disable-next-line no-script-url
      expect(image).not.toHaveAttribute("src", "javascript:void(0)");
      expect(image).toHaveAttribute("src", "x-javascript:void(0)");
    });
    it("should not render malicious images as links, and convert them instead", () => {
      const malformedimage = "![xss image](javascript:void(0))";
      render(<MarkdownRenderer body={malformedimage} renderImages={false} />);
      const image = screen.getByRole("link");
      // Eslint disable script url checking
      // eslint-disable-next-line no-script-url
      expect(image).not.toHaveAttribute("href", "javascript:void(0)");
      expect(image).toHaveAttribute("href", "x-javascript:void(0)");
    });
    it("should not render any malicious links", () => {
      const maliciousLinks = `[xss link](javascript:alert(1))
    [xss link](JAVASCRIPT:alert(1))
    [xss link](vbscript:alert(1))
    [xss link](VBSCRIPT:alert(1))
    [xss link](file:///123)
    [xss link](&#34;&#62;&#60;script&#62;alert&#40;&#34;xss&#34;&#41;&#60;/script&#62;)
    [xss link](&#74;avascript:alert(1))
    [xss link](&#x26;#74;avascript:alert(1))
    [xss link](\&#74;avascript:alert(1))
    [xss link](<javascript:alert(1)>)
    [xss link](javascript&#x3A;alert(1))
    [xss link](data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4K)
    `;

      render(<MarkdownRenderer body={maliciousLinks} />);
      expect(spyConsoleWarn).toBeCalledTimes(12);
    });
    it("should not render any malicious images", () => {
      const maliciousImages = `![](data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7)
    ![xss link](javascript:alert(1))
    `;

      render(<MarkdownRenderer body={maliciousImages} />);
      expect(spyConsoleWarn).toBeCalledTimes(2);
    });
    it("should not render malicious html tags as links", () => {
      const maliciousTags = `<p>[xss link](javascript:alert(1))</p>
    <p>[xss link](JAVASCRIPT:alert(1))</p>
    <p>[xss link](vbscript:alert(1))</p>
    <p>[xss link](VBSCRIPT:alert(1))</p>
    <p>[xss link](file:///123)</p>`;

      render(<MarkdownRenderer body={maliciousTags} />);
      expect(spyConsoleWarn).not.toBeCalled();
      const links = screen.queryAllByRole("link");
      expect(links).toBeArrayOfSize(0);
    });
  });
});
