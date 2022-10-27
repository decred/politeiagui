import {
  endProgress,
  initProgress,
  services as progressServices,
  selectProgress,
  updateProgress,
} from "./progress";
import {
  clearMessage,
  services as messageServices,
  selectMessage,
  setMessage,
} from "./message";

export const progress = {
  end: endProgress,
  init: initProgress,
  select: selectProgress,
  update: updateProgress,
};

export const message = {
  clear: clearMessage,
  select: selectMessage,
  set: setMessage,
};

export const services = [...progressServices, ...messageServices];
