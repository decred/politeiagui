import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApi, selectApi, selectApiStatus } from "./apiSlice";

export function useFetchApi() {
  const dispatch = useDispatch();
  const status = useSelector(selectApiStatus);
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchApi());
    }
  }, [status, dispatch]);
  const api = useSelector(selectApi);
  return { api, status };
}
