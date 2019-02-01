import * as act from "../actions/types";

const DEFAULT_STATE = {
  openedModals: []
};

const modal = (state = DEFAULT_STATE, action) =>
  (({
    [act.OPEN_MODAL]: () => ({
      ...state,
      openedModals: state.openedModals.concat([
        {
          type: action.modalType,
          payload: action.payload,
          callback: action.callback,
          options: {
            disableCloseOnClick: action.options.disableCloseOnClick,
            disableCloseOnEsc: action.options.disableCloseOnEsc
          }
        }
      ])
    }),
    [act.CLOSE_MODAL]: () => ({
      ...state,
      openedModals: state.openedModals.filter(
        (obj, idx) => idx !== state.openedModals.length - 1
      )
    }),
    [act.CLOSE_ALL_MODALS]: () => ({
      ...state,
      openedModals: []
    })
  }[action.type] || (() => state))());

export default modal;
