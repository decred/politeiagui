import React from "react";
import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import { api } from "@politeiagui/core/api";
import { Provider } from "react-redux";
import commentsReducer from "../../comments/comments/commentsSlice";
import countReducer from "../../comments/count/countSlice";
import policyReducer from "../../comments/policy/policySlice";
import { Comments, CommentsCount, CommentsPolicyProvider } from "../../ui";

const RecordCommentsPage = async () => {
  const apiStatus = api.selectStatus(store.getState());

  if (apiStatus === "idle") {
    await store.dispatch(api.fetch());
  }
  await store.injectReducer("comments", commentsReducer);
  await store.injectReducer("commentsCount", countReducer);
  await store.injectReducer("commentsPolicy", policyReducer);
  return ReactDOM.render(
    <Provider store={store}>
      <CommentsPolicyProvider>
        <h1>Comments for a8a16ca77aed7e7e:</h1>
        <Comments token="a8a16ca77aed7e7e" />
        <h1>Comments Count:</h1>
        <CommentsCount
          tokens={[
            "a8a16ca77aed7e7e",
            "8a0630254c628734",
            "e1897786fe08d31f",
            "1fe2586a6f744e09",
          ]}
        />
      </CommentsPolicyProvider>
    </Provider>,
    document.querySelector("#root")
  );
};

export default RecordCommentsPage;
