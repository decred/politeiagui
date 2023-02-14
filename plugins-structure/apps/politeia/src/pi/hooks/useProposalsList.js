import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory, fetchNextBatch } from "../proposalsList/actions";
import {
  selectListFetchStatus,
  selectListPageSize,
} from "../proposalsList/selectors";

function useProposalsList({ status, recordsState, userid }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  function onFetchNextInventoryPage() {
    setPage(page + 1);
  }

  const listFetchStatus = useSelector(selectListFetchStatus);
  const listPageSize = useSelector(selectListPageSize);

  function onFetchNextBatch() {
    dispatch(fetchNextBatch({ status, recordsState, userid }));
  }

  useEffect(() => {
    dispatch(fetchInventory({ status, recordsState, page, userid }));
  }, [status, recordsState, page, dispatch, userid]);

  return {
    onFetchNextInventoryPage,
    onFetchNextBatch,
    listFetchStatus,
    listPageSize,
  };
}

export default useProposalsList;
