import React from "react";
import { Text, classNames } from "pi-ui";
import styles from "./ProposalForm.module.css";

const FormatHelpButton = ({ isDarkTheme, openMDGuideModal }) => (
  <Text
    weight="semibold"
    className={classNames(
      styles.formatHelpButton,
      isDarkTheme && styles.darkButton
    )}
    onClick={openMDGuideModal}
  >
    Formatting Help
  </Text>
);

export default FormatHelpButton;
