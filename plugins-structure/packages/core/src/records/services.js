import { services as recordsServices } from "./records/services";
import { services as inventoryServices } from "./inventory/services";

export const services = [...recordsServices, ...inventoryServices];
