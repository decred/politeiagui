import { recordsInventory } from "@politeiagui/core/records/inventory";
import { useSelector } from "react-redux";

function useUserInventory({ userid }) {
  const inventory = useSelector((state) =>
    recordsInventory.selectUserInventory(state, userid)
  );
  const inventoryStatus = useSelector(recordsInventory.selectUserStatus);

  return {
    inventory,
    inventoryStatus,
  };
}

export default useUserInventory;
