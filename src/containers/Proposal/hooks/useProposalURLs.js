import { useMemo } from "react";
import { useConfig } from "src/containers/Config";
import { getProposalUrl, getCommentsUrl, getAuthorUrl } from "../helpers";
import { ARCHIVE_URL } from "src/constants";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";
import { PROPOSAL_STATE_VETTED } from "src/constants";

export default function useProposalURLs(
  proposalToken,
  userid,
  isRfpSubmission,
  linkto
) {
  const { javascriptEnabled } = useConfig();
  // TODO: remove legacy
  const legacyProposals = useSelector(sel.legacyProposals);
  const isLegacy = legacyProposals.includes(proposalToken);
  const proposalURL = !isLegacy
    ? getProposalUrl(proposalToken, javascriptEnabled, isLegacy)
    : `${ARCHIVE_URL}proposals/${proposalToken.substring(0, 7)}`;
  const commentsURL = useMemo(
    () =>
      !isLegacy
        ? getCommentsUrl(proposalToken, javascriptEnabled)
        : `${ARCHIVE_URL}proposals/${proposalToken.substring(
            0,
            7
          )}?scrollToComments=true`,
    [isLegacy, javascriptEnabled, proposalToken]
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

  return { isLegacy, proposalURL, authorURL, commentsURL, rfpProposalURL };
}
