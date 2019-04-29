import { formValueSelector } from "redux-form";

const recordFormSelector = formValueSelector("form/record");

export const invoiceFormMonth = state => recordFormSelector(state, "month");
export const invoiceFormYear = state => recordFormSelector(state, "year");
