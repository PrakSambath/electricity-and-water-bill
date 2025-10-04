
import React from 'react';
import { BillInputProps } from '../types';
import { BillType } from '../types';

const Icon: React.FC<{ type: BillType }> = ({ type }) => {
  if (type === BillType.ELECTRICITY) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-yellow-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M11.3 1.046A1 1 0 0112 2v5.234l2.121-2.122a1 1 0 111.414 1.415L13 8.938V18a1 1 0 01-1.447.894l-5-2.5a1 1 0 01-.553-.894V8.665l-2.121 2.121a1 1 0 01-1.414-1.414L5 7.234V2a1 1 0 011.7-.707l5 2.5a1 1 0 01.6.954v.5z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-cyan-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.05 3.636a1 1 0 010 1.414L2.464 7.636a1 1 0 01-1.414-1.414l2.586-2.586a1 1 0 011.414 0zM16.364 5.05a1 1 0 01-1.414 0L12.364 2.464a1 1 0 011.414-1.414l2.586 2.586a1 1 0 010 1.414zM9 11a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
      <path d="M3 13.5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
      <path
        fillRule="evenodd"
        d="M5 16.5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
};

const BillInput: React.FC<BillInputProps> = ({
  label,
  value,
  onChange,
  type,
}) => {
  return (
    <div>
      <label
        htmlFor={label}
        className="flex items-center gap-2 mb-2 text-md font-bold text-slate-600"
      >
        <Icon type={type} />
        {label}
      </label>
      <div className="relative">
        <input
          id={label}
          type="number"
          value={value}
          onChange={onChange}
          placeholder="បញ្ចូលចំនួនទឹកប្រាក់"
          min="0"
          className="w-full pl-4 pr-10 py-3 text-lg border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 font-bold">
          ៛
        </span>
      </div>
    </div>
  );
};

export default BillInput;
