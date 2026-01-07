import { useEffect, useRef } from 'react';
import { BarcodeFormData } from '../types/barcode';
import { generateBarcode } from '../utils/barcodeGenerator';

interface BarcodePreviewProps {
  formData: BarcodeFormData;
}

export const BarcodePreview = ({ formData }: BarcodePreviewProps) => {
  const barcodeId = 'preview-barcode';
  const barcodeRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (formData.itemCode) {
      generateBarcode(formData.itemCode, barcodeId, formData.barcodeType || 'CODE128');
    }
  }, [formData.itemCode, formData.barcodeType]);

  return (
    <div className="bg-white border-2 border-gray-400 rounded-lg p-3 shadow-lg w-full">
      <div className="text-center">
        {/* Header - Company Name */}
        <h3 className="font-bold text-sm text-gray-800 mb-1 leading-tight">
          {formData.header || 'POS BARCODE GENERATOR'}
        </h3>
        
        {/* Item Name after company name */}
        <p className="text-base font-semibold text-gray-700 mb-1 leading-tight">
          {formData.itemName || 'Item Name'}
        </p>
        
        {/* Barcode */}
        <div className="flex justify-center my-1">
          {formData.itemCode ? (
            <img
              id={barcodeId}
              ref={barcodeRef}
              alt="Barcode preview"
              className="max-w-full h-auto"
            />
          ) : (
            <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs border border-gray-300">
              Enter item code to see barcode
            </div>
          )}
        </div>

        {/* Item Code below barcode */}
        {formData.itemCode && (
          <p className="text-xs text-gray-600 mb-1 leading-tight">
            {formData.itemCode}
          </p>
        )}

        {/* Additional Lines */}
        {formData.lines.length > 0 && formData.lines.some(line => line.trim()) && (
          <div className="text-xs text-gray-600 mb-1 space-y-0.5">
            {formData.lines.map((line, index) => (
              line.trim() && (
                <p key={index} className="leading-tight">{line}</p>
              )
            ))}
          </div>
        )}

        {/* Pricing at bottom */}
        <div className="flex justify-between items-center text-xs font-semibold text-gray-800 pt-1 border-t-2 border-gray-300">
          <span className={formData.strikeMrp ? 'line-through' : ''}>
            MRP: Rs.{formData.mrp || 0}
          </span>
          <span>Offer: Rs.{formData.salePrice || 0}</span>
        </div>
      </div>
    </div>
  );
};
