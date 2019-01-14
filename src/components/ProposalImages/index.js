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

  getStyleForDiffMode = (removed, added) => {
    // it only returns a style modification if removed/added properties
    // have been specified.
    // Note: it is only used when presenting the proposal diff
    return {
      borderLeft: added ? "4px solid green" : removed ? "4px solid red" : "0"
    };
  };

  render() {
    const { files, readOnly } = this.props;

    return (
      <div className="attached-images">
        {files.map(
          ({ name, mime, payload, removed = null, added = null }, idx) => (
            <div
              key={`prop-image-${idx}`}
              style={this.getStyleForDiffMode(removed, added)}
              className="attached-image-ct"
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <h5 className="attached-image-title">{name}</h5>
                {!readOnly && (
                  <span
                    className="attached-image-remove"
                    onClick={() => this.onRemove(idx)}
                    title="Remove image"
                  >
                    ✖
                  </span>
                )}
              </div>
              <img
                className="attached-image"
                alt={name}
                src={`data:${mime};base64,${payload}`}
              />
            </div>
          )
        )}
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
