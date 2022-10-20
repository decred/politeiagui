import {
  endProgress,
  initProgress,
  services as progressServices,
  selectProgress,
  updateProgress,
} from "./progress";

export const progress = {
  end: endProgress,
  init: initProgress,
  select: selectProgress,
  update: updateProgress,
};

export const services = [...progressServices];
