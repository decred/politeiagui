import { combineReducers } from "redux";
import form from "./form";
import app from "./app";
import api from "./api";
import modal from "./modal";
import {
  comments,
  users,
  credits,
  proposals,
  proposalVotes,
  invoices,
  dccs
} from "./models";
import external_api from "./external_api";

const rootReducer = combineReducers({
  form,
  app,
  api,
  modal,
  external_api,
  comments,
  credits,
  users,
  proposals,
  proposalVotes,
  invoices,
  dccs
});

export default rootReducer;
