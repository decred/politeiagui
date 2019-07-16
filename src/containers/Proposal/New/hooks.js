import * as act from "src/actions";
import { useRedux } from "src/redux";

const mapStateToProps = {};

const mapDispatchToProps = {
  onSubmitProposal: act.onSaveNewProposalV2
};

export function useNewProposal(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  return fromRedux;
}
