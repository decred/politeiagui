import { h } from "preact";
import currentUserConnector from "../../connectors/currentUser";

const CurrentUser = ({ loggedInAs, onLogout }) => (
  <div className={"curren-user"}>
    Logged in as: <span>{loggedInAs}</span>
    <button onClick={onLogout}>Logout</button>
  </div>
);

export default currentUserConnector(CurrentUser);
