import fetchMock from "fetch-mock";
import * as app from "../app";
import * as act from "../types";
import * as ls from "../../lib/local_storage";
import { onChangeUsername, onChangePassword } from "../api";
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
      },
      draftInvoices: {
        draft_id: {
          month: "month",
          year: "year",
          name: "name",
          location: "location",
          contact: "contact",
          rate: "20",
          address: "",
          lineitems: [],
          files: [],
          draftId: "draft_id",
          timestamp: Date.now() / 1000
        }
      }
    },
    users: {
      byID: {
        testid: {
          email: "foo@bar.com",
          username: "foobar"
        }
      },
      currentUserID: "testid"
    }
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
  const FAKE_INVOICE = {
    token: "fake_token",
    lineitems: [],
    files: []
  };

  beforeAll(() => {
    // send status 200 to every unmatched request
    fetchMock.post("/", {}, { overwriteRoutes: true }).catch({});
  });

  beforeEach(() => {
    fetchMock.restore();
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

  test("on save draft invoice action", () => {
    expect(app.onSaveDraftInvoice(FAKE_INVOICE)).toDispatchActions(
      [
        {
          type: act.SAVE_DRAFT_INVOICE,
          payload: { name: FAKE_INVOICE.name }
        }
      ],
      done
    );
  });

  test("on load draft invoices", () => {
    const { email } = MOCK_STATE.api.me.response;
    ls.handleSaveStateToLocalStorage(MOCK_STATE);
    expect(app.onLoadDraftInvoices(email)).toDispatchActions(
      [
        {
          type: act.LOAD_DRAFT_INVOICES,
          payload: MOCK_STATE.app.draftInvoices
        }
      ],
      done
    );
  });

  test("on delete draft invoice", () => {
    const id = "draft_id";
    expect(app.onDeleteDraftInvoice(id)).toDispatchActions(
      [{ type: act.DELETE_DRAFT_INVOICE, payload: id }],
      done
    );
  });

  test("toggleCreditsPaymentPolling action", () => {
    expect(app.toggleCreditsPaymentPolling(true)).toDispatchActions(
      [{ type: act.TOGGLE_CREDITS_PAYMENT_POLLING, payload: true }],
      done
    );
  });
});
