import { pluginServices as commentsServices } from "./comments/services";
import { pluginServices as timestampServices } from "./timestamps/services";
import { pluginServices as countServices } from "./count/services";

export const services = [
  ...commentsServices,
  ...timestampServices,
  ...countServices,
];
