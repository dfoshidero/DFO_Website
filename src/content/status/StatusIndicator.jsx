import React from 'react';
import StatusCircle from './StatusCircle';
import { statusConfig } from './statusConfig';

export default function StatusIndicator() {
  return <StatusCircle severity={statusConfig.indicatorSeverity} />;
}
