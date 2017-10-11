import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    name: sel.newProposalName,
    description: sel.newProposalDescription,
    isSaving: sel.newProposalIsRequesting,
    error: sel.newProposalError,
    merkle: sel.newProposalMerkle,
    token: sel.newProposalToken,
    signature: sel.newProposalSignature
  }),
  { onSave: act.onSaveNewProposal }
);
