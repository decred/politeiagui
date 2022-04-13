import React from "react";
import { Row } from "pi-ui";
import styles from "./styles.module.css";

export function SplashScreen({ children }) {
  return (
    <Row className={styles.splash}>
      <div>{children}</div>
    </Row>
  );
}

SplashScreen.defaultProps = {
  children: "Loading",
};
