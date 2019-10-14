import React from "react";
import MarkdownToJsx from "markdown-to-jsx";
import { mount } from "enzyme";
import { rootHandler } from "../helpers";

const maliciousBodyText =
  "![clickforxss](javascript:alert('XSS'))  [clickforxss](javascript:alert('XSS'))";

it("filter potencial 'XSS' attackers", () => {
  const wrapper = mount(
    <MarkdownToJsx
      options={{
        createElement: rootHandler(true)
      }}
    >
      {maliciousBodyText}
    </MarkdownToJsx>
  );
  wrapper.find("LinkRenderer").forEach(el => {
    expect(["x-javascript:alert('XSS')", "javascript:void(0)"]).toContain(
      el.prop("url")
    );
  });
});
