import React from 'react';
import './Status.scss';

const StatusCard = () => {
  return (
    <div className="status-card">
      <div className="text-container">
        <div className="status-text">
          Full-Stack SWE at Intropic.io
        </div>
      </div>
      <div className="text-container">
        <div className="status-text">
          Pursuing MSc in Applied Data Science.
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
