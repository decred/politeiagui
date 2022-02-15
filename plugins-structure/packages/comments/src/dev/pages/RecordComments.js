import React from "react";
import ReactDOM from "react-dom";
import { connectReducers, store } from "@politeiagui/core";
import { api } from "@politeiagui/core/api";
import { Provider } from "react-redux";
import { comments, commentsConstants } from "../../comments";
import {
  Comments,
  // CommentsCount,
  // CommentsVotes,
  // DownloadCommentsTimestamps,
} from "../../ui";
import {
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME,
  ThemeProvider,
  defaultDarkTheme,
  defaultLightTheme,
} from "pi-ui";
import "pi-ui/dist/index.css";

const themes = {
  [DEFAULT_LIGHT_THEME_NAME]: { ...defaultLightTheme },
  [DEFAULT_DARK_THEME_NAME]: { ...defaultDarkTheme },
};

const RecordCommentsPage = async ({ token = "fb73b6ebb6823517" }) => {
  const apiStatus = api.selectStatus(store.getState());

  if (apiStatus === "idle") {
    await store.dispatch(api.fetch());
  }
  await connectReducers(commentsConstants.reducersArray);
  await store.dispatch(comments.comments.fetch({ token }));
  const recordComments = comments.comments.selectByToken(
    store.getState(),
    token
  );
  return ReactDOM.render(
    <ThemeProvider themes={themes} defaultThemeName={DEFAULT_LIGHT_THEME_NAME}>
      <Provider store={store}>
        {/* <h1>Votes for {token}:</h1>
      <CommentsVotes
        token={token}
        userId="225a7543-63e3-4d4d-bffe-98d2fad3d1dc"
      /> */}
        <Comments comments={recordComments} />
        {/* <h1>Comments Count:</h1>
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
      /> */}
      </Provider>
    </ThemeProvider>,
    document.querySelector("#root")
  );
};

export default RecordCommentsPage;
