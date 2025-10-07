
import React, { useState, useMemo } from 'react';
import BillInput from './components/BillInput';
import SummaryLine from './components/SummaryLine';
import { BillType } from './types';
import { SERVICE_FEE } from './constants';

const App: React.FC = () => {
  const [electricityBill, setElectricityBill] = useState<string>('');
  const [waterBill, setWaterBill] = useState<string>('');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

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

  const handleOpenPrintModal = () => {
    setIsPrintModalOpen(true);
  };

  const handleProceedToPrint = () => {
    setIsPrintModalOpen(false);
    setTimeout(() => {
      window.print();
    }, 100);
  };


  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
      <main id="invoice-content" className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <header className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-3xl font-koulen tracking-wide">វិក្កយបត្រសេវាកម្ម</h1>
          <p className="opacity-80 mt-1">អគ្គិសនី និង ទឹកស្អាត</p>
        </header>

        <section className="p-6 md:p-8 space-y-6 no-print">
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
            <h2 className="text-xl font-bold text-slate-700 mb-4 no-print">សេចក្តីសង្ខេបនៃវិក្កយបត្រ</h2>
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

              <div className="mt-6 pt-4 no-print">
                <button
                  onClick={handleOpenPrintModal}
                  className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  aria-label="បោះពុម្ពវិក្កយបត្រ"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                    <path d="M9 13a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                  </svg>
                  បោះពុម្ពវិក្កយបត្រ
                </button>
              </div>

              <div className="print-only text-center text-sm mt-6" style={{ display: 'none' }}>
                <p>កាលបរិច្ឆេទ: {new Date().toLocaleString('km-KH', { dateStyle: 'short', timeStyle: 'short' })}</p>
                <p className="mt-2 font-bold">សូមអរគុណ!</p>
              </div>
            </div>
          </section>
        )}
      </main>

      {isPrintModalOpen && (
        <div className="no-print fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="print-modal-title">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm transform transition-all">
            <div className="p-6">
              <h3 id="print-modal-title" className="text-xl font-bold text-slate-800 font-koulen">
                ត្រៀមបោះពុម្ព
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                សូមអនុវត្តតាមជំហានទាំងនេះដើម្បីភ្ជាប់ទៅម៉ាស៊ីនបោះពុម្ពរបស់អ្នក៖
              </p>
              <ol className="list-decimal list-inside space-y-3 mt-4 text-slate-700">
                <li>បើកម៉ាស៊ីនបោះពុម្ព Bluetooth របស់អ្នក។</li>
                <li>នៅក្នុងការកំណត់ (Settings) នៃឧបករណ៍របស់អ្នក សូមចូលទៅកាន់ Bluetooth ហើយភ្ជាប់ជាមួយម៉ាស៊ីនបោះពុម្ព។</li>
                <li>នៅពេលភ្ជាប់រួចរាល់ សូមចុច "បន្តបោះពុម្ព" ខាងក្រោម។</li>
                <li>នៅលើផ្ទាំងបន្ទាប់ សូមជ្រើសរើសម៉ាស៊ីនបោះពុម្ពរបស់អ្នកពីបញ្ជី។</li>
              </ol>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-bold"
              >
                បោះបង់
              </button>
              <button
                onClick={handleProceedToPrint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
              >
                បន្តបោះពុម្ព
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
