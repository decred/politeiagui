import AuthenticatedRoute from "./AuthenticatedRoute";
import requireLoginConnector from "../../connectors/requireLogin";
import { withRouter } from "react-router-dom";

class AdminAuthenticatedRoute extends AuthenticatedRoute {
  componentDidMount() {
    if (!this.props.isAdmin) {
      this.props.history.replace({
        pathname: "/"
      });
      return;
    }
    super.componentDidMount();
  }
}

export default requireLoginConnector(withRouter(AdminAuthenticatedRoute));
