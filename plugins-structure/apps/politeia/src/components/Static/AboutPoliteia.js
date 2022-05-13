import React from "react";
import { Card } from "pi-ui";
import { MarkdownRenderer } from "@politeiagui/common-ui";
import aboutPoliteiaText from "../../assets/copies/about-politeia.md";
import styles from "./styles.module.css";

export default function AboutPoliteia() {
  return (
    <Card paddingSize="small">
      <MarkdownRenderer
        body={aboutPoliteiaText}
        className={styles.aboutPoliteia}
      />
    </Card>
  );
}
