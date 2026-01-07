export interface LabelSize {
  labelCount: number;
  width: number; // in mm
  height: number; // in mm
  label: string;
}

export const LABEL_SIZES: LabelSize[] = [
  // Calculated based on A4: 210×297mm with 10mm margins, 2mm spacing
  // Usable area: 190×277mm
  { labelCount: 12, width: 94, height: 44.5, label: '12 labels (94×45mm) - 2×6 grid' },
  { labelCount: 24, width: 62, height: 32.9, label: '24 labels (62×33mm) - 3×8 grid' },
  { labelCount: 32, width: 46, height: 32.9, label: '32 labels (46×33mm) - 4×8 grid' },
  { labelCount: 40, width: 36.4, height: 32.9, label: '40 labels (36×33mm) - 5×8 grid' },
  { labelCount: 48, width: 46, height: 21.3, label: '48 labels (46×21mm) - 4×12 grid' },
  { labelCount: 50, width: 36.4, height: 25.9, label: '50 labels (36×26mm) - 5×10 grid' },
  { labelCount: 60, width: 30, height: 25.9, label: '60 labels (30×26mm) - 6×10 grid' },
  { labelCount: 65, width: 36.4, height: 19.5, label: '65 labels (36×20mm) - 5×13 grid' },
  { labelCount: 72, width: 30, height: 21.3, label: '72 labels (30×21mm) - 6×12 grid' },
];

export type BarcodeType = 'CODE128' | 'EAN13';

export interface BarcodeData {
  id: string;
  itemName: string;
  itemCode: string;
  numberOfLabels: number;
  header: string;
  lines: string[];
  mrp: number;
  salePrice: number;
  labelSize: LabelSize;
  strikeMrp: boolean;
  barcodeType: BarcodeType;
  createdAt: Date;
}

export interface BarcodeFormData {
  itemName: string;
  itemCode: string;
  numberOfLabels: number;
  header: string;
  lines: string[];
  mrp: number;
  salePrice: number;
  labelSize: LabelSize;
  strikeMrp: boolean;
  barcodeType: BarcodeType;
}

