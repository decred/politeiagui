import { useEffect } from "react";
import { records } from "./";
import { useSelector, useDispatch } from "react-redux";

export function useFetchRecords({ inventoryStatus, inventory }) {
  const dispatch = useDispatch();
  const recordsStatus = useSelector(records.selectStatus);
  useEffect(() => {
    if (recordsStatus === "idle" && inventoryStatus === "succeeded") {
      const obj = inventory;
      dispatch(records.fetch(obj));
    }
  }, [recordsStatus, dispatch, inventory, inventoryStatus]);
  return { status: recordsStatus };
}
