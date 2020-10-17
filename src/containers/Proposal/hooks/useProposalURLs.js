import { useMemo } from "react";
import { useConfig } from "src/containers/Config";
import { getProposalUrl, getCommentsUrl, getAuthorUrl } from "../helpers";
import { PROPOSAL_STATE_VETTED } from "src/constants";

export default function useProposalURLs(
  proposalToken,
  userid,
  isRfpSubmission,
  linkto,
  state
) {
  const { javascriptEnabled } = useConfig();

  const proposalURL = useMemo(
    () => getProposalUrl(proposalToken, javascriptEnabled, state),
    [proposalToken, javascriptEnabled, state]
  );
  const commentsURL = useMemo(
    () => getCommentsUrl(proposalToken, javascriptEnabled, state),
    [javascriptEnabled, proposalToken, state]
  );
  const authorURL = useMemo(() => getAuthorUrl(userid, javascriptEnabled), [
    userid,
    javascriptEnabled
  ]);
  const rfpProposalURL = useMemo(
    () =>
      isRfpSubmission &&
      getProposalUrl(linkto, javascriptEnabled, PROPOSAL_STATE_VETTED),
    [isRfpSubmission, javascriptEnabled, linkto]
  );

  return { proposalURL, authorURL, commentsURL, rfpProposalURL };
}
