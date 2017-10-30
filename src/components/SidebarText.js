import React from "react";
import { Markdown, Loading } from "./snew";
import connector from "../connectors/sidebar";

const text = `
# Error there was an error loading the sidebar text.

You should set an environment variable to point to the correct proposal

    set REACT_APP_SIDEBAR="censorshiptoken"


`;

const SidebarText = connector((props) => props.isLoading ? <Loading /> : (
  <Markdown body={props.markdown || text} {...props} />)
);
export default SidebarText;
