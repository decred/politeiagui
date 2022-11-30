import { recordsInventory } from "@politeiagui/core/records/inventory";
import { useSelector } from "react-redux";

function useRecordsInventory({ status, recordsState }) {
  const inventoryStatus = useSelector((state) =>
    recordsInventory.selectStatus(state, { status, recordsState })
  );
  const inventory = useSelector((state) =>
    recordsInventory.selectByStateAndStatus(state, { status, recordsState })
  );

  return {
    inventory,
    inventoryStatus,
  };
}

export default useRecordsInventory;
