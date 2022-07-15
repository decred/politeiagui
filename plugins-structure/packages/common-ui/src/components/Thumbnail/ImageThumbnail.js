import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import styles from "./styles.module.css";

export function ImageThumbnail({ file, onClick, className }) {
  function handleClick() {
    return onClick(file);
  }
  return (
    <div className={classNames(styles.fileThumbnailWrapper, className)}>
      <img
        onClick={handleClick}
        className={styles.fileThumbnail}
        alt={file.name}
        src={`data:${file.mime};base64,${file.payload}`}
      />
    </div>
  );
}

ImageThumbnail.propTypes = {
  file: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
