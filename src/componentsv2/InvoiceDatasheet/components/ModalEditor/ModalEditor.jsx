import React, { createContext, useContext, useMemo, useEffect } from "react";
import { Modal, Button, TextInput } from "pi-ui";
import ModalProvider from "src/componentsv2/ModalProvider";
import FormWrapper from "src/componentsv2/FormWrapper";

export const modalEditorContext = createContext();

export const ModalEditorConsumer = modalEditorContext.Consumer;

export const useModalEditor = () => useContext(modalEditorContext);

export const ModalEditorProvider = ({ children }) => {
  const modal = useMemo(() => <ModalEditor />, []);
  return (
    <ModalProvider context={modalEditorContext} modal={modal}>
      {children}
    </ModalProvider>
  );
};

// key codes
const ENTER_KEY = 13;
const LEFT_ARROW_KEY = 37;
const UP_ARROW_KEY = 38;
const RIGHT_ARROW_KEY = 39;
const DOWN_ARROW_KEY = 40;

const KEYS_TO_STOP_PROPAGATION = [
  ENTER_KEY,
  LEFT_ARROW_KEY,
  UP_ARROW_KEY,
  RIGHT_ARROW_KEY,
  DOWN_ARROW_KEY
];

const ModalEditor = ({ value, onCommit, onRevert, ...props }) => {
  function handleDone(values, { resetForm }) {
    onCommit && onCommit(values.description);
    resetForm();
    props.onClose();
  }

  function handleCancel() {
    onRevert();
    props.onClose();
  }

  function onKeyDown(keyEvent) {
    if (
      KEYS_TO_STOP_PROPAGATION.find(
        (key) => (keyEvent.charCode || keyEvent.keyCode) === key
      )
    ) {
      keyEvent.stopPropagation();
    }
  }

  useEffect(() => {
    const el = document.getElementById("itemDescription");
    if (el && props.show) {
      setTimeout(() => {
        el.focus();
      }, 100);
    }
    return () => {
      if (el && !props.show) {
        el.value = "";
      }
    };
  }, [props.show]);

  return (
    <>
      <Modal {...props} title="Edit description">
        <FormWrapper
          onSubmit={handleDone}
          enableReinitialize
          initialValues={{ description: value || "" }}>
          {({
            Form,
            Actions,
            values,
            handleSubmit,
            setFieldValue,
            handleBlur
          }) => {
            const handleChangeTextArea = (e) => {
              e.stopPropagation();
              setFieldValue("description", e.target.value);
            };
            return (
              <Form>
                <TextInput
                  id="itemDescription"
                  name="description"
                  onKeyDown={onKeyDown}
                  label="Description"
                  onChange={handleChangeTextArea}
                  value={values.description}
                  onBlur={handleBlur}
                />
                <Actions>
                  <Button kind="secondary" type="button" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSubmit}>
                    Save
                  </Button>
                </Actions>
              </Form>
            );
          }}
        </FormWrapper>
      </Modal>
    </>
  );
};

export default ModalEditor;
