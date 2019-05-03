import { useState, useEffect, useCallback } from "react";
import { useApp } from "src/App";
import * as sel from "src/selectors";
import * as act from "src/actions";
import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import { arg, or } from "src/lib/fp";
import { useRedux, makeHookConnector } from "src/lib/redux";
import { validate } from "src/validators/proposal";

const mapStateToProps = {
  token: compose(
    t => (t ? t.toLowerCase() : t),
    get(["match", "params", "token"]),
    arg(1)
  ),
  editedProposalToken: sel.editProposalToken,
  submitError: sel.apiEditProposalError,
  proposal: sel.proposal,
  initialValues: or(sel.getEditProposalValues),
  isLoading: or(sel.isLoadingSubmit, sel.proposalIsRequesting),
  loggedInAsEmail: sel.loggedInAsEmail,
  userCanExecuteActions: sel.userCanExecuteActions,
  policy: sel.policy,
  userid: sel.userid,
  username: sel.loggedInAsUsername,
  keyMismatch: sel.getKeyMismatch,
  proposalCredits: sel.proposalCredits,
  draftProposalById: sel.draftProposalById,
  isApiRequestingMe: sel.isApiRequestingMe
};

const mapDispatchToProps = {
  onFetchData: act.onGetPolicy,
  onFetchProposal: act.onFetchProposal,
  onResetProposal: act.onResetProposal,
  onSave: act.onEditProposal,
  onSaveDraftProposal: act.onSaveDraftProposal,
  onDeleteDraftProposal: act.onDeleteDraftProposal
};

export function useEditProposal(props) {
  const { history } = useApp();
  const fromRedux = useRedux(props, mapStateToProps, mapDispatchToProps);
  const [validationError, setValidationError] = useState("");
  const {
    token,
    policy,
    editedProposalToken,
    proposal,
    userid,
    isApiRequestingMe
  } = fromRedux;

  const onSave = useCallback(
    (...args) => {
      try {
        validate(...args);
        fromRedux.onSave(...args, token);
      } catch (e) {
        setValidationError(e.errors._error);
      }
    },
    [token, fromRedux.onSave]
  );

  useEffect(() => {
    if (!policy) fromRedux.onFetchData();
    if (fromRedux.onFetchProposal) fromRedux.onFetchProposal(token);
  }, []);

  useEffect(() => {
    if (editedProposalToken) {
      fromRedux.onResetProposal();
      history.push(`/proposals/${editedProposalToken}`);
    }
  }, [editedProposalToken]);

  useEffect(() => {
    if (editedProposalToken) return;
    const isProposalFetched =
      proposal &&
      proposal.censorshiprecord &&
      proposal.censorshiprecord.token === token;
    const proposalBelongsToTheUser = proposal && proposal.userid === userid;

    if (isProposalFetched && !proposalBelongsToTheUser && !isApiRequestingMe) {
      history.push("/");
    }
  });

  return { ...fromRedux, validationError, editingMode: true, onSave };
}

export const editProposalConnector = makeHookConnector(useEditProposal);
