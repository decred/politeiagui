import { combineReducers } from "redux";
import form from "./form";
import app from "./app";
import api from "./api";
import modal from "./modal";

const rootReducer = combineReducers({ form, app, api, modal });

export default rootReducer;
