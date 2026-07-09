// Code 128 → SVG, sans dépendance. Optimisé Code C pour les numéros
// (RPPS, FINESS) ; bascule en Code B pour un éventuel chiffre isolé final
// ou tout caractère non numérique.

// Table officielle des 107 motifs (largeurs barre/espace), index 0–106.
const PATTERNS = (
  "212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 " +
  "221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 " +
  "221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 " +
  "212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 " +
  "231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 " +
  "231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 " +
  "314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 " +
  "112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 " +
  "111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 " +
  "214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 " +
  "114131 311141 411131 211412 211214 211232 2331112"
).split(" ");

const START_B = 104, START_C = 105, CODE_B = 100, CODE_C = 99, STOP = 106;
const valB = (ch) => ch.charCodeAt(0) - 32; // ASCII 32–127 → 0–95

/** Encode une chaîne en suite de valeurs Code 128 (avec checksum et stop). */
function encode(text) {
  const digitsOnly = /^\d+$/.test(text);
  const codes = [];
  if (digitsOnly && text.length >= 2) {
    codes.push(START_C);
    let i = 0;
    for (; i + 1 < text.length; i += 2) codes.push(Number(text.slice(i, i + 2)));
    if (i < text.length) codes.push(CODE_B, valB(text[i])); // chiffre isolé final
  } else {
    codes.push(START_B);
    for (const ch of text) codes.push(valB(ch));
  }
  let sum = codes[0];
  for (let i = 1; i < codes.length; i++) sum += codes[i] * i;
  codes.push(sum % 103, STOP);
  return codes;
}

/**
 * Rend un code-barres Code 128 en SVG inline.
 * @param {string} text  contenu (ex. "10101156171")
 * @param {object} [o]   {height: px, module: largeur d'un module en px}
 */
export function code128svg(text, o = {}) {
  const height = o.height ?? 26;
  const module = o.module ?? 1.05;
  const widths = encode(text).flatMap((v) => [...PATTERNS[v]].map(Number));
  const total = widths.reduce((a, b) => a + b, 0) + 20; // zones de silence 10 modules
  let x = 10, bars = "";
  widths.forEach((w, i) => {
    if (i % 2 === 0) bars += `<rect x="${(x * module).toFixed(2)}" y="0" width="${(w * module).toFixed(2)}" height="${height}"/>`;
    x += w;
  });
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${(total * module).toFixed(0)}" height="${height}" ` +
    `viewBox="0 0 ${(total * module).toFixed(0)} ${height}" role="img" aria-label="${text}" ` +
    `style="display:block;"><g fill="#0d2b45">${bars}</g></svg>`
  );
}
