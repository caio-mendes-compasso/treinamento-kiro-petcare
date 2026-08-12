"use client";

import { useState, useRef } from "react";
import { validatePetPhoto } from "./fileValidation";

interface PhotoUploadProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  error?: string;
}

export default function PhotoUpload({ value, onChange, error }: PhotoUploadProps) {
  const [internalError, setInternalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayError = error || internalError;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePetPhoto(file);

    if (!validation.valid) {
      setInternalError(validation.error ?? "Arquivo inválido");
      onChange(null);
      // Reset input so user can re-select
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      return;
    }

    setInternalError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Foto do Pet
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-500 hover:file:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 border border-gray-200 rounded-lg cursor-pointer"
      />

      {displayError && (
        <p className="text-red-500 text-sm">{displayError}</p>
      )}

      {value && (
        <div className="mt-2">
          <img
            src={value}
            alt="Preview da foto do pet"
            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
          />
        </div>
      )}
    </div>
  );
}
