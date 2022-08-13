import React from "react";
import { Card } from "pi-ui";
import { MarkdownRenderer } from "@politeiagui/common-ui";
import aboutText from "../../assets/copies/about.md";
import styles from "./styles.module.css";

export default function About() {
  return (
    <Card paddingSize="small" data-testid="about-politeia">
      <MarkdownRenderer body={aboutText} className={styles.about} />
    </Card>
  );
}
