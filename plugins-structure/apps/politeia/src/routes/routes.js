import { Home } from "../pages";
import { ticketvoteConstants } from "@politeiagui/ticketvote";
import homeReducer from "../pages/Home/homeSlice";
import { createAppRoute } from "./utils";

export const homeReducerObj = {
  key: "home",
  reducer: homeReducer,
};

export const routes = [
  createAppRoute({
    path: "/",
    reducers: [...ticketvoteConstants.reducersArray, homeReducerObj],
    Component: Home,
  }),
];
