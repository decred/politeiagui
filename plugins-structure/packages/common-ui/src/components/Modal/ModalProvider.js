import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from "react";

export const modalContext = createContext([]);

export const useModal = () => useContext(modalContext);

const initialState = {
  component: () => null,
  props: {
    show: false,
  },
};

function toggleReducer(state) {
  return { toggle: !state.toggle };
}

export function ModalProvider({ children }) {
  const modalStack = useRef([]);
  const modalToDisplay = useRef(initialState);
  // Modals are refs, and refs doesn't trigger component re-render. This
  // will force the state update, hence a modal update.
  const [, toggleDisplay] = useReducer(toggleReducer, { toggle: false });

  const handleOpenModal = useCallback(function (
    modal,
    props = {},
    { overlay } = {}
  ) {
    const newModal = { component: modal, props: { show: true, ...props } };
    if (!modalStack.current || overlay) {
      modalStack.current && modalStack.current.push(newModal);
      modalToDisplay.current = newModal;
      toggleDisplay();
    } else if (modalToDisplay.current && !modalToDisplay.current.props.show) {
      modalToDisplay.current = newModal;
      toggleDisplay();
    }
  },
  []);

  const handleCloseModal = useCallback(function () {
    modalStack.current && modalStack.current.pop();
    const previousModal = modalStack.current && modalStack.current.pop();
    modalToDisplay.current = previousModal || initialState;
    toggleDisplay();
  }, []);

  const props = {
    onClose: handleCloseModal,
    ...modalToDisplay.current.props,
  };

  return (
    <modalContext.Provider value={[handleOpenModal, handleCloseModal]}>
      {children}
      <modalToDisplay.current.component {...props} />
    </modalContext.Provider>
  );
}
