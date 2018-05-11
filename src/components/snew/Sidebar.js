import React from "react";
import { Sidebar } from "snew-classic-ui";
import connector from "../../connectors/actions";

const CustomSidebar = ({ loggedInAsEmail, ...props }) => (
  <Sidebar {...{ ...props, username: loggedInAsEmail }} />
);

export default connector(CustomSidebar);
