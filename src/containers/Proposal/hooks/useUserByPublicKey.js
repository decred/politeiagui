import { useEffect } from "react";
import { useSelector, useAction } from "src/redux";
import * as sel from "src/selectors";
import * as act from "src/actions";

export default function useUserByPublicKey({ userPubKey, fetch = true }) {
  const onSearchUser = useAction(act.onSearchUser);
  const resultsByPk = useSelector(sel.queryResultsByPublicKey);
  const resultsByID = useSelector(sel.searchResultsByID);
  const userID = userPubKey && resultsByPk[userPubKey];
  const user = userID && resultsByID[userID];
  const { username } = user || {};
  const isLoadingUser = useSelector(sel.isApiRequestingUserSearch);
  const fetchUser = userPubKey && !isLoadingUser && !user && fetch;

  useEffect(() => {
    if (fetchUser) onSearchUser({ publickey: userPubKey });
  });

  return {
    username
  };
}
