import { OPEN_MODAL, CLOSE_MODAL } from "./types";

export const openModal = (modalType, payload, callback) => ({
  type: OPEN_MODAL,
  modalType,
  payload,
  callback
});

export const closeModal = () => ({
  type: CLOSE_MODAL
});

export const confirmWithModal = (modalType, payload) =>
  (dispatch) =>
    new Promise((resolve) => {
      dispatch(openModal(modalType, payload, resolve));
    });

