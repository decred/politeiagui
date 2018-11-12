import * as modals from "../modal";
import * as act from "../types";
import { done } from "./helpers";

describe("test actions/modal.js", () => {
  const MODAL_TYPE = "ANY_TYPE";
  const PAYLOAD = "any";
  const CALLBACK = () => "callback returned value";
  test("open modal action", () => {
    expect(modals.openModal(MODAL_TYPE, PAYLOAD, CALLBACK)).toEqual({
      type: act.OPEN_MODAL,
      modalType: MODAL_TYPE,
      payload: PAYLOAD,
      callback: CALLBACK
    });
  });

  test("close modal action", () => {
    expect(modals.closeModal()).toEqual({
      type: act.CLOSE_MODAL
    });
  });

  test("confirm with modal", () => {
    expect(modals.confirmWithModal(MODAL_TYPE, PAYLOAD)).toDispatchActions(
      [modals.openModal()],
      done
    );
  });
});
