import { useEffect, useRef } from 'react';
import { BarcodeData } from '../types/barcode';
import { generateBarcode } from '../utils/barcodeGenerator';

interface BarcodeCardProps {
  barcode: BarcodeData;
  onDelete: (id: string) => void;
}

export const BarcodeCard = ({ barcode, onDelete }: BarcodeCardProps) => {
  const barcodeId = `barcode-${barcode.id}`;
  const barcodeRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (barcode.itemCode) {
      generateBarcode(barcode.itemCode, barcodeId, barcode.barcodeType || 'CODE128');
    }
  }, [barcode.itemCode, barcode.barcodeType, barcodeId]);

  return (
    <div className="border-2 border-gray-300 rounded-lg p-2 bg-white shadow-sm hover:shadow-md transition-all hover:border-blue-400">
      <div className="flex justify-between items-start mb-1.5">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xs text-gray-800 border-b border-gray-200 pb-1">
            {barcode.header || 'POS BARCODE GENERATOR'}
          </h3>
          <p className="text-xs text-gray-700 mt-1 font-semibold">{barcode.itemName}</p>
        </div>
        <button
          onClick={() => onDelete(barcode.id)}
          className="ml-2 px-1.5 py-0.5 text-red-600 hover:text-red-800 font-semibold border border-red-300 rounded hover:bg-red-50 transition-colors text-xs flex-shrink-0"
          aria-label="Delete barcode"
        >
          ✕
        </button>
      </div>
      
      <div className="flex justify-center my-1.5 bg-gray-50 p-1 rounded border border-gray-200">
        <img
          id={barcodeId}
          ref={barcodeRef}
          alt={`Barcode for ${barcode.itemCode}`}
          className="max-w-full h-auto max-h-10"
        />
      </div>

      <div className="flex justify-between items-center text-xs font-semibold text-gray-800 mt-1.5 pt-1.5 border-t border-gray-300">
        <span className={barcode.strikeMrp ? 'line-through' : ''}>
          MRP: {barcode.mrp}
        </span>
        <span>Offer: {barcode.salePrice}</span>
      </div>
      
      <div className="mt-1 pt-1 border-t border-gray-200 text-xs text-gray-500">
        <p>Code: <span className="font-semibold">{barcode.itemCode}</span></p>
        <p>Labels: <span className="font-semibold">{barcode.numberOfLabels}</span></p>
      </div>
    </div>
  );
};
