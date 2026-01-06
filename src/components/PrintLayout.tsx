import { BarcodeData } from '../types/barcode';
import { useEffect, useRef } from 'react';
import { generateBarcode } from '../utils/barcodeGenerator';

interface PrintLayoutProps {
  barcodes: BarcodeData[];
}

export const PrintLayout = ({ barcodes }: PrintLayoutProps) => {
  const printContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate all barcodes when component mounts or barcodes change
    const generateAllBarcodes = () => {
      const allLabels = barcodes.flatMap((barcode) =>
        Array.from({ length: barcode.numberOfLabels }, (_, i) => ({
          barcode,
          labelIndex: i,
          barcodeId: `print-barcode-${barcode.id}-${i}`,
        }))
      );

      // Generate all barcodes with a small delay to ensure DOM is ready
      allLabels.forEach((label, idx) => {
        setTimeout(() => {
          if (label.barcode.itemCode) {
            // Ensure the image element exists
            const imgElement = document.getElementById(label.barcodeId);
            if (imgElement) {
              generateBarcode(label.barcode.itemCode, label.barcodeId);
            } else {
              // If element doesn't exist yet, try again after a short delay
              setTimeout(() => {
                const retryElement = document.getElementById(label.barcodeId);
                if (retryElement && label.barcode.itemCode) {
                  generateBarcode(label.barcode.itemCode, label.barcodeId);
                }
              }, 100);
            }
          }
        }, idx * 20); // Stagger generation slightly
      });
    };

    if (barcodes.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(generateAllBarcodes, 100);
    }
  }, [barcodes]);

  // Also regenerate on beforeprint event
  useEffect(() => {
    const handleBeforePrint = () => {
      const allLabels = barcodes.flatMap((barcode) =>
        Array.from({ length: barcode.numberOfLabels }, (_, i) => ({
          barcode,
          barcodeId: `print-barcode-${barcode.id}-${i}`,
        }))
      );

      allLabels.forEach((label) => {
        if (label.barcode.itemCode) {
          const imgElement = document.getElementById(label.barcodeId);
          if (imgElement) {
            generateBarcode(label.barcode.itemCode, label.barcodeId);
          }
        }
      });
    };

    window.addEventListener('beforeprint', handleBeforePrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, [barcodes]);

  const allLabels = barcodes.flatMap((barcode) =>
    Array.from({ length: barcode.numberOfLabels }, (_, i) => ({ 
      ...barcode, 
      labelIndex: i,
      labelSize: barcode.labelSize || { labelCount: 12, width: 100, height: 44, label: '12 labels (100×44mm)' }
    }))
  );

  return (
    <div className="print-only" style={{ display: 'none' }}>
      <div
        ref={printContainerRef}
        className="print-container"
        style={{
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
          padding: '10mm',
          backgroundColor: 'white',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2mm',
          }}
        >
          {allLabels.map((label, index) => {
            const labelWidth = label.labelSize?.width || 80;
            const labelHeight = label.labelSize?.height || 50;
            const barcodeId = `print-barcode-${label.id}-${index}`;
            
            // Calculate font sizes based on label height
            const headerFontSize = Math.max(8, Math.min(12, labelHeight * 0.15));
            const itemNameFontSize = Math.max(10, Math.min(14, labelHeight * 0.18)); // Increased size
            const lineFontSize = Math.max(6, Math.min(8, labelHeight * 0.1));
            const priceFontSize = Math.max(9, Math.min(12, labelHeight * 0.2)); // Increased for better visibility
            
            return (
              <div
                key={`${label.id}-${index}`}
                className="border border-gray-300 break-inside-avoid"
                data-item-code={label.itemCode}
                style={{
                  width: `${labelWidth}mm`,
                  height: `${labelHeight}mm`,
                  pageBreakInside: 'avoid',
                  padding: '2mm',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxSizing: 'border-box',
                }}
              >
                {/* Header - Company Name */}
                <div style={{ marginBottom: '2mm' }}>
                  <h3 style={{ 
                    fontSize: `${headerFontSize}px`, 
                    margin: 0, 
                    padding: 0,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#111827'
                  }}>
                    {label.header || 'POS BARCODE GENERATOR'}
                  </h3>
                </div>

                {/* Item Name after company name */}
                <div style={{ marginBottom: '1mm' }}>
                  <p style={{ 
                    fontSize: `${itemNameFontSize}px`, 
                    margin: 0, 
                    padding: 0,
                    textAlign: 'center',
                    fontWeight: 'semibold',
                    color: '#374151'
                  }}>
                    {label.itemName}
                  </p>
                </div>
                
                {/* Barcode Section */}
                <div style={{ 
                  flex: '1 1 auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '1mm 0',
                  minHeight: `${labelHeight * 0.35}mm`
                }}>
                  <img
                    id={barcodeId}
                    alt={`Barcode ${label.itemCode}`}
                    src=""
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: `${labelHeight * 0.35}mm`,
                      objectFit: 'contain',
                      display: 'block',
                      minHeight: '20px'
                    }}
                  />
                </div>

                {/* Item Code below barcode */}
                <div style={{ 
                  marginTop: '1mm',
                  marginBottom: '1mm',
                  textAlign: 'center'
                }}>
                  <p style={{ 
                    fontSize: `${itemNameFontSize}px`, 
                    margin: 0, 
                    padding: 0,
                    color: '#374151',
                    fontWeight: 'normal'
                  }}>
                    {label.itemCode}
                  </p>
                </div>

                {/* Additional Lines */}
                {label.lines.length > 0 && label.lines.some(line => line.trim()) && (
                  <div style={{ 
                    marginBottom: '1mm',
                    textAlign: 'center'
                  }}>
                    {label.lines.map((line, lineIndex) => (
                      line.trim() && (
                        <p key={lineIndex} style={{ 
                          fontSize: `${lineFontSize}px`, 
                          margin: '0.5mm 0',
                          padding: 0,
                          color: '#374151'
                        }}>
                          {line}
                        </p>
                      )
                    ))}
                  </div>
                )}

                {/* Bottom Section - Pricing */}
                <div style={{ 
                  marginTop: 'auto',
                  paddingTop: '1mm',
                  borderTop: '1px solid #d1d5db',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ 
                    fontSize: `${priceFontSize}px`, 
                    margin: 0, 
                    padding: 0,
                    fontWeight: 'bold',
                    color: '#111827',
                    textDecoration: label.strikeMrp ? 'line-through' : 'none'
                  }}>
                    MRP: Rs.{label.mrp}
                  </span>
                  <span style={{ 
                    fontSize: `${priceFontSize}px`, 
                    margin: 0, 
                    padding: 0,
                    fontWeight: 'bold',
                    color: '#111827'
                  }}>
                    Sale: Rs.{label.salePrice}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
