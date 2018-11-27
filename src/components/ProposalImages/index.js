import React, { Component } from "react";
import PropTypes from "prop-types";
import { sanitizeSVGFiles } from "./helpers";

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
    const sanitizedFiles = sanitizeSVGFiles(files || []);

    return (
      <div className="attached-images">
        {sanitizedFiles.map(({ name, mime, payload }, idx) => (
          <div key={`prop-image-${idx}`} className="attached-image-ct">
            <div style={{ display: "flex", alignItems: "center" }}>
              <h5 className="attached-image-title">{name}</h5>
              {!readOnly && (
                <a
                  className="attached-image-remove"
                  onClick={() => this.onRemove(idx)}
                  title="Remove image"
                >
                  ✖
                </a>
              )}
            </div>
            <img
              className="attached-image"
              alt={name}
              src={`data:${mime};base64,${payload}`}
            />
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
