import { StatusTag, Text, classNames } from "pi-ui";
import React from "react";
import RecordWrapper from "src/components/RecordWrapper";
import Field from "./Field";
import styles from "./DCC.module.css";
import {
  presentationalDccName,
  getDccStatusTagProps,
  presentationalDccType,
  presentationalDccContractorType,
  presentationalStatement,
  isRevocationDcc,
  isDccActive,
  isDccApproved
} from "src/containers/DCC/helpers";
import { SupportOppose, DccActions } from "src/containers/DCC/Actions";
import { usePolicy } from "src/hooks";
import { getContractorDomains, getDomainName } from "src/helpers";

const Dcc = ({ dcc, extended }) => {
  const {
    censorshiprecord,
    dccpayload,
    timesubmitted,
    sponsoruserid,
    nomineeusername,
    sponsorusername,
    statuschangereason,
    timereviewed
  } = dcc;

  const {
    policy: { supporteddomains }
  } = usePolicy();
  const contractorDomains = getContractorDomains(supporteddomains);
  const isActive = isDccActive(dcc);
  const dccToken = censorshiprecord && censorshiprecord.token;
  const dccURL = `/dccs/${dccToken}`;
  const dccDomain = dccpayload && dccpayload.domain;
  const dccContractorType = dccpayload && dccpayload.contractortype;
  const dccStatement = dccpayload && dccpayload.statement;
  const domainName = getDomainName(contractorDomains, dccDomain);

  return (
    <RecordWrapper>
      {({
        Author,
        Event,
        Row,
        Title,
        Header,
        Subtitle,
        Status,
        RecordToken
      }) => {
        return (
          <>
            <Header
              title={
                <Title
                  id={`dcc-title-${dccToken}`}
                  truncate
                  linesBeforeTruncate={2}
                  url={extended ? "" : dccURL}
                >
                  {presentationalDccName(dcc)}
                </Title>
              }
              subtitle={
                <Subtitle>
                  <Author
                    username={sponsorusername}
                    url={`/user/${sponsoruserid}`}
                  />
                  {!extended && !isRevocationDcc(dcc) && (
                    <Text>
                      {presentationalDccContractorType(dccContractorType)}
                    </Text>
                  )}
                  {!extended && <Text>{domainName}</Text>}
                  <Event event="submitted" timestamp={timesubmitted} />
                  {timereviewed && (
                    <Event
                      event={isDccApproved(dcc) ? "approved" : "rejected"}
                      timestamp={timereviewed}
                    />
                  )}
                  {!isActive && !extended && <Text>{statuschangereason}</Text>}
                </Subtitle>
              }
              status={
                <Status>
                  <StatusTag
                    className={styles.statusTag}
                    {...getDccStatusTagProps(dcc)}
                  />
                </Status>
              }
            />
            {extended && (
              <>
                <Row topMarginSize="s">
                  <RecordToken token={dccToken} />
                </Row>
                <Row
                  justify="space-between"
                  bottomMarginSize="m"
                  className={styles.topDetails}
                >
                  <Field label="Type" value={presentationalDccType(dcc)} />
                  <Field label="Nominee" value={nomineeusername} />
                  <Field label="Domain" value={domainName} />
                  {!isRevocationDcc(dcc) && (
                    <Field
                      label="Contractor Type"
                      value={presentationalDccContractorType(dccContractorType)}
                    />
                  )}
                </Row>
                <Row justify="space-between" className={styles.topDetails}>
                  <div className={styles.field}>
                    <Text size="small">Statement</Text>
                    <Text className={styles.statement}>
                      {presentationalStatement(dccStatement)}
                    </Text>
                  </div>
                </Row>
                {!isActive && (
                  <Row justify="space-between" className={styles.topDetails}>
                    <div className={styles.field}>
                      <Text size="small">Status change reason</Text>
                      <Text>{statuschangereason}</Text>
                    </div>
                  </Row>
                )}
                <SupportOppose
                  className={styles.supportOpposeBar}
                  buttonsClassName={styles.supportOpposeButtons}
                  dcc={dcc}
                  token={dccToken}
                />
              </>
            )}
            <DccActions
              dcc={dcc}
              className={classNames(
                !extended && "justify-right margin-bottom-xs",
                styles.dccActions
              )}
            />
          </>
        );
      }}
    </RecordWrapper>
  );
};

export default React.memo(Dcc);
