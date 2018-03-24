import get from "lodash/fp/get";

export const getOpennedModals = state => get(["modal", "opennedModals"], state);
