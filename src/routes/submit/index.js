import { h } from "preact";
import submitConnector from "../../connectors/submitProposal";
import SubmitPage from "./Page";
import SuccessPage from "./Success";

const Submit = ({ token, ...props }) =>
  token
    ? <SuccessPage {...{ ...props, token }} />
    : <SubmitPage {...props} />;

export default submitConnector(Submit);
