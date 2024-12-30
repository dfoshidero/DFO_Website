import React from 'react';
import './Status.scss';

const StatusCard = () => {
  return (
    <div className="status-card">
      <div className="text-container">
        <div className="status-text">
          Software Engineer at ETAS (Bosch).
        </div>
      </div>
      <div className="text-container">
        <div className="status-text">
          Pursuing MSc at the University of Buckingham.
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
