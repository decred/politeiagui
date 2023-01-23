import React from "react";
import { records } from "@politeiagui/core/records";
import { useSelector } from "react-redux";
import { decodeProposalRecord } from "../../pi/proposals/utils";
import { SingleContentPage } from "@politeiagui/common-ui/layout";
import {
  formatDateToInternationalString,
  formatUnixTimestampToObj,
} from "@politeiagui/common-ui/utils";

function displayProposalInMarkdown({
  author,
  body,
  censored,
  name,
  proposalMetadata: { domain, amount, enddate, startdate },
  version,
  token,
}) {
  const startDate =
    startdate &&
    formatDateToInternationalString(formatUnixTimestampToObj(startdate));
  const endDate =
    enddate &&
    formatDateToInternationalString(formatUnixTimestampToObj(enddate));
  console.log(author);

  return `
****
# ${name}

- Token: ${token}
- Author: ${author.username}
- Version: ${version}
- Censored: ${censored}

## Proposal Metadata
${domain && `- Domain: ${domain}`}
${amount && `- Amount: ${amount} USD`}
${startDate && `- Start Date: ${startDate}`}
${endDate && `- End Date: ${endDate}`}

****

${body}
`;
}

function ProposalRawPage({ token }) {
  const record = useSelector((state) =>
    records.selectByShortToken(state, token)
  );
  const proposal = decodeProposalRecord(record);
  const md = proposal && displayProposalInMarkdown(proposal);

  return (
    <SingleContentPage>
      <pre>{md}</pre>
    </SingleContentPage>
  );
}

export default ProposalRawPage;
