import get from "lodash/fp/get";

export const getopenedModals = state => get(["modal", "openedModals"], state);
