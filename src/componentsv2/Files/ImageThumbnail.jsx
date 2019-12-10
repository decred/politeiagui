import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import styles from "./Files.module.css";
import RemoveButton from "./ThumbnailRemoveButton";

export const ImageThumbnail = ({
  file,
  viewOnly,
  onClick,
  onRemove,
  className
}) => (
  <div
    className={classNames(
      styles.imageThumbnailWrapper,
      viewOnly && styles.marginRight,
      className
    )}
  >
    <img
      onClick={onClick(file)}
      className={styles.imageThumbnail}
      alt={file.name}
      src={`data:${file.mime};base64,${file.payload}`}
    />
    {!viewOnly && <RemoveButton file={file} onRemove={onRemove} />}
  </div>
);

ImageThumbnail.propTypes = {
  file: PropTypes.object.isRequired,
  viewOnly: PropTypes.bool,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
  className: PropTypes.string
};

export default ImageThumbnail;
