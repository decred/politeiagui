import { h } from "preact";
import currentUserConnector from "../../connectors/currentUser";

const CurrentUser = ({ loggedInAs, onLogout }) => (
  <fieldset className={"curren-user"}>
    Logged in as: <span>{loggedInAs}</span>
    <button onClick={onLogout}>Logout</button>
  </fieldset>
);

export default currentUserConnector(CurrentUser);
