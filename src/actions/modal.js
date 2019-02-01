import { OPEN_MODAL, CLOSE_MODAL, CLOSE_ALL_MODALS } from "./types";

export const openModal = (
  modalType,
  payload,
  callback,
  options = { disableCloseOnClick: false, disableCloseOnEsc: false }
) => ({
  type: OPEN_MODAL,
  modalType,
  payload,
  callback,
  options
});

export const closeModal = () => ({
  type: CLOSE_MODAL
});

export const closeAllModals = () => ({
  type: CLOSE_ALL_MODALS
});

export const confirmWithModal = (modalType, payload) => dispatch =>
  new Promise(resolve => {
    dispatch(
      openModal(modalType, payload, function(a, b) {
        resolve(a, b);
      })
    );
  });
