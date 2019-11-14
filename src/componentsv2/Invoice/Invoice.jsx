import { classNames, StatusBar, StatusTag, Text, useMediaQuery } from "pi-ui";
import React, { useState } from "react";
// import Markdown from "../Markdown";
// import ModalSearchVotes from "../ModalSearchVotes";
import RecordWrapper from "../RecordWrapper";
// import IconButton from "src/componentsv2/IconButton";
import { getInvoiceStatusTagProps } from "./helpers";
// import {
//   getMarkdownContent,
//   getVotesReceived,
//   isAbandonedProposal,
//   isPublicProposal,
//   isEditableProposal,
//   getQuorumInVotes,
//   isVotingFinishedProposal
// } from "src/containers/Proposal/helpers";
// import { useProposalVote } from "src/containers/Proposal/hooks";
// import { useLoaderContext } from "src/containers/Loader";
import styles from "./Invoice.module.css";
// import LoggedInContent from "src/componentsv2/LoggedInContent";
// import VotesCount from "./VotesCount";
// import DownloadComments from "src/containers/Comments/Download";
// import ProposalActions from "./ProposalActions";
// import { useFullImageModal } from "src/componentsv2/ProposalForm/hooks";
// import { ThumbnailGrid } from "src/componentsv2/Files/Thumbnail";
// import ModalFullImage from "src/componentsv2/ModalFullImage";
// import VersionPicker from "src/componentsv2/VersionPicker";
// import { useRouter } from "src/componentsv2/Router";

const Invoice = ({ invoice, extended, collapseBodyContent }) => {
  const {
    censorshiprecord,
    file,
    input,
    status,
    timestamp,
    userid,
    username,
    version
  } = invoice;

  const mobile = useMediaQuery("(max-width: 560px)");

  const invoiceToken = censorshiprecord && censorshiprecord.token;
  const invoiceURL = `/invoices/${invoiceToken}`;
  const invoiceMonth = input && input.month;
  const invoiceYear = input && input.year;
  const invContractorName = input && input.contractorname;

  return (
    <RecordWrapper>
      {({
        Author,
        Event,
        Row,
        Title,
        CommentsLink,
        GithubLink,
        ChartsLink,
        DownloadRecord,
        Header,
        Subtitle,
        Edit,
        Status,
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
                  {`Invoice from ${invContractorName} - ${invoiceMonth}/${invoiceYear}`}
                </Title>
              }
              subtitle={
                <Subtitle>
                  <Author username={username} id={userid} />
                  <Event event="edited" timestamp={timestamp} />
                  {version > 1 && !mobile && (
                    <Text
                      id={`invoice-${invoiceToken}-version`}
                      className={classNames(styles.version)}
                      color="gray"
                      truncate
                    >{`version ${version}`}</Text>
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
            />
          </>
        );
      }}
    </RecordWrapper>
  );
};

export default Invoice;
