// FIX: Import React to use React types like ChangeEvent.
import React from 'react';

export interface BillInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: BillType;
}

export interface SummaryLineProps {
  label: string;
  amount: number;
  formatFn: (amount: number) => string;
}

export enum BillType {
    ELECTRICITY = 'ELECTRICITY',
    WATER = 'WATER'
}
