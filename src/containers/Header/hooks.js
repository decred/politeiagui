import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";

const mapStateToProps = {
  username: sel.loggedInAsUsername
};

const mapDispatchToProps = {
  onLogout: act.onLogout
};

export function useHeader(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  return fromRedux;
}
