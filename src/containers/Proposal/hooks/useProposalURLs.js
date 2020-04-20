import { useMemo } from "react";
import { useConfig } from "src/containers/Config";
import { getProposalUrl, getCommentsUrl, getAuthorUrl } from "../helpers";

export default function useProposalURLs(
  proposalToken,
  userid,
  isRfpSubmission,
  linkto
) {
  const { javascriptEnabled } = useConfig();

  const proposalURL = useMemo(
    () => getProposalUrl(proposalToken, javascriptEnabled),
    [proposalToken, javascriptEnabled]
  );
  const commentsURL = useMemo(
    () => getCommentsUrl(proposalToken, javascriptEnabled),
    [proposalToken, javascriptEnabled]
  );
  const authorURL = useMemo(() => getAuthorUrl(userid, javascriptEnabled), [
    userid,
    javascriptEnabled
  ]);
  const rfpProposalURL = useMemo(
    () => isRfpSubmission && getProposalUrl(linkto, javascriptEnabled),
    [isRfpSubmission, javascriptEnabled, linkto]
  );

  return { proposalURL, authorURL, commentsURL, rfpProposalURL };
}
