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
      generateBarcode(barcode.itemCode, barcodeId);
    }
  }, [barcode.itemCode, barcodeId]);

  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-all hover:border-blue-400">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-base text-gray-800 border-b-2 border-gray-200 pb-2">
            {barcode.header || 'POS BARCODE GENERATOR'}
          </h3>
          <p className="text-lg text-gray-700 mt-4 font-semibold">{barcode.itemName}</p>
        </div>
        <button
          onClick={() => onDelete(barcode.id)}
          className="ml-4 px-3 py-1 text-red-600 hover:text-red-800 font-semibold border-2 border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          aria-label="Delete barcode"
        >
          ✕ Delete
        </button>
      </div>
      
      <div className="flex justify-center my-3 bg-gray-50 p-2 rounded border border-gray-200">
        <img
          id={barcodeId}
          ref={barcodeRef}
          alt={`Barcode for ${barcode.itemCode}`}
          className="max-w-full h-auto"
        />
      </div>

      {barcode.lines.length > 0 && barcode.lines.some(line => line.trim()) && (
        <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded border border-gray-200">
          {barcode.lines.map((line, index) => (
            line.trim() && (
              <p key={index} className="mb-1">{line}</p>
            )
          ))}
        </div>
      )}

      <div className="flex justify-between items-center text-sm font-semibold text-gray-800 mt-3 pt-3 border-t-2 border-gray-300">
        <span className={barcode.strikeMrp ? 'line-through' : ''}>
          MRP: Rs.{barcode.mrp}
        </span>
        <span>Sale: Rs.{barcode.salePrice}</span>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200 text-xs text-gray-500">
        <p>Code: <span className="font-semibold">{barcode.itemCode}</span></p>
        <p>Labels: <span className="font-semibold">{barcode.numberOfLabels}</span> | Size: <span className="font-semibold">{barcode.labelSize?.label || 'N/A'}</span></p>
      </div>
    </div>
  );
};
