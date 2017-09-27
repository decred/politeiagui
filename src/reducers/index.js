import { combineReducers } from "redux";
import app from "./app";
import api from "./api";

const rootReducer = combineReducers({ app, api });

export default rootReducer;
