
import React from 'react';
import { SummaryLineProps } from '../types';

const SummaryLine: React.FC<SummaryLineProps> = ({
  label,
  amount,
  formatFn,
}) => {
  if (amount <= 0) {
    return null;
  }

  return (
    <div className="flex justify-between items-center text-slate-600">
      <span>{label}</span>
      <span className="font-medium text-slate-800">{formatFn(amount)}</span>
    </div>
  );
};

export default SummaryLine;
