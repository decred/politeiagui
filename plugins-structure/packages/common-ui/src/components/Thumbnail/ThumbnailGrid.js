import React from "react";
import { ButtonIcon } from "pi-ui";
import { ImageThumbnail } from "./ImageThumbnail";
import { TextThumbnail } from "./TextThumbnail";
import styles from "./styles.module.css";

export function ThumbnailGrid({
  files,
  errors,
  onRemove = () => {},
  readOnly = false,
}) {
  return (
    files && (
      <>
        {errors && <div>Errors</div>}
        <div className={styles.thumbnailGrid}>
          {files.map((f, key) => (
            <div className={styles.thumbnailWrapper}>
              {f.mime.includes("image") ? (
                <ImageThumbnail
                  file={f}
                  key={key}
                  onClick={() => console.log("Clicked")}
                />
              ) : (
                <TextThumbnail key={key} />
              )}
              {!readOnly && (
                <div className={styles.removeButton}>
                  <ButtonIcon type="trash" onClick={onRemove} />
                </div>
              )}
            </div>
          ))}
        </div>
      </>
    )
  );
}
