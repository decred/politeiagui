import { combineReducers } from "redux";
import app from "./app";
import api from "./api";
import external_api from "./external_api";
import {
  comments,
  users,
  credits,
  proposals,
  proposalVotes,
  invoices,
  invoicePayouts,
  dccs,
  paywall,
  codestats
} from "./models";

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
  invoicePayouts,
  dccs,
  paywall,
  codestats
});

export default rootReducer;
