// A4 dimensions in mm
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const A4_MARGIN_MM = 10;

// A4 dimensions in pixels (at 96 DPI)
export const A4_WIDTH_PX = 794; // 210mm * 3.7795
export const A4_HEIGHT_PX = 1123; // 297mm * 3.7795
export const A4_MARGIN_PX = 38; // 10mm * 3.7795

export interface LabelDimensions {
  width: number;
  height: number;
}

export interface GridLayout {
  rows: number;
  cols: number;
  labelWidth: number;
  labelHeight: number;
}

export const calculateOptimalLayout = (
  numberOfLabels: number,
  labelWidth: number = 80,
  labelHeight: number = 50
): GridLayout => {
  const availableWidth = A4_WIDTH_PX - (A4_MARGIN_PX * 2);
  const availableHeight = A4_HEIGHT_PX - (A4_MARGIN_PX * 2);

  // Calculate how many labels can fit
  const maxCols = Math.floor(availableWidth / labelWidth);
  const maxRows = Math.floor(availableHeight / labelHeight);

  // Calculate optimal grid
  let cols = Math.min(maxCols, numberOfLabels);
  let rows = Math.ceil(numberOfLabels / cols);

  // If rows exceed available space, adjust
  if (rows > maxRows) {
    rows = maxRows;
    cols = Math.ceil(numberOfLabels / rows);
  }

  return {
    rows,
    cols,
    labelWidth,
    labelHeight,
  };
};

