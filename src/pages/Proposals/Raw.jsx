import React from "react";
import RawProposal from "src/components/Proposal/RawProposal";
import { withRouter } from "react-router-dom";

const RawProposalPage = (props) => <RawProposal {...props} />;

export default withRouter(RawProposalPage);
