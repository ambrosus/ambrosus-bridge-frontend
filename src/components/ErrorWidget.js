import React from 'react';
import PropTypes from 'prop-types';

export const ErrorWidget = ({ error }) => {
  if (error)
    return (
      <div className="error-widget">
        <div className="content error-widget__content">{error}</div>
      </div>
    );
  return null;
};

ErrorWidget.propTypes = {
  error: PropTypes.string,
};
