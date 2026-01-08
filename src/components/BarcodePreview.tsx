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
    <div className="bg-white border-2 border-gray-300 rounded-xl p-3 sm:p-4 shadow-xl w-full hover:shadow-2xl transition-shadow duration-300">
      <div className="text-center">
        {/* Header - Company Name */}
        <h3 className="font-bold text-xs sm:text-sm text-gray-800 mb-1.5 leading-tight">
          {formData.header || 'POS BARCODE GENERATOR'}
        </h3>
        
        {/* Item Name after company name */}
        <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1.5 leading-tight">
          {formData.itemName || 'Item Name'}
        </p>
        
        {/* Barcode */}
        <div className="flex justify-center my-2 bg-gray-50 rounded-lg p-2">
          {formData.itemCode ? (
            <img
              id={barcodeId}
              ref={barcodeRef}
              alt="Barcode preview"
              className="max-w-full h-auto"
            />
          ) : (
            <div className="w-full h-20 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs sm:text-sm border-2 border-dashed border-gray-300">
              <div className="text-center px-2">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                <p>Enter item code to see barcode</p>
              </div>
            </div>
          )}
        </div>

        {/* Item Code below barcode */}
        {formData.itemCode && (
          <p className="text-xs text-gray-600 mb-1.5 leading-tight font-mono">
            {formData.itemCode}
          </p>
        )}

        {/* Additional Lines */}
        {formData.lines.length > 0 && formData.lines.some(line => line.trim()) && (
          <div className="text-xs text-gray-600 mb-1.5 space-y-0.5">
            {formData.lines.map((line, index) => (
              line.trim() && (
                <p key={index} className="leading-tight">{line}</p>
              )
            ))}
          </div>
        )}

        {/* Pricing at bottom */}
        <div className="flex justify-between items-center text-xs sm:text-sm font-semibold text-gray-800 pt-2 border-t-2 border-gray-300 mt-2">
          <span className={formData.strikeMrp ? 'line-through text-gray-500' : ''}>
            MRP: Rs.{formData.mrp || 0}
          </span>
          <span className="text-indigo-600">Offer: Rs.{formData.salePrice || 0}</span>
        </div>
      </div>
    </div>
  );
};
