import { connect } from "react-redux";
import * as act from "../actions";

const verifyConnector = connect(null, { onVerify: act.onVerifyNewUser });

export default verifyConnector;
