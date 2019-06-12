import React from "react";
import { Button, classNames } from "pi-ui";
import styles from "./AttachFileButton.module.css";
import attachSVG from "./attach-file.svg";

const AttachFileButton = ({ className, ...props }) => {
  return (
    <Button
      className={classNames(styles.attachFileButton, className)}
      {...props}
    >
      <img alt="Attach" src={attachSVG} />
    </Button>
  );
};

export default AttachFileButton;
