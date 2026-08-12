/**
 * Applies CPF mask: XXX.XXX.XXX-XX
 * Input: raw digit string (e.g. "12345678901")
 * Output: masked string (e.g. "123.456.789-01")
 */
export function applyCpfMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

/**
 * Applies phone mask: (XX) XXXXX-XXXX
 * Input: raw digit string (e.g. "11999998888")
 * Output: masked string (e.g. "(11) 99999-8888")
 */
export function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

/**
 * Strips mask characters, returning only digits
 */
export function unmask(value: string): string {
  return value.replace(/\D/g, "");
}
