import { combineReducers } from "redux";
import form from "./form";
import app from "./app";
import api from "./api";
import external_api from "./external_api";

const rootReducer = combineReducers({ form, app, api, external_api });

export default rootReducer;
