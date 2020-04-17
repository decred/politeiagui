import { combineReducers } from "redux";
import app from "./app";
import api from "./api";
import {
  comments,
  users,
  credits,
  proposals,
  proposalVotes,
  invoices,
  dccs,
  paywall
} from "./models";
import external_api from "./external_api";

const rootReducer = combineReducers({
  app,
  api,
  external_api,
  comments,
  credits,
  users,
  proposals,
  proposalVotes,
  invoices,
  dccs,
  paywall
});

export default rootReducer;
