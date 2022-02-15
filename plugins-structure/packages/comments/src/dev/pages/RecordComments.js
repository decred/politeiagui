import React from "react";
import ReactDOM from "react-dom";
import { connectReducers, store } from "@politeiagui/core";
import { api } from "@politeiagui/core/api";
import { Provider } from "react-redux";
import { commentsConstants } from "../../comments";
import {
  CommentsCount,
  CommentsVotes,
  DownloadCommentsTimestamps,
  RecordComments,
} from "../../ui";

const RecordCommentsPage = async ({ token = "fb73b6ebb6823517" }) => {
  const apiStatus = api.selectStatus(store.getState());

  if (apiStatus === "idle") {
    await store.dispatch(api.fetch());
  }
  await connectReducers(commentsConstants.reducersArray);
  return ReactDOM.render(
    <Provider store={store}>
      <h1>Votes for {token}:</h1>
      <CommentsVotes
        token={token}
        userId="225a7543-63e3-4d4d-bffe-98d2fad3d1dc"
      />
      <h1>Comments for {token}:</h1>
      <RecordComments token={token} />
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
      <DownloadCommentsTimestamps
        token={token}
        onFetchDone={(timestamps) => {
          console.log(timestamps);
        }}
      />
    </Provider>,
    document.querySelector("#root")
  );
};

export default RecordCommentsPage;
