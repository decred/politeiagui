import React from "react";
import ReactDOM from "react-dom";
import { connectReducers, store } from "@politeiagui/core";
import { api } from "@politeiagui/core/api";
import { Provider } from "react-redux";
import { comments, commentsConstants } from "../../comments";
import { Comments } from "../../ui";
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

const userid = "0612f387-3777-4003-8f40-87b183f89032";

const RecordCommentsPage = async ({ token = "fb73b6ebb6823517" }) => {
  const apiStatus = api.selectStatus(store.getState());

  if (apiStatus === "idle") {
    await store.dispatch(api.fetch());
  }
  await connectReducers(commentsConstants.reducersArray);
  await store.dispatch(comments.comments.fetch({ token }));
  await store.dispatch(comments.votes.fetch({ token, userid }));
  const recordComments = comments.comments.selectByToken(
    store.getState(),
    token
  );
  const userCommentsVotes = comments.votes.selectUserVotesByToken(
    store.getState(),
    { token, userid }
  );
  return ReactDOM.render(
    <ThemeProvider themes={themes} defaultThemeName={DEFAULT_LIGHT_THEME_NAME}>
      <Provider store={store}>
        <Comments
          comments={recordComments}
          userVotes={userCommentsVotes}
          showCensor={true}
        />
      </Provider>
    </ThemeProvider>,
    document.querySelector("#root")
  );
};

export default RecordCommentsPage;
