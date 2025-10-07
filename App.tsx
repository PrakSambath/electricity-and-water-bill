
import React, { useState, useMemo } from 'react';
import BillInput from './components/BillInput';
import SummaryLine from './components/SummaryLine';
import { BillType } from './types';
import { SERVICE_FEE } from './constants';

const App: React.FC = () => {
  const [electricityBill, setElectricityBill] = useState<string>('');
  const [waterBill, setWaterBill] = useState<string>('');
  
  const [isBluetoothModalOpen, setIsBluetoothModalOpen] = useState(false);
  // FIX: Use 'any' type for BluetoothDevice as Web Bluetooth API types are not available.
  const [bluetoothDevice, setBluetoothDevice] = useState<any | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'searching' | 'connected' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('Connect to a thermal printer to print the invoice.');


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

  const handleConnectBluetooth = async () => {
    // FIX: Cast navigator to 'any' to access the bluetooth property.
    if (!(navigator as any).bluetooth) {
        setStatusMessage('Web Bluetooth is not supported on this browser. Please use Chrome on a compatible device.');
        setConnectionStatus('error');
        return;
    }
    try {
        setConnectionStatus('searching');
        setStatusMessage('Searching for Bluetooth devices... Please select your printer.');
        
        // FIX: Cast navigator to 'any' to access the bluetooth property.
        const device = await (navigator as any).bluetooth.requestDevice({
            acceptAllDevices: false,
            // Filter for Serial Port Profile (SPP), common in thermal printers
            filters: [{ services: ['00001101-0000-1000-8000-00805f9b34fb'] }],
        });

        if (!device) {
             setConnectionStatus('idle');
             setStatusMessage('Connection cancelled. Please try again.');
             return;
        }
        
        setBluetoothDevice(device);
        setConnectionStatus('connected');
        setStatusMessage(`Ready to print to: ${device.name}`);

    } catch (error) {
        console.error('Bluetooth connection failed:', error);
        setConnectionStatus('error');
        const errorMessage = error instanceof Error && error.message.includes("User cancelled")
          ? 'Connection cancelled. Please try again.'
          : 'Failed to connect. Make sure the printer is on, in range, and not connected to another device.';
        setStatusMessage(errorMessage);
    }
  };
  
  const handleDisconnectBluetooth = () => {
    setBluetoothDevice(null);
    setConnectionStatus('idle');
    setStatusMessage('Connect to a thermal printer to print the invoice.');
  }

  const handlePrint = () => {
    setIsBluetoothModalOpen(false);
    setTimeout(() => {
        window.print();
    }, 100);
  };

  const openPrintModal = () => {
    setIsBluetoothModalOpen(true);
  }
  
  const closePrintModal = () => {
    if(connectionStatus !== 'searching') {
      setIsBluetoothModalOpen(false);
    }
  }


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

      {isBluetoothModalOpen && (
        <div className="no-print fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="print-modal-title">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm transform transition-all">
            <div className="p-6 text-center">
              <h3 id="print-modal-title" className="text-xl font-bold text-slate-800 font-koulen">
                ភ្ជាប់ម៉ាស៊ីនបោះពុម្ព
              </h3>
              <div className="my-6">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mx-auto ${connectionStatus === 'connected' ? 'text-blue-600' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.05 13.05l5.656 5.657" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v.75" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.95 7.05l-1.6 1.6" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.05 7.05l1.6 1.6" />
                </svg>
              </div>
              <p className={`text-sm min-h-[40px] ${connectionStatus === 'error' ? 'text-red-600' : 'text-slate-600'}`}>
                {statusMessage}
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex flex-col gap-3 rounded-b-2xl">
              {connectionStatus !== 'connected' ? (
                <button
                  onClick={handleConnectBluetooth}
                  disabled={connectionStatus === 'searching'}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-wait transition-colors font-bold"
                >
                  {connectionStatus === 'searching' ? 'កំពុង​ស្វែងរក...' : 'ភ្ជាប់តាម Bluetooth'}
                </button>
              ) : (
                 <button
                  onClick={handlePrint}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                >
                  បោះពុម្ព
                </button>
              )}
               {bluetoothDevice && connectionStatus === 'connected' && (
                <button
                  onClick={handleDisconnectBluetooth}
                  className="w-full px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-bold"
                >
                  ផ្តាច់
                </button>
              )}
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