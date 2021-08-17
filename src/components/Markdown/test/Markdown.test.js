import React from "react";
import Markdown from "../Markdown";
import {
  defaultLightTheme,
  ThemeProvider,
  DEFAULT_LIGHT_THEME_NAME
} from "pi-ui";
import { shallow, mount } from "enzyme";
import * as mockData from "./mock";

describe("Test Markdown", () => {
  it("should filter potencial 'XSS' attackers", () => {
    const wrapper = shallow(
      <ThemeProvider
        themes={{ [DEFAULT_LIGHT_THEME_NAME]: defaultLightTheme }}
        defaultThemeName={DEFAULT_LIGHT_THEME_NAME}>
        <Markdown body={mockData.maliciousBodyText} />
      </ThemeProvider>
    );
    wrapper.find("LinkRenderer").forEach((el) => {
      expect(["x-javascript:alert('XSS')", "javascript:void(0)"]).toContain(
        el.prop("url")
      );
    });
  });
  it("should render tables correctly", () => {
    const wrapper = mount(<Markdown body={mockData.tableText} />);
    expect(wrapper.find("th")).toHaveLength(4);
    expect(wrapper.find("tr")).toHaveLength(7);
  });
  it("should render headers correctly", () => {
    const wrapper = mount(<Markdown body={mockData.headersText} />);
    expect(wrapper.find("h1")).toHaveLength(1);
    expect(wrapper.find("h2")).toHaveLength(1);
    expect(wrapper.find("h3")).toHaveLength(1);
    expect(wrapper.find("h4")).toHaveLength(1);
    expect(wrapper.find("h5")).toHaveLength(1);
    expect(wrapper.find("h6")).toHaveLength(1);
  });
  it("should render unordered lists correctly", () => {
    const wrapper = mount(<Markdown body={mockData.unorderedListText} />);
    const unorderedList = wrapper.find("ul");
    expect(unorderedList).toBeDefined();
    expect(unorderedList.find("li")).toHaveLength(4);
  });
  it("should render ordered lists correctly", () => {
    const wrapper = mount(<Markdown body={mockData.orderedListText} />);
    const orderedList = wrapper.find("ol");
    expect(orderedList).toHaveLength(2);

    const parent = orderedList.at(0);
    expect(parent.find("li")).toHaveLength(5);

    const sublist = orderedList.at(1);
    expect(sublist.find("li")).toHaveLength(2);
  });
  it("should render blockquotes correctly", () => {
    const wrapper = mount(<Markdown body={mockData.blockQuotesText} />);
    const parent = wrapper.find("blockquote").at(0);
    expect(wrapper.find("blockquote")).toHaveLength(2);
    expect(parent.children().find("blockquote")).toHaveLength(1);
  });
  it("should rener codeblocks correctly", () => {
    const wrapper = mount(<Markdown body={mockData.codeBlocksText} />);
    expect(wrapper.find("code")).toHaveLength(1);
    expect(wrapper.find("pre")).toHaveLength(1);
  });
  it("should not render disabled elements", () => {
    const wrapper = mount(
      <Markdown body={mockData.headersText} disallowedElements={["h1", "h2"]} />
    );
    expect(wrapper.contains("h1")).toBe(false);
    expect(wrapper.contains("h2")).toBe(false);
    expect(wrapper.find("h3")).toHaveLength(1);
    expect(wrapper.find("h4")).toHaveLength(1);
    expect(wrapper.find("h5")).toHaveLength(1);
    expect(wrapper.find("h6")).toHaveLength(1);
  });
});
