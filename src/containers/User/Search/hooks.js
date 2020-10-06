import { useMemo, useEffect, useState } from "react";
import unionBy from "lodash/unionBy";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import * as sel from "src/selectors";

const ERROR_MESSAGE = "unable to fetch users";

export function useReactiveSearchUser(email, username) {
  const onSearchUser = useAction(act.onSearchUser);
  const [error, setError] = useState();
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
      onSearchUser({ email }).catch(() => {
        setError(new Error(ERROR_MESSAGE));
      });
    }
  }, [email, resultsForEmail, onSearchUser]);

  useEffect(() => {
    if (!!username && !resultsForUsername) {
      onSearchUser({ username }).catch(() => {
        setError(new Error(ERROR_MESSAGE));
      });
    }
  }, [username, resultsForUsername, onSearchUser]);

  return { error, results: unionBy(resultsForUsername, resultsForEmail, "id") };
}

export function useSearchUser() {
  const searchResult = useSelector(sel.searchResults);
  const onSearchUser = useAction(act.onSearchUser);
  const isCMS = useSelector(sel.isCMS);

  return { searchResult, onSearchUser, isCMS };
}
