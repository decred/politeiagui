import React from 'react';

const PolicyErrors = ({errors}) => (
  <ul>
    {
      errors.map((error, idx) => <li key={idx} className="error">{error}</li>)
    }
  </ul>
);

export default PolicyErrors;
