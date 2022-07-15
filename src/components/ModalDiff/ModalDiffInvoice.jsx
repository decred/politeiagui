import React, { useMemo } from "react";
import { Text, Modal, CopyableText, Message } from "pi-ui";
import PropTypes from "prop-types";
import { DiffInvoices } from "src/components/Diff/Diff";
import {
  Author,
  Event,
  Title,
  Header,
  Subtitle,
  RecordToken
} from "src/components/RecordWrapper";
import Field from "src/components/Invoice/Field";
import { Row } from "src/components/layout";
import styles from "./ModalDiff.module.css";
import { presentationalInvoiceName } from "src/containers/Invoice/helpers";
import uniq from "lodash/uniq";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import usePolicy from "src/hooks/api/usePolicy";

const ModalDiffInvoice = ({ onClose, invoice, prevInvoice, ...props }) => {
  const prevInput = prevInvoice && prevInvoice.input ? prevInvoice.input : [];
  const {
    policyTicketVote: { summariespagesize: proposalPageSize }
  } = usePolicy();
  const proposalsTokens = useMemo(() => {
    const prevTokens = prevInput.lineitems
      ? prevInput.lineitems.map(({ proposaltoken }) => proposaltoken)
      : [];
    const tokens = invoice.input.lineitems.map(
      ({ proposaltoken }) => proposaltoken
    );
    return uniq([...prevTokens, ...tokens]).filter((t) => t !== "");
  }, [invoice.input.lineitems, prevInput]);

  const { proposalsByToken, error } = useApprovedProposals(
    proposalPageSize,
    proposalsTokens
  );

  return (
    <Modal
      onClose={onClose}
      {...props}
      contentStyle={{ width: "100%", minHeight: "40rem" }}
    >
      {error && <Message kind="error">{error.toString()}</Message>}
      <Header
        title={
          <Title id={"proposal-title-gfsag"} truncate linesBeforeTruncate={2}>
            {presentationalInvoiceName(invoice)}
          </Title>
        }
        subtitle={
          <Subtitle>
            <Author
              username={invoice.username}
              url={`/user/${invoice.userid}`}
            />
            {invoice.timestamp !== invoice.publishedat &&
              invoice.timestamp !== invoice.abandonedat && (
                <Event event="edited" timestamp={invoice.timestamp} />
              )}
            {invoice.abandonedat && (
              <Event event={"abandoned"} timestamp={invoice.abandonedat} />
            )}
            {invoice.version && (
              <Text
                id={`proposal-${invoice.proposalToken}-version`}
                className={styles.version}
              >{`version ${invoice.version}`}</Text>
            )}
          </Subtitle>
        }
      />
      <Row topMarginSize="s">
        <RecordToken token={invoice.censorshiprecord.token} />
      </Row>
      <Row justify="space-between" className={styles.topDetails}>
        <div className={styles.field}>
          <Text weight="semibold">{invoice.input.contractorname}</Text>
          <Text>{invoice.input.contractorlocation}</Text>
          <Text>{invoice.input.contractorcontact}</Text>
        </div>
        <Field
          label={"Pay to Address:"}
          value={invoice.input.paymentaddress}
          renderValue={(addr) => (
            <CopyableText
              id="invoice-diff-payment-address"
              truncate
              tooltipPlacement={"bottom"}
            >
              {addr}
            </CopyableText>
          )}
        />
      </Row>
      <div className={styles.lineitemsWrapper}>
        <DiffInvoices
          newData={invoice.input}
          oldData={prevInput}
          proposals={proposalsByToken}
          className="margin-top-m"
        />
      </div>
    </Modal>
  );
};
ModalDiffInvoice.propTypes = {
  onClose: PropTypes.func.isRequired,
  oldText: PropTypes.string,
  newText: PropTypes.string,
  oldFiles: PropTypes.array,
  newFiles: PropTypes.array,
  proposalDetails: PropTypes.object
};

export default ModalDiffInvoice;
