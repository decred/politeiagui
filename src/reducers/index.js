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
  proposalBilling
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
  proposalBilling
});

export default rootReducer;
