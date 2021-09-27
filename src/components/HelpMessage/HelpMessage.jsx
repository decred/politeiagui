import React from "react";
import { Text, classNames, useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import styles from "./HelpMessage.module.css";

const HelpMessage = ({ className, children }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  return (
    <div
      className={classNames("justify-center", styles.container)}
      data-testid="help-message">
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
