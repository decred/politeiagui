import { reducer } from "redux-form";
import { resetNewProposalData, resetNewCommentData } from "../lib/editors_content_backup";
import { deleteDraftProposalFromLocalStorage } from "../lib/local_storage";
import * as act from "../actions/types";

const formReducer = reducer.plugin({
  "form/proposal": (state, action) => {
    switch(action.type) {
    case act.RECEIVE_NEW_PROPOSAL:
      resetNewProposalData();
      deleteDraftProposalFromLocalStorage();
      return undefined;
    case act.SAVE_DRAFT_PROPOSAL:
      resetNewProposalData();
      return undefined;
    default:
      return state;
    }
  },
  "form/reply": (state, action) => {
    switch(action.type) {
    case act.RECEIVE_NEW_COMMENT:
      resetNewCommentData();
      return undefined;
    default:
      return state;
    }
  },
  "form/change-username": (state, action) => {
    switch(action.type) {
    case act.RECEIVE_CHANGE_USERNAME:
      return !action.error ? undefined : state;
    default:
      return state;
    }
  },
  "form/change-password": (state, action) => {
    switch(action.type) {
    case act.RECEIVE_CHANGE_PASSWORD:
      return !action.error ? undefined : state;
    default:
      return state;
    }
  }
});

export default formReducer;
