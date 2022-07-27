import React from 'react';
import PropTypes from 'prop-types';

export const ErrorWidget = ({ error }) => (
  <div className={`error-widget ${error ? 'error-widget_visible' : ''}`}>
    <div className="content error-widget__content">{error}</div>
  </div>
);

ErrorWidget.propTypes = {
  error: PropTypes.string,
};
