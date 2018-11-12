import React from "react";
import ReactMarkdown from "react-markdown";
import renderer from "react-test-renderer";
import { customRenderers } from "../helpers";

const maliciousBodyText =
  "![clickforxss](javascript:alert('XSS'))  [clickforxss](javascript:alert('XSS'))";

it("filter potencial 'XSS' attackers", () => {
  const tree = renderer
    .create(
      <ReactMarkdown
        source={maliciousBodyText}
        renderers={customRenderers(true)}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
