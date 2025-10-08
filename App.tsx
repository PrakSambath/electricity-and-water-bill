import React, { useState, useMemo, useEffect } from 'react';
import BillInput from './components/BillInput';
import SummaryLine from './components/SummaryLine';
import { BillType } from './types';
import { SERVICE_FEE } from './constants';

const App: React.FC = () => {
  const [electricityBill, setElectricityBill] = useState<string>(
    () => localStorage.getItem('khmer_invoice_electricity_bill') || ''
  );
  const [waterBill, setWaterBill] = useState<string>(
    () => localStorage.getItem('khmer_invoice_water_bill') || ''
  );
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('khmer_invoice_electricity_bill', electricityBill);
    localStorage.setItem('khmer_invoice_water_bill', waterBill);
  }, [electricityBill, waterBill]);

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
  
  const handlePrint = () => {
    setIsPrintModalOpen(false);
    // Use a small timeout to ensure the modal is closed before the print dialog opens
    setTimeout(() => {
        window.print();
    }, 100);
  };

  const openPrintModal = () => {
    setIsPrintModalOpen(true);
  }
  
  const closePrintModal = () => {
    setIsPrintModalOpen(false);
  }

  const handleReset = () => {
    setElectricityBill('');
    setWaterBill('');
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
            <div className="flex justify-between items-center mb-4 no-print">
              <h2 className="text-xl font-bold text-slate-700">សេចក្តីសង្ខេបនៃវិក្កយបត្រ</h2>
              <button
                onClick={handleReset}
                className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                aria-label="សម្អាតទិន្នន័យ"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                </svg>
                សម្អាត
              </button>
            </div>
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
                  onClick={openPrintModal}
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm transform transition-all text-center">
            <div className="p-6">
              <h3 id="print-modal-title" className="text-xl font-bold text-slate-800 font-koulen">
                ត្រៀមបោះពុម្ព
              </h3>
              <div className="my-6 text-left text-sm text-slate-600 space-y-2">
                <p>1. សូមប្រាកដថាម៉ាស៊ីនបោះពុម្ពរបស់អ្នកបានភ្ជាប់ជាមួយឧបករណ៍នេះតាមរយៈ Bluetooth។</p>
                <p>2. ចូលទៅកាន់ការកំណត់ Bluetooth របស់ឧបករណ៍អ្នក ហើយធ្វើការភ្ជាប់។</p>
                <p>3. អាសយដ្ឋានរបស់ម៉ាស៊ីនបោះពុម្ពអាចមើលលើតែម (ឧ: <code className="bg-slate-200 px-1 rounded">66:22:6B:2F:34:79</code>)។</p>
                <p>4. នៅពេលភ្ជាប់រួចរាល់ សូមចុចប៊ូតុងខាងក្រោមដើម្បីបន្ត។</p>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex flex-col gap-3 rounded-b-2xl">
              <button
                onClick={handlePrint}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold"
              >
                បន្តបោះពុម្ព
              </button>
              <button
                onClick={closePrintModal}
                className="w-full px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-bold"
              >
                បោះបង់
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
