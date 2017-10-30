import get from "lodash/fp/get";
import compose from "lodash/fp/compose";
import find from "lodash/fp/find";
import { bool } from "../lib/fp";
import { isMarkdown } from "./api";

export const isApiRequestingSidebar = bool(get(["api", "proposals", "sidebar", "isRequesting"]));
export const getApiSidebarError = get(["api", "proposals", "sidebar", "error"]);
export const getApiSidebarMarkdown = compose(
  x => x && atob(x), get("payload"), find(isMarkdown),
  get(["api", "proposals", "sidebar", "response", "proposal", "files"])
);

