import { combineReducers } from "redux";
import { reducer as form } from "redux-form";
import app from "./app";
import api from "./api";

const rootReducer = combineReducers({ form, app, api });

export default rootReducer;
