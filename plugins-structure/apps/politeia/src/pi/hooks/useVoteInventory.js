import { ticketvoteInventory } from "@politeiagui/ticketvote/inventory";
import { useSelector } from "react-redux";

function useVoteInventory({ status }) {
  const inventoryError = useSelector(ticketvoteInventory.selectError);
  const inventoryStatus = useSelector((state) =>
    ticketvoteInventory.selectStatus(state, { status })
  );
  const inventory = useSelector((state) =>
    ticketvoteInventory.selectByStatus(state, status)
  );

  return {
    inventory,
    inventoryError,
    inventoryStatus,
  };
}

export default useVoteInventory;
