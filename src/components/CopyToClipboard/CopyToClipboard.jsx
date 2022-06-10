import React, { useState } from "react";
import { Tooltip, useTheme, classNames, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import styles from "./CopyToClipboard.module.css";

const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const CopyToClipboard = ({ children, value, tooltipText, className }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;

  const [feedbackActive, setFeedbackActive] = useState(false);
  const onCopyToClipboard = () => {
    copyToClipboard(value);
    setFeedbackActive(true);
    setTimeout(() => {
      setFeedbackActive(false);
    }, 600);
  };
  return (
    <Tooltip
      className={classNames(
        styles.copyTooltip,
        isDarkTheme && styles.darkCopyTooltip,
        className
      )}
      placement="bottom"
      content={feedbackActive ? "Copied!" : tooltipText}
    >
      {children({ onCopyToClipboard })}
    </Tooltip>
  );
};

export default CopyToClipboard;
