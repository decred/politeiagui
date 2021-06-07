import React from "react";
import RawProposal from "src/components/Proposal/RawProposal";
import { withRouter } from "react-router-dom";

/** The raw markdown proposal page was created to match the behavior of
 * "view raw" from github where the raw markdown is opened in a new tab.
 * We considered the option to render it in place with a toggle but decided to
 * go with the former because people are already used to it and we believe it
 * will translate to better UX.
 */
const RawProposalPage = (props) => <RawProposal {...props} />;

export default withRouter(RawProposalPage);
