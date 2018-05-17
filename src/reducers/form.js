import { reducer } from "redux-form";
import { resetNewProposalData, resetNewCommentData } from "../lib/editors_content_backup";
import * as act from "../actions/types";


const formReducer = reducer.plugin({
  "form/proposal": (state, action) => {
    switch(action.type) {
    case act.RECEIVE_NEW_PROPOSAL:
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
  }
});

export default formReducer;
