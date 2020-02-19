import * as act from "src/actions";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";

export function useSearchUser() {
  const searchResult = useSelector(sel.apiUserSearchResponse);
  const onSearchUser = useAction(act.onSearchUser);

  return { searchResult, onSearchUser };
}
