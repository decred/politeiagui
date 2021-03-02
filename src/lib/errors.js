const APIPi = "pi";
const APIRecords = "records";
const APIComments = "comments";
const APITicketvote = "ticketvote";
const APIWww = "v1"; // www api has no prefix so it's identified by v1

const PluginIdPi = "pi";
const PluginIdComments = "comments";
const PluginIdTicketvote = "ticketvote";

const defaultErrorMessage = (code = 0, api = "") => `
  The server encountered an unexpected error, please contact Politeia
  administrators and inform the api/${api} error code: ${code}
`;

// API User errors
export function APIUserError(response, code, context) {
  const url = new URL(response.url);
  const apiType = url.pathname.split("/")[2];

  switch (apiType) {
    case APIPi:
      throw new PiUserError(code);
    case APIRecords:
      throw new RecordsUserError(code, context);
    case APIComments:
      throw new CommentsUserError(code);
    case APITicketvote:
      throw new TicketvoteUserError(code);
    case APIWww:
      throw new WWWUserError(code, context);
    default:
      defaultErrorMessage();
  }
}

// API Plugin errors
export function APIPluginError(pluginId, code, context) {
  switch (pluginId) {
    case PluginIdPi:
      throw new PiPluginError(code, context);
    case PluginIdComments:
      throw new CommentsPluginError(code, context);
    case PluginIdTicketvote:
      throw new TicketvotePluginError(code, context);
    default:
      defaultErrorMessage();
  }
}

function PiUserError(code) {
  const errorMap = {
    1: "Invalid inputs for request",
    2: "The number of requested proposal tokens exceeds the page size policy",
    3: "The proposal was in an invalid state"
  };

  this.message = errorMap[code] || defaultErrorMessage(code, APIPi);
}

PiUserError.prototype = new Error();

function RecordsUserError(code, context) {
  const errorMap = {
    1: "Invalid inputs for request",
    2: `The file ${context} has an invalid name`,
    3: `The file ${context} has an invalid MIME type`,
    4: `The file ${context} has an invalid digest`,
    5: `The file ${context} has an invalid base64 payload`,
    6: `The provided record mdstream has an invalid ID ${context}`,
    8: "The provided record mdstream has an invalid payload",
    9: "The provided user public key is not active",
    10: "The provided signature is invalid",
    11: "The provided record token is invalid",
    12: "The provided record state is invalid",
    13: "The record was not found",
    14: "The record is locked for changes",
    15: "The record has no changes and therefore cannot be updated",
    16: "The record status is empty or is attempting an invalid transition",
    17: "The status reason was not found",
    18: "The number of requested record tokens exceeds the page size policy"
  };

  this.message = errorMap[code] || defaultErrorMessage(code, APIRecords);
}

RecordsUserError.prototype = new Error();

function CommentsUserError(code) {
  const errorMap = {
    1: "Invalid inputs for request",
    2: "Unvetted records can only be voted by an admin or the author",
    3: "The user public key is not active",
    4: "The provided signature was invalid for this comment",
    5: "The record is in an invalidstate",
    6: "The record token is invalid",
    7: "The record was not found",
    8: "The record is locked for changes",
    9: "No tokens found in the count votes request"
  };

  this.message = errorMap[code] || defaultErrorMessage(code, APIComments);
}

CommentsUserError.prototype = new Error();

function TicketvoteUserError(code) {
  const errorMap = {
    1: "Invalid inputs for request",
    2: "The provided user public key is not active",
    3: "Unauthorized operation"
  };

  this.message = errorMap[code] || defaultErrorMessage(code, APITicketvote);
}

TicketvoteUserError.prototype = new Error();

function WWWUserError(code, context) {
  const errorMap = {
    1: "The provided password was invalid",
    2: "The provided email address is invalid",
    3: "The provided verification token is invalid. Please ensure you click the link or copy and paste it exactly as it appears in the verification email",
    4: "The provided verification token is expired. Please register again to receive another email with a new verification token",
    5: `The provided proposal is missing the following file(s): ${context}`,
    6: "The requested proposal was not found",
    7: `The provided proposal has duplicate files: ${context}`,
    8: "The provided proposal has an invalid title",
    9: "The submitted proposal has too many markdown files",
    10: "The submitted proposal has too many images",
    11: "The submitted proposal markdown is too large",
    12: "The submitted proposal has one or more images that are too large",
    13: "The password you provided is invalid; it's either too short, too long, or has unsupported characters.",
    14: "The requested comment was not found",
    15: "The provided proposal name was invalid",
    16: "The SHA256 checksum for one of the files was incorrect",
    17: "The Base64 encoding for one of the files was incorrect",
    18: `The MIME type detected for ${context} is not supported`,
    19: "The MIME type for one of the files is not supported",
    20: "The requested proposal status transition is invalid",
    21: "The provided public key was invalid",
    22: "No active public key was found for your account, please visit your account page to resolve this issue",
    23: "The provided signature was invalid",
    24: "The provided inputs were invalid",
    25: "The private key used for signing was invalid",
    26: "Your comment is too long",
    27: "The user was not found",
    28: "The proposal is in an unexpected state, please contact Politeia administrators",
    29: "You must be logged in to perform this action",
    30: "You must pay the registration fee to perform this action",
    31: "You cannot change the status of your own proposal, please have another admin review it!",
    32: "The username you provided is invalid; it's either too short, too long, or has unsupported characters",
    33: "Another user already has that username, please choose another",
    34: "A verification email has already been sent recently. Please check your email, or wait until it expires and send another one",
    35: "The server cannot verify the payment at this time, please try again later or contact Politeia administrators",
    36: "The public key provided is already taken by another user",
    37: "The proposal cannot be set to that voting status",
    38: "Your account has been locked due to too many login attempts",
    40: "That is an invalid user edit action",
    41: "You are not authorized to perform this action",
    42: "This proposal is in the wrong state for that action",
    43: "Commenting is not allowed on this proposal",
    44: "You cannot vote on this comment",
    45: "You must provide a reason for censoring the proposal",
    46: "You must provide a reason for censoring the comment",
    47: "You cannot censor this comment",
    48: "Only the proposal author may perform this action",
    49: "The author has not yet authorized a vote for this proposal",
    50: "The vote has already been authorized for this proposal",
    51: "That is an invalid vote authorization action",
    52: "This account has been deactivated",
    53: "Your email address has not yet been verified",
    54: "Invalid proposal vote parameters",
    55: "Email address is not verified",
    56: "Invalid user ID",
    57: "Invalid like comment action",
    58: "Invalid proposal censorship token",
    59: "Email address is already verified",
    60: "No changes were found in the proposal",
    61: "Maximum proposal page size exceeded",
    62: "That is a duplicate comment.",
    63: "Invalid login credentials",
    64: "Comment is censored",
    65: "Invalid proposal version",
    66: "Invalid proposal metadata",
    67: "Missing proposal metadata",
    68: "Proposal metadata digest invalid",
    69: "Invalid vote type",
    70: "Invalid vote option",
    71: "The proposal linkby deadline was not met yet",
    72: "The RFP proposal has no linked proposals",
    73: "Invalid proposal linkto",
    74: "Invalid proposal linkby",
    75: "Invalid runoff vote",
    76: "Wrong proposal type",
    77: "The provided passcode for TOTP validation does not match the saved secret key",
    78: "Invalid TOTP type",
    79: "Login requires the TOTP code",
    80: "You must wait until the next TOTP code window",

    // CMS Errors
    1001: "Malformed name",
    1002: "Malformed location",
    1003: "Invoice cannot be found",
    1004: "Month or year was set, while the other was not",
    1005: "Invalid invoice status transition",
    1006: "Reason for action not provided",
    1007: "Submitted invoice file is malformed",
    1008: "Submitted invoice is a duplicate of an existing invoice",
    1009: "Invalid payment address",
    1010: "Malformed line item submitted",
    1011: "Invoice missing contractor name",
    1013: "Invoice missing contractor contact",
    1014: "Invoice missing contractor rate",
    1015: "Invoice has invalid contractor rate",
    1016: "Invoice has malformed contractor contact",
    1017: "Line item has malformed proposal token",
    1018: "Line item has malformed domain",
    1019: "Line item has malformed subdomain",
    1020: "Line item has malformed description",
    1021: "Invoice is an wrong status to be editted (approved, rejected or paid)",
    1022: "Invoices require at least 1 line item",
    1023: "Only one invoice per month/year is allowed to be submitted",
    1024: "An invalid month/year was submitted on an invoice",
    1025: "Exchange rate was invalid or didn't match the expected result",
    1026: "An invalid line item type was entered",
    1027: "An invalid value was entered into labor or expenses",
    1028: "The invoice has a duplicate payment address, please use a new address",
    1029: "Invalid dates were requested for line item payouts",
    1030: "An attempted edit of invoice included an unauthorized month or year change",
    1031: "An invalid DCC Type was included in the request",
    1032: "Your domain does not match the DCC domain",
    1033: "The DCC sponsor statement is malformed",
    1034: "The submitted DCC file is malformed, please review and try again",
    1035: "This error is currently not implemented",
    1036: "There was an invalid status transition detected",
    1037: "That email is already being used by another user",
    1038: "You do not have the correct contractor status to submit an invoice",
    1039: "An invalid nominee was submitted for a DCC",
    1040: "The requested DCC was not found",
    1041: "Cannot comment/support/oppose a DCC if it's not active",
    1042: "Invalid suppport or opposition vote was included, must be aye or nay",
    1043: "You have already supported or opposed this DCC",
    1044: "You may not support or oppose your own sponsored DCC",
    1045: "You are not authorized to complete a DCC request",
    1046: "You must include a valid contractor type for a DCC",
    1047: "You must be a Supervisor Contractor to submit a Sub Contractor line item",
    1048: "You must supply a UserID for a Sub Contractor line item",
    1049: "Invalid SubContractor",
    1050: `Supervisor Error - ${context}`,
    1051: "Malformed DCC",
    1052: "The DCC is not currently up for an all user vote",
    1053: "The user does not have the sufficient user weight for this vote",
    1054: "The all contractors voting period has ended",
    1055: "Cannot update the status of a DCC while the vote is still live",
    1056: "The user has already submitted a vote for this DCC",
    1057: "Codestats site username is required to receive the code stats",
    1058: "Code tracker required for attempted request, check token setting in config"
  };

  this.message = errorMap[code] || defaultErrorMessage(code, APIWww);
}

WWWUserError.prototype = new Error();

function PiPluginError(code, context) {
  const errorMap = {
    1: `The file ${context} has an invalid name`,
    2: `The file size is invalid, ${context}`,
    3: `The required ${context} file is missing`,
    4: `The provided images exceeds the maximum allowed, ${context}`,
    5: `The file exceeds the maximum allowed size, ${context}`,
    6: `The proposal name ${context} is invalid`,
    7: `This operation is not allowed, ${context}`
  };

  this.message = errorMap[code] || defaultErrorMessage(code, PluginIdPi);
}

PiPluginError.prototype = new Error();

function CommentsPluginError(code, context) {
  const errorMap = {
    1: `The provided proposal token is invalid, ${context}`,
    2: "The provided user public key is not active",
    3: "The provided signature is invalid",
    4: `The comment exceeds the maximum length allowed, ${context}`,
    5: "The comment has no changes and therefore cannot be updated",
    6: `The provided comment code is not found ${context}`,
    7: "Only the comment author is allowed to edit",
    8: `The provided parent ID is invalid, ${context}`,
    9: `The provided comment vote is invalid, ${context}`,
    10: "You have exceeded the max number of changes on your vote"
  };

  this.message = errorMap[code] || defaultErrorMessage(code, PluginIdComments);
}

CommentsPluginError.prototype = new Error();

function TicketvotePluginError(code, context) {
  const errorMap = {
    1: `The provided record token is invalid, ${context}`,
    2: "The provided user public key is invalid",
    3: "The provided signature is invalid",
    4: `The provided record version is invalid, ${context}`,
    5: `The provided record status is invalid, ${context}`,
    6: `This operation is not authorized, ${context}`,
    7: `The start details for this vote are missing, ${context}`,
    8: `The start details for this vote are invalid, ${context}`,
    9: `The provided vote parameters are invalid, ${context}`,
    10: `This operation is invalid for this vote status, ${context}`,
    11: `The provided metadata for this vote is invalid, ${context}`,
    12: `The provided linkBy is invalid, ${context}`,
    13: `The provided linkTo is invalid, ${context}`,
    14: `The parent for the runnoff vote is invalid, ${context}`,
    15: `The linkBy deadline for this record is not yet expired, ${context}`
  };

  this.message = errorMap[code] || defaultErrorMessage(code, PluginIdComments);
}

TicketvotePluginError.prototype = new Error();

// Helpers
export function isAPIWww(url) {
  const apiType = new URL(url).pathname.split("/")[2];
  return apiType === APIWww;
}
