import { BarcodeData } from '../types/barcode';
import { BarcodeCard } from './BarcodeCard';

interface BarcodeListProps {
  barcodes: BarcodeData[];
  onDelete: (id: string) => void;
}

export const BarcodeList = ({ barcodes, onDelete }: BarcodeListProps) => {
  if (barcodes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-lg font-semibold">No barcodes added yet.</p>
        <p className="text-sm mt-2">Fill in the form above and click "Add to List" to create barcodes.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {barcodes.map((barcode) => (
        <BarcodeCard key={barcode.id} barcode={barcode} onDelete={onDelete} />
      ))}
    </div>
  );
};

