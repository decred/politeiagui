import React from "react";
import PropTypes from "prop-types";
import { Modal, Icon, Card } from "pi-ui";
import useEventListener from "src/hooks/utils/useEventListener";
import styles from "./ModalFullImage.module.css";

const ModalFullImage = ({
  image,
  show,
  onPrevious,
  onNext,
  navigatorText,
  ...props
}) => {
  const imgSrc = image ? `data:${image.mime};base64,${image.payload}` : "";
  const imgAlt = image ? image.name : "image";

  useEventListener("keydown", ({ key }) => {
    if (key === "ArrowLeft") {
      onPrevious && onPrevious();
    }
    if (key === "ArrowRight") {
      onNext && onNext();
    }
  });

  return (
    <Modal
      {...props}
      show={show}
      wrapperClassName={styles.wrapper}
      contentClassName={styles.content}>
      <div className={styles.navigator}>
        <Card className={styles.navigatorCard}>
          {onPrevious && (
            <Icon
              className={styles.navigatorIcon}
              onClick={onPrevious}
              type="left"
            />
          )}
          <span className="padding-x-s">{navigatorText}</span>
          {onNext && (
            <Icon
              className={styles.navigatorIcon}
              onClick={onNext}
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
  image: PropTypes.object,
  show: PropTypes.bool,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  navigatorText: PropTypes.string
};

export default ModalFullImage;
