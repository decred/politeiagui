import * as act from "src/actions";
import * as sel from "src/selectors";
import { useRedux } from "src/redux";

const mapStateToProps = {
  username: sel.loggedInAsUsername,
  user: sel.apiMeResponse
};

const mapDispatchToProps = {
  onLogout: act.onLogout,
  handleLogout: act.handleLogout
};

export default function useNavigation(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  return fromRedux;
}
