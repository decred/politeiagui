import { createSliceServices } from "../toolkit";
import { clearMessage, setMessage } from "./message";
import { endProgress, initProgress, updateProgress } from "./progress";

export const { pluginServices: messageServices, serviceSetups: messageSetups } =
  createSliceServices({
    name: "globalMessage",
    services: {
      set: {
        effect: (_, dispatch, { title, body } = {}) => {
          dispatch(setMessage({ title, body }));
        },
      },
      clear: {
        effect: (_, dispatch) => {
          dispatch(clearMessage());
        },
      },
    },
  });

export const {
  pluginServices: progressServices,
  serviceSetups: progressSetups,
} = createSliceServices({
  name: "globalProgress",
  services: {
    init: {
      effect: (_, dispatch, payload) => {
        if (!isNaN(payload)) {
          dispatch(initProgress(payload));
        }
      },
    },
    update: {
      effect: (_, dispatch) => {
        dispatch(updateProgress());
      },
    },
    end: {
      effect: (_, dispatch) => {
        dispatch(endProgress());
      },
    },
  },
});
