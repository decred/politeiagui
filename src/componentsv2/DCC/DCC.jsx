import {
  // classNames,
  StatusTag,
  Text
  // useMediaQuery
  // CopyableText
} from "pi-ui";
import React from "react";
import RecordWrapper from "src/componentsv2/RecordWrapper";
import Field from "./Field";
import styles from "./DCC.module.css";
// import { DccActions } from "src/containers/DCC/Actions";
import {
  presentationalDccName,
  getDccStatusTagProps,
  presentationalDccType,
  presentationalDccContractorType,
  presentationalDccDomain,
  presentationalStatement,
  isRevocationDcc,
  isDccActive
} from "src/containers/DCC/helpers";

const Dcc = ({ dcc, extended }) => {
  const {
    censorshiprecord,
    dccpayload,
    timestamp,
    sponsoruserid,
    nomineeusername,
    sponsorusername,
    statuschangereason
    // status,
  } = dcc;

  // const mobile = useMediaQuery("(max-width: 560px)");

  const dccToken = censorshiprecord && censorshiprecord.token;
  const dccURL = `/dccs/${dccToken}`;
  const dccDomain = dccpayload && dccpayload.domain;
  const dccContractorType = dccpayload && dccpayload.contractortype;
  // const dccNomineeUserID = dccpayload && dccpayload.nomineeuserid;
  const dccStatement = dccpayload && dccpayload.statement;

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
                  url={extended ? "" : dccURL}>
                  {presentationalDccName(dcc)}
                </Title>
              }
              subtitle={
                <Subtitle>
                  <Author username={sponsorusername} id={sponsoruserid} />
                  { !extended && !isRevocationDcc(dcc) &&
                    <Text>
                      {presentationalDccContractorType(dccContractorType)}
                    </Text>
                  }
                  { !extended &&
                    <Text>
                      {presentationalDccDomain(dccDomain)}
                    </Text>
                  }
                  <Event event="submitted" timestamp={timestamp} />
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
                <Row justify="space-between" className={styles.topDetails}>
                  <Field
                    label="Type"
                    value={presentationalDccType(dcc)}
                  />
                  <Field label="Nominee" value={nomineeusername} />
                  <Field
                    label="Domain"
                    value={presentationalDccDomain(dccDomain)}
                  />
                  { !isRevocationDcc(dcc) && <Field
                    label="Contractor Type"
                    value={presentationalDccContractorType(dccContractorType)}
                  /> }
                </Row>
                <Row justify="space-between" className={styles.topDetails}>
                  <div className={styles.field}>
                    <Text size="small">Statement</Text>
                    <Text>{presentationalStatement(dccStatement)}</Text>
                  </div>
                </Row>
                {!isDccActive(dcc) && <Row justify="space-between" className={styles.topDetails}>
                  <div className={styles.field}>
                    <Text size="small">Status change reason</Text>
                    <Text>{statuschangereason}</Text>
                  </div>
                </Row>}
              </>
            )}
            {/* <DccActions dcc={dcc} /> */}
          </>
        );
      }}
    </RecordWrapper>
  );
};

export default Dcc;
