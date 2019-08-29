import * as act from "src/actions";
import { useRedux } from "src/redux";
import * as sel from "src/selectors";

const mapStateToProps = {
  searchResult: sel.apiUserSearchResponse
};

const mapDispatchToProps = {
  onSearchUser: act.onSearchUser
};

export function useSearchUser(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  return fromRedux;
}
