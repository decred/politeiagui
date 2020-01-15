import React from "react";
import { Modal } from "pi-ui";

const ModalFullImage = ({ image, show, ...props }) => {
  const imgSrc = image ? `data:${image.mime};base64,${image.payload}` : "";
  const imgAlt = image ? image.name : "image";
  return (
    <Modal
      {...props}
      show={show}
      style={{ maxWidth: "100vw", background: "rgba(0,0,0,0.3)" }}
      contentStyle={{ padding: "1rem" }}
    >
      <img alt={imgAlt} style={{ width: "100%" }} src={imgSrc} />
    </Modal>
  );
};

export default ModalFullImage;
