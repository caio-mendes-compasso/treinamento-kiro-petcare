export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePetPhoto(file: File): FileValidationResult {
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Apenas imagens são aceitas" };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Tamanho máximo permitido é 5MB" };
  }
  return { valid: true };
}
