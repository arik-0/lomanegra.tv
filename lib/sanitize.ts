/**
 * Utilidad de sanitización para garantizar que no existan menciones a Coronel Suárez
 * en títulos, descripciones o datos deportivos en ningún lugar de la aplicación.
 */
export function sanitizeRegionalText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/de\s+coronel\s+su[aá]rez/gi, 'de la Liga Deportiva del Sur')
    .replace(/coronel\s+su[aá]rez/gi, 'Liga Deportiva del Sur');
}
