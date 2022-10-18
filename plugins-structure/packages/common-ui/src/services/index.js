import {
  popNavigation,
  pushNavigation,
  selectNavigationHistory,
  selectNavigationHistoryLastItem,
} from "./navigation";

export const navigation = {
  pop: popNavigation,
  push: pushNavigation,
  selectHistory: selectNavigationHistory,
  selectHistoryLastItem: selectNavigationHistoryLastItem,
};
