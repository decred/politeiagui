import { useEffect, useState, useCallback, useMemo } from "react";
import isEqual from "lodash/isEqual";
import { or } from "src/lib/fp";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import { isUnreviewedProposal, isCensoredProposal } from "../helpers";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import { isEmpty, keys, difference, pick, values } from "lodash";

const proposalWithFilesOrNothing = (proposal) => {
  return proposal && proposal.files && !!proposal.files.length
    ? proposal
    : null;
};

export function useProposal(token, threadParentID) {
  const error = useSelector(sel.proposalError);
  const loadingSelector = useMemo(
    () => or(sel.isApiRequestingProposalsVoteSummary, sel.proposalIsRequesting),
    []
  );
  const loading = useSelector(loadingSelector);
  const onFetchProposal = useAction(act.onFetchProposal);
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchProposalsVoteSummary = useAction(
    act.onFetchProposalsBatchVoteSummary
  );
  const proposalSelector = useMemo(() => sel.makeGetProposalByToken(token), [
    token
  ]);
  const proposalFromState = useSelector(proposalSelector);
  const currentUser = useSelector(sel.currentUser);
  const proposals = useSelector(sel.proposalsByToken);
  const voteSummaries = useSelector(sel.summaryByToken);

  const currentUserIsAdmin = currentUser && currentUser.isadmin;
  const currentUserId = currentUser && currentUser.userid;

  const getProposal = useCallback(() => {
    const proposalAuthorID = proposalFromState && proposalFromState.userid;
    const userCannotViewFullProposal =
      !currentUserIsAdmin || currentUserId !== proposalAuthorID;
    const dontNeedToPresentProposalFiles =
      !!proposalFromState &&
      (isCensoredProposal(proposalFromState) ||
        isUnreviewedProposal(proposalFromState)) &&
      userCannotViewFullProposal;
    if (dontNeedToPresentProposalFiles) {
      return proposalFromState;
    }
    return proposalWithFilesOrNothing(proposalFromState);
  }, [proposalFromState, currentUserId, currentUserIsAdmin]);

  const [proposal, setProposal] = useState(getProposal());

  // useEffect(
  //   function fetchProposal() {
  //     if (proposal) {
  //       return;
  //     }
  //     onFetchProposal(token);
  //   },
  //   [proposal, token, onFetchProposal, onFetchProposalsVoteSummary]
  // );
  useEffect(
    // fetch vote summary only when proposal details loaded => full token is avaliable in redux store
    // thus can be used to fetch vote summary
    function fetchVoteSummary() {
      if (proposalFromState) {
        const {
          censorshiprecord: { token }
        } = proposalFromState;
        onFetchProposalsVoteSummary([token]);
      }
    },
    [proposalFromState, onFetchProposalsVoteSummary]
  );

  const rfpLinks =
    proposal && (proposal.linkby || proposal.linkto)
      ? proposal.linkby
        ? proposal.linkedfrom
        : [proposal.linkto]
      : [];
  const unfetchedTokens = rfpLinks && difference(rfpLinks, keys(proposals));
  const rfpSubmissions = {
    proposals: values(pick(proposals, rfpLinks)),
    voteSummaries: pick(voteSummaries, rfpLinks)
  };

  const [state, send] = useFetchMachine({
    actions: {
      initial: () => {
        if (token && !proposal) {
          onFetchProposal(token).then(() => send("VERIFY"));
          return send("FETCH");
        }
        return send("VERIFY");
      },
      load: () => {
        if (token && !proposal) {
          return;
        }
        if (token && proposal && !rfpLinks) {
          return send("RESOLVE", { proposal });
        }
        if (
          (token && !proposal) ||
          (proposal && rfpLinks && !isEmpty(unfetchedTokens))
        ) {
          return;
        }
        return send("VERIFY");
      },
      verify: () => {
        if (!isEmpty(unfetchedTokens)) {
          onFetchProposalsBatch(unfetchedTokens).then(() => send("VERIFY"));
          return send("FETCH");
        }
        if (rfpLinks && !isEmpty(rfpSubmissions)) {
          return send("RESOLVE", { proposal: { ...proposal, rfpSubmissions } });
        }
        return send("RESOLVE", { proposal });
      }
    }
  });

  useEffect(
    function handleProposalChanged() {
      const prop = getProposal();
      if (!!prop && !isEqual(prop, proposal)) {
        setProposal(prop);
      }
    },
    [proposal, getProposal]
  );

  if (error) {
    throw error;
  }

  return { proposal: state.proposal, loading, threadParentID };
}
