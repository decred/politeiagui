import fetchMock from "fetch-mock";
import * as app from "../app";
import * as act from "../types";
import * as ls from "../../lib/local_storage";
import {
  onSubmitProposal,
  onChangeUsername,
  onChangePassword,
  onFetchProposalComments
} from "../api";
import {
  onFetchProposal as onFetchProposalApi,
  onSubmitComment as onSubmitCommentApi
} from "../api";
import { done } from "./helpers";

describe("test app actions (actions/app.js)", () => {
  const FAKE_CSRF = "fake_csrf_token";
  const MOCK_STATE = {
    api: {
      me: {
        response: {
          csrfToken: FAKE_CSRF,
          email: "foo@bar.com",
          username: "foobar"
        }
      },
      init: {
        response: {
          csrfToken: FAKE_CSRF
        }
      }
    },
    app: {
      draftProposals: {
        draft_id: {
          draftid: "draft_id",
          name: "test",
          description: "Description",
          files: [],
          timestamp: Date.now() / 1000
        }
      }
    }
  };
  const FAKE_COMMENT = {
    comment: "fake comment",
    token: "fake_token",
    parentid: 0
  };
  const FAKE_PROPOSAL = {
    token: "fake_token",
    name: "fake name",
    description: "fake description",
    files: []
  };
  const FAKE_USER = {
    id: "2",
    email: "foo@bar.com",
    username: "foobar",
    password: "foobar1234"
  };
  beforeEach(() => {
    //send status 200 to every unmatched request
    fetchMock.restore();
    fetchMock.post("/", {}).catch({});
  });

  test("set reply parent and reset form reply", async () => {
    await expect(app.onSetReplyParent(0)).toDispatchActions(
      [
        { type: act.SET_REPLY_PARENT },
        { type: "@@redux-form/RESET", meta: { form: "form/reply" } }
      ],
      done
    );
  });
  test("save new proposal action", async () => {
    const props = {
      loggedInAsEmail: FAKE_USER.email,
      userid: FAKE_USER.id,
      username: FAKE_USER.username
    };
    const proposal = FAKE_PROPOSAL;
    await expect(
      app.onSaveNewProposal(proposal, null, props)
    ).toDispatchActionsWithState(
      MOCK_STATE,
      [
        onSubmitProposal(
          props.loggedInAsEmail,
          props.userid,
          props.username,
          proposal.name,
          proposal.description,
          proposal.files
        )
      ],
      done
    );
  });

  test("save change username action", async () => {
    const params = {
      password: FAKE_USER.password,
      newUsername: FAKE_USER.username
    };
    await expect(app.onSaveChangeUsername(params)).toDispatchActionsWithState(
      MOCK_STATE,
      [onChangeUsername(params.password, params.newUsername)],
      done
    );
  });

  test("save change password action", async () => {
    const existingPassword = FAKE_USER.password;
    const newPassword = "new_pass";
    await expect(
      app.onSaveChangePassword({ existingPassword, newPassword })
    ).toDispatchActionsWithState(
      MOCK_STATE,
      [onChangePassword(existingPassword, newPassword)],
      done
    );
  });

  test("fetch proposal action", async () => {
    const { token } = FAKE_PROPOSAL;
    await expect(app.onFetchProposal(token)).toDispatchActionsWithState(
      MOCK_STATE,
      [onFetchProposalApi(token), onFetchProposalComments(token)],
      done
    );
  });

  test("load me action", () => {
    const { me } = MOCK_STATE.api;
    expect(app.onLoadMe(me)).toDispatchActions(
      { type: act.LOAD_ME, payload: me },
      done
    );
  });

  test("on change admin filter action", () => {
    const option = "any";
    expect(app.onChangeAdminFilter(option)).toDispatchActions(
      { type: act.CHANGE_ADMIN_FILTER_VALUE, payload: option },
      done
    );
  });

  test("on change public filter action", () => {
    const option = "any";
    expect(app.onChangePublicFilter(option)).toDispatchActions(
      { type: act.CHANGE_PUBLIC_FILTER_VALUE, payload: option },
      done
    );
  });

  test("on change user filter action", () => {
    const option = "any";
    expect(app.onChangeUserFilter(option)).toDispatchActions(
      { type: act.CHANGE_USER_FILTER_VALUE, payload: option },
      done
    );
  });

  test("on change proposal status to approved action", () => {
    const status = "any";
    expect(app.onChangeProposalStatusApproved(status)).toDispatchActions(
      { type: act.SET_PROPOSAL_APPROVED, payload: status },
      done
    );
  });

  test("on submit comment action", async () => {
    const { token, comment, parentid } = FAKE_COMMENT;
    const { email } = FAKE_USER;
    await expect(
      app.onSubmitComment(email, token, comment, parentid)
    ).toDispatchActionsWithState(
      MOCK_STATE,
      [onSubmitCommentApi(email, token, comment, parentid)],
      done
    );
  });

  test("on save draft proposal action", () => {
    expect(app.onSaveDraftProposal(FAKE_PROPOSAL)).toDispatchActions(
      [
        {
          type: act.SAVE_DRAFT_PROPOSAL,
          payload: { name: FAKE_PROPOSAL.name }
        }
      ],
      done
    );
  });

  test("on load draft proposals", () => {
    const { email } = MOCK_STATE.api.me.response;
    ls.handleSaveStateToLocalStorage(MOCK_STATE);
    expect(app.onLoadDraftProposals(email)).toDispatchActions(
      [
        {
          type: act.LOAD_DRAFT_PROPOSALS,
          payload: MOCK_STATE.app.draftProposals
        }
      ],
      done
    );
  });

  test("on delete draft proposal", () => {
    const id = "draft_id";
    expect(app.onDeleteDraftProposal(id)).toDispatchActions(
      [{ type: act.DELETE_DRAFT_PROPOSAL, payload: id }],
      done
    );
  });

  test("toggleCreditsPaymentPolling action", () => {
    expect(app.toggleCreditsPaymentPolling(true)).toDispatchActions(
      [{ type: act.TOGGLE_CREDITS_PAYMENT_POLLING, payload: true }],
      done
    );
  });

  test("on local storage change action", () => {
    //save if values aren't equal
    const mockedNewStorageStateValue = {
      api: {
        me: {
          response: {
            username: "fake_user"
          }
        }
      }
    };
    localStorage.setItem("state", JSON.stringify(mockedNewStorageStateValue));

    const generateLSChangeEvent = (newValue, key = ls.loggedInStateKey) => ({
      newValue,
      key
    });
    let mockedEvent = generateLSChangeEvent(
      JSON.stringify(mockedNewStorageStateValue)
    );
    expect(app.onLocalStorageChange(mockedEvent)).toDispatchActionsWithState(
      MOCK_STATE,
      [app.onLoadMe(mockedNewStorageStateValue.api.me)],
      done
    );

    //equal values and undefined/falsy local storage values leads to logout
    localStorage.removeItem(ls.loggedInStateKey);
    mockedEvent = generateLSChangeEvent(JSON.stringify({}));
    expect(app.onLocalStorageChange(mockedEvent)).toDispatchActionsWithState(
      MOCK_STATE,
      [
        {
          type: act.RECEIVE_LOGOUT,
          payload: {}
        }
      ],
      done
    );

    localStorage.removeItem(ls.loggedInStateKey);
    mockedEvent = generateLSChangeEvent(JSON.stringify(false));
    expect(app.onLocalStorageChange(mockedEvent)).toDispatchActionsWithState(
      MOCK_STATE,
      [
        {
          type: act.RECEIVE_LOGOUT,
          payload: {}
        }
      ],
      done
    );

    // Actions are not dispatched when the local storage event key
    // is different from ls.loggedInStateKey
    localStorage.removeItem(ls.loggedInStateKey);
    mockedEvent = generateLSChangeEvent(
      JSON.stringify(mockedNewStorageStateValue),
      "any"
    );
    expect(app.onLocalStorageChange(mockedEvent)).toDispatchActionsWithState(
      MOCK_STATE,
      [],
      done
    );
  });
});
