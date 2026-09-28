import React from 'react';
import StatusCircle from './StatusCircle';
import { useSettings } from '../../utils/contentContext';

export default function StatusIndicator() {
  const { status } = useSettings();
  return <StatusCircle severity={status.indicatorSeverity} />;
}
