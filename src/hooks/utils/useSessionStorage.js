import { useState, useCallback } from "react";
import useEventListener from "./useEventListener";

const setSessionStorageValue = (key, value) => {
  const serializedValue = JSON.stringify(value);
  sessionStorage.setItem(key, serializedValue);
};

const getSessionStorageValue = (key) => {
  const serializedState = sessionStorage.getItem(key);
  return JSON.parse(serializedState);
};

export default function useSessionStorage(key, initialValue) {
  const [error, setError] = useState(null);

  // initialize the state value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return getSessionStorageValue(key) || initialValue;
    } catch (e) {
      setError(e);
      return initialValue;
    }
  });

  const onSetValue = useCallback(
    (newValue) => {
      try {
        setSessionStorageValue(key, newValue);
        setStoredValue(newValue);
      } catch (e) {
        setError(e);
      }
    },
    [key, setError]
  );

  const onStorageChange = useCallback(
    (event) => {
      if (event.key !== key) {
        return;
      }

      if (event.newValue !== event.oldValue) {
        try {
          const parsedValue = JSON.parse(event.newValue);
          setStoredValue(parsedValue);
        } catch (e) {
          setError(e);
        }
      }
    },
    [key, setStoredValue, setError]
  );

  useEventListener("session", onStorageChange);
  if (error) console.log(error);

  return [storedValue, onSetValue, error];
}
