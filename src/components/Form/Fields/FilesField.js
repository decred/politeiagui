import React from "react";
import PropTypes from "prop-types";
import ReactFileReader from "react-file-reader";
import { change } from "redux-form";
import ProposalImages from "../../ProposalImages";
import PolicyErrors from "./PolicyErrors";
import { validateFiles, getFormattedFiles } from "../../ProposalImages/helpers";
import isArray from "lodash/isArray";
import isUndefined from "lodash/isUndefined";
import concat from "lodash/concat";
import cloneDeep from "lodash/cloneDeep";

export class FilesField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      policyErrors: []
    };
  }

  handleFilesChange = files => {
    const {
      input,
      meta: { dispatch },
      policy
    } = this.props;

    const formattedFiles = getFormattedFiles(files);
    const inputAndNewFiles = input.value
      ? formattedFiles.concat(input.value)
      : formattedFiles;
    const validation = validateFiles(inputAndNewFiles, policy);

    this.setState({
      policyErrors: validation.errors ? validation.errors : []
    });

    return dispatch(change("form/record", "files", inputAndNewFiles));
  };

  render() {
    const {
      placeholder = "Upload",
      input,
      touched,
      error,
      disabled,
      policy,
      userCanExecuteActions
    } = this.props;
    const { policyErrors } = this.state;
    const buttonStyle = {
      margin: 0
    };
    return (
      policy && (
        <div className="attach-wrapper">
          {policyErrors.length > 0 && <PolicyErrors errors={policyErrors} />}
          <div>
            <ReactFileReader
              base64
              multipleFiles
              fileTypes={policy.validmimetypes}
              handleFiles={this.handleFilesChange}
            >
              <div className="button-wrapper">
                <button
                  className={`togglebutton access-required${
                    !userCanExecuteActions ? " not-active disabled" : ""
                  }`}
                  style={buttonStyle}
                >
                  {placeholder}
                </button>
                <div className="attach-requirements">
                  <div>
                    {" "}
                    Max number of files: <span>{policy.maximages}.</span>{" "}
                  </div>
                  <div>
                    {" "}
                    Max file size:{" "}
                    <span>
                      {Math.floor(policy.maximagesize / 1024)} Kb.{" "}
                    </span>{" "}
                  </div>
                  <div>
                    {" "}
                    Valid MIME types:{" "}
                    <span>{policy.validmimetypes.join(", ")}</span>{" "}
                  </div>
                </div>
              </div>
            </ReactFileReader>
          </div>
          {touched && error && !disabled && (
            <span className="error">{error}</span>
          )}
          <ProposalImages files={input.value || []} onChange={input.onChange} />
        </div>
      )
    );
  }
}

FilesField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  policy: PropTypes.object.isRequired
};

export const normalizer = (value, previousValue) => {
  let files = [];

  if (previousValue && isArray(previousValue)) {
    files = cloneDeep(previousValue);
  }

  // Delete images
  if (!isUndefined(value.remove)) {
    files.splice(value.remove, 1);
  }

  // Add images
  if (isArray(value)) {
    files = concat(files, value);
  }

  return files;
};
