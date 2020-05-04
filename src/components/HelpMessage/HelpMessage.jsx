import React from "react";
import { Text, classNames, useTheme } from "pi-ui";
import styles from "./HelpMessage.module.css";

const HelpMessage = ({ className, children }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";
  return (
    <div className={classNames("justify-center", styles.container)}>
      <Text
        textAlign="center"
        className={classNames(
          className,
          styles.helpMessage,
          isDarkTheme && styles.dark
        )}>
        {children}
      </Text>
    </div>
  );
};

export default HelpMessage;
