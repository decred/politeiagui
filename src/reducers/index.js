import { combineReducers } from "redux";
import form from "./form";
import app from "./app";
import api from "./api";
import {
  comments,
  users,
  credits,
  proposals,
  proposalVotes,
  invoices
} from "./models";
import external_api from "./external_api";

const rootReducer = combineReducers({
  form,
  app,
  api,
  external_api,
  comments,
  credits,
  users,
  proposals,
  proposalVotes,
  invoices
});

export default rootReducer;
