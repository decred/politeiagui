import { Record, File, Inventory } from "./generate";
import { stateToString } from "./utils";
import { USER_TYPE_ADMIN, userByType } from "../users/generate";

export const API_BASE_URL = "/api/records/v1";

/**
 * errorReply is the reply that the server returns when you want to force
 * an error
 *
 * @param {Object} { errorParams }
 * @returns error reply
 */
export function errorReply({
  errorcode,
  errorcontext,
  pluginid,
  statuscode,
  omitBody
}) {
  return {
    statusCode: statuscode,
    body: omitBody ? null : { errorcode, errorcontext, pluginid }
  };
}

/**
 * policyReply is the reply to the Policy command.
 *
 * @param {Object} { testParams }
 * @returns Policy
 */
export function policyReply({
  testParams: { recordspagesize = 5, inventorypagesize = 20 }
}) {
  return {
    recordspagesize,
    inventorypagesize
  };
}

/**
 * recordsReply is the reply to the Records command. It returns a records batch
 * map: `{ [token]: Record }`
 *
 * @param {Object} { testParams, requestParams }
 * @returns Records batch map: `{ [token]: Record }`
 */
export function recordsReply({
  testParams: { status, state, metadatafiles, recordfiles, user },
  requestParams: { requests = [] }
}) {
  const findFile = (name, files) => files.find((f) => f.name === name);
  const records = requests.reduce((acc, { token, filenames }) => {
    const files =
      recordfiles && filenames.map((f) => new File(findFile(f, recordfiles)));
    return {
      ...acc,
      [token]: new Record({
        token,
        status,
        state,
        files,
        author: user
      })
    };
  }, {});
  return { records };
}

/**
 * inventoryReply is the reply to the Inventory command. The returned maps are
 * `{ [state]: { [status]: token } }` where the status is the human readable
 * record status.
 *
 * @param {Object} { testParams, requestParams }
 * @return Inventory map: `{ [state]: { [status]: token } }`
 */
export function inventoryReply({
  testParams: { amountByStatus = {}, pageLimit = 20, fixedInventory },
  requestParams: { state = 2, page }
}) {
  if (fixedInventory) return fixedInventory;
  const inventory = new Inventory(amountByStatus, {
    page,
    pageLimit
  });
  return { [stateToString(state)]: inventory };
}

/**
 * detailsReply is the reply to the Details command. It returns a record for the
 * request token with given `state`, `status` and `username` testParams.
 *
 * @param {Object} { testParams, requestParams }
 * @returns Record
 */
export function detailsReply({
  testParams: {
    state,
    status,
    user,
    files,
    fullToken,
    version,
    oldStatus,
    reason
  },
  requestParams: { token }
}) {
  const record = new Record({
    author: user,
    status,
    state,
    version,
    token: fullToken || token,
    files,
    oldStatus,
    reason
  });
  return { record };
}

/**
 * newRecordReply is the reply to the new command. It returns a new record for the
 * request data with given `files`, `publickey`, `signature` and `username` testParams.
 *
 * @param {Object} { testParams, requestParams }
 * @returns Proposal
 */
export function newRecordReply({
  testParams: { user },
  requestParams: { files = [], publickey, signature, token }
}) {
  const record = new Record({
    status: 1,
    state: 1,
    version: 1,
    files,
    author: user,
    publickey,
    signature,
    token
  });
  return { record };
}

export function editRecordReply({
  testParams: { user },
  requestParams: { status, state, version, files = [], publickey, signature }
}) {
  const record = new Record({
    status: status,
    state: state,
    version: version,
    files,
    author: user,
    publickey,
    signature
  });
  return { record };
}

export function timestampsReply({
  testParams: {},
  requestParams: { token, version }
}) {
  return {
    files: [],
    metadata: {},
    recordmetadata: {}
  };
}

export function setstatusReply({
  testParams: { user, oldStatus, state, files },
  requestParams: { publickey, reason, signature, status, token, version }
}) {
  if (!user) {
    user = userByType(USER_TYPE_ADMIN);
  }
  const record = new Record({
    author: user,
    publickey,
    signature,
    status,
    token,
    version,
    state,
    files,
    oldStatus,
    reason
  });
  return {
    record
  };
}

export const repliers = {
  new: newRecordReply,
  edit: editRecordReply,
  records: recordsReply,
  inventory: inventoryReply,
  policy: policyReply,
  details: detailsReply,
  timestamps: timestampsReply,
  setstatus: setstatusReply
};
