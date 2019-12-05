import { useState, useCallback } from "react";
import useEventListener from "./useEventListener";

const setLocalStorageValue = (key, value) => {
  const serializedValue = JSON.stringify(value);
  localStorage.setItem(key, serializedValue);
};

const getLocalStorageValue = (key) => {
  const serializedState = localStorage.getItem(key);
  return JSON.parse(serializedState);
};

export default function useLocalStorage(key, initialValue) {
  const [error, setError] = useState(null);

  // initialize the state value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return getLocalStorageValue(key) || initialValue;
    } catch (e) {
      setError(e);
      return initialValue;
    }
  });

  const onSetValue = useCallback(
    (newValue) => {
      try {
        setLocalStorageValue(key, newValue);
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

  useEventListener("storage", onStorageChange);
  if (error) console.log(error);

  return [storedValue, onSetValue, error];
}
