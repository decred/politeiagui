import React from "react";
import submitConnector from "../../connectors/submitProposal";
import SubmitPage from "./Page";
import SuccessPage from "./Success";

const Submit = ({ token, ...props }) =>
  <div className="page proposal-submit-page">
    {token
      ? <SuccessPage {...{ ...props, token }} />
      : <SubmitPage {...props} />}
  </div>;

export default submitConnector(Submit);
