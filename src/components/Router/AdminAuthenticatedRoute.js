import AuthenticatedRoute from "./AuthenticatedRoute";

class AdminAuthenticatedRoute extends AuthenticatedRoute {
  componentDidMount() {
    if (!this.props.isAdmin) {
      return;
    }

    super.componentDidMount();
  }
}

export default AdminAuthenticatedRoute;
