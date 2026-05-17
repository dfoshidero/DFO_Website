import React from 'react';
import './Status.scss';
import { STATUS_SEVERITIES } from './statusConfig';

export default function StatusCircle({ severity = 'available' }) {
  const color = STATUS_SEVERITIES[severity] ?? STATUS_SEVERITIES.available;
  const circleStyle = {
    backgroundColor: color,
    boxShadow: `0 0 8px 2px ${color}`,
  };

  return <div className="status-circle" style={circleStyle}></div>;
}
