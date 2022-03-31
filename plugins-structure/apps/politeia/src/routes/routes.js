import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import { records } from "@politeiagui/core/records";
import { ticketvoteConstants } from "@politeiagui/ticketvote";
import { commentsConstants } from "@politeiagui/comments";
import { Details, Home } from "../pages";
import homeReducer from "../pages/Home/homeSlice";
import detailsReducer from "../pages/Details/detailsSlice";
import { createAppRoute } from "./utils";

export const homeReducerObj = {
  key: "home",
  reducer: homeReducer,
};

export const detailsReducerObj = {
  key: "details",
  reducer: detailsReducer,
};

export const routes = [
  createAppRoute({
    path: "/",
    reducers: [
      ...ticketvoteConstants.reducersArray,
      ...commentsConstants.reducersArray,
      homeReducerObj,
    ],
    Component: Home,
  }),
  createAppRoute({
    path: "/record/:token",
    reducers: [
      ...ticketvoteConstants.reducersArray,
      ...commentsConstants.reducersArray,
      detailsReducerObj,
    ],
    Component: Details,
  }),
  {
    path: "/record/:token/raw",
    view: async ({ token }) => {
      const { payload: recordDetails } = await store.dispatch(
        records.fetchDetails({ token })
      );
      const recordDetailsString = JSON.stringify(recordDetails, null, 2);
      return (document.querySelector(
        "#root"
      ).innerHTML = `<pre>${recordDetailsString}</pre>`);
    },
    cleanup: () =>
      ReactDOM.unmountComponentAtNode(document.querySelector("#root")),
  },
];
