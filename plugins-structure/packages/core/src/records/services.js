import { pluginServices as recordsServices } from "./records/services";
import { pluginServices as inventoryServices } from "./inventory/services";

export const services = [...recordsServices, ...inventoryServices];
