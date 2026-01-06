export interface LabelSize {
  labelCount: number;
  width: number; // in mm
  height: number; // in mm
  label: string;
}

export const LABEL_SIZES: LabelSize[] = [
  { labelCount: 12, width: 100, height: 44, label: '12 labels (100×44mm)' },
  { labelCount: 24, width: 64, height: 34, label: '24 labels (64×34mm)' },
  { labelCount: 48, width: 48, height: 24, label: '48 labels (48×24mm)' },
  { labelCount: 65, width: 38, height: 21, label: '65 labels (38×21mm)' },
];

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
}

