import * as act from "src/actions";
import { useRedux } from "src/redux";

const mapStateToProps = {};

const mapDispatchToProps = {
  onEditProposal: act.onEditProposal
};

export function useEditProposal(ownProps) {
  return useRedux(ownProps, mapStateToProps, mapDispatchToProps);
}
