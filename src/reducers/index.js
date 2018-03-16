import { combineReducers } from "redux";
import form from "./form";
import app from "./app";
import api from "./api";

const rootReducer = combineReducers({ form, app, api });

export default rootReducer;
