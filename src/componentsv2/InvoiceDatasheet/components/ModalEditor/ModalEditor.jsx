import React, { createContext, useContext, useMemo } from "react";
import { Modal, Button } from "pi-ui";
import ModalProvider from "src/componentsv2/ModalProvider";
import FormWrapper from "src/componentsv2/FormWrapper";
import styles from "./ModalEditor.module.css";

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

const KEYS_TO_STOP_PROPAGATION = [13, 37, 38, 39, 40];

const ModalEditor = ({ value, options, onCommit, onRevert, ...props }) => {
  function handleDone(values, { resetForm }) {
    onCommit && onCommit(values.text);
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
        key => (keyEvent.charCode || keyEvent.keyCode) === key
      )
    ) {
      keyEvent.stopPropagation();
    }
  }

  return (
    <>
      <Modal {...props} title="Edit description">
        <FormWrapper
          onSubmit={handleDone}
          enableReinitialize
          initialValues={{ text: value }}
        >
          {({ Form, Actions, values, handleSubmit, handleChange }) => {
            return (
              <Form>
                <textarea
                  name="text"
                  onKeyDown={onKeyDown}
                  className={styles.textarea}
                  onChange={handleChange}
                  value={values.text}
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
