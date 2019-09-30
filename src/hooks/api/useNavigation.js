import * as act from "src/actions";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";

const mapStateToProps = {
  username: sel.loggedInAsUsername,
  user: sel.apiMeResponse,
  proposalCredits: sel.proposalCreditsV2
};

const mapDispatchToProps = {
  onLogout: act.onLogout,
  handleLogout: act.handleLogout
};

export default function useNavigation(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  return fromRedux;
}
