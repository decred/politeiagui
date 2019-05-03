import { useEffect, useState, useCallback } from "react";
import { useApp } from "src/App";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { or } from "src/lib/fp";
import { validate } from "src/validators/proposal";
import { useRedux, makeHookConnector } from "src/lib/redux";
import { getNewProposalData } from "src/lib/editors_content_backup";

const mapStateToProps = {
  draftProposal: sel.draftProposalById,
  isLoading: or(sel.isLoadingSubmit, sel.newProposalIsRequesting),
  policy: sel.policy,
  userid: sel.userid,
  username: sel.loggedInAsUsername,
  keyMismatch: sel.getKeyMismatch,
  name: sel.newProposalName,
  description: sel.newProposalDescription,
  files: sel.newProposalFiles,
  submitError: sel.newProposalError,
  merkle: sel.newProposalMerkle,
  token: sel.newProposalToken,
  signature: sel.newProposalSignature,
  proposalCredits: sel.proposalCredits,
  draftProposalById: sel.draftProposalById,
  userPaywallStatus: sel.getUserPaywallStatus,
  userHasPaid: sel.userHasPaid
};

const mapDispatchToProps = {
  onFetchData: act.onGetPolicy,
  onSave: act.onSaveNewProposal,
  onResetProposal: act.onResetProposal,
  onSaveDraftProposal: act.onSaveDraftProposal,
  onDeleteDraftProposal: act.onDeleteDraftProposal
};

export function useNewProposal(props) {
  const { history } = useApp();
  const fromRedux = useRedux(props, mapStateToProps, mapDispatchToProps);
  const { token, draftProposal, draftProposalById } = fromRedux;
  const [{ initialValues, validationError }, setState] = useState({
    initialValues: draftProposal || getNewProposalData(),
    validationError: ""
  });

  const onChange = useCallback(
    () => setState(s => ({ ...s, validationError: "" })),
    []
  );

  const onSave = useCallback(
    (...args) => {
      try {
        validate(...args);
      } catch (e) {
        setState(s => ({ ...s, validationError: e.errors._error }));
        return;
      }
      return fromRedux.onSave(...args);
    },
    [fromRedux.onSave]
  );

  useEffect(() => {
    if (token) {
      if (draftProposalById)
        fromRedux.onDeleteDraftProposal(draftProposalById.draftId);
      fromRedux.onResetProposal();
      history.push("/proposals/" + token);
    }
  }, [token, draftProposalById]);

  useEffect(() => {
    if (draftProposal)
      setState(s => ({ ...s, initialValues: fromRedux.draftProposal }));
  }, [!!draftProposal]);

  return { ...fromRedux, initialValues, validationError, onChange, onSave };
}

export const newProposalConnector = makeHookConnector(useNewProposal);
