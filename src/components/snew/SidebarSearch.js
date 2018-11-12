import React from "react";
import { Field } from "redux-form";
import Message from "../Message";
import LoadingIcon from "./LoadingIcon";
import searchConnector from "../../connectors/search";

const SidebarSearch = ({ error, isSaving, onFind, handleSubmit }) => (
  <div className="spacer">
    <form
      className="search-form"
      id="search"
      role="search"
      onSubmit={handleSubmit(onFind)}
    >
      <Field
        name="censorship"
        component="input"
        type="text"
        placeholder="Censorship token"
        size={80}
        tabIndex={20}
      />
      {isSaving ? (
        <LoadingIcon
          width={20}
          style={{
            display: "block",
            position: "absolute",
            top: "14px",
            right: "12px"
          }}
        />
      ) : (
        <input tabIndex={22} type="submit" value="" />
      )}

      {error && (
        <Message
          type="error"
          header="Cannot search for proposal"
          body={error}
        />
      )}
      <div className="infobar" id="searchexpando">
        <div id="moresearchinfo" />
      </div>
    </form>
  </div>
);

export default searchConnector(SidebarSearch);
