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

  const handleLineChange = (index: number, value: string) => {
    setFormData((prev) => {
      const newLines = [...prev.lines];
      newLines[index] = value;
      return { ...prev, lines: newLines };
    });
  };

  const addLine = () => {
    setFormData((prev) => ({ ...prev, lines: [...prev.lines, ''] }));
  };

  const removeLine = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName || !formData.itemCode) {
      alert('Please fill in Item Name and Item Code');
      return;
    }

    const newBarcode: BarcodeData = {
      id: Date.now().toString(),
      ...formData,
      lines: formData.lines.filter((line) => line.trim() !== ''),
      createdAt: new Date(),
    };

    onAddBarcode(newBarcode);

    // Reset form but keep header and label size
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
    });
    setNumberOfLabelsInput('1');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
      <div className="border-b-2 border-gray-300 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Barcode Generator</h2>
        <p className="text-sm text-gray-600 mt-1">Create and manage barcode labels</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="header" className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name / Header
                </label>
                <input
                  type="text"
                  id="header"
                  value={formData.header}
                  onChange={(e) => handleInputChange('header', e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="itemName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange('itemName', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="itemCode" className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="itemCode"
                  value={formData.itemCode}
                  onChange={(e) => handleInputChange('itemCode', e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="labelSize" className="block text-sm font-semibold text-gray-700 mb-2">
                  Label Size
                </label>
                <select
                  id="labelSize"
                  value={formData.labelSize.labelCount}
                  onChange={(e) => handleLabelSizeChange(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                >
                  {LABEL_SIZES.map((size) => (
                    <option key={size.labelCount} value={size.labelCount}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="numberOfLabels" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="absolute left-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-l-lg border-2 border-r-0 border-gray-300 font-bold text-gray-700 transition-colors"
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
                        // Allow empty input
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
                    className="w-full px-4 py-2.5 pl-12 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                    className="absolute right-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-r-lg border-2 border-l-0 border-gray-300 font-bold text-gray-700 transition-colors"
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="mrp" className="block text-sm font-semibold text-gray-700 mb-2">
                  MRP (Rs.)
                </label>
                <input
                  type="number"
                  id="mrp"
                  value={formData.mrp === 0 ? '' : formData.mrp}
                  onChange={(e) => handleInputChange('mrp', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="salePrice" className="block text-sm font-semibold text-gray-700 mb-2">
                  Sale Price (Rs.)
                </label>
                <input
                  type="number"
                  id="salePrice"
                  value={formData.salePrice === 0 ? '' : formData.salePrice}
                  onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Strike MRP Option */}
            <div className="mt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.strikeMrp}
                  onChange={(e) => setFormData((prev) => ({ ...prev, strikeMrp: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Strike through MRP price
                </span>
              </label>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Additional Lines
                </label>
                <button
                  type="button"
                  onClick={addLine}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
                >
                  + Add Line
                </button>
              </div>
              <div className="space-y-2">
                {formData.lines.map((line, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => handleLineChange(index, e.target.value)}
                      className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    {formData.lines.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeLine(index)}
                        className="px-4 py-2.5 text-red-600 hover:text-red-800 font-semibold border-2 border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Add to List
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-semibold text-gray-700 mb-3 text-center">Preview</p>
              <BarcodePreview formData={formData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
