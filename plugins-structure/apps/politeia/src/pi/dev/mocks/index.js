import { mockRecord } from "@politeiagui/core/dev/mocks";
import {
  convertMarkdownToFile,
  convertProposalMetadataToFile,
} from "../../utils";
import { faker } from "@faker-js/faker";

function generateMetadataFile({
  name = faker.commerce.productName(),
  amount = faker.random.numeric(5) * 100,
  startdate = (Date.now() + +faker.random.numeric(6)) / 1000,
  enddate = (Date.now() + +faker.random.numeric(10)) / 1000,
  domain = "development",
} = {}) {
  return convertProposalMetadataToFile({
    amount,
    domain,
    enddate,
    name,
    startdate,
  });
}

export function mockProposal({ status, state, customToken } = {}) {
  return ({ token, version }) => {
    const record = mockRecord({ state, status })({
      token: customToken || token,
      version,
    });
    return {
      ...record,
      files: [generateMetadataFile()],
    };
  };
}

export function mockProposalDetails({
  status,
  state,
  username,
  timestamp,
  customVersion,
  customToken,
  body = faker.random.words(10),
  name,
  amount,
  enddate,
  startdate,
  domain,
} = {}) {
  return ({ token, version = customVersion }) => {
    const record = mockRecord({
      state,
      status,
      username,
      timestamp,
    })({
      token: customToken || `${token}${faker.random.numeric(9)}`,
      version,
    });
    return {
      record: {
        ...record,
        files: [
          generateMetadataFile({ name, amount, enddate, startdate, domain }),
          convertMarkdownToFile(body),
        ],
      },
    };
  };
}

export function mockPiPolicy({
  textfilesizemax = 524288,
  imagefilecountmax = 5,
  imagefilesizemax = 524288,
  namelengthmin = 8,
  namelengthmax = 80,
  namesupportedchars = [
    "A-z",
    "0-9",
    "&",
    ".",
    ",",
    ":",
    ";",
    "-",
    " ",
    "@",
    "+",
    "#",
    "/",
    "(",
    ")",
    "!",
    "?",
    '"',
    "'",
  ],
  amountmin = 100,
  amountmax = 100000000,
  startdatemin = -60072000,
  enddatemax = 60000000,
  domains = ["development", "marketing", "research", "design"],
  summariespagesize = 5,
  billingstatuschangespagesize = 5,
  billingstatuschangesmax = 1,
} = {}) {
  return () => ({
    textfilesizemax,
    imagefilecountmax,
    imagefilesizemax,
    namelengthmin,
    namelengthmax,
    namesupportedchars,
    amountmin,
    amountmax,
    startdatemin,
    enddatemax,
    domains,
    summariespagesize,
    billingstatuschangespagesize,
    billingstatuschangesmax,
  });
}

export function mockPiSummaries({ status = "under-review" } = {}) {
  return ({ tokens }) => {
    const summaries = tokens.reduce(
      (res, token) => ({ ...res, [token]: { status } }),
      {}
    );
    return { summaries };
  };
}