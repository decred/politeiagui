import { h } from "preact";
import submitConnector from "../../connectors/submitProposal";
import SubmitPage from "./Page";
import SuccessPage from "./Success";
import RequireLogin from "../../components/RequireLogin";
import style from "./style";

const Submit = ({ token, ...props }) =>
  <div class={style.submitProposal}>
    <RequireLogin>
      {token
        ? <SuccessPage {...{ ...props, token }} />
        : <SubmitPage {...props} />}
    </RequireLogin>
  </div>;

export default submitConnector(Submit);
