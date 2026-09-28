import React from 'react';
import './Status.scss';
import { useSettings } from '../../utils/contentContext';

const StatusCard = () => {
  const { status } = useSettings();

  return (
    <div className="status-card">
      {status.lines.map((line, index) => (
        <div className="text-container" key={index}>
          <div className="status-text">{line.message}</div>
        </div>
      ))}
    </div>
  );
};

export default StatusCard;
