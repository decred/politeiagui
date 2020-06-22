import React from "react";
import { Formik } from "formik";
import { TextInput, Button, H2 } from "pi-ui";
import styles from "./ManageContractor.module.css";

export default function EditContractorForm({ onEdit, user, onClose }) {
  const {
    matrixname,
    githubname,
    contractorname,
    contractorlocation,
    contractorcontact
  } = user;

  const initialValues = {
    matrixname,
    githubname,
    contractorname,
    contractorlocation,
    contractorcontact
  };

  const handleEditContractor = async (
    values,
    { resetForm, setSubmitting, setFieldError }
  ) => {
    try {
      await onEdit(values);
      setSubmitting(false);
      resetForm();
      onClose();
    } catch (e) {
      setSubmitting(false);
      setFieldError("global", e);
    }
  };

  return (
    <Formik onSubmit={handleEditContractor} initialValues={initialValues}>
      {({ values, errors, handleChange, handleSubmit, isSubmitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            <H2>Edit Contractor Info</H2>
            <div className={styles.editContractor}>
              <TextInput
                label="Contractor Name"
                name="contractorname"
                id="contractorname"
                value={values.contractorname}
                error={errors.contractorname}
                onChange={handleChange}
              />
              <TextInput
                label="GitHub Username"
                name="githubname"
                id="githubname"
                value={values.githubname}
                error={errors.githubname}
                onChange={handleChange}
              />
              <TextInput
                label="Matrix Name"
                name="matrixname"
                id="matrixname"
                value={values.matrixname}
                error={errors.matrixname}
                onChange={handleChange}
              />
              <TextInput
                label="Contractor Location"
                name="contractorlocation"
                id="contractorlocation"
                value={values.contractorlocation}
                error={errors.contractorlocation}
                onChange={handleChange}
              />
              <TextInput
                label="Contractor Contact"
                name="contractorcontact"
                id="contractorcontact"
                value={values.contractorcontact}
                error={errors.contractorcontact}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" loading={isSubmitting}>
              Update Contractor Info
            </Button>
          </form>
        );
      }}
    </Formik>
  );
}
