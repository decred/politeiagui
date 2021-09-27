import { useEffect } from "react";
import { fetchRecords, selectRecordsStatus } from "../records/recordsSlice";
import { useSelector, useDispatch } from "react-redux";

export function useFetchRecords({ inventoryStatus, inventory }) {
  const dispatch = useDispatch();
  const recordsStatus = useSelector(selectRecordsStatus);
  useEffect(() => {
    if (recordsStatus === "idle" && inventoryStatus === "succeeded") {
      const obj = inventory;
      dispatch(fetchRecords(obj));
    }
  }, [recordsStatus, dispatch, inventory, inventoryStatus]);
  return { status: recordsStatus };
}
