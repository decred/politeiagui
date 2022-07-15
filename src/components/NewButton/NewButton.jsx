import { Button, useMediaQuery } from "pi-ui";
import React, { useCallback } from "react";
import { withRouter } from "react-router-dom";
import LoggedInContent from "../LoggedInContent";
import styles from "./NewButton.module.css";

const NewButton = ({ history, goTo, label, disabled }) => {
  const extraSmall = useMediaQuery("(max-width: 560px)");
  const onClick = useCallback(() => history.push(goTo), [history, goTo]);
  return (
    <LoggedInContent>
      <Button
        type="button"
        kind={disabled ? "disabled" : "primary"}
        className={styles.newButton}
        onClick={onClick}
      >
        {extraSmall ? "+" : label}
      </Button>
    </LoggedInContent>
  );
};

export default withRouter(NewButton);
