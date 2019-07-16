import React from "react";
import ReactMarkdown from "react-markdown";
import { mount } from "enzyme";
import { customRenderers } from "../helpers";

const maliciousBodyText =
  "![clickforxss](javascript:alert('XSS'))  [clickforxss](javascript:alert('XSS'))";

it("filter potencial 'XSS' attackers", () => {
  const wrapper = mount(
    <ReactMarkdown
      source={maliciousBodyText}
      renderers={customRenderers(true)}
    />
  );
  wrapper.find("LinkRenderer").forEach(el => {
    expect(["x-javascript:alert('XSS')", "javascript:void(0)"]).toContain(
      el.prop("url")
    );
  });
});
