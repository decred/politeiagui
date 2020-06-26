import * as Yup from "yup";

export const searchSchema = Yup.object().shape({
  searchBy: Yup.string()
    .required("required")
    .oneOf(["email", "username", "domain", "contractortype"]),
  searchTerm: Yup.string().when("searchBy", (searchBy, schema) =>
    searchBy === "email" || searchBy === "username"
      ? schema.required("required")
      : schema
  ),
  domain: Yup.object().when("searchBy", (searchBy, schema) =>
    searchBy === "domain" ? schema.required("required") : schema
  ),
  contractortype: Yup.object().when("searchBy", (searchBy, schema) =>
    searchBy === "contractortype" ? schema.required("required") : schema
  )
});
