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
            import('./utils/barcodeGenerator').then(({ generateBarcode }) => {
              generateBarcode(itemCode, barcodeId);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className="mb-6 bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              POS BARCODE GENERATOR
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-3 text-sm">
              Professional Barcode Label Generation System
            </p>
          </div>
        </header>

        {/* Main Content - Optimized Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <Dashboard onAddBarcode={handleAddBarcode} />
          </div>

          {/* Action Buttons Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-3">Actions</h3>
              {barcodes.length > 0 ? (
                <>
                  <div className="space-y-3 mb-4">
                    <button
                      onClick={handlePrint}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      🖨️ Print Labels
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      📄 Export PDF
                    </button>
                  </div>
                  <div className="pt-4 border-t-2 border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">Total:</span> {barcodes.length} barcode{barcodes.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Add barcodes to enable actions
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Barcode List Section */}
        {barcodes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
            <div className="border-b-2 border-gray-300 pb-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Barcode List ({barcodes.length})
              </h2>
            </div>
            <BarcodeList barcodes={barcodes} onDelete={handleDeleteBarcode} />
          </div>
        )}

        {/* Print layout (hidden on screen, visible when printing) */}
        <PrintLayout barcodes={barcodes} />
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
