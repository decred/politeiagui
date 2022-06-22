import React, { useState } from "react";
import { Modal } from "pi-ui";
import styles from "./styles.module.css";

function ImagesCarousel({ images, activeIndex }) {
  const [index, setIndex] = useState(activeIndex);
  const length = images.length - 1;
  return (
    <div onClick={() => setIndex(index < length ? index + 1 : 0)}>
      {images.map(
        (img, i) =>
          i === index && (
            <img
              alt={img.alt}
              key={i}
              src={img.src}
              className={styles.modalImage}
            />
          )
      )}
    </div>
  );
}

export function ModalImages({ images, activeIndex = 0, onClose, show }) {
  return (
    <Modal show={show} onClose={onClose}>
      {images && <ImagesCarousel images={images} activeIndex={activeIndex} />}
    </Modal>
  );
}
