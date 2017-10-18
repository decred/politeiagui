import { connect } from "react-redux";
import * as sel from "../selectors";

const proposalNewConnector = connect(
  sel.selectorMap({
    newProposalError: sel.newProposalError,
  }),
);

export default proposalNewConnector;
