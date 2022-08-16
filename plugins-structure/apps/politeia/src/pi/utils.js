import { Buffer } from "buffer";
import { store } from "@politeiagui/core";
import { encodeTextToFilePayload } from "@politeiagui/core/records/utils";
import { piPolicy } from "./policy";

export function fetchPolicyIfIdle() {
  if (piPolicy.selectStatus(store.getState()) === "idle") {
    return store.dispatch(piPolicy.fetch());
  }
}

export function convertMarkdownToFile(markdownText) {
  return {
    name: "index.md",
    mime: "text/plain; charset=utf-8",
    payload: encodeTextToFilePayload(markdownText),
  };
}

const objectToBuffer = (obj) => Buffer.from(JSON.stringify(obj));

const bufferToBase64String = (buf) => buf.toString("base64");

export function convertProposalMetadataToFile({
  name,
  amount,
  startdate,
  enddate,
  domain,
}) {
  return {
    name: "proposalmetadata.json",
    mime: "text/plain; charset=utf-8",
    payload: bufferToBase64String(
      objectToBuffer({ name, amount, startdate, enddate, domain })
    ),
  };
}
