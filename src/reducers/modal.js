import * as act from "../actions/types";

const DEFAULT_STATE = {
  opennedModals: []
};

const modal = (state = DEFAULT_STATE, action) => (({
  [act.OPEN_MODAL]: () => ({
    ...state,
    opennedModals: state.opennedModals.concat([{
      type: action.modalType,
      payload: action.payload,
      callback: action.payload
    }])
  }),
  [act.CLOSE_MODAL]: () => ({
    ...state,
    opennedModals: state.opennedModals.filter((obj, idx) => idx !== state.opennedModals.length - 1)
  })
})[action.type] || (() => state))();

export default modal;
