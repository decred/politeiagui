import { useEffect, useState } from "react";
import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory } from "../proposalsList/actions";

function useVoteInventory({ status }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  function onFetchNextInventoryPage() {
    setPage(page + 1);
  }

  const inventoryError = useSelector(ticketvoteInventory.selectError);
  const inventoryStatus = useSelector((state) =>
    ticketvoteInventory.selectStatus(state, { status })
  );
  const inventory = useSelector((state) =>
    ticketvoteInventory.selectByStatus(state, status)
  );

  useEffect(() => {
    dispatch(fetchInventory({ status, page }));
  }, [status, page, dispatch]);

  return {
    onFetchNextInventoryPage,
    inventory,
    inventoryError,
    inventoryStatus,
  };
}

export default useVoteInventory;
