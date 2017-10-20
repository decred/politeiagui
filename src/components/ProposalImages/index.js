import React, { Component } from "react";
import PropTypes from "prop-types";
import { slice } from "lodash";
import { isFileValid } from "./helpers";

class ProposalImages extends Component {
  constructor(props) {
    super(props);

    this.onRemove = this.onRemove.bind(this);
  }

  onRemove(idx) {
    const files = slice(this.props.files);
    files.splice(idx, 1);
    this.props.onChange(files);
  }

  render() {
    const { files, policy, readOnly } = this.props;

    return (
      <div>
        {(files || []).map(({ name, mime, digest, payload, size }, idx) => (
          <div key={digest || idx}>
            <h5>{name}{isFileValid({ size, mime }, policy) ? null :  <span className="error">&nbsp;Errored</span>}</h5>
            <img alt={name} src={`data:${mime};base64,${payload}`} />
            {readOnly ? null : <span onClick={() => this.onRemove(idx)}>REMOVE</span>}
          </div>
        ))}
      </div>
    );
  }
}

ProposalImages.propTypes = {
  files: PropTypes.array.isRequired,
  policy: PropTypes.object.isRequired,
  readOnly: PropTypes.bool,
};

export default ProposalImages;
