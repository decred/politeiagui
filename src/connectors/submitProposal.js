import { connect } from "preact-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    name: sel.newProposalName,
    description: sel.newProposalDescription,
    isSaving: sel.newProposalIsRequesting
  }),
  dispatch => bindActionCreators({
    onSetName: act.onSetNewProposalName,
    onSetDescription: act.onSetNewProposalDescription
  }, dispatch)
);
