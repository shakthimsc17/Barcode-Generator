import { useState, useEffect } from 'react';
import { BarcodeData } from './types/barcode';
import { Dashboard } from './components/Dashboard';
import { BarcodeList } from './components/BarcodeList';
import { PrintLayout } from './components/PrintLayout';
import { generatePDF } from './utils/pdfExport';

function App() {
  const [barcodes, setBarcodes] = useState<BarcodeData[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('barcodes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((b: BarcodeData) => ({
          ...b,
          createdAt: new Date(b.createdAt),
          labelSize: b.labelSize || { labelCount: 12, width: 100, height: 44, label: '12 labels (100×44mm)' },
          strikeMrp: b.strikeMrp || false, // Default to false if not present
          barcodeType: b.barcodeType || 'CODE128', // Default to CODE128 if not present
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Save to localStorage whenever barcodes change
    localStorage.setItem('barcodes', JSON.stringify(barcodes));
  }, [barcodes]);

  useEffect(() => {
    // Handle print event to ensure barcodes are visible
    const handleBeforePrint = () => {
      // Regenerate all barcodes in print layout
      const printImages = document.querySelectorAll('.print-container img[id^="print-barcode-"]');
      printImages.forEach((img) => {
        const imgElement = img as HTMLImageElement;
        const barcodeId = imgElement.id;
        // Extract item code from parent or try to regenerate
        const labelElement = imgElement.closest('[data-item-code]');
        if (labelElement) {
          const itemCode = (labelElement as HTMLElement).dataset.itemCode;
          if (itemCode) {
            // Import and use generateBarcode
            // Note: This is a fallback handler, barcode type will default to CODE128
            // The PrintLayout component handles barcode type properly
            import('./utils/barcodeGenerator').then(({ generateBarcode }) => {
              generateBarcode(itemCode, barcodeId, 'CODE128');
            });
          }
        }
      });
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, []);

  const handleAddBarcode = (barcode: BarcodeData) => {
    setBarcodes((prev) => [...prev, barcode]);
  };

  const handleDeleteBarcode = (id: string) => {
    if (window.confirm('Are you sure you want to delete this barcode?')) {
      setBarcodes((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handlePrint = () => {
    // Ensure all barcodes are generated before printing
    const printLayout = document.querySelector('.print-container');
    if (printLayout) {
      // Wait a moment for barcodes to generate
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      window.print();
    }
  };

  const handleExportPDF = async () => {
    if (barcodes.length === 0) {
      alert('No barcodes to export. Please add some barcodes first.');
      return;
    }
    try {
      await generatePDF(barcodes);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Professional Background with Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-screen overflow-hidden flex flex-col">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex-1 flex flex-col min-h-0">
          {/* Professional Header */}
          <header className="mb-2 flex-shrink-0">
            <div className="bg-white/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 p-1.5 sm:p-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <div className="flex-1 text-center">
                  <h1 className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                    POS BARCODE GENERATOR
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">
                    Professional Barcode Label Generation System
                  </p>
                </div>
              </div>
            </div>
          </header>

        {/* Main Content - Responsive Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 sm:gap-3 mb-2 sm:mb-3 flex-1 min-h-0">
          {/* Form Section */}
          <div className="xl:col-span-3">
            <Dashboard onAddBarcode={handleAddBarcode} />
          </div>

          {/* Action Buttons Sidebar */}
          <div className="xl:col-span-1 flex flex-col min-h-0">
            <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-2 sm:p-3 flex flex-col h-full">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-800">Actions</h3>
              </div>
              {barcodes.length > 0 ? (
                <>
                  <div className="space-y-2 mb-2 flex-shrink-0">
                    <button
                      onClick={handlePrint}
                      className="w-full group relative px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-semibold shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Print Labels</span>
                      </span>
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="w-full group relative px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-semibold shadow-md hover:shadow-lg transition-all text-xs sm:text-sm"
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>Export PDF</span>
                      </span>
                    </button>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex-shrink-0">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2">
                      <p className="text-xs text-gray-600 text-center">
                        <span className="font-bold text-gray-800 text-sm">{barcodes.length}</span>
                        <span className="block mt-0.5">barcode{barcodes.length !== 1 ? 's' : ''} created</span>
                      </p>
                    </div>
                  </div>
                  
                  {/* Barcode List Section */}
                  <div className="pt-2 border-t border-gray-200 flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 flex-shrink-0">
                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h2 className="text-xs font-bold text-gray-800">
                        Barcode List
                        <span className="ml-1 text-xs font-semibold text-indigo-600">({barcodes.length})</span>
                      </h2>
                    </div>
                    <div className="overflow-y-auto flex-1 min-h-0">
                      <BarcodeList barcodes={barcodes} onDelete={handleDeleteBarcode} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 flex-1 flex items-center justify-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500">
                    Add barcodes to enable actions
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Print layout (hidden on screen, visible when printing) */}
        <PrintLayout barcodes={barcodes} />
        </div>
      </div>

      <style>{`
        .print-only {
          display: none;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .print-only {
            display: block !important;
          }
          .print-container,
          .print-container * {
            visibility: visible;
          }
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
