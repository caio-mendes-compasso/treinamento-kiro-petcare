import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { validatePetPhoto, MAX_FILE_SIZE } from "@/components/pets/fileValidation";

/**
 * Helper to create a File-like object with a given MIME type and size.
 */
function createImageFile(size: number, mimeType = "image/png"): File {
  const buffer = new ArrayBuffer(size);
  const blob = new Blob([buffer], { type: mimeType });
  return new File([blob], "test-photo.png", { type: mimeType });
}

describe("Feature: pet-registration-listing, Property 5: File size validation rejects files above 5MB", () => {
  /**
   * **Validates: Requirements 4.3**
   *
   * For any file with MIME type starting with "image/", validatePetPhoto returns
   * valid: false with the size error if and only if the file size exceeds 5,242,880 bytes.
   */

  it("rejects image files with size > 5MB", () => {
    const oversizedBytes = fc.integer({ min: MAX_FILE_SIZE + 1, max: MAX_FILE_SIZE + 10_000 });

    fc.assert(
      fc.property(oversizedBytes, (size) => {
        const file = createImageFile(size);
        const result = validatePetPhoto(file);
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Tamanho máximo permitido é 5MB");
      }),
      { numRuns: 200 }
    );
  });

  it("accepts image files with size <= 5MB", () => {
    const validSizeBytes = fc.integer({ min: 1, max: MAX_FILE_SIZE });

    fc.assert(
      fc.property(validSizeBytes, (size) => {
        const file = createImageFile(size);
        const result = validatePetPhoto(file);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      }),
      { numRuns: 200 }
    );
  });

  it("boundary: exactly 5MB passes, 5MB + 1 byte fails", () => {
    // Exactly 5MB should pass
    const exactFile = createImageFile(MAX_FILE_SIZE);
    const exactResult = validatePetPhoto(exactFile);
    expect(exactResult.valid).toBe(true);
    expect(exactResult.error).toBeUndefined();

    // 5MB + 1 byte should fail
    const overFile = createImageFile(MAX_FILE_SIZE + 1);
    const overResult = validatePetPhoto(overFile);
    expect(overResult.valid).toBe(false);
    expect(overResult.error).toBe("Tamanho máximo permitido é 5MB");
  });

  it("size validation only applies to image MIME types", () => {
    const imageMimeTypes = fc.constantFrom(
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp"
    );
    const oversizedBytes = fc.integer({ min: MAX_FILE_SIZE + 1, max: MAX_FILE_SIZE + 5_000 });

    fc.assert(
      fc.property(fc.tuple(imageMimeTypes, oversizedBytes), ([mimeType, size]) => {
        const file = createImageFile(size, mimeType);
        const result = validatePetPhoto(file);
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Tamanho máximo permitido é 5MB");
      }),
      { numRuns: 100 }
    );
  });
});
