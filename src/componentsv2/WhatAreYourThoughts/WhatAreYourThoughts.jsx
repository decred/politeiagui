import React from "react";
import { Text, Button } from "pi-ui";
import styles from "./WhatAreYourThoughts.module.css";

const WhatAreYourThoughts = ({ onLoginClick, onSignupClick }) => {
  return (
    <div className={styles.wrapper}>
      <Text color="gray">What are your thoughts?</Text>
      <div className={styles.buttonsWrapper}>
        {onLoginClick && (
          <Button kind="secondary" style={{ border: "solid 1px" }} onClick={onLoginClick}>
            Log in
          </Button>
        )}
        {onSignupClick && <Button onClick={onSignupClick}>Sign up</Button>}
      </div>
    </div>
  );
};

export default WhatAreYourThoughts;
