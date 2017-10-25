import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";
import compose from "lodash/fp/compose";
import { reduxForm } from "redux-form";
import validate from "../components/ProposalSubmitPage/validator";
import { withRouter } from "react-router-dom";

const submitConnector = connect(
  sel.selectorMap({
    isLoading: sel.isLoadingSubmit,
    policy: sel.policy,
    name: sel.newProposalName,
    description: sel.newProposalDescription,
    files: sel.newProposalFiles,
    isSaving: sel.newProposalIsRequesting,
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

export default compose(reduxForm({ form: "form/proposal", validate }), submitConnector, withRouter);
