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
import {
  popNavigation,
  pushNavigation,
  selectNavigationHistory,
  selectNavigationHistoryLastItem,
} from "./navigation";

export const message = {
  clear: clearMessage,
  select: selectMessage,
  set: setMessage,
};

export const navigation = {
  pop: popNavigation,
  push: pushNavigation,
  selectHistory: selectNavigationHistory,
  selectHistoryLastItem: selectNavigationHistoryLastItem,
};

export const progress = {
  end: endProgress,
  init: initProgress,
  select: selectProgress,
  update: updateProgress,
};

export const services = [...progressServices, ...messageServices];
