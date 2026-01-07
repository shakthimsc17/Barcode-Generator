import { jsPDF } from 'jspdf';
import { BarcodeData } from '../types/barcode';
import { generateBarcodeToCanvas } from './barcodeGenerator';
import { A4_WIDTH_MM, A4_HEIGHT_MM, A4_MARGIN_MM } from './printLayout';

export const generatePDF = async (barcodes: BarcodeData[]): Promise<void> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const margin = A4_MARGIN_MM;

  let currentY = margin;
  let currentX = margin;

  for (const barcode of barcodes) {
    const labelWidth = barcode.labelSize?.width || 80;
    const labelHeight = barcode.labelSize?.height || 50;
    const spacing = 2; // 2mm spacing between labels
    const rowHeight = labelHeight + spacing;
    const padding = 2; // Internal padding for label

    // Generate barcode canvas once per barcode type
    const barcodeCanvas = generateBarcodeToCanvas(barcode.itemCode);
    if (!barcodeCanvas) continue;

    const barcodeDataUrl = barcodeCanvas.toDataURL('image/png');
    
    // Calculate font sizes based on label height
    const headerFontSize = Math.max(6, Math.min(12, labelHeight * 0.15));
    const itemNameFontSize = Math.max(8, Math.min(14, labelHeight * 0.18));
    const lineFontSize = Math.max(5, Math.min(8, labelHeight * 0.1));
    const priceFontSize = Math.max(7, Math.min(12, labelHeight * 0.2));
    
    // Barcode dimensions - proportional to label size, ensuring minimum scannable size
    // Minimum barcode height: 10mm for CODE128 scannability
    // Maximum: 35% of label height to leave room for text
    const barcodeImgWidth = labelWidth - (padding * 2);
    const barcodeImgHeight = Math.max(10, Math.min(labelHeight * 0.35, 20));

    // Generate all labels for this barcode
    for (let labelIndex = 0; labelIndex < barcode.numberOfLabels; labelIndex++) {
      // Check if we need a new page
      if (currentY + labelHeight > A4_HEIGHT_MM - margin) {
        pdf.addPage();
        currentY = margin;
        currentX = margin;
      }

      // Draw label border
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(currentX, currentY, labelWidth, labelHeight);

      let yPosition = currentY + padding + 1;

      // Add header (company name) - centered
      pdf.setFontSize(headerFontSize);
      pdf.setFont('helvetica', 'bold');
      const headerText = barcode.header || 'POS BARCODE GENERATOR';
      const headerWidth = pdf.getTextWidth(headerText);
      pdf.text(headerText, currentX + (labelWidth / 2) - (headerWidth / 2), yPosition);
      yPosition += headerFontSize * 0.4 + 1; // Reduced spacing: font height * 0.4 + 1mm

      // Add item name after company name (centered)
      pdf.setFontSize(itemNameFontSize);
      pdf.setFont('helvetica', 'bold');
      const itemNameWidth = pdf.getTextWidth(barcode.itemName);
      pdf.text(barcode.itemName, currentX + (labelWidth / 2) - (itemNameWidth / 2), yPosition);
      yPosition += itemNameFontSize * 0.3 + 1; // Reduced spacing: font height * 0.3 + 1mm

      // Add barcode image
      const barcodeY = yPosition;
      pdf.addImage(barcodeDataUrl, 'PNG', currentX + padding, barcodeY, barcodeImgWidth, barcodeImgHeight);
      yPosition += barcodeImgHeight + 1; // Reduced spacing: 1mm after barcode

      // Add item code below barcode (centered)
      pdf.setFontSize(itemNameFontSize);
      pdf.setFont('helvetica', 'normal');
      const itemCodeWidth = pdf.getTextWidth(barcode.itemCode);
      pdf.text(barcode.itemCode, currentX + (labelWidth / 2) - (itemCodeWidth / 2), yPosition);
      yPosition += itemNameFontSize * 0.3 + 1; // Reduced spacing: font height * 0.3 + 1mm

      // Add additional lines (centered)
      for (const line of barcode.lines) {
        if (line.trim() && yPosition < currentY + labelHeight - 6) {
          pdf.setFontSize(lineFontSize);
          const lineWidth = pdf.getTextWidth(line);
          pdf.text(line, currentX + (labelWidth / 2) - (lineWidth / 2), yPosition);
          yPosition += lineFontSize * 0.4 + 0.5; // Reduced spacing: font height * 0.4 + 0.5mm
        }
      }

      // Add MRP and Sale Price on same line at bottom (MRP left, Sale right)
      pdf.setFontSize(priceFontSize);
      pdf.setFont('helvetica', 'bold');
      const mrpText = `MRP: Rs.${barcode.mrp}`;
      const saleText = `Sale: Rs.${barcode.salePrice}`;
      const priceY = currentY + labelHeight - padding - 1; // Reduced spacing: 1mm from bottom
      
      // MRP on the left
      pdf.text(mrpText, currentX + padding, priceY);
      
      // Draw strikethrough line for MRP if enabled
      if (barcode.strikeMrp) {
        const mrpTextWidth = pdf.getTextWidth(mrpText);
        const lineY = priceY - (priceFontSize * 0.3); // Position line through middle of text
        pdf.setDrawColor(0, 0, 0); // Black color
        pdf.setLineWidth(0.5);
        pdf.line(currentX + padding, lineY, currentX + padding + mrpTextWidth, lineY);
      }
      
      // Sale on the right
      const saleTextWidth = pdf.getTextWidth(saleText);
      pdf.text(saleText, currentX + labelWidth - padding - saleTextWidth, priceY);

      // Move to next position
      currentX += labelWidth + spacing;
      if (currentX + labelWidth > A4_WIDTH_MM - margin) {
        currentX = margin;
        currentY += rowHeight;
      }
    }
  }

  pdf.save('barcodes.pdf');
};
