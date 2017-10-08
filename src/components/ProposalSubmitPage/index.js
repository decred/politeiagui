import React from "react";
import submitConnector from "../../connectors/submitProposal";
import SubmitPage from "./Page";
import SuccessPage from "./Success";
import RequireLogin from "../RequireLogin";

const Submit = ({ token, ...props }) =>
  <div className="page proposal-submit-page">
    <RequireLogin>
      {token
        ? <SuccessPage {...{ ...props, token }} />
        : <SubmitPage {...props} />}
    </RequireLogin>
  </div>;

export default submitConnector(Submit);
