import React, { useMemo, useCallback } from "react";
import styles from "./Files.module.css";
import { classNames, P } from "pi-ui";

// TODO: use a single error props for all cases. Currently having multiple
// approaches for CMS refactoring.
// TODO: add prop types validation and split sub-components into different files
export const ThumbnailGrid = ({
  value = [],
  onClick,
  onRemove,
  errors = [],
  errorsPerFile,
  viewOnly = false
}) => {
  const files = value.filter(f => f.name !== "index.md");

  const getFileError = useCallback(
    fileIndex => {
      const fileErrors =
        Array.isArray(errorsPerFile) && errorsPerFile[fileIndex];
      if (!fileErrors) return "";

      const singleError = Object.keys(fileErrors).reduce(
        (_, key) => fileErrors[key],
        ""
      );

      return singleError;
    },
    [errorsPerFile]
  );

  const thumbnails = useMemo(() => {
    return files.map((file, idx) => {
      const ThumbComponent = file.mime.includes("image")
        ? ImageThumbnail
        : TextThumbnail;
      return (
        <li>
          <ThumbComponent
            key={`img-${idx}`}
            file={file}
            error={getFileError(idx)}
            viewOnly={viewOnly}
            onClick={onClick}
            onRemove={onRemove}
          />
        </li>
      );
    });
  }, [files, getFileError, onClick, onRemove, viewOnly]);

  return (
    <>
      <ThumbnailGridErrors errors={errors} />
      <ul className={styles.thumbnailGrid}>{thumbnails}</ul>
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

export const ImageThumbnail = ({
  file,
  viewOnly,
  onClick,
  onRemove,
  className,
  error
}) => (
  <li className={styles.thumbItemWrapper}>
    <div
      className={classNames(
        styles.imageThumbnailWrapper,
        viewOnly && styles.marginRight,
        className
      )}
    >
      <img
        onClick={onClick(file)}
        className={classNames(
          styles.imageThumbnail,
          error && styles.erroredImage
        )}
        alt={file.name}
        src={`data:${file.mime};base64,${file.payload}`}
      />
      {!viewOnly && RemoveButton(file, onRemove)}
    </div>
    {error && <span className={styles.fileError}>{error}</span>}
  </li>
);

export const TextThumbnail = ({ file, viewOnly, onRemove, error }) => (
  <li className={styles.thumbItemWrapper}>
    <div
      className={classNames(
        styles.fileThumbnailWrapper,
        viewOnly && styles.marginRight
      )}
    >
      <div
        className={classNames(
          styles.fileThumbnail,
          error && styles.erroredImage
        )}
      >
        <P className={styles.fileThumbnailText}>.txt</P>
      </div>
      {!viewOnly && RemoveButton(file, onRemove)}
    </div>
    {error && <span className={styles.fileError}>{error}</span>}
  </li>
);

const RemoveButton = (file, onRemove) => (
  <button
    className={styles.removeFileIcon}
    onClick={e => {
      e.preventDefault();
      onRemove(file);
    }}
  >
    &times;
  </button>
);
