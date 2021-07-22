import React from "react";
import Markdown from "../Markdown";
import {
  defaultLightTheme,
  ThemeProvider,
  DEFAULT_LIGHT_THEME_NAME
} from "pi-ui";
import { shallow } from "enzyme";

const maliciousBodyText =
  "![clickforxss](javascript:alert('XSS'))  [clickforxss](javascript:alert('XSS'))";

describe("Test Markdown", () => {
  it("should filter potencial 'XSS' attackers", () => {
    const wrapper = shallow(
      <ThemeProvider
        themes={{ [DEFAULT_LIGHT_THEME_NAME]: defaultLightTheme }}
        defaultThemeName={DEFAULT_LIGHT_THEME_NAME}>
        <Markdown body={maliciousBodyText} />
      </ThemeProvider>
    );
    wrapper.find("LinkRenderer").forEach((el) => {
      expect(["x-javascript:alert('XSS')", "javascript:void(0)"]).toContain(
        el.prop("url")
      );
    });
  });
});
