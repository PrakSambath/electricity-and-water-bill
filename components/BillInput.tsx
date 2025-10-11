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
  bill,
  onAmountChange,
  onRemove,
}) => {
  const { id, type, amount } = bill;
  const label = type === BillType.ELECTRICITY ? 'ថ្លៃអគ្គិសនី' : 'ថ្លៃទឹកស្អាត';

  return (
    <div className="animate-fade-in">
      <label
        htmlFor={id}
        className="flex items-center gap-2 mb-2 text-md font-bold text-slate-600"
      >
        <Icon type={type} />
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <input
            id={id}
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(id, e.target.value)}
            placeholder="បញ្ចូលចំនួនទឹកប្រាក់"
            min="0"
            className="w-full pl-4 pr-10 py-3 text-lg border-2 border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 font-bold">
            ៛
          </span>
        </div>
        <button
            onClick={() => onRemove(id)}
            aria-label={`លុប ${label}`}
            className="flex-shrink-0 p-3 bg-slate-100 text-slate-500 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default BillInput;
