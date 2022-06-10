import React from "react";
import PropTypes from "prop-types";
import styles from "./Files.module.css";

const RemoveButton = ({ file, onRemove }) => (
  <button
    className={styles.removeFileIcon}
    onClick={(e) => {
      e.preventDefault();
      onRemove(file);
    }}
  >
    &times;
  </button>
);

RemoveButton.propTypes = {
  file: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default RemoveButton;
