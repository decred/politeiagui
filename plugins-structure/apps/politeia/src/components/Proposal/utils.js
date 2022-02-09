import {
  decodeRecordFile,
  decodeRecordMetadata,
  getShortToken,
} from "@politeiagui/core/records/utils";
import {
  RECORD_STATUS_ARCHIVED,
  RECORD_STATUS_CENSORED,
  RECORD_STATUS_PUBLIC,
  RECORD_STATUS_UNREVIEWED,
} from "@politeiagui/core/records/constants";
import {
  TICKETVOTE_STATUS_APPROVED,
  TICKETVOTE_STATUS_AUTHORIZED,
  TICKETVOTE_STATUS_FINISHED,
  TICKETVOTE_STATUS_REJECTED,
  TICKETVOTE_STATUS_STARTED,
  TICKETVOTE_STATUS_UNAUTHORIZED,
} from "@politeiagui/ticketvote/constants";
import isArray from "lodash/fp/isArray";

export function decodeProposalMetadataFile(files) {
  const metadata = files.find((f) => f.name === "proposalmetadata.json");
  return decodeRecordFile(metadata);
}

export function decodeProposalUserMetadata(metadataStreams) {
  const userMd = metadataStreams
    ? metadataStreams
        .filter((md) => md.pluginid === "usermd")
        .map((md) => decodeRecordMetadata(md))
    : {};
  return userMd;
}

export function decodeProposalRecord(record) {
  const { name } = decodeProposalMetadataFile(record.files);
  const userMetadata = decodeProposalUserMetadata(record.metadata);
  const voteMetadata = decodeVoteMetadataFile(record.files);
  const { userid } = userMetadata.find((md) => md && md.payload.userid);
  const { token } = record.censorshiprecord;
  return {
    name: name ? name : getShortToken(token),
    token,
    recordState: record.state,
    recordStatus: record.status,
    version: record.version,
    timestamps: getProposalTimestamps(record, userMetadata),
    voteMetadata,
    author: {
      username: record.username,
      userid,
    },
  };
}

/**
 * decodeVoteMetadataFile accepts a proposal object parses it's metadata
 * and returns it as object of the form { linkto, linkby }
 * @param {Array} files Record Files array
 */
export function decodeVoteMetadataFile(files) {
  const metadata = files && files.find((f) => f.name === "votemetadata.json");
  return decodeRecordFile(metadata);
}

function findPublicStatusMetadataFromPayloads(mdPayloads) {
  if (!mdPayloads) return {};
  const publicMd = mdPayloads.find((p) => p.status === RECORD_STATUS_PUBLIC);
  if (!publicMd) {
    // traverse payload arrays
    const arrayPayloads = mdPayloads.find((p) => isArray(p));
    return findPublicStatusMetadataFromPayloads(arrayPayloads);
  }
  return publicMd;
}

export function getPublicStatusChangeMetadata(userMetadata) {
  if (!userMetadata) return {};
  const payloads = userMetadata.map((md) => md.payload);
  return findPublicStatusMetadataFromPayloads(payloads);
}

/**
 * getProposalTimestamps
 * @param {Object} proposal
 * @returns {{publishedat: number, censoredat: number, abandonedat: number}}
 *   Object with publishedat, censoredat, abandonedat
 */
function getProposalTimestamps(record, userMetadata) {
  const { status, timestamp, version } = record;
  let publishedat = 0,
    censoredat = 0,
    abandonedat = 0,
    editedat = 0;
  // unreviewed
  if (status === RECORD_STATUS_UNREVIEWED) {
    publishedat = timestamp;
  }
  // publlished but not edited
  if (status === RECORD_STATUS_PUBLIC && version <= 1) {
    publishedat = timestamp;
  }
  // edited, have to grab published timestamp from metadata
  if (status === RECORD_STATUS_PUBLIC && version > 1) {
    const publishedMetadata = getPublicStatusChangeMetadata(userMetadata);
    publishedat = publishedMetadata.timestamp;
    editedat = timestamp;
  }
  if (status === RECORD_STATUS_CENSORED) {
    const publishedMetadata = getPublicStatusChangeMetadata(userMetadata);
    publishedat = publishedMetadata.timestamp;
    censoredat = timestamp;
  }
  if (status === RECORD_STATUS_ARCHIVED) {
    const publishedMetadata = getPublicStatusChangeMetadata(userMetadata);
    publishedat = publishedMetadata.timestamp;
    abandonedat = timestamp;
  }

  return { publishedat, editedat, censoredat, abandonedat };
}

export function getProposalStatusTagProps(record, voteSummary) {
  const voteMetadata = decodeVoteMetadataFile(record.files);
  const isRfpSubmission = voteMetadata?.linkto;
  if (record.status === RECORD_STATUS_PUBLIC && !!voteSummary) {
    switch (voteSummary.status) {
      case TICKETVOTE_STATUS_UNAUTHORIZED:
        return {
          type: "blackTime",
          text: isRfpSubmission
            ? "Waiting for runoff vote to start"
            : "Waiting for author to authorize voting",
        };
      case TICKETVOTE_STATUS_AUTHORIZED:
        return {
          type: "yellowTime",
          text: "Waiting for admin to start voting",
        };
      case TICKETVOTE_STATUS_STARTED:
        return { type: "bluePending", text: "Active" };
      case TICKETVOTE_STATUS_FINISHED:
        return {
          type: "grayNegative",
          text: "Finished",
        };
      case TICKETVOTE_STATUS_REJECTED:
        return {
          type: "orangeNegativeCircled",
          text: "Rejected",
        };
      case TICKETVOTE_STATUS_APPROVED:
        return { type: "greenCheck", text: "Approved" };
      default:
        break;
    }
  }

  if (record.status === RECORD_STATUS_ARCHIVED) {
    return {
      type: "grayNegative",
      text: "Abandoned",
    };
  }

  return { type: "grayNegative", text: "missing" };
}

export function showVoteStatusBar(voteSummary) {
  if (!voteSummary) return false;
  return [
    TICKETVOTE_STATUS_STARTED,
    TICKETVOTE_STATUS_FINISHED,
    TICKETVOTE_STATUS_APPROVED,
    TICKETVOTE_STATUS_REJECTED,
  ].includes(voteSummary.status);
}
