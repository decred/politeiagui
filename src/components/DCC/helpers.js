import {
  DCC_STATUS_ACTIVE,
  // DCC_STATUS_SUPPORTED,
  DCC_STATUS_APPROVED,
  DCC_STATUS_REJECTED,
  // DCC_STATUS_DEBATE,
  DCC_TYPE_ISSUANCE,
  DCC_TYPE_REVOCATION
} from "../../constants";

export const dccStatusList = [
  {
    label: "active",
    value: DCC_STATUS_ACTIVE
  },
  // {
  //   label: "supported",
  //   value: DCC_STATUS_SUPPORTED
  // },
  {
    label: "approved",
    value: DCC_STATUS_APPROVED
  },
  {
    label: "rejected",
    value: DCC_STATUS_REJECTED
  }
  // {
  //   label: "debate",
  //   value: DCC_STATUS_DEBATE
  // }
];

export const dccChangeStatusList = [
  // {
  //   label: "support",
  //   value: DCC_STATUS_SUPPORTED
  // },
  {
    label: "approve",
    value: DCC_STATUS_APPROVED
  },
  {
    label: "reject",
    value: DCC_STATUS_REJECTED
  }
  // {
  //   label: "debate",
  //   value: DCC_STATUS_DEBATE
  // }
];

export const typesForDCC = {
  [DCC_TYPE_ISSUANCE]: "Issuance",
  [DCC_TYPE_REVOCATION]: "Revocation"
};

export const getDCCStatus = status => {
  const { label } = dccStatusList.find(st => st.value === status);
  return label;
};
