import React from "react";
import ReactDOM from "react-dom";
import { connectReducers, store } from "@politeiagui/core";
import { api } from "@politeiagui/core/api";
import { Provider } from "react-redux";
import { commentsConstants } from "../../comments";
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

const RecordCommentsPage = async () => {
  const apiStatus = api.selectStatus(store.getState());

  if (apiStatus === "idle") {
    await store.dispatch(api.fetch());
  }
  await connectReducers(commentsConstants.reducersArray);

  return ReactDOM.render(
    <ThemeProvider themes={themes} defaultThemeName={DEFAULT_LIGHT_THEME_NAME}>
      <Provider store={store}>
        <Comments
          comments={commentsMock}
          userVotes={userVotesMock}
          showCensor={true}
        />
      </Provider>
    </ThemeProvider>,
    document.querySelector("#root")
  );
};

export default RecordCommentsPage;
