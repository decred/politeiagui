import React from "react"
import { Sidebar } from "snew-classic-ui";
import connector from "../../connectors/actions";

const CustomSidebar = ({ loggedInAs, ...props }) => (
  <Sidebar {...{ ...props, username: loggedInAs }} />
);

export default connector(CustomSidebar);
