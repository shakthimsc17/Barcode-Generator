import { useState, useEffect } from 'react';
import { BarcodeFormData, BarcodeData, LABEL_SIZES } from '../types/barcode';
import { BarcodePreview } from './BarcodePreview';

interface DashboardProps {
  onAddBarcode: (barcode: BarcodeData) => void;
}

export const Dashboard = ({ onAddBarcode }: DashboardProps) => {
  const [formData, setFormData] = useState<BarcodeFormData>({
    itemName: '',
    itemCode: '',
    numberOfLabels: 1,
    header: 'POS BARCODE GENERATOR',
    lines: ['', ''],
    mrp: 0,
    salePrice: 0,
    labelSize: LABEL_SIZES[0], // Default to 12 labels
    strikeMrp: false,
    barcodeType: 'CODE128', // Default barcode type
  });

  // Local state for numberOfLabels input to allow clearing
  const [numberOfLabelsInput, setNumberOfLabelsInput] = useState<string>('1');

  // Sync input with formData when formData changes externally
  useEffect(() => {
    setNumberOfLabelsInput(formData.numberOfLabels.toString());
  }, [formData.numberOfLabels]);

  const handleInputChange = (field: keyof BarcodeFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLabelSizeChange = (labelCount: number) => {
    const selectedSize = LABEL_SIZES.find((size) => size.labelCount === labelCount);
    if (selectedSize) {
      setFormData((prev) => ({ ...prev, labelSize: selectedSize }));
    }
  };

  const generateRandomEAN13 = () => {
    // Generate a random 12-digit number for EAN-13
    // First digit should be between 0-9 (not starting with 0 for better distribution)
    const firstDigit = Math.floor(Math.random() * 9) + 1; // 1-9
    // Remaining 11 digits
    const remainingDigits = Array.from({ length: 11 }, () => 
      Math.floor(Math.random() * 10)
    ).join('');
    const randomCode = firstDigit + remainingDigits;
    handleInputChange('itemCode', randomCode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.itemCode) {
      alert('Please fill in Item Name and Item Code');
      return;
    }

    // Validate EAN-13: must be exactly 12 digits (check digit will be auto-calculated)
    if (formData.barcodeType === 'EAN13') {
      const digitsOnly = formData.itemCode.replace(/\D/g, '');
      if (digitsOnly.length !== 12) {
        alert('EAN-13 requires exactly 12 digits. Please enter a 12-digit number.');
        return;
      }
    }

    const newBarcode: BarcodeData = {
      id: Date.now().toString(),
      ...formData,
      lines: formData.lines.filter((line) => line.trim() !== ''),
      createdAt: new Date(),
    };

    onAddBarcode(newBarcode);

    // Reset form but keep header, label size, and barcode type
    setFormData({
      itemName: '',
      itemCode: '',
      numberOfLabels: 1,
      header: formData.header,
      lines: ['', ''],
      mrp: 0,
      salePrice: 0,
      labelSize: formData.labelSize,
      strikeMrp: false,
      barcodeType: formData.barcodeType,
    });
    setNumberOfLabelsInput('1');
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 p-2 sm:p-3 flex flex-col h-full min-h-0">
      {/* Header Section */}
      <div className="mb-2 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Barcode Generator
            </h2>
            <p className="text-xs text-gray-600 font-medium">Create and manage professional barcode labels</p>
          </div>
        </div>
        <div className="h-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 flex-1 min-h-0">
        {/* Form Section */}
        <div className="lg:col-span-2 flex flex-col min-h-0 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-2 flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="sm:col-span-2">
                <label htmlFor="header" className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Company Name / Header
                </label>
                <input
                  type="text"
                  id="header"
                  value={formData.header}
                  onChange={(e) => handleInputChange('header', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                />
              </div>

              {/* 1. Barcode Type */}
              <div>
                <label htmlFor="barcodeType" className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Barcode Type
                </label>
                <select
                  id="barcodeType"
                  value={formData.barcodeType}
                  onChange={(e) => handleInputChange('barcodeType', e.target.value as 'CODE128' | 'EAN13')}
                  className="w-full px-2 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm cursor-pointer"
                >
                  <option value="CODE128">CODE128 (Alphanumeric)</option>
                  <option value="EAN13">EAN-13 (12 digits)</option>
                </select>
              </div>

              {/* 2. Item Code */}
              <div className={formData.barcodeType === 'EAN13' ? 'sm:col-span-2' : ''}>
                <label htmlFor="itemCode" className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Item Code <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 items-stretch">
                  <input
                    type="text"
                    id="itemCode"
                    value={formData.itemCode}
                    onChange={(e) => handleInputChange('itemCode', e.target.value)}
                    required
                    className="flex-1 px-2 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-w-0 bg-white shadow-sm"
                  />
                  {formData.barcodeType === 'EAN13' && (
                    <button
                      type="button"
                      onClick={generateRandomEAN13}
                      className="px-2 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold shadow-md hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0 text-xs"
                      title="Generate random 12-digit code"
                    >
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Generate
                      </span>
                    </button>
                  )}
                </div>
                {formData.barcodeType === 'EAN13' && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    EAN-13 requires exactly 12 digits (check digit will be auto-calculated)
                  </p>
                )}
              </div>

              {/* 3. Item Name */}
              <div>
                <label htmlFor="itemName" className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange('itemName', e.target.value)}
                  required
                  className="w-full px-2 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                />
              </div>

              {/* 4. Label Size */}
              <div>
                <label htmlFor="labelSize" className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  Label Size
                </label>
                <select
                  id="labelSize"
                  value={formData.labelSize.labelCount}
                  onChange={(e) => handleLabelSizeChange(parseInt(e.target.value))}
                  className="w-full px-2 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm cursor-pointer"
                >
                  {LABEL_SIZES.map((size) => (
                    <option key={size.labelCount} value={size.labelCount}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Number of Labels */}
              <div>
                <label htmlFor="numberOfLabels" className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  Number of Labels
                </label>
                <div className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = Math.max(1, formData.numberOfLabels - 1);
                      handleInputChange('numberOfLabels', newValue);
                      setNumberOfLabelsInput(newValue.toString());
                    }}
                    className="absolute left-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-l-lg border-2 border-r-0 border-gray-300 font-bold text-gray-700 transition-colors z-10 text-xs"
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="numberOfLabels"
                    value={numberOfLabelsInput}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNumberOfLabelsInput(value);
                      if (value === '') {
                        return;
                      }
                      const numValue = parseInt(value);
                      if (!isNaN(numValue) && numValue >= 1) {
                        handleInputChange('numberOfLabels', numValue);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value === '' || parseInt(value) < 1 || isNaN(parseInt(value))) {
                        setNumberOfLabelsInput('1');
                        handleInputChange('numberOfLabels', 1);
                      } else {
                        const numValue = parseInt(value);
                        setNumberOfLabelsInput(numValue.toString());
                        handleInputChange('numberOfLabels', numValue);
                      }
                    }}
                    min="1"
                    step="1"
                    className="w-full px-2 py-1.5 text-sm pl-8 pr-8 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center bg-white shadow-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    style={{
                      MozAppearance: 'textfield',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = formData.numberOfLabels + 1;
                      handleInputChange('numberOfLabels', newValue);
                      setNumberOfLabelsInput(newValue.toString());
                    }}
                    className="absolute right-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-r-lg border-2 border-l-0 border-gray-300 font-bold text-gray-700 transition-colors z-10 text-xs"
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 6. MRP */}
              <div>
                <label htmlFor="mrp" className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  MRP (Rs.)
                </label>
                <input
                  type="number"
                  id="mrp"
                  value={formData.mrp === 0 ? '' : formData.mrp}
                  onChange={(e) => handleInputChange('mrp', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-2 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                />
              </div>

              {/* 7. Offer Price */}
              <div>
                <label htmlFor="salePrice" className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Offer Price (Rs.)
                </label>
                <input
                  type="number"
                  id="salePrice"
                  value={formData.salePrice === 0 ? '' : formData.salePrice}
                  onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-2 py-1.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Strike MRP Option */}
            <div className="mt-2">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.strikeMrp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, strikeMrp: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  Strike through MRP price
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-2 mt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add to List</span>
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1 flex flex-col min-h-0">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 p-2 flex flex-col h-full">
            <div className="flex items-center justify-center gap-1.5 mb-2 pb-2 border-b border-gray-200 flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <p className="text-xs font-bold text-gray-800">Live Preview</p>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <BarcodePreview formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
