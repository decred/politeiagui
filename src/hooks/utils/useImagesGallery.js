import ModalFullImage from "src/components/ModalFullImage";
import useModalContext from "src/hooks/utils/useModalContext";
import { useCallback } from "react";

function useImagesGallery(images) {
  const [handleOpenModal, handleCloseModal] = useModalContext();

  console.log(images);

  const openImageFromIndex = useCallback(
    (idx) => {
      console.log("open!", idx);
      const file = images[idx];
      handleOpenModal(ModalFullImage, {
        image: file,
        onClose: handleCloseModal,
        onNext: () => openImageFromIndex(idx + 1),
        onPrevious: () => openImageFromIndex(idx - 1),
        navigatorText: `${idx + 1}/${images.length}`
      });
    },
    [handleCloseModal, handleOpenModal, images]
  );

  return openImageFromIndex;
}

export default useImagesGallery;

// const openFullImageModal = (file) => {
//     handleOpenModal(ModalFullImage, {
//       image: file,
//       onClose: handleCloseModal
//     });
//   };
