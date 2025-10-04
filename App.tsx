
import React, { useState, useMemo } from 'react';
import BillInput from './components/BillInput';
import SummaryLine from './components/SummaryLine';
import { BillType } from './types';
import { SERVICE_FEE } from './constants';

const App: React.FC = () => {
  const [electricityBill, setElectricityBill] = useState<string>('');
  const [waterBill, setWaterBill] = useState<string>('');

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('km-KH').format(amount) + '៛';
  };

  const calculations = useMemo(() => {
    const electricityAmount = parseFloat(electricityBill) || 0;
    const waterAmount = parseFloat(waterBill) || 0;

    const electricityFee = electricityAmount > 0 ? SERVICE_FEE : 0;
    const waterFee = waterAmount > 0 ? SERVICE_FEE : 0;

    const total = electricityAmount + electricityFee + waterAmount + waterFee;

    return {
      electricityAmount,
      waterAmount,
      electricityFee,
      waterFee,
      total,
    };
  }, [electricityBill, waterBill]);

  const {
    electricityAmount,
    waterAmount,
    electricityFee,
    waterFee,
    total,
  } = calculations;

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <header className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-3xl font-koulen tracking-wide">វិក្កយបត្រសេវាកម្ម</h1>
          <p className="opacity-80 mt-1">អគ្គិសនី និង ទឹកស្អាត</p>
        </header>

        <section className="p-6 md:p-8 space-y-6">
          <BillInput
            label="ថ្លៃអគ្គិសនី"
            value={electricityBill}
            onChange={(e) => setElectricityBill(e.target.value)}
            type={BillType.ELECTRICITY}
          />
          <BillInput
            label="ថ្លៃទឹកស្អាត"
            value={waterBill}
            onChange={(e) => setWaterBill(e.target.value)}
            type={BillType.WATER}
          />
        </section>

        {total > 0 && (
          <section className="p-6 md:p-8 bg-slate-50 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-700 mb-4">សេចក្តីសង្ខេបនៃកម្មវិធី</h2>
            <div className="space-y-3">
              <SummaryLine
                label="ថ្លៃអគ្គិសនី"
                amount={electricityAmount}
                formatFn={formatCurrency}
              />
              <SummaryLine
                label="ថ្លៃសេវាអគ្គិសនី"
                amount={electricityFee}
                formatFn={formatCurrency}
              />
              <SummaryLine
                label="ថ្លៃទឹកស្អាត"
                amount={waterAmount}
                formatFn={formatCurrency}
              />
              <SummaryLine
                label="ថ្លៃសេវាទឹកស្អាត"
                amount={waterFee}
                formatFn={formatCurrency}
              />

              <div className="border-t border-dashed border-slate-300 my-4"></div>
              
              <div className="flex justify-between items-center text-xl font-bold text-slate-800 pt-2">
                <span>សរុប</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
