import React from "react";
import currentUserConnector from "../../connectors/currentUser";
import UnvettedPage from "../ProposalUnvetted";

const AdminLanding = ({ loggedInAs, isAdmin }) =>
  <div className="page admin-landing-page">
    <div>
      This is the admin landing page, only accessible by an admin<br />
      The current user is: <br />
      email {loggedInAs}<br />
      admin: {isAdmin ? "Yes" : "No"}
    </div>
    <hr />
    <UnvettedPage />
  </div>;

export default currentUserConnector(AdminLanding);
