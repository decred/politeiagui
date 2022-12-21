import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "@politeiagui/core/globalServices";

export default function useToast() {
  const dispatch = useDispatch();
  const { title, body, kind } = useSelector(message.select);

  // Wrapps on useCallback to prevent clearToast effect renders
  const openToast = useCallback(
    ({ title, body, kind }) => {
      dispatch(message.set({ title, body, kind }));
    },
    [dispatch]
  );
  const clearToast = useCallback(() => {
    dispatch(message.clear());
  }, [dispatch]);

  return { openToast, clearToast, title, body, kind };
}
