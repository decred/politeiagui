import { Record, File, Inventory } from "./generate";
import { stateToString } from "./utils";

export const API_BASE_URL = "/api/records/v1";

// errorReply is the reply that the server returns when you want to force
// an error
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

// policyReply is the reply to the Policy command.
export function policyReply({ recordspagesize = 5, inventorypagesize = 20 }) {
  return {
    recordspagesize,
    inventorypagesize
  };
}

// recordsReply is the reply to the Records command.
export function recordsReply(
  { status, state, metadatafiles, recordfiles, user } = {},
  { requests = [] }
) {
  const findFile = (name, files) => files.find((f) => f.name === name);
  const records = requests.reduce((acc, { token, filenames }) => {
    const files =
      recordfiles && filenames.map((f) => new File(findFile(f, recordFiles)));
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

// inventoryReply is the reply to the Inventory command. The returned maps are
// map[status][]token where the status is the human readable record status..
export function inventoryReply(
  { amountByStatus = {}, pageLimit = 20 } = {},
  { state = 2, page }
) {
  const inventory = new Inventory(amountByStatus, {
    page,
    pageLimit
  });
  return { [stateToString(state)]: inventory };
}

export const repliers = {
  records: recordsReply,
  inventory: inventoryReply,
  policy: policyReply
};
