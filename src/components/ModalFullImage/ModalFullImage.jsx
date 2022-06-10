import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Icon, Card } from "pi-ui";
import useEventListener from "src/hooks/utils/useEventListener";
import styles from "./ModalFullImage.module.css";

const ModalFullImage = ({ images, show, initialIndex = 0, ...props }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(initialIndex);
  const currentImage = images[currentImageIdx];
  const imgSrc = currentImage
    ? `data:${currentImage.mime};base64,${currentImage.payload}`
    : "";
  const imgAlt = currentImage ? currentImage.name : "image";

  // only allow navigating back and forth if there are multiple images
  const canNavigate = images && images.length > 1;

  function showNextImage() {
    // go to next image or reset index to 0 if there are no subsequent images
    const nextIndex =
      images.length > currentImageIdx + 1 ? currentImageIdx + 1 : 0;
    setCurrentImageIdx(nextIndex);
  }

  function showPreviousImage() {
    // go to previous index or set to latest index if there are no preceding images
    const prevIndex =
      currentImageIdx === 0 ? images.length - 1 : currentImageIdx - 1;
    setCurrentImageIdx(prevIndex);
  }

  useEventListener("keydown", ({ key }) => {
    if (key === "ArrowLeft") {
      canNavigate && showPreviousImage();
    }
    if (key === "ArrowRight") {
      canNavigate && showNextImage();
    }
  });

  return (
    <Modal
      {...props}
      show={show}
      wrapperClassName={styles.wrapper}
      contentClassName={styles.content}
    >
      <div className={styles.navigator}>
        <Card className={styles.navigatorCard}>
          {canNavigate && (
            <Icon
              className={styles.navigatorIcon}
              onClick={showPreviousImage}
              type="left"
            />
          )}
          <span className="padding-x-s">{`${currentImageIdx + 1}/${
            images.length
          }`}</span>
          {canNavigate && (
            <Icon
              className={styles.navigatorIcon}
              onClick={showNextImage}
              type="right"
              size="lg"
            />
          )}
        </Card>
      </div>
      <img alt={imgAlt} style={{ width: "100%" }} src={imgSrc} />
    </Modal>
  );
};

ModalFullImage.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
  show: PropTypes.bool,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  navigatorText: PropTypes.string,
  withNavigation: PropTypes.bool
};

export default ModalFullImage;
