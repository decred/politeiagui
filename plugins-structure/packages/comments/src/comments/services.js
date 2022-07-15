import { services as commentsServices } from "./comments/services";
import { services as timestampServices } from "./timestamps/services";
import { services as countServices } from "./count/services";

export const services = [
  ...commentsServices,
  ...timestampServices,
  ...countServices,
];
