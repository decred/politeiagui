import React, { useEffect } from "react";
import { H1, Message, Spinner, classNames } from "pi-ui";
import { Formik, useField, Form as FormikForm, useFormikContext } from "formik";
import Link from "../Link";
import styles from "./FormWrapper.module.css";
import MarkdownEditor from "src/components/MarkdownEditor";
import useSessionStorage from "src/hooks/utils/useSessionStorage";
import useScrollFormOnError from "src/hooks/utils/useScrollFormOnError";
import AttachFileInput from "src/components/AttachFileInput";
import {
  Select,
  TextArea,
  SubmitButton,
  RadioButtonGroup,
  TextInput
} from "./fields";

const Title = ({ className, ...props }) => (
  <H1 className={classNames(styles.title, className)} {...props} />
);

const Actions = ({ className, ...props }) => (
  <div
    className={classNames(
      props.children.length > 1 ? styles.actions : styles.singleAction,
      className
    )}
    {...props}
  />
);

const Footer = ({ className, ...props }) => (
  <div className={classNames(styles.footer, className)} {...props} />
);

const Form = ({ className, ...props }) => (
  <form className={classNames(styles.form, className)} {...props} />
);

const ErrorMessage = ({ className, ...props }) => (
  <Message
    kind="error"
    className={classNames(styles.errorMessage, className)}
    {...props}
  />
);

const Loader = ({ className, ...props }) => (
  <div className={classNames(styles.loader, className)} {...props}>
    <Spinner invert />
  </div>
);

const FormRecordActions = ({ className, ...props }) => (
  <div className={classNames(styles.formRecordActions, className)} {...props} />
);

const RecordForm = ({ className, children, ...props }) => {
  const { errors } = useFormikContext();
  return (
    <FormikForm className={classNames(styles.form, className)} {...props}>
      {errors && errors.global && (
        <ErrorMessage kind="error">{errors.global.toString()}</ErrorMessage>
      )}
      {children}
    </FormikForm>
  );
};

const FormWithCache = ({ onChange, values, errors }) => {
  useEffect(() => {
    onChange(values);
  }, [onChange, values]);
  useScrollFormOnError(errors && errors.global);
  return RecordForm;
};

const FilesInput = ({ name, label, type, className }) => {
  const [field, , helpers] = useField(name);
  const { value } = field;
  const { setValue } = helpers;

  const handleFilesChange = (v) => {
    const files = value.concat(v);
    setValue(files);
  };

  return (
    <AttachFileInput
      label={label}
      type={type}
      onChange={handleFilesChange}
      className={className}
    />
  );
};

const MarkdownInput = ({
  name,
  className,
  placeholder,
  textAreaProps,
  enableFilesInput
}) => {
  const [, meta, helpers] = useField(name);
  const { error, touched, value } = meta;
  const { setValue } = helpers;

  const handleMarkdownChange = (v) => {
    setValue(v);
  };

  return (
    <MarkdownEditor
      name={name}
      className={className}
      value={value}
      textAreaProps={textAreaProps}
      onChange={handleMarkdownChange}
      placeholder={placeholder}
      error={touched && error}
      filesInput={enableFilesInput && FilesInput}
    />
  );
};

const FormWrapper = ({ children, loading, ...props }) => {
  return loading ? (
    <Loader />
  ) : (
    <Formik {...props}>
      {(props) =>
        children({
          ...props,
          Actions,
          Footer,
          Title,
          Form,
          ErrorMessage,
          Link
        })
      }
    </Formik>
  );
};

export const FormWrapperWithCache = ({
  children,
  formName,
  initialValues,
  validationSchema,
  onSubmit,
  ...props
}) => {
  const sessionStorageKey = formName;
  let formInitialValues = initialValues;
  const [sessionStorageValue, setSessionStorageValue] = useSessionStorage(
    sessionStorageKey,
    null
  );

  if (sessionStorageValue !== null) {
    formInitialValues = sessionStorageValue;
  }

  const isInitialValid = validationSchema.isValidSync(formInitialValues);

  const handleSubmitAndClearCache = (values, { resetForm, setFieldError }) => {
    onSubmit(values)
      .then(() => {
        setSessionStorageValue(null);
        resetForm();
      })
      .catch((formError) => {
        setFieldError("global", formError);
      });
  };

  return (
    <Formik
      {...{
        ...props,
        initialValues: formInitialValues,
        isInitialValid,
        onSubmit: handleSubmitAndClearCache,
        validationSchema
      }}>
      {(formProps) =>
        children({
          ...formProps,
          TextInput,
          FilesInput,
          MarkdownInput,
          Select,
          TextArea,
          Form: FormWithCache({
            onChange: setSessionStorageValue,
            values: formProps.values,
            errors: formProps.errors
          }),
          SubmitButton,
          RadioButtonGroup,
          ErrorMessage,
          Actions: FormRecordActions
        })
      }
    </Formik>
  );
};

export default FormWrapper;
