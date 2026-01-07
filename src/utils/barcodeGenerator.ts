import JsBarcode from 'jsbarcode';
import { BarcodeType } from '../types/barcode';

export const generateBarcode = (value: string, elementId: string, barcodeType: BarcodeType = 'CODE128'): void => {
  try {
    const canvas = document.createElement('canvas');
    const JsBarcodeLib = (JsBarcode as any).default || JsBarcode;
    
    const options: any = {
      format: barcodeType,
      width: 2,
      height: 60,
      displayValue: false, // Hide text below barcode
      fontSize: 14,
      margin: 10,
    };

    // EAN-13 specific options
    if (barcodeType === 'EAN13') {
      options.flat = true; // EAN-13 should be flat
    }
    
    JsBarcodeLib(canvas, value, options);
    
    const img = document.getElementById(elementId) as HTMLImageElement;
    if (img) {
      img.src = canvas.toDataURL('image/png');
    }
  } catch (error) {
    console.error('Error generating barcode:', error);
  }
};

export const generateBarcodeToCanvas = (value: string, barcodeType: BarcodeType = 'CODE128'): HTMLCanvasElement | null => {
  try {
    const canvas = document.createElement('canvas');
    const JsBarcodeLib = (JsBarcode as any).default || JsBarcode;
    
    const options: any = {
      format: barcodeType,
      width: 2,
      height: 60,
      displayValue: false, // Hide text below barcode
      fontSize: 14,
      margin: 10,
    };

    // EAN-13 specific options
    if (barcodeType === 'EAN13') {
      options.flat = true; // EAN-13 should be flat
    }
    
    JsBarcodeLib(canvas, value, options);
    return canvas;
  } catch (error) {
    console.error('Error generating barcode:', error);
    return null;
  }
};

