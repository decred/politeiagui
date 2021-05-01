// TODO: remove legacy
import { useEffect, useState } from "react";
import {
  PROPOSAL_VOTING_APPROVED,
  PROPOSAL_VOTING_REJECTED,
  PROPOSAL_VOTING_INELIGIBLE
} from "src/constants";
import legacyProposalsInfo from "src/legacyproposals.json";
import tokenInventory from "src/legacytokeninventory.json";

const mapOldToNewStatus = {
  // old public
  4: 2,
  // old abandoned
  6: 4
};

const newLegacyProposalsInfo = legacyProposalsInfo.proposals.map((p) => ({
  ...p,
  status: mapOldToNewStatus[p.status]
}));

const mapStatusToString = {
  [PROPOSAL_VOTING_APPROVED]: "approved",
  [PROPOSAL_VOTING_REJECTED]: "rejected",
  [PROPOSAL_VOTING_INELIGIBLE]: "abandoned"
};

export default function useLegacyVettedProposals(shouldReturn = false, status) {
  const [legacyProposals, setLegacyProposals] = useState([]);
  const [legacyProposalsTokens, setLegacyProposalsTokens] = useState({});
  useEffect(() => {
    console.log("----- useLegacyVettedProposals -------")
    // shouldReturn is a boolean to control when the proposals are done fetching so we can return the legacy props.
    if (shouldReturn) {
      const proposalsTokensList = 
        tokenInventory[mapStatusToString[status]] &&
        tokenInventory[mapStatusToString[status]]
        .map((token) => token.substring(0, 7));
      console.log("proposalsTokensList")
      console.log(proposalsTokensList)
      // filter propsals by tab and transform from Array to Object where the key is the proposal token and the value is the proposal info
      const finalList = newLegacyProposalsInfo
        .filter(
          (p) =>
            proposalsTokensList &&
            proposalsTokensList.includes(
              p.censorshiprecord.token.substring(0, 7)
            )
        )
        .reduce(
          (acc, cur) => ({ ...acc, [cur.censorshiprecord.token.substring(0, 7)]: cur }),
          {}
        );
      console.log("final list")
      console.log(finalList)
      setLegacyProposals(finalList);
      setLegacyProposalsTokens(tokenInventory);
    } else {
      setLegacyProposals([]);
      setLegacyProposalsTokens({});
    }
    console.log("----- ------------------------ -------")

  }, [legacyProposals.proposals, shouldReturn, status]);
  return { legacyProposals, legacyProposalsTokens };
}
