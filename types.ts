import React from 'react';

export enum BillType {
    ELECTRICITY = 'ELECTRICITY',
    WATER = 'WATER'
}

export interface Bill {
  id: string;
  type: BillType;
  amount: string;
}

export interface BillInputProps {
  bill: Bill;
  onAmountChange: (id: string, amount: string) => void;
  onRemove: (id: string) => void;
}

export interface SummaryLineProps {
  label: string;
  amount: number;
  formatFn: (amount: number) => string;
}
