import ModalFullImage from "src/components/ModalFullImage";
import useModalContext from "src/hooks/utils/useModalContext";
import { useCallback } from "react";

function useImagesGallery(images) {
  const [handleOpenModal, handleCloseModal] = useModalContext();

  const openImageFromIndex = useCallback(
    (idx) => {
      const file = images[idx];

      // go to next image or reset index to 0 if there are no subsequent images
      const nextIndex = images.length > idx + 1 ? idx + 1 : 0;

      // go to previous index or set to latest index if there are no preceding images
      const prevIndex = idx === 0 ? images.length - 1 : idx - 1;

      handleOpenModal(ModalFullImage, {
        image: file,
        onClose: handleCloseModal,
        onNext: () => openImageFromIndex(nextIndex),
        onPrevious: () => openImageFromIndex(prevIndex),
        navigatorText: `${idx + 1}/${images.length}`
      });
    },
    [handleCloseModal, handleOpenModal, images]
  );

  return openImageFromIndex;
}

export default useImagesGallery;
