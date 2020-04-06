import { useEffect } from "react";
import debounce from "lodash/debounce";
import { useFormikContext } from "formik";

const DEBOUNCE_DELAY = 300;

const saveData = debounce((key, data) => {
  window.sessionStorage.setItem(key, JSON.stringify(data));
}, DEBOUNCE_DELAY);

const getData = (key) => {
  const data = window.sessionStorage.getItem(key);
  return data ? JSON.parse(data) : undefined;
};

const Persist = ({ name }) => {
  const { values, setValues } = useFormikContext();
  useEffect(() => {
    const data = getData(name);
    if (data) {
      setValues(data);
    }
  }, [name, setValues]);

  useEffect(() => {
    saveData(name, values);
  });

  return null;
};

export default Persist;
