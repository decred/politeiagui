import React from "react";
import { Text, Button, useTheme, classNames } from "pi-ui";
import styles from "./WhatAreYourThoughts.module.css";

const WhatAreYourThoughts = ({ onLoginClick, onSignupClick }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";
  return (
    <div className={styles.wrapper}>
      <Text className={classNames(styles.text, isDarkTheme && styles.darkText)}>What are your thoughts?</Text>
      <div className={styles.buttonsWrapper}>
        {onLoginClick && (
          <Button kind="secondary" onClick={onLoginClick}>
            Log in
          </Button>
        )}
        {onSignupClick && <Button onClick={onSignupClick}>Sign up</Button>}
      </div>
    </div>
  );
};

export default WhatAreYourThoughts;
