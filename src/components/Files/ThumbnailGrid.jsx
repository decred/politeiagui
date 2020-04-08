import React from "react";
import PropTypes from "prop-types";
import { Row } from "../layout";
import styles from "./Files.module.css";
import ImageThumbnail from "./ImageThumbnail";
import TextThumbnail from "./TextThumbnail";
import ModalFullImage from "src/components/ModalFullImage";
import useModalContext from "src/hooks/utils/useModalContext";
import ThumbnailGridErrors from "./ThumbnailGridErrors";

export const ThumbnailGrid = ({
  value = [],
  onRemove,
  errors = [],
  viewOnly = false
}) => {
  const files = value.filter((f) => f.name !== "index.md");
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const openFullImageModal = (file) => {
    handleOpenModal(ModalFullImage, {
      image: file,
      onClose: handleCloseModal
    });
  };
  return (
    <>
      <ThumbnailGridErrors errors={errors} />
      <Row
        className={styles.thumbnailGrid}
        justify="left"
        topMarginSize={errors ? "s" : "m"}>
        {files.map((f, key) =>
          f.mime.includes("image") ? (
            <ImageThumbnail
              key={`img-${key}`}
              file={f}
              viewOnly={viewOnly}
              onClick={openFullImageModal}
              onRemove={onRemove}
            />
          ) : (
            <TextThumbnail
              key={`txt-${key}`}
              file={f}
              viewOnly={viewOnly}
              onRemove={onRemove}
            />
          )
        )}
      </Row>
    </>
  );
};

ThumbnailGrid.propTypes = {
  value: PropTypes.array,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
  errors: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  viewOnly: PropTypes.bool
};

export default ThumbnailGrid;
