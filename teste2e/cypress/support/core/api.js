import { Record, File, Inventory } from "./generate";
import { stateToString } from "./utils";

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
  testParams: { state, status, username },
  requestParams: { token }
}) {
  const record = new Record({ author: username, status, state, token });
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
  testParams: { username },
  requestParams: { files = [], publickey, signature }
}) {
  const record = new Record({
    status: 1,
    state: 1,
    version: 1,
    files,
    author: username,
    publickey,
    signature
  });
  return { record };
}

export const repliers = {
  new: newRecordReply,
  records: recordsReply,
  inventory: inventoryReply,
  policy: policyReply,
  details: detailsReply
};
