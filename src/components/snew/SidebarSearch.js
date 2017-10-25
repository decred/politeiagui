import React from "react";
import { Field } from "redux-form";
import ErrorField from "../Form/Fields/ErrorField";
import connector from "../../connectors/search";

const SidebarSearch = ({
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
      <Field
        name="global"
        component={props => <ErrorField title="Cannot search for proposal" {...props} />}
      />
      <div className="infobar" id="searchexpando">
        <div id="moresearchinfo">
        </div>
      </div>
    </form>
  </div>
);

export default connector(SidebarSearch);
