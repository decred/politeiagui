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
import {
  PROPOSAL_SUMMARY_STATUS_ABANDONED,
  PROPOSAL_SUMMARY_STATUS_ACTIVE,
  PROPOSAL_SUMMARY_STATUS_APPROVED,
  PROPOSAL_SUMMARY_STATUS_CENSORED,
  PROPOSAL_SUMMARY_STATUS_CLOSED,
  PROPOSAL_SUMMARY_STATUS_COMPLETED,
  PROPOSAL_SUMMARY_STATUS_REJECTED,
  PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW,
  PROPOSAL_SUMMARY_STATUS_UNVETTED,
  PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED,
  PROPOSAL_SUMMARY_STATUS_UNVETTED_CENSORED,
  PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED,
  PROPOSAL_SUMMARY_STATUS_VOTE_STARTED,
} from "../../pi/constants";
import isArray from "lodash/fp/isArray";

const MONTHS_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Record object
 * @typedef {{
 *   censorshiprecord: { token: String, merkle: String, signature: String },
 *   files: Array,
 *   metadata: Array,
 *   state: Number,
 *   status: Number,
 *   timestamp: Number,
 *   username: String,
 *   version: Number
 * }} Record
 */

/**
 * Ticketvote Vote Summary object
 * @typedef {{
 *   type: Number,
 *   status: Number,
 *   duration: Number,
 *   startblockheight: Number,
 *   startblockhash: String,
 *   endblockheight: Number,
 *   eligibletickets: Number,
 *   quorumpercentage: Number,
 *   passpercentage: Number,
 *   results: Array,
 *   bestblock: Number
 * }} VoteSummary
 */

/**
 * Proposal object
 * @typedef {{
 *   name: String,
 *   token: String,
 *   recordState: Number,
 *   recordStatus: Number,
 *   version: Number,
 *   timestamps: {
 *     publishedat: Number,
 *     editedat: Number,
 *     censoredat: Number,
 *     abandonedat: Number,
 *   },
 *   voteMetadata: {
 *     linkto: Number,
 *     linkby: Number,
 *   },
 *   author: {
 *     username: String,
 *     userid: String,
 *   },
 *   body: String,
 *   proposalMetadata: Object,
 *   censored: Bool,
 *   archived: Bool
 * }} Proposal
 */

/**
 * decodeProposalMetadataFile returns the decoded "proposalmetadata.json" file
 * for given record's files array.
 * @param {Array} files record's files
 * @returns {Object} Proposal metadata object
 */
export function decodeProposalMetadataFile(files) {
  const metadata = files.find((f) => f.name === "proposalmetadata.json");
  return decodeRecordFile(metadata);
}

/**
 * decodeProposalMetadataFile returns the decoded "proposalmetadata.json" file
 * for given record's files array.
 * @param {Array} files record's files
 * @returns {Object} Proposal metadata object
 */
export function decodeProposalBodyFile(files) {
  const body = files.find((f) => f.name === "index.md");
  return body && decodeURIComponent(escape(window.atob(body.payload)));
}

/**
 * decodeVoteMetadataFile accepts a proposal files array parses it's vote
 * metadata and returns it as object of the form { linkto, linkby }.
 * @param {Array} files Record Files array
 * @returns {Object} `{linkto, linkby}` decoded vote metadata
 */
export function decodeVoteMetadataFile(files) {
  const metadata = files && files.find((f) => f.name === "votemetadata.json");
  return decodeRecordFile(metadata);
}

/**
 * decodeProposalUserMetadata filters all "usermd" metadata streams and decodes
 * their payloads. Returns decoded and filtered metadata streams.
 * @param {Array} metadataStreams record's metadata streams
 * @returns {Array} Decoded "usermd" metadata streams
 */
export function decodeProposalUserMetadata(metadataStreams) {
  const userMd = metadataStreams
    ? metadataStreams
        .filter((md) => md.pluginid === "usermd")
        .map((md) => decodeRecordMetadata(md))
    : [];
  return userMd;
}

/**
 * decodeProposalRecord returns a formatted proposal object for given record.
 * It decodes all proposal-related data from records and converts it into a
 * readable proposal object.
 * @param {Record} record record object
 * @returns {Proposal} formatted proposal object
 */
export function decodeProposalRecord(record) {
  const { name, ...proposalMetadata } = decodeProposalMetadataFile(
    record.files
  );
  const userMetadata = decodeProposalUserMetadata(record.metadata);
  const voteMetadata = decodeVoteMetadataFile(record.files);
  const body = decodeProposalBodyFile(record.files);
  const useridMd = userMetadata.find((md) => md && md.payload.userid);
  const { token } = record.censorshiprecord;
  return {
    name: name ? name : getShortToken(token),
    token,
    recordState: record.state,
    recordStatus: record.status,
    version: record.version,
    timestamps: getProposalTimestamps(record),
    voteMetadata,
    author: {
      username: record.username,
      userid: useridMd?.payload?.userid,
    },
    body,
    proposalMetadata,
    archived: record.status === RECORD_STATUS_ARCHIVED,
    censored: record.status === RECORD_STATUS_CENSORED,
  };
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

/**
 * formatDateToInternationalString accepts an object of day, month and year.
 * It returns a string of human viewable international date from the result
 * of DatePicker or BackEnd and supposes they are correct.
 * String format: 08 Sep 2021
 * @param {object} { day, month, year }
 * @returns {string}
 */
export function formatDateToInternationalString({ day, month, year }) {
  const monthLabel = MONTHS_LABELS[month - 1];
  if (monthLabel === undefined) {
    return "Invalid Date";
  }
  const dayView = `0${day}`.slice(-2);
  return `${dayView} ${MONTHS_LABELS[month - 1]} ${year}`;
}

/**
 * getPublicStatusChangeMetadata returns the metadata stream that describes when
 * the record has been made `public`, i.e. status === 2.
 * @param {Array} userMetadata record's "usermd" metadata stream
 * @returns {Object} Public status change metadata stream
 */
export function getPublicStatusChangeMetadata(userMetadata) {
  if (!userMetadata) return {};
  const payloads = userMetadata.map((md) => md.payload);
  return findPublicStatusMetadataFromPayloads(payloads);
}

/**
 * getProposalTimestamps returns published, censored, edited and abandoned
 * timestamps for given record. Default timestamps values are 0.
 * @param {Record} record record object
 * @returns {Object} `{publishedat: number, editedat: number, censoredat: number,
 *    abandonedat: number}` - Object with publishedat, censoredat, abandonedat
 */
function getProposalTimestamps(record) {
  if (!record)
    return { publishedat: 0, editedat: 0, censoredat: 0, abandonedat: 0 };

  let publishedat = 0,
    censoredat = 0,
    abandonedat = 0,
    editedat = 0;
  const { status, timestamp, version, metadata } = record;
  const userMetadata = decodeProposalUserMetadata(metadata);
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

/**
 * getProposalStatusTagProps returns the formatted `{ type, text }`
 * props for StatusTag component for given record and ticketvote summary.
 * @param {Record} record record object
 * @param {VoteSummary} voteSummary ticketvote summary object
 * @returns {Object} `{ type, text }` StatusTag props
 */
export function getLegacyProposalStatusTagProps(record, voteSummary) {
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
  if (record.status === RECORD_STATUS_CENSORED) {
    return {
      type: "orangeNegativeCircled",
      text: "Censored",
    };
  }

  return { type: "grayNegative", text: "missing" };
}

export const getProposalStatusTagProps = (proposalSummary, isDarkTheme) => {
  if (proposalSummary) {
    switch (proposalSummary.status) {
      case PROPOSAL_SUMMARY_STATUS_UNVETTED:
        return {
          type: "yellowTime",
          text: "Unvetted",
        };
      case PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED:
      case PROPOSAL_SUMMARY_STATUS_ABANDONED:
        return {
          type: isDarkTheme ? "blueNegative" : "grayNegative",
          text: "Abandoned",
        };

      case PROPOSAL_SUMMARY_STATUS_UNVETTED_CENSORED:
      case PROPOSAL_SUMMARY_STATUS_CENSORED:
        return {
          type: "orangeNegativeCircled",
          text: "Censored",
        };

      case PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW:
        return {
          type: isDarkTheme ? "blueTime" : "blackTime",
          text: "Waiting for author to authorize voting",
        };

      case PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED:
        return {
          type: "yellowTime",
          text: "Waiting for admin to start voting",
        };

      case PROPOSAL_SUMMARY_STATUS_VOTE_STARTED:
        return { type: "bluePending", text: "Voting" };

      case PROPOSAL_SUMMARY_STATUS_REJECTED:
        return {
          type: "orangeNegativeCircled",
          text: "Rejected",
        };

      case PROPOSAL_SUMMARY_STATUS_ACTIVE:
        return { type: "bluePending", text: "Active" };

      case PROPOSAL_SUMMARY_STATUS_CLOSED:
        return { type: "grayNegative", text: "Closed" };

      case PROPOSAL_SUMMARY_STATUS_COMPLETED:
        return { type: "greenCheck", text: "Completed" };

      case PROPOSAL_SUMMARY_STATUS_APPROVED:
        return { type: "greenCheck", text: "Approved" };

      default:
        break;
    }
  }

  return { type: "grayNegative", text: "missing" };
};

/**
 * showVoteStatusBar returns if vote has started, finished, approved or
 * rejected, which indicates whether the StatusBar should be displayed or not.
 * @param {VoteSummary} voteSummary ticketvote summary
 */
export function showVoteStatusBar(voteSummary) {
  if (!voteSummary) return false;
  return [
    TICKETVOTE_STATUS_STARTED,
    TICKETVOTE_STATUS_FINISHED,
    TICKETVOTE_STATUS_APPROVED,
    TICKETVOTE_STATUS_REJECTED,
  ].includes(voteSummary.status);
}
