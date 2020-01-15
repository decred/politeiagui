import React, { useEffect } from "react";
import SelectEditor from "./components/SelectEditor";
import { useModalEditor } from "./components/ModalEditor/ModalEditor";

export const selectWrapper = options => props => (
  <SelectEditor {...{ ...props, options }} />
);

export const ModalEditorWrapper = props => {
  const [, , handleOpen] = useModalEditor();
  useEffect(() => {
    handleOpen("edit", props);
  }, [handleOpen, props]);

  return <span>editing...</span>;
};
