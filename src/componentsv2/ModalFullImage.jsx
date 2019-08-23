import React from "react";
import { Modal } from "pi-ui";

const ModalFullImage = ({ image, ...props }) => (
  <Modal
    {...props}
    contentStyle={{ maxWidth: "100%" }}
  >
    {image && 
      <img
        alt={image.name}
        src={`data:${image.mime};base64,${image.payload}`}
      />
    }
  </Modal>
);

export default ModalFullImage;

