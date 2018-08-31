import React from "react";
import { Sidebar } from "snew-classic-ui";
import actionsConnector from "../../connectors/actions";

const CustomSidebar = ({ loggedInAsEmail, ...props }) => (
  <Sidebar {...{ ...props, username: loggedInAsEmail }} />
);

export default actionsConnector(CustomSidebar);
