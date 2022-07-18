import { useMemo } from "react";
import { useConfig } from "src/containers/Config";
import { getProposalUrl, getCommentsUrl, getAuthorUrl } from "../helpers";
import { PROPOSAL_STATE_VETTED } from "src/constants";

export default function useProposalURLs(
  proposalToken,
  userid,
  isRfpSubmission,
  linkto
) {
  const { javascriptEnabled } = useConfig();
  const proposalURL = getProposalUrl(proposalToken, javascriptEnabled);
  const commentsURL = useMemo(
    () => getCommentsUrl(proposalToken, javascriptEnabled),
    [javascriptEnabled, proposalToken]
  );
  const authorURL = useMemo(
    () => getAuthorUrl(userid, javascriptEnabled),
    [userid, javascriptEnabled]
  );
  const rfpProposalURL = useMemo(() => {
    return (
      isRfpSubmission &&
      linkto &&
      getProposalUrl(linkto, javascriptEnabled, PROPOSAL_STATE_VETTED)
    );
  }, [isRfpSubmission, javascriptEnabled, linkto]);

  return {
    proposalURL,
    authorURL,
    commentsURL,
    rfpProposalURL
  };
}
