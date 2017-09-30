import React from "react";
import currentUserConnector from "../../connectors/currentUser";

const CurrentUser = ({ loggedInAs, onLogout }) => (
  <fieldset className="current-user">
    Logged in as: <span>{loggedInAs}</span>
    <button onClick={onLogout}>Logout</button>
  </fieldset>
);

export default currentUserConnector(CurrentUser);
