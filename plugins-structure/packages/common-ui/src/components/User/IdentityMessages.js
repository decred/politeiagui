import React from "react";
import description from "../../assets/copies/identity.md";
import { MarkdownRenderer, getMarkdownSection } from "../Markdown";

export const IdentityDescription = () => {
  const body = getMarkdownSection(description, "## About");
  return <MarkdownRenderer body={body} />;
};
