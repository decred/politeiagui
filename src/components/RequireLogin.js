import { h } from "preact";
import Login from "./Login";
import requireLoginConnector from "../connectors/requireLogin";

const RequireLogin = ({ loggedInAs, children, message="A login is required" }) =>
  loggedInAs ? <div>{children}</div> : (
    <div>
      <h2>{message}</h2>
      <Login />
    </div>
  );


export default requireLoginConnector(RequireLogin);
