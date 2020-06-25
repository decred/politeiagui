import * as Yup from "yup";

export const searchSchema = ({ isCMS }) =>
  Yup.object().shape({
    searchBy: Yup.string()
      .required("required")
      .oneOf(["email", "username", "domain", "contractortype"]),
    searchTerm: Yup.string().when("searchBy", (searchBy, schema) =>
      !isCMS || searchBy === "email" || searchBy === "username"
        ? schema.required("required")
        : schema
    ),
    domain: Yup.string().when("searchBy", (searchBy, schema) =>
      searchBy === "domain" ? schema.required("required") : schema
    ),
    contractortype: Yup.string().when("searchBy", (searchBy, schema) =>
      searchBy === "contractortype" ? schema.required("required") : schema
    )
  });
