import { downloadJSON } from "@politeiagui/core/downloads";
import { getShortToken } from "@politeiagui/core/records/utils";

export function downloadCommentsTimestampsEffect({ payload, meta }) {
  const { token } = meta.arg;
  downloadJSON(payload, `${getShortToken(token)}-comments-timestamps`);
}

export function downloadRecordTimestampsEffect({ payload, meta }) {
  const { token, version } = meta.arg;
  downloadJSON(
    payload,
    `${getShortToken(token)}-v${version}-record-timestamps`
  );
}

export function downloadTicketvoteTimestampsEffect({ payload, meta }) {
  const { token } = meta.arg;
  downloadJSON(payload, `${getShortToken(token)}-vote-timestamps`);
}
