import { useMemo, useEffect } from "react";
import unionBy from "lodash/unionBy";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import * as sel from "src/selectors";

export function useReactiveSearchUser(email, username) {
  const onSearchUser = useAction(act.onSearchUser);
  const resultForEmailSelector = useMemo(
    () => sel.makeGetSearchResultsByEmail(email),
    [email]
  );
  const resultForUsernameSelector = useMemo(
    () => sel.makeGetSearchResultsByUsername(username),
    [username]
  );
  const resultsForEmail = useSelector(resultForEmailSelector);
  const resultsForUsername = useSelector(resultForUsernameSelector);

  useEffect(() => {
    if (!!email && !resultsForEmail) {
      onSearchUser({ email });
    }
  }, [email, resultsForEmail, onSearchUser]);

  useEffect(() => {
    if (!!username && !resultsForUsername) {
      onSearchUser({ username });
    }
  }, [username, resultsForUsername, onSearchUser]);

  return unionBy(resultsForUsername, resultsForEmail, "id");
}

export function useSearchUser() {
  const searchResult = useSelector(sel.searchResults);
  const onSearchUser = useAction(act.onSearchUser);

  return { searchResult, onSearchUser };
}
