import React from 'react';
import './Status.scss';
import { statusConfig } from './statusConfig';

const StatusCard = () => {
  return (
    <div className="status-card">
      {statusConfig.lines.map((line, index) => (
        <div className="text-container" key={index}>
          <div className="status-text">{line.message}</div>
        </div>
      ))}
    </div>
  );
};

export default StatusCard;
