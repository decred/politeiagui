import React from "react";
import ReactMarkdown from "react-markdown";
import {
  defaultLightTheme,
  ThemeProvider,
  DEFAULT_LIGHT_THEME_NAME
} from "pi-ui";
import { shallow } from "enzyme";
import { customRenderers } from "../helpers";

const maliciousBodyText =
  "![clickforxss](javascript:alert('XSS'))  [clickforxss](javascript:alert('XSS'))";

it("filter potencial 'XSS' attackers", () => {
  const wrapper = shallow(
    <ThemeProvider
      themes={{ [DEFAULT_LIGHT_THEME_NAME]: defaultLightTheme }}
      defaultThemeName={DEFAULT_LIGHT_THEME_NAME}>
      <ReactMarkdown
        source={maliciousBodyText}
        renderers={customRenderers(true)}
      />
    </ThemeProvider>
  );
  wrapper.find("LinkRenderer").forEach((el) => {
    expect(["x-javascript:alert('XSS')", "javascript:void(0)"]).toContain(
      el.prop("url")
    );
  });
});
