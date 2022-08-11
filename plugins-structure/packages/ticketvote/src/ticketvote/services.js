import { services as timestampsServices } from "./timestamps/services";
import { services as inventoryServices } from "./inventory/services";
import { services as summariesServices } from "./summaries/services";
import { services as submissionsServices } from "./submissions/services";

export const services = [
  ...timestampsServices,
  ...inventoryServices,
  ...summariesServices,
  ...submissionsServices,
];
