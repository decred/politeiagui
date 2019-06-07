import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";

const mapStateToProps = {
  user: sel.apiMeResponse
};

const mapDispatchToProps = {
  onLogout: act.onLogout
};

export function useHeader(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);
  return fromRedux;
}
