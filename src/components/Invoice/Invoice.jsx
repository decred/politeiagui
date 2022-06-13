import {
  classNames,
  StatusTag,
  Text,
  useMediaQuery,
  CopyableText,
  useTheme,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import RecordWrapper from "../RecordWrapper";
import { getInvoiceStatusTagProps, isEditableInvoice } from "./helpers";
import styles from "./Invoice.module.css";
import { InvoiceActions } from "src/containers/Invoice/Actions";
import {
  presentationalInvoiceName,
  getInvoiceTotalHours,
  hasDecimalPlaces
} from "src/containers/Invoice/helpers";
import Field from "./Field";
import InvoiceDatasheet from "../InvoiceDatasheet";
import { convertAtomsToDcr, usdFormatter } from "src/utils";
import ThumbnailGrid from "src/components/Files";
import VersionPicker from "src/components/VersionPicker";

const Invoice = ({
  invoice,
  isAuthor,
  isPublicMode,
  extended,
  approvedProposalsError,
  approvedProposals
}) => {
  const {
    censorshiprecord,
    file,
    input,
    status,
    timestamp,
    userid,
    username,
    version,
    payout
  } = invoice;
  const mobile = useMediaQuery("(max-width: 560px)");
  const { themeName } = useTheme();
  const isEditable = isAuthor && isEditableInvoice(status);
  const invoiceToken = censorshiprecord && censorshiprecord.token;
  const invoiceURL = `/invoices/${invoiceToken}`;
  const invContractorName = input && input.contractorname;
  const invContractorLocation = input && input.contractorlocation;
  const invContractorRate = input && input.contractorrate;
  const invContractorContact = input && input.contractorcontact;
  const paymentAddress = input && input.paymentaddress;
  const exchangeRate = input && input.exchangerate;
  const totalHours = getInvoiceTotalHours(invoice);
  const totalExpenses = payout && payout.expensetotal / 100;
  const totalAmount = payout && payout.total / 100;
  const totalDcrAmount = payout && convertAtomsToDcr(payout.dcrtotal);
  const showExtendedVersionPicker = extended && version > 1;
  const showVersionAsText = version > 1 && !extended && !mobile;
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;

  // record attchments without the invoice file
  const invoiceAttachments = useMemo(
    () => (file || []).filter((f) => !f.mime.includes("text/")),
    [file]
  );

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
        Edit,
        RecordToken
      }) => {
        return (
          <>
            <Header
              title={
                <Title
                  id={`invoice-title-${invoiceToken}`}
                  truncate
                  linesBeforeTruncate={2}
                  url={extended ? "" : invoiceURL}
                >
                  {presentationalInvoiceName(invoice)}
                </Title>
              }
              subtitle={
                <Subtitle>
                  <Author
                    username={username}
                    url={`/user/${userid}`}
                    id={userid}
                  />
                  <Event event="edited" timestamp={timestamp} />
                  {showVersionAsText && (
                    <Text
                      id={`invoice-${invoiceToken}-version`}
                      className={classNames(styles.version)}
                      color="gray"
                      truncate
                    >{`version ${version}`}</Text>
                  )}
                  {showExtendedVersionPicker && (
                    <VersionPicker
                      className={classNames(
                        styles.versionPicker,
                        isDarkTheme && styles.darkVersionPicker
                      )}
                      version={version}
                      token={invoiceToken}
                      proposals={approvedProposals}
                    />
                  )}
                </Subtitle>
              }
              status={
                <Status>
                  <StatusTag
                    className={styles.statusTag}
                    {...getInvoiceStatusTagProps(invoice)}
                  />
                </Status>
              }
              edit={
                isEditable && <Edit url={`/invoices/${invoiceToken}/edit`} />
              }
            />
            {extended && (
              <>
                <Row topMarginSize="s">
                  <RecordToken token={invoiceToken} />
                </Row>
                <Row justify="space-between" className={styles.topDetails}>
                  <div className={styles.field}>
                    <Text weight="semibold">{invContractorName}</Text>
                    <Text>{invContractorLocation}</Text>
                    <Text>{invContractorContact}</Text>
                  </div>
                  {!isPublicMode && (
                    <Field
                      label={"Pay to Address:"}
                      value={paymentAddress}
                      renderValue={(addr) => (
                        <CopyableText
                          id="invoice-payment-address"
                          truncate
                          tooltipPlacement={"bottom"}
                        >
                          {addr}
                        </CopyableText>
                      )}
                    />
                  )}
                </Row>
                {!isPublicMode && (
                  <Row justify="space-between" className={styles.topDetails}>
                    <Field
                      label="Total hours:"
                      value={`${
                        // verify if has decimal places
                        hasDecimalPlaces(totalHours)
                          ? totalHours.toFixed(2)
                          : totalHours
                      }h`}
                    />
                    <Field
                      label="Contractor Rate:"
                      value={usdFormatter.format(invContractorRate / 100)}
                    />
                    <Field
                      label="Total expenses:"
                      value={usdFormatter.format(totalExpenses)}
                    />
                    <Field
                      label="Exchange rate:"
                      value={usdFormatter.format(exchangeRate / 100)}
                    />
                    <Field
                      label="Amount:"
                      value={usdFormatter.format(totalAmount)}
                    />
                    <Field label="Amount (dcr):" value={totalDcrAmount} />
                  </Row>
                )}
                {extended && !!invoiceAttachments.length && (
                  <Row
                    className={styles.filesRow}
                    justify="left"
                    topMarginSize="s"
                  >
                    <ThumbnailGrid
                      value={invoiceAttachments}
                      onClick={() => null}
                      viewOnly={true}
                    />
                  </Row>
                )}
                <InvoiceDatasheet
                  value={
                    invoice &&
                    invoice.input.lineitems &&
                    invoice.input.lineitems.map((li) => {
                      const proposal = approvedProposals.find(
                        (el) => el.censorshiprecord.token === li.proposaltoken
                      );
                      return {
                        ...li,
                        proposaltoken: proposal ? proposal.name : ""
                      };
                    })
                  }
                  readOnly
                  isMobile={mobile}
                  userRate={invContractorRate / 100}
                  proposals={approvedProposals || []}
                  proposalsError={approvedProposalsError}
                />
              </>
            )}
            <InvoiceActions invoice={invoice} extended={extended} />
          </>
        );
      }}
    </RecordWrapper>
  );
};

Invoice.propTypes = {
  invoice: PropTypes.object.isRequired,
  approvedProposals: PropTypes.array
};

export default Invoice;
