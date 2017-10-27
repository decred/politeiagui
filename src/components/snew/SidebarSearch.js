import React from "react";
import { Field } from "redux-form";
import Message from "../Message";
import connector from "../../connectors/search";

const SidebarSearch = ({
  error,
  Loading,
  isSaving,
  onFind,
  handleSubmit
}) => isSaving ? <Loading /> : (
  <div className="spacer">
    <form id="search" role="search" onSubmit={handleSubmit(onFind)}>
      <Field
        name="censorship"
        component="input"
        type="text"
        placeholder="Censorship token"
        size={80}
        tabIndex={20}
      />
      <input tabIndex={22} type="submit" defaultValue />
      {error && (
        <Message type="error" header="Cannot search for proposal" body={error} />
      )}
      <div className="infobar" id="searchexpando">
        <div id="moresearchinfo">
        </div>
      </div>
    </form>
  </div>
);

export default connector(SidebarSearch);
