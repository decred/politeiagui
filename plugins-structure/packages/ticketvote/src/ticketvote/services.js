import { services as timestampsServices } from "./timestamps/services";
import { services as inventoryServices } from "./inventory/services";
import { services as summariesServices } from "./summaries/services";

export const services = [
  ...timestampsServices,
  ...inventoryServices,
  ...summariesServices,
];
