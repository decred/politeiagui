import { useState } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import { useAction, useSelector } from "src/redux";
import head from "lodash/head";
import isEmpty from "lodash/fp/isEmpty";
import uniq from "lodash/uniq";
import useFetchMachine, {
  VERIFY,
  FETCH,
  REJECT,
  RESOLVE,
  START
} from "src/hooks/utils/useFetchMachine";
import { shortRecordToken } from "src/helpers";

// useProposalsStatusChangeUser receives a key-value object of proposals
// and a status. For all proposals that are in the passed in status, the
// hook adds a 'statuschangeusername' field to the proposal object, which
// corresponds to the username of the user that submitted the status change
// action to the server.
export default function useProposalsStatusChangeUser(proposals = {}, status) {
  const [publicKeys, setPublicKeys] = useState([]);
  const onSearchUser = useAction(act.onSearchUser);
  const resultsByPk = useSelector(sel.queryResultsByPublicKey);
  const resultsByID = useSelector(sel.searchResultsByID);

  // The public keys for the users we need to search for
  const unfetchedPublicKeys = uniq(
    Object.values(proposals).flatMap((prop) =>
      prop.status === status ? prop.statuschangepk : []
    )
  ).filter((pk) => pk && !resultsByPk[pk]);

  const hasPublicKeys = !isEmpty(publicKeys);
  const hasUnfetchedPublicKeys = !isEmpty(unfetchedPublicKeys);

  // Fetch users by public key
  const [state, send] = useFetchMachine({
    actions: {
      initial: () => send(START),
      start: () => {
        if (!hasUnfetchedPublicKeys) return send(RESOLVE);
        if (hasPublicKeys) return send(VERIFY);
        setPublicKeys(unfetchedPublicKeys);
        return send(VERIFY);
      },
      verify: () => {
        if (!hasPublicKeys) return send(RESOLVE);
        const pk = head(publicKeys);
        onSearchUser({ publickey: pk })
          .then(() => {
            setPublicKeys(publicKeys.filter((v) => v !== pk));
            return send(VERIFY);
          })
          .catch((e) => send(REJECT, e));
        return send(FETCH);
      },
      done: () => {}
    },
    initialValues: {
      status: "idle",
      loading: true,
      verifying: true
    }
  });

  // Restart machine if there are unfetched public keys left
  if (hasUnfetchedPublicKeys && state.status === "success") {
    send(START);
  }

  // Add statuschangeusername data to proposals that needs it
  const parsedProposals = Object.values(proposals)
    .map((prop) => {
      const userID = resultsByPk[prop?.statuschangepk];
      const user = resultsByID[userID];
      return prop.status === status
        ? {
            ...prop,
            statuschangeusername: user?.username
          }
        : prop;
    })
    .reduce(
      (acc, prop) => ({
        ...acc,
        [shortRecordToken(prop.censorshiprecord.token)]: prop
      }),
      {}
    );

  return {
    proposals: parsedProposals,
    loading: state.loading || state.verifying
  };
}
