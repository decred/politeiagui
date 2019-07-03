import { useEffect } from "react";
import { useRedux } from "src/redux";
import { or } from "src/lib/fp";
import * as act from "src/actions";
import * as sel from "src/selectors";

const mapStateToProps = {
  proposals: sel.getUserProposalsWithVoteStatus,
  loading: or(sel.userProposalsIsRequesting, sel.isApiRequestingPropsVoteStatus)
};
const mapDispatchToProps = {
  onFetchUserProposals: act.onFetchUserProposalsWithVoteStatus
};

export function useUserProposals(ownProps) {
  const { userID, userProposals, setUserProposals } = ownProps;
  const { onFetchUserProposals, proposals, loading } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

  useEffect(() => {
    if (!userProposals) {
      onFetchUserProposals(userID);
    }
  }, []);

  useEffect(() => {
    const proposalsFeched = !!proposals;
    const hasProposalsCached = userProposals && userProposals.length;
    if (proposalsFeched && !hasProposalsCached) {
      setUserProposals(proposals);
    }
  }, [proposals]);

  return { proposals: userProposals, loading };
}
