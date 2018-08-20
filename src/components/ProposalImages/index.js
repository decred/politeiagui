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
    const { files, readOnly } = this.props;

    return (
      <div className="attached-images">
        {(files || []).map(({ name, mime, digest, payload }, idx) => (
          <div key={digest || idx} className="attached-image-ct">
            <h5 className="attached-image-title">{name}</h5>
            {!readOnly && (
              <a
                className="attached-image-remove"
                onClick={() => this.onRemove(idx)}
                title="Remove image">✖</a>
            )}
            <img className="attached-image" alt={name} src={`data:${mime};base64,${payload}`} />
          </div>
        ))}
      </div>
    );
  }
}

ProposalImages.propTypes = {
  files: PropTypes.array.isRequired,
  readOnly: PropTypes.bool.isRequired
};

ProposalImages.defaultProps = {
  readOnly: false,
  files: []
};

export default ProposalImages;
