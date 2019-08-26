import React from "react";
import { Modal } from "pi-ui";

const ModalFullImage = ({ image, show, ...props }) => (
  <Modal
    {...props}
    show={show}
    style={{ maxWidth: "100vw", background: "rgba(0,0,0,0.3)" }}
    contentStyle={{ padding: "1rem" }}
  >
    {image && (
      <img
        alt={image.name}
        style={{ width: "100%" }}
        src={`data:${image.mime};base64,${image.payload}`}
      />
    )}
  </Modal>
);

export default ModalFullImage;

