import React from "react";
import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import { api } from "@politeiagui/core/api";
import { Provider } from "react-redux";
import commentsReducer from "../../comments/comments/commentsSlice";
import Comments from "../../ui/Comments";

const RecordCommentsPage = async () => {
  const apiStatus = api.selectStatus(store.getState());

  if (apiStatus === "idle") {
    await store.dispatch(api.fetch());
  }
  await store.injectReducer("comments", commentsReducer);
  return ReactDOM.render(
    <Provider store={store}>
      <Comments token="a8a16ca77aed7e7e" />
    </Provider>,
    document.querySelector("#root")
  );
};

export default RecordCommentsPage;
