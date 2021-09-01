import { useMemo, useState, useEffect, useCallback } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import {
  getProposalRfpLinks,
  getProposalToken,
  getTokensForProposalsPagination
} from "../helpers";
import { getDetailsFile, calculateAuthorUpdateTree } from "./helpers";
import { shortRecordToken, parseRawProposal } from "src/helpers";
import {
  PROPOSAL_STATE_VETTED,
  PROPOSAL_UPDATE_HINT,
  PROPOSAL_MAIN_THREAD_KEY
} from "src/constants";
import useFetchMachine from "src/hooks/utils/useFetchMachine";
import { useLoaderContext } from "src/containers/Loader";
import isEmpty from "lodash/fp/isEmpty";
import keys from "lodash/fp/keys";
import difference from "lodash/fp/difference";
import isEqual from "lodash/fp/isEqual";
import values from "lodash/fp/values";
import pick from "lodash/pick";
import concat from "lodash/fp/concat";
import { useConfig } from "src/containers/Config";
import { or } from "src/lib/fp";

const getUnfetchedVoteSummaries = (proposal, voteSummaries, isSubmission) => {
  if (!proposal) return [];
  // no need to fetch vote summary if its submission
  const rfpLinks = isSubmission ? [] : getProposalRfpLinksTokens(proposal);
  const proposalToken = getProposalToken(proposal);
  const tokens = concat(rfpLinks || [])(proposalToken);
  // compare tokens by short form
  return tokens.filter(
    (t) =>
      !keys(voteSummaries).some(
        (vs) => shortRecordToken(vs) === shortRecordToken(t)
      )
  );
};

const getProposalRfpLinksTokens = (proposal) => {
  if (!proposal) return null;
  const isSubmission = !!proposal.linkto;
  const isRfp = !!proposal.linkby;
  const hasRfpLinks = isSubmission || isRfp;
  if (!hasRfpLinks) return null;
  return isSubmission ? [proposal.linkto] : proposal.linkedfrom;
};

export function useProposal(token, threadParentID) {
  const tokenShort = shortRecordToken(token);
  const onFetchProposalDetails = useAction(act.onFetchProposalDetails);
  const onFetchProposalsBatch = useAction(act.onFetchProposalsBatch);
  const onFetchProposalsVoteSummary = useAction(
    act.onFetchProposalsBatchVoteSummary
  );
  const proposalSelector = useMemo(
    () => sel.makeGetProposalByToken(tokenShort),
    [tokenShort]
  );
  const proposal = useSelector(proposalSelector);
  const proposals = useSelector(sel.proposalsByToken);
  const voteSummaries = useSelector(sel.summaryByToken);
  const loadingVoteSummary = useSelector(sel.isApiRequestingVoteSummary);
  const rfpLinks = getProposalRfpLinksTokens(proposal);
  const isRfp = proposal && !!proposal.linkby;
  const isSubmission = proposal && !!proposal.linkto;
  const { currentUser } = useLoaderContext();
  const isCurrentUserProposalAuthor =
    currentUser && proposal && currentUser.userid === proposal.userid;

  const unfetchedProposalTokens =
    rfpLinks &&
    difference(
      rfpLinks.map((r) => shortRecordToken(r)),
      keys(proposals)
    );
  const unfetchedSummariesTokens = getUnfetchedVoteSummaries(
    proposal,
    voteSummaries,
    isSubmission
  );
  const rfpSubmissions = rfpLinks &&
    proposal.linkby && {
      proposals: values(
        pick(
          proposals,
          rfpLinks.map((l) => shortRecordToken(l))
        )
      ),
      voteSummaries: pick(
        voteSummaries,
        rfpLinks.map((l) => shortRecordToken(l))
      )
    };

  const isMissingDetails = !(proposal && getDetailsFile(proposal.files));
  const isMissingVoteSummary = !voteSummaries[tokenShort];
  const needsInitialFetch = token && isMissingDetails;

  const [remainingTokens, setRemainingTokens] = useState(
    unfetchedProposalTokens
  );
  const hasRemainingTokens = !isEmpty(remainingTokens);

  const initialValues = {
    status: "idle"
  };

  const [state, send, { FETCH, RESOLVE, VERIFY, REJECT }] = useFetchMachine({
    actions: {
      initial: () => {
        if (needsInitialFetch) {
          onFetchProposalDetails(token)
            .then((res) => {
              const hasToFetchRfpLinks = getProposalRfpLinksTokens(
                parseRawProposal(res)
              );
              setRemainingTokens(hasToFetchRfpLinks);
              send(VERIFY);
            })
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        return send(VERIFY);
      },
      load: () => {
        if (
          (token && !proposal) ||
          !isEmpty(unfetchedSummariesTokens) ||
          (proposal &&
            rfpLinks &&
            (hasRemainingTokens || !isEmpty(unfetchedSummariesTokens)))
        ) {
          return;
        }
        return send(VERIFY);
      },
      verify: () => {
        if (hasRemainingTokens) {
          const [tokensBatch, next] =
            getTokensForProposalsPagination(remainingTokens);
          // Fetch summaries and count only if the proposal is a RFP.
          // If it is a submission, just grab the records info.
          onFetchProposalsBatch(tokensBatch, isRfp, undefined, !isSubmission)
            .then(() => {
              setRemainingTokens(next);
              return send(VERIFY);
            })
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        if (
          (!isEmpty(unfetchedSummariesTokens) || isMissingVoteSummary) &&
          proposal?.state === PROPOSAL_STATE_VETTED &&
          !loadingVoteSummary
        ) {
          onFetchProposalsVoteSummary(unfetchedSummariesTokens)
            .then(() => send(VERIFY))
            .catch((e) => send(REJECT, e));
          return send(FETCH);
        }
        if (rfpLinks && rfpSubmissions) {
          // is a RFP
          return send(RESOLVE, { proposal, rfpSubmissions });
        }
        return send(RESOLVE, { proposal });
      },
      done: () => {
        // verify proposal on proposal changes
        // TODO: improve this in the future so we don't need to verify once
        // it should be done.
        if (!isEqual(state.proposal, proposal)) {
          return send(VERIFY);
        }
      }
    },
    initialValues
  });

  const proposalWithLinks = getProposalRfpLinks(
    state.proposal,
    state.rfpSubmissions,
    proposals
  );

  return {
    proposal: proposalWithLinks,
    error: state.error,
    loading: state.status === "idle" || state.status === "loading",
    threadParentID,
    isCurrentUserProposalAuthor
  };
}

export function useComments(recordToken, proposalState) {
  const { enableCommentVote, recordType, constants } = useConfig();

  const errorSelector = or(
    sel.apiProposalCommentsError,
    sel.apiInvoiceCommentsError,
    sel.apiDccCommentsError,
    sel.apiLikeCommentsError,
    sel.apiCommentsLikesError
  );
  const error = useSelector(errorSelector);
  const commentsSelector = useMemo(
    () => sel.makeGetRecordComments(recordToken),
    [recordToken]
  );
  const commentsLikesSelector = useMemo(
    () => sel.makeGetRecordCommentsLikes(recordToken),
    [recordToken]
  );
  const commentsVotesSelector = useMemo(
    () => sel.makeGetRecordCommentsVotes(recordToken),
    [recordToken]
  );
  const lastVisitTimestampSelector = useMemo(
    () => sel.makeGetLastAccessTime(recordToken),
    [recordToken]
  );
  const comments = useSelector(commentsSelector);
  const commentsLikes = useSelector(commentsLikesSelector);
  const commentsVotes = useSelector(commentsVotesSelector);
  const lastVisitTimestamp = useSelector(lastVisitTimestampSelector);
  const loading = useSelector(sel.isApiRequestingComments);
  const loadingLikes = useSelector(sel.isApiRequestingCommentsLikes);
  const onSubmitComment = useAction(
    recordType === constants.RECORD_TYPE_DCC
      ? act.onSaveNewDccComment
      : act.onSaveNewComment
  );
  const onFetchComments = useAction(
    recordType === constants.RECORD_TYPE_PROPOSAL
      ? act.onFetchProposalComments
      : recordType === constants.RECORD_TYPE_DCC
      ? act.onFetchDccComments
      : act.onFetchInvoiceComments
  );
  const onFetchLikes = useAction(act.onFetchLikedComments);
  const onCommentVoteAction = useAction(act.onCommentVote);
  const onCensorComment = useAction(act.onCensorComment);

  const { currentUser } = useLoaderContext();
  const userid = currentUser && currentUser.userid;
  const email = currentUser && currentUser.email;

  const userLoggedIn = !!email;

  // comments are not public on cms. User needs to be logged in
  const isProposal = recordType === constants.RECORD_TYPE_PROPOSAL;
  const needsToFetchComments = isProposal
    ? !!recordToken && !comments
    : !!recordToken && !comments && userLoggedIn;

  const needsToFetchCommentsLikes =
    !!recordToken &&
    !commentsLikes &&
    enableCommentVote &&
    userLoggedIn &&
    proposalState === PROPOSAL_STATE_VETTED;

  useEffect(
    function handleFetchOfComments() {
      if (needsToFetchComments) {
        onFetchComments(recordToken);
      }
    },
    [onFetchComments, needsToFetchComments, recordToken]
  );

  useEffect(
    function handleFetchOfLikes() {
      if (needsToFetchCommentsLikes) {
        onFetchLikes(recordToken, userid);
      }
    },
    [onFetchLikes, needsToFetchCommentsLikes, recordToken, userid]
  );

  const onCommentVote = useCallback(
    (commentID, action, token) => {
      onCommentVoteAction(userid, token, commentID, action, proposalState);
    },
    [onCommentVoteAction, userid, proposalState]
  );

  const getCommentLikeOption = useCallback(
    (commentID) => {
      const option = commentsLikes && commentsLikes[commentID];
      return option ? option : 0;
    },
    [commentsLikes]
  );

  const getCommentVotes = useCallback(
    (commentID) => commentsVotes && commentsVotes[commentID],
    [commentsVotes]
  );

  const authorUpdateIds = comments
    ?.filter(({ extradatahint }) => extradatahint === PROPOSAL_UPDATE_HINT)
    .map(({ commentid }) => commentid);

  // Calculate comments tree for each author update to display each
  // one of them in a separate comments section.
  const commentsWithAuthorUpdatesMap = useMemo(() => {
    const commentsMap = {};
    let authorUpdateThreads = [];
    if (authorUpdateIds) {
      authorUpdateIds.forEach((updateId) => {
        const authorUpdateTree = calculateAuthorUpdateTree(updateId, comments);
        authorUpdateThreads = [...authorUpdateThreads, ...authorUpdateTree];
        commentsMap[updateId] = comments.filter(({ commentid }) =>
          authorUpdateTree.includes(commentid)
        );
      });
      commentsMap[PROPOSAL_MAIN_THREAD_KEY] = comments.filter(
        ({ commentid }) => !authorUpdateThreads.includes(commentid)
      );
    }
    return commentsMap;
  }, [authorUpdateIds, comments]);

  return {
    comments: authorUpdateIds ? commentsWithAuthorUpdatesMap : comments,
    onCommentVote,
    onCensorComment,
    getCommentLikeOption,
    enableCommentVote,
    userLoggedIn,
    userEmail: email,
    recordType,
    currentUser,
    lastVisitTimestamp,
    loading,
    loadingLikes,
    onSubmitComment,
    error,
    getCommentVotes,
    authorUpdateIds,
    latestAuthorUpdateId: authorUpdateIds && authorUpdateIds[0]
  };
}
