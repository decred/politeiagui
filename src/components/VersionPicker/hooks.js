import { useState, useCallback } from "react";
import { invoice as onFetchInvoice } from "src/lib/api.js";
import { ModalDiffProposal, ModalDiffInvoice } from "src/components/ModalDiff";
import useModalContext from "src/hooks/utils/useModalContext";
import { useConfig } from "src/containers/Config";

export function useVersionPicker(version, token) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(version);
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const { recordType, constants } = useConfig();
  const [error, setError] = useState();

  async function fetchInvoiceVersions(token, version) {
    let prevInvoice = null;
    const { invoice } = await onFetchInvoice(token, version);
    if (invoice.version > 1) {
      const { invoice: prevInvoiceResponse } = await onFetchInvoice(
        token,
        version - 1
      );
      prevInvoice = prevInvoiceResponse;
    }
    return {
      invoice,
      prevInvoice
    };
  }

  const onChangeVersion = useCallback(
    async (v, latest) => {
      setSelectedVersion(v);
      try {
        if (recordType === constants.RECORD_TYPE_PROPOSAL) {
          handleOpenModal(ModalDiffProposal, {
            onClose: handleCloseModal,
            latest: latest,
            initVersion: v,
            token: token
          });
        }
        if (recordType === constants.RECORD_TYPE_INVOICE) {
          const { invoice, prevInvoice } = await fetchInvoiceVersions(token, v);
          setIsLoading(false);
          handleOpenModal(ModalDiffInvoice, {
            onClose: handleCloseModal,
            invoice,
            prevInvoice
          });
        }
      } catch (err) {
        setIsLoading(false);
        setError(err);
      }
    },
    [
      recordType,
      constants.RECORD_TYPE_PROPOSAL,
      constants.RECORD_TYPE_INVOICE,
      token,
      handleOpenModal,
      handleCloseModal
    ]
  );

  const disablePicker = version === 1;

  return {
    disablePicker,
    selectedVersion,
    onChangeVersion,
    error,
    isLoading
  };
}
