import JsBarcode from 'jsbarcode';

export const generateBarcode = (value: string, elementId: string): void => {
  try {
    const canvas = document.createElement('canvas');
    const JsBarcodeLib = (JsBarcode as any).default || JsBarcode;
    JsBarcodeLib(canvas, value, {
      format: 'CODE128',
      width: 2,
      height: 60,
      displayValue: false, // Hide text below barcode
      fontSize: 14,
      margin: 10,
    });
    
    const img = document.getElementById(elementId) as HTMLImageElement;
    if (img) {
      img.src = canvas.toDataURL('image/png');
    }
  } catch (error) {
    console.error('Error generating barcode:', error);
  }
};

export const generateBarcodeToCanvas = (value: string): HTMLCanvasElement | null => {
  try {
    const canvas = document.createElement('canvas');
    const JsBarcodeLib = (JsBarcode as any).default || JsBarcode;
    JsBarcodeLib(canvas, value, {
      format: 'CODE128',
      width: 2,
      height: 60,
      displayValue: false, // Hide text below barcode
      fontSize: 14,
      margin: 10,
    });
    return canvas;
  } catch (error) {
    console.error('Error generating barcode:', error);
    return null;
  }
};

