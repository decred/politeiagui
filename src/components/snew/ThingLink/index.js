import React from "react";
import { withRouter } from "react-router-dom";
import thingLinkConnector from "../../../connectors/thingLink";
import ThingLinkProposal from "./ThingLinkProposal";
import ThingLinkInvoice from "./ThingLinkInvoice";

const ThingLink = ({ isCMS, ...props }) => {
  return isCMS ? (
    <ThingLinkInvoice {...props} />
  ) : (
    <ThingLinkProposal {...props} />
  );
};

export default withRouter(thingLinkConnector(ThingLink));
