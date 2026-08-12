import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { validatePetPhoto, MAX_FILE_SIZE } from "@/components/pets/fileValidation";

/**
 * Helper to create a File-like object with specified type and size.
 */
function createFakeFile(type: string, size: number): File {
  const buffer = new ArrayBuffer(size);
  const blob = new Blob([buffer], { type });
  return new File([blob], "test-file", { type });
}

/**
 * Arbitrary that generates valid image MIME types (starting with "image/").
 */
const imageMimeType = fc.oneof(
  fc.constant("image/png"),
  fc.constant("image/jpeg"),
  fc.constant("image/gif"),
  fc.constant("image/webp"),
  fc.constant("image/svg+xml"),
  fc.constant("image/bmp"),
  fc.constant("image/tiff"),
  fc.constantFrom("image/avif", "image/heic", "image/heif"),
  fc.stringMatching(/^[a-z]{1,10}$/).map((s) => `image/${s}`)
);

/**
 * Arbitrary that generates non-image MIME types (not starting with "image/").
 */
const nonImageMimeType = fc.oneof(
  fc.constant("application/pdf"),
  fc.constant("text/plain"),
  fc.constant("video/mp4"),
  fc.constant("audio/mpeg"),
  fc.constant("application/json"),
  fc.constant("application/zip"),
  fc.constant("text/html"),
  fc.constant("video/webm"),
  fc.constant("audio/wav"),
  fc.constantFrom(
    "application/octet-stream",
    "text/csv",
    "application/xml",
    "multipart/form-data"
  ),
  fc
    .stringMatching(/^[a-z]{1,10}$/)
    .filter((s) => s !== "image")
    .map((s) => `${s}/something`)
);

/**
 * Arbitrary that generates file sizes within valid range (1 byte to 5MB).
 */
const validFileSize = fc.integer({ min: 1, max: MAX_FILE_SIZE });

describe("Feature: pet-registration-listing, Property 4: File type validation accepts only images", () => {
  /**
   * **Validates: Requirements 4.1, 4.4**
   *
   * For any file with MIME type starting with "image/", validatePetPhoto
   * returns valid: true (when size is within limit).
   */
  it("accepts any file with MIME type starting with 'image/'", () => {
    fc.assert(
      fc.property(imageMimeType, validFileSize, (mimeType, size) => {
        const file = createFakeFile(mimeType, size);
        const result = validatePetPhoto(file);
        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      }),
      { numRuns: 200 }
    );
  });

  /**
   * **Validates: Requirements 4.1, 4.4**
   *
   * For any file with MIME type NOT starting with "image/", validatePetPhoto
   * returns valid: false with the error message "Apenas imagens são aceitas".
   */
  it("rejects any file with MIME type not starting with 'image/'", () => {
    fc.assert(
      fc.property(nonImageMimeType, validFileSize, (mimeType, size) => {
        const file = createFakeFile(mimeType, size);
        const result = validatePetPhoto(file);
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Apenas imagens são aceitas");
      }),
      { numRuns: 200 }
    );
  });

  /**
   * **Validates: Requirements 4.1, 4.4**
   *
   * Verifies the biconditional: valid is true IF AND ONLY IF type starts with "image/".
   */
  it("valid is true iff MIME type starts with 'image/'", () => {
    const anyMimeType = fc.oneof(imageMimeType, nonImageMimeType);

    fc.assert(
      fc.property(anyMimeType, validFileSize, (mimeType, size) => {
        const file = createFakeFile(mimeType, size);
        const result = validatePetPhoto(file);
        const isImage = mimeType.startsWith("image/");

        expect(result.valid).toBe(isImage);
        if (!isImage) {
          expect(result.error).toBe("Apenas imagens são aceitas");
        }
      }),
      { numRuns: 200 }
    );
  });
});
