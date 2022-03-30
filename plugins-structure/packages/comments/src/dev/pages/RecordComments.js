import React from "react";
import ReactDOM from "react-dom";
import { connectReducers, store } from "@politeiagui/core";
import { api } from "@politeiagui/core/api";
import { Provider } from "react-redux";
import { comments, commentsConstants } from "../../comments";
import { commentsMock, userVotesMock } from "../mocks";
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

const RecordCommentsPage = async ({ token, userid }) => {
  const apiStatus = api.selectStatus(store.getState());
  await connectReducers(commentsConstants.reducersArray);

  if (apiStatus === "idle") {
    await store.dispatch(api.fetch());
  }

  await store.dispatch(comments.policy.fetch());

  let recordComments = commentsMock;
  let userCommentsVotes = userVotesMock;
  if (token) {
    await store.dispatch(comments.comments.fetch({ token }));
    recordComments = comments.comments.selectByToken(store.getState(), token);
    if (userid) {
      await store.dispatch(comments.votes.fetch({ token, userid }));
      userCommentsVotes = comments.votes.selectUserVotesByToken(
        store.getState(),
        {
          token,
          userid,
        }
      );
    }
  }

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
