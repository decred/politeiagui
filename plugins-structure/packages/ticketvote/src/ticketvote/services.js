import { pluginServices as timestampsServices } from "./timestamps/services";
import { pluginServices as inventoryServices } from "./inventory/services";
import { pluginServices as summariesServices } from "./summaries/services";
import { pluginServices as submissionsServices } from "./submissions/services";

export const pluginServices = [
  ...timestampsServices,
  ...inventoryServices,
  ...summariesServices,
  ...submissionsServices,
];
