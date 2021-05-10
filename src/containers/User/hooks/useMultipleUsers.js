import { useMemo, useEffect, useState } from "react";
import difference from "lodash/difference";
import * as act from "src/actions";
import { useAction, useSelector } from "src/redux";
import * as sel from "src/selectors";

export default function useMultipleUsers(userIDs) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const onFetchUser = useAction(act.onFetchUser);
  const usersSelector = useMemo(
    () => sel.makeGetUsersByArrayOfIDs(userIDs),
    [userIDs]
  );
  const users = useSelector(usersSelector);
  const userIDsToBeFeched = useMemo(() => {
    const idsFromState = Object.keys(users);
    return difference(userIDs, idsFromState);
  }, [users, userIDs]);

  useEffect(() => {
    async function fetchAllUsers(userIdsToFetch) {
      try {
        setLoading(true);
        const promises = userIdsToFetch.map((userID) => onFetchUser(userID));
        await Promise.all(promises);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        setError(e);
      }
    }

    if (!loading && !!userIDsToBeFeched.length) {
      fetchAllUsers(userIDsToBeFeched);
    }
  }, [userIDsToBeFeched, loading, onFetchUser]);

  return [users, loading, error];
}
