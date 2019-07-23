import { Text, classNames } from "pi-ui";
import React from "react";
import styles from "./HelpMessage.module.css";

const HelpMessage = ({ className, children }) => {
  return (
    <div className={classNames("justify-center", styles.container)}>
      <Text textAlign="center" className={classNames(className, styles.helpMessage)}>{children}</Text>
    </div>
  );
};

export default HelpMessage;
