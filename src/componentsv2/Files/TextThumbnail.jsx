import React from "react";
import PropTypes from "prop-types";
import { classNames, P } from "pi-ui";
import styles from "./Files.module.css";
import RemoveButton from "./ThumbnailRemoveButton";

export const TextThumbnail = ({ file, viewOnly, onRemove }) => (
  <div
    className={classNames(
      styles.fileThumbnailWrapper,
      viewOnly && styles.marginRight
    )}
  >
    <div className={styles.fileThumbnail}>
      <P className={styles.fileThumbnailText}>.txt</P>
    </div>
    {!viewOnly && <RemoveButton file={file} onRemove={onRemove} />}
  </div>
);

TextThumbnail.propTypes = {
  file: PropTypes.object.isRequired,
  viewOnly: PropTypes.bool,
  onRemove: PropTypes.func,
  className: PropTypes.string
};

export default TextThumbnail;
