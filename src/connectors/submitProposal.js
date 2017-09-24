import { connect } from "preact-redux";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    name: sel.newProposalName,
    description: sel.newProposalDescription,
    nameIsInvalid: sel.newProposalNameIsInvalid,
    descriptionIsInvalid: sel.newProposalDescriptionIsInvalid,
    isInvalid: sel.newProposalIsInvalid,
    isSaving: sel.newProposalIsRequesting,
    error: sel.newProposalError,
    merkle: sel.newProposalMerkle,
    token: sel.newProposalToken,
    signature: sel.newProposalSignature
  }),
  dispatch => bindActionCreators({
    onSetName: act.onSetNewProposalName,
    onSetDescription: act.onSetNewProposalDescription,
    onSave: act.onSaveNewProposal
  }, dispatch)
);
