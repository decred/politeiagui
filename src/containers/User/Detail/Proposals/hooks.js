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

  useEffect(
    function handleFetchUserProposals() {
      if (!userProposals) {
        onFetchUserProposals(userID);
      }
    },
    [onFetchUserProposals, userID, userProposals]
  );

  useEffect(
    function handleCachingProposals() {
      const needsCaching =
        (!userProposals && !!proposals) ||
        (userProposals &&
          !!proposals &&
          proposals.length > userProposals.length);
      if (needsCaching) {
        setUserProposals(proposals);
      }
    },
    [proposals, userProposals, setUserProposals]
  );

  return { proposals: userProposals, loading };
}
