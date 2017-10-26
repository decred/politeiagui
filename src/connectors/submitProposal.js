import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    isLoading: sel.policyIsRequesting,
    policy: sel.policy,
    name: sel.newProposalName,
    description: sel.newProposalDescription,
    files: sel.newProposalFiles,
    isRequesting: sel.newProposalIsRequesting,
    error: sel.newProposalError,
    merkle: sel.newProposalMerkle,
    token: sel.newProposalToken,
    signature: sel.newProposalSignature
  }),
  {
    onFetchData: act.onGetPolicy,
    onSave: act.onSaveNewProposal
  }
);
