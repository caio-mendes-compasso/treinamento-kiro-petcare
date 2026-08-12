"use client";

import { Pet } from "@/types/pets";

interface RemoveDialogProps {
  pet: Pet | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function RemoveDialog({
  pet,
  isOpen,
  onConfirm,
  onCancel,
}: RemoveDialogProps) {
  if (!isOpen || !pet) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-dialog-title"
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="remove-dialog-title"
          className="text-lg font-semibold text-gray-900 mb-4"
        >
          Remover Pet
        </h2>

        <p className="text-gray-700 mb-6">
          Tem certeza que deseja remover <strong>{pet.name}</strong>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
