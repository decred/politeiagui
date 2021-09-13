import React from "react";
import { ReactComponent as ImageSVG } from "./assets/image.svg";
import ModalAttachFiles from "src/components/ModalAttachFiles";
import useModalContext from "src/hooks/utils/useModalContext";
import { saveFileToMde } from "./helpers";

export function useCustomImageCommand(saveImage) {
  const [handleOpenModal, handleCloseModal] = useModalContext();

  const imageCommand = {
    name: "image",
    icon: () => <ImageSVG />,
    execute({ initialState, textApi, l18n }) {
      const handleOnChange = async function (_, files) {
        handleCloseModal();
        for (const file of files) {
          await saveFileToMde(file[1], saveImage, initialState, textApi, l18n);
        }
      };
      handleOpenModal(ModalAttachFiles, {
        title: "Insert an image",
        subTitle:
          "Select the image that you would like to insert into the proposal text.",
        onChange: handleOnChange,
        onClose: handleCloseModal
      });
    }
  };

  return {
    imageCommand
  };
}
