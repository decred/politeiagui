import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Modal, useKeyPress } from "pi-ui";
import useEventListener from "src/hooks/utils/useEventListener";

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
      style={{ maxWidth: "100vw", background: "rgba(0,0,0,0.3)" }}
      contentStyle={{ padding: "1rem" }}>
      <img alt={imgAlt} style={{ width: "100%" }} src={imgSrc} />
      <div>
        {onPrevious && <span onClick={onPrevious}>{"<"} </span>}
        <span>{navigatorText}</span>
        {onNext && <span onClick={onNext}>{">"} </span>}
      </div>
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
