import * as act from "src/actions";
import * as sel from "src/selectors";
import { useRedux } from "src/redux";
import { useCredits } from "src/containers/User/Detail/Credits/hooks.js";
import { useLoaderContext } from "src/Appv2/Loader";

const mapStateToProps = {
  username: sel.loggedInAsUsername,
  user: sel.apiMeResponse
};

const mapDispatchToProps = {
  onLogout: act.onLogout,
  handleLogout: act.handleLogout
};

export default function useNavigation(ownProps) {
  const { currentUser } = useLoaderContext();
  const { proposalCredits } = useCredits({ userid: currentUser.userid });
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  return { ...fromRedux, proposalCredits };
}
