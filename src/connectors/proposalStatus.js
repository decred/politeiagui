import { connect } from "react-redux";
import * as act from "../actions";
import * as sel from "../selectors";

export default connect(
  sel.selectorMap({
    newStatusProposal: sel.setStatusProposal
  }),
  { onSubmitStatusProposal: act.onSubmitStatusProposal }
);
