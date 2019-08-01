import { useState, useEffect } from "react";
import { useLoaderContext } from "src/Appv2/Loader";
import * as pki from "src/lib/pki";

const IDENTITY_NOT_FOUND =
  "Failed to load user identity. You need tor restore it from a backup or generate a new one.";
const IDENTITY_MISMATCH =
  "User identity doesn't match with the server identity.";

const useIdentity = () => {
  const [error, setError] = useState(null);
  const [identity, setIdentity] = useState(null);
  const { initDone, currentUser } = useLoaderContext();

  const userLoggedIn = initDone && !!currentUser;
  const userEmail = !!currentUser && currentUser.email;
  const userActivePublicKey = !!currentUser && currentUser.publickey;

  useEffect(() => {
    async function verifyIdentity() {
      try {
        const keys = await pki.getKeys(userEmail);

        if (!keys) {
          throw new Error(IDENTITY_NOT_FOUND);
        }

        const valid = keys.publicKey === userActivePublicKey;
        setIdentity({
          ...keys,
          valid
        });

        if (!valid) {
          throw new Error(IDENTITY_MISMATCH);
        }
      } catch (e) {
        setError(e);
      }
    }

    if (userLoggedIn) {
      verifyIdentity();
    }
  }, [userLoggedIn, userEmail, userActivePublicKey]);

  return [identity, error];
};

export default useIdentity;
