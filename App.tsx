import React, { useState, useMemo, useEffect } from 'react';
import BillInput from './components/BillInput';
import SummaryLine from './components/SummaryLine';
import { Bill, BillType } from './types';
import { SERVICE_FEE } from './constants';

const App: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>(() => {
    try {
      const savedBills = localStorage.getItem('invoice-bills');
      return savedBills ? JSON.parse(savedBills) : [];
    } catch (error) {
      console.error("Failed to parse bills from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('invoice-bills', JSON.stringify(bills));
  }, [bills]);

  const addBill = (type: BillType) => {
    const newBill: Bill = {
      id: `bill-${Date.now()}-${Math.random()}`,
      type,
      amount: '',
    };
    setBills(prevBills => [newBill, ...prevBills]);
  };

  const removeBill = (id: string) => {
    setBills(prevBills => prevBills.filter(bill => bill.id !== id));
  };

  const updateBillAmount = (id: string, amount: string) => {
    setBills(prevBills =>
      prevBills.map(bill =>
        bill.id === id ? { ...bill, amount } : bill
      )
    );
  };

  const clearAmounts = () => {
    setBills(prevBills => prevBills.map(b => ({ ...b, amount: '' })));
  };


  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('km-KH').format(amount) + '៛';
  };

  const calculations = useMemo(() => {
    const electricityAmount = bills
      .filter(b => b.type === BillType.ELECTRICITY)
      .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);
      
    const waterAmount = bills
      .filter(b => b.type === BillType.WATER)
      .reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);

    const electricityFee = bills.filter(b => b.type === BillType.ELECTRICITY && (parseFloat(b.amount) || 0) > 0).length * SERVICE_FEE;
    const waterFee = bills.filter(b => b.type === BillType.WATER && (parseFloat(b.amount) || 0) > 0).length * SERVICE_FEE;

    const total = electricityAmount + electricityFee + waterAmount + waterFee;

    return {
      electricityAmount,
      waterAmount,
      electricityFee,
      waterFee,
      total,
    };
  }, [bills]);

  const {
    electricityAmount,
    waterAmount,
    electricityFee,
    waterFee,
    total,
  } = calculations;
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center">
      <div id="app-wrapper" className="w-full max-w-md bg-white shadow-lg flex flex-col h-screen">
        <header className="bg-blue-600 p-6 text-white text-center flex-shrink-0">
          <h1 className="text-3xl font-koulen tracking-wide">វិក្កយបត្រសេវាកម្ម</h1>
          <p className="opacity-80 mt-1">អគ្គិសនី និង ទឹកស្អាត</p>
        </header>

        <section className="p-6 md:p-8 no-print flex-shrink-0 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => addBill(BillType.ELECTRICITY)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400 text-yellow-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              <span>បន្ថែមអគ្គិសនី</span>
            </button>
            <button onClick={() => addBill(BillType.WATER)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-cyan-400 text-cyan-900 font-bold rounded-lg hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              <span>បន្ថែមទឹកស្អាត</span>
            </button>
          </div>
        </section>

        <main id="invoice-content" className="flex-grow overflow-y-auto p-6 md:p-8">
          <div className="space-y-4">
            {bills.map(bill => (
              <BillInput
                key={bill.id}
                bill={bill}
                onAmountChange={updateBillAmount}
                onRemove={removeBill}
              />
            ))}
            {bills.length === 0 && (
              <div className="text-center text-slate-500 py-8 border-2 border-dashed border-slate-200 rounded-lg">
                <p className="font-bold">មិនទាន់មានវិក្កយបត្រ</p>
                <p className="text-sm mt-1">សូមចុចប៊ូតុងខាងលើដើម្បីបន្ថែម</p>
              </div>
            )}
          </div>

          {bills.length > 0 && (
            <div className="text-center mt-6">
                <button onClick={clearAmounts} className="no-print text-sm text-slate-500 font-medium hover:text-red-600 hover:bg-red-50 rounded-md py-2 px-4 transition-colors">
                    សម្អាតតម្លៃ
                </button>
            </div>
          )}
        </main>
        
        {total > 0 && (
          <footer className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex-shrink-0">
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-700 mb-4 no-print">សេចក្តីសង្ខេបនៃវិក្កយបត្រ</h2>
              
              {/* Screen-only aggregated summary */}
              <div className="no-print space-y-3">
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
              </div>

              {/* Print-only detailed breakdown */}
              <div className="print-only text-sm" style={{ display: 'none' }}>
                <div className="space-y-1">
                  {bills
                    .filter(bill => parseFloat(bill.amount) > 0)
                    .map((bill, index) => {
                      const billLabel = bill.type === BillType.ELECTRICITY 
                        ? `ថ្លៃអគ្គិសនី #${index + 1}` 
                        : `ថ្លៃទឹកស្អាត #${index + 1}`;
                      return (
                        <React.Fragment key={`print-bill-${bill.id}`}>
                          <div className="flex justify-between">
                            <span>{billLabel}</span>
                            <span>{formatCurrency(parseFloat(bill.amount))}</span>
                          </div>
                          <div className="flex justify-between pl-4">
                            <span>+ ថ្លៃសេវា</span>
                            <span>{formatCurrency(SERVICE_FEE)}</span>
                          </div>
                        </React.Fragment>
                      );
                    })}
                </div>
              </div>

              <div className="border-t border-dashed border-slate-300 my-4"></div>
              
              <div className="flex justify-between items-center text-xl font-bold text-slate-800 pt-2">
                <span>សរុប</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>

              <div className="mt-6 pt-4 no-print">
                <button
                  onClick={handlePrint}
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
          </footer>
        )}
      </div>
    </div>
  );
};

export default App;
