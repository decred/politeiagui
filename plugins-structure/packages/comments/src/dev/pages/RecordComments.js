import React from "react";
import ReactDOM from "react-dom";
import { store } from "@politeiagui/core";
import { api } from "@politeiagui/core/api";
import { Provider } from "react-redux";
import commentsReducer from "../../comments/comments/commentsSlice";
import countReducer from "../../comments/count/countSlice";
import policyReducer from "../../comments/policy/policySlice";
import timestampsReducer from "../../comments/timestamps/timestampsSlice";
import {
  Comments,
  CommentsCount,
  CommentsPolicyProvider,
  CommentsTimestamps,
} from "../../ui";

const RecordCommentsPage = async ({ token = "fb73b6ebb6823517" }) => {
  const apiStatus = api.selectStatus(store.getState());

  if (apiStatus === "idle") {
    await store.dispatch(api.fetch());
  }
  await store.injectReducer("comments", commentsReducer);
  await store.injectReducer("commentsCount", countReducer);
  await store.injectReducer("commentsPolicy", policyReducer);
  await store.injectReducer("commentsTimestamps", timestampsReducer);
  return ReactDOM.render(
    <Provider store={store}>
      <CommentsPolicyProvider>
        <h1>Comments for {token}:</h1>
        <Comments token={token} />
        <h1>Comments Count:</h1>
        <CommentsCount
          tokens={[
            "fb74b286585c4219",
            "8a0630254c628734",
            "e1897786fe08d31f",
            "1fe2586a6f744e09",
          ]}
        />
        <h1>Comment Timestamps for {token}:</h1>
        <CommentsTimestamps
          token={token}
          onFetchDone={(timestamps) => {
            console.log(timestamps);
          }}
        />
      </CommentsPolicyProvider>
    </Provider>,
    document.querySelector("#root")
  );
};

export default RecordCommentsPage;
