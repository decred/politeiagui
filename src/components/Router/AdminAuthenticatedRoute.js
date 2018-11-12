import AuthenticatedRoute from "./AuthenticatedRoute";
import requireLoginConnector from "../../connectors/requireLogin";
import { withRouter } from "react-router-dom";

class AdminAuthenticatedRoute extends AuthenticatedRoute {
  componentDidUpdate() {
    const { apiMeResponse, apiLoginResponse, isAdmin } = this.props;
    const dataHasBeenFetched = apiMeResponse || apiLoginResponse;
    if (dataHasBeenFetched && !isAdmin) {
      this.props.history.replace({
        pathname: "/"
      });
      return;
    }
  }
}

export default requireLoginConnector(withRouter(AdminAuthenticatedRoute));
