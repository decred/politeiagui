import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Row } from "../layout";
import styles from "./Files.module.css";
import ImageThumbnail from "./ImageThumbnail";
import TextThumbnail from "./TextThumbnail";
import useHighlightedItem from "src/hooks/utils/useHighlightItem";
import ModalFullImage from "src/componentsv2/ModalFullImage";
import ThumbnailGridErrors from "./ThumbnailGridErrors";

export const ThumbnailGrid = ({
  value = [],
  onRemove,
  errors = [],
  viewOnly = false
}) => {
  const [
    imageOnModal,
    setImageOnModal,
    closeImageOnModal
  ] = useHighlightedItem();
  const files = value.filter((f) => f.name !== "index.md");
  const handleSetImageOnModal = useCallback(
    (file) => {
      setImageOnModal(file);
    },
    [setImageOnModal]
  );
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
              onClick={handleSetImageOnModal}
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
      <ModalFullImage
        image={imageOnModal}
        show={!!imageOnModal}
        onClose={closeImageOnModal}
      />
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
