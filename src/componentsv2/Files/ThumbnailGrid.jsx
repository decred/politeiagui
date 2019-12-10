import React from "react";
import PropTypes from "prop-types";
import { Row } from "../layout";
import styles from "./Files.module.css";
import ImageThumbnail from "./ImageThumbnail";
import TextThumbnail from "./TextThumbnail";

export const ThumbnailGrid = ({
  value = [],
  onClick,
  onRemove,
  errors = [],
  viewOnly = false
}) => {
  const files = value.filter(f => f.name !== "index.md");
  return (
    <>
      <ThumbnailGridErrors errors={errors} />
      <Row
        className={styles.thumbnailGrid}
        justify="left"
        topMarginSize={errors ? "s" : "m"}
      >
        {files.map((f, key) =>
          f.mime.includes("image") ? (
            <ImageThumbnail
              key={`img-${key}`}
              file={f}
              viewOnly={viewOnly}
              onClick={onClick}
              onRemove={onRemove}
            />
          ) : (
            <TextThumbnail
              key={`txt-${key}`}
              file={f}
              viewOnly={viewOnly}
              onClick={onClick}
              onRemove={onRemove}
            />
          )
        )}
      </Row>
    </>
  );
};

const ThumbnailGridErrors = ({ errors }) => {
  const fileErrors = errors.files || [];
  const uniqueErrors = Array.isArray(fileErrors)
    ? [...new Set(fileErrors)]
    : [fileErrors];
  return uniqueErrors.map(
    err =>
      err && (
        <p key={err} className={styles.fileErrorText}>
          {err}
        </p>
      )
  );
};

ThumbnailGrid.propTypes = {
  value: PropTypes.array,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
  errors: PropTypes.array,
  viewOnly: PropTypes.bool
};

export default ThumbnailGrid;
