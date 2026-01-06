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
  const availableWidth = A4_WIDTH_MM - (margin * 2);
  const availableHeight = A4_HEIGHT_MM - (margin * 2);

  let currentY = margin;
  let currentX = margin;

  for (const barcode of barcodes) {
    const labelWidth = barcode.labelSize?.width || 80;
    const labelHeight = barcode.labelSize?.height || 50;
    const spacing = 2; // 2mm spacing between labels
    const rowHeight = labelHeight + spacing;
    const padding = 2; // Internal padding for label

    // Calculate how many labels fit per row
    const labelsPerRow = Math.floor((availableWidth + spacing) / (labelWidth + spacing));

    // Generate barcode canvas once per barcode type
    const barcodeCanvas = generateBarcodeToCanvas(barcode.itemCode);
    if (!barcodeCanvas) continue;

    const barcodeDataUrl = barcodeCanvas.toDataURL('image/png');
    
    // Calculate font sizes based on label height
    const headerFontSize = Math.max(8, Math.min(12, labelHeight * 0.15));
    const itemNameFontSize = Math.max(10, Math.min(14, labelHeight * 0.18)); // Increased size
    const lineFontSize = Math.max(6, Math.min(8, labelHeight * 0.1));
    const priceFontSize = Math.max(9, Math.min(12, labelHeight * 0.2)); // Increased for better visibility
    
    // Barcode dimensions - proportional to label size
    const barcodeImgWidth = labelWidth - (padding * 2);
    const barcodeImgHeight = Math.max(12, Math.min(20, labelHeight * 0.35));

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

      let yPosition = currentY + padding + 2;

      // Add header (company name) - centered
      pdf.setFontSize(headerFontSize);
      pdf.setFont('helvetica', 'bold');
      const headerText = barcode.header || 'POS BARCODE GENERATOR';
      const headerWidth = pdf.getTextWidth(headerText);
      pdf.text(headerText, currentX + (labelWidth / 2) - (headerWidth / 2), yPosition);
      yPosition += 5; // Increased spacing

      // Add item name after company name (centered)
      pdf.setFontSize(itemNameFontSize);
      pdf.setFont('helvetica', 'bold');
      const itemNameWidth = pdf.getTextWidth(barcode.itemName);
      pdf.text(barcode.itemName, currentX + (labelWidth / 2) - (itemNameWidth / 2), yPosition);
      yPosition += 4;

      // Add barcode image
      const barcodeY = yPosition;
      pdf.addImage(barcodeDataUrl, 'PNG', currentX + padding, barcodeY, barcodeImgWidth, barcodeImgHeight);
      yPosition += barcodeImgHeight + 2;

      // Add item code below barcode (centered)
      pdf.setFontSize(itemNameFontSize);
      pdf.setFont('helvetica', 'normal');
      const itemCodeWidth = pdf.getTextWidth(barcode.itemCode);
      pdf.text(barcode.itemCode, currentX + (labelWidth / 2) - (itemCodeWidth / 2), yPosition);
      yPosition += 3;

      // Add additional lines (centered)
      for (const line of barcode.lines) {
        if (line.trim() && yPosition < currentY + labelHeight - 8) {
          pdf.setFontSize(lineFontSize);
          const lineWidth = pdf.getTextWidth(line);
          pdf.text(line, currentX + (labelWidth / 2) - (lineWidth / 2), yPosition);
          yPosition += 3;
        }
      }

      // Add MRP and Sale Price on same line at bottom (MRP left, Sale right)
      pdf.setFontSize(priceFontSize);
      pdf.setFont('helvetica', 'bold');
      const mrpText = `MRP: Rs.${barcode.mrp}`;
      const saleText = `Sale: Rs.${barcode.salePrice}`;
      const priceY = currentY + labelHeight - padding - 2;
      
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
