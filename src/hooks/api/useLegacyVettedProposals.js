// TODO: remove legacy
import { useEffect, useState } from "react";
import * as external_api from "src/lib/external_api";
import { PROPOSAL_VOTING_APPROVED, PROPOSAL_VOTING_REJECTED, PROPOSAL_VOTING_INELIGIBLE } from "src/constants";
import legacyProposalsInfo from "src/legacyproposals.json";

const mapOldToNewStatus = {
  // old public
  4: 2,
  // old abandoned
  6: 4
};

const newLegacyProposalsInfo = legacyProposalsInfo.proposals.map(p => ({ ...p, status: mapOldToNewStatus[p.status] }));

const mapStatusToString = {
  [PROPOSAL_VOTING_APPROVED]: "approved",
  [PROPOSAL_VOTING_REJECTED]: "rejected",
  [PROPOSAL_VOTING_INELIGIBLE]: "abandoned"
};

export default function useLegacyVettedProposals(shouldReturn, status) {
  const [legacyProposals, setLegacyProposals] = useState([]);
  const [legacyProposalsTokens, setLegacyProposalsTokens] = useState({});
  useEffect(() => {
    if (shouldReturn) {
    external_api.getLegacyVettedProposals().then((res) => {
      const proposalsTokensList = res[mapStatusToString[status]];
      const finalList = newLegacyProposalsInfo.filter(p => proposalsTokensList && proposalsTokensList.includes(p.censorshiprecord.token)).reduce((acc, cur) => ({ ...acc, [cur.censorshiprecord.token]: cur }), {});
      setLegacyProposals(finalList);
      setLegacyProposalsTokens(res);
    });
    } else {
      setLegacyProposals([]);
      setLegacyProposalsTokens({});
    }
  }, [legacyProposals.proposals, shouldReturn, status]);
  return { legacyProposals, legacyProposalsTokens };
}
