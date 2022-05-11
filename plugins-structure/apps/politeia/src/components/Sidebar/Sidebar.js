import React from "react";
import { Card } from "pi-ui";
import { MarkdownRenderer } from "@politeiagui/common-ui";
import aboutPoliteiaText from "../../assets/copies/about-politeia.md";
import styles from "./styles.module.css";

export default function Sidebar() {
  return (
    <Card paddingSize="small">
      <MarkdownRenderer body={aboutPoliteiaText} className={styles.sidebar} />
    </Card>
  );
}
