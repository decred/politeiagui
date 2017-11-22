import React from "react";
import PropTypes from "prop-types";
import ReactFileReader from "react-file-reader";
import { change } from 'redux-form';
import ProposalImages from "../../ProposalImages";
import PolicyErrors from './PolicyErrors';
import { validateFiles, getFormattedFiles } from '../../ProposalImages/helpers';

class FilesField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      policyErrors: []
    }
  }

  handleFilesChange = (files) => {
    const { input, policy, meta: { dispatch } } = this.props;
    const formatedFiles = getFormattedFiles(files);
    const inputAndNewFiles = input.value ? formatedFiles.concat(input.value) : formatedFiles;
    const validation = validateFiles(inputAndNewFiles, policy);

    this.setState({
      policyErrors: validation.errors ? validation.errors : []
    })

    return dispatch(change('form/proposal','files', validation.files));
  }

  render() {
    const { placeholder="Upload", input, touched, error, disabled, policy } = this.props;
    const { policyErrors } = this.state;

    return (
      <div className="files-field">
        <ReactFileReader
          base64
          multipleFiles
          fileTypes={policy.validmimetypes}
          handleFiles={this.handleFilesChange}
        ><button>{placeholder}</button></ReactFileReader>
        {touched && error && !disabled && <span className="error">{error}</span>}
        { policyErrors.length > 0 && <PolicyErrors errors={policyErrors} />}
        <ProposalImages files={input.value || []} onChange={input.onChange} />
      </div>
    )
  }
}

FilesField.propTypes = {
  placeholder: PropTypes.string.isRequired,
  input: PropTypes.object.isRequired,
  touched: PropTypes.bool,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  policy: PropTypes.object.isRequired,
};

export default FilesField;
