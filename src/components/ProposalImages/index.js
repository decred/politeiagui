import React, { Component } from "react";
import PropTypes from "prop-types";

class ProposalImages extends Component {
  constructor(props) {
    super(props);

    this.onRemove = this.onRemove.bind(this);
  }

  onRemove(idx) {
    this.props.onChange({ remove: idx });
  }

  render() {
    const { files, readOnly, policy } = this.props;

    return (
      <div>
        {(files || []).map(({ name, mime, digest, payload, size }, idx) => (
          <div key={digest || idx}>
            <h5>{name}</h5>
            <div className="attached-image-ct clearfloat">
              <img className="attached-image" alt={name} src={`data:${mime};base64,${payload}`} />
              {readOnly ? null : (
                <a className="attached-image-remove" onClick={() => this.onRemove(idx)} title="Remove image">✖</a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

ProposalImages.propTypes = {
  files: PropTypes.array.isRequired,
  policy: PropTypes.object,
  readOnly: PropTypes.bool.isRequired,
};

ProposalImages.defaultProps = {
  readOnly: false,
  files: [],
};

export default ProposalImages;
