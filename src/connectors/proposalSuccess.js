import { connect } from "react-redux";
import { onResetProposal } from "../actions";

const proposalSuccessConnector = connect(null, { onResetProposal });

export default proposalSuccessConnector;
