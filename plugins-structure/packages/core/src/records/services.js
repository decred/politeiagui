import { services as recordsServices } from "./records/services";
import { services as inventoryServices } from "./inventory/services";
import { pluginServices as draftsServices } from "./drafts/services";

export const services = [
  ...recordsServices,
  ...inventoryServices,
  ...draftsServices,
];
