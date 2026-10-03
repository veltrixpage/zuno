/**
 * Bandeiras pequenas e redondas (SVG próprio, sem emoji).
 * Emojis de bandeira não aparecem no Windows, então desenhamos versões
 * simplificadas em 20×20, recortadas em círculo pelo CSS (.flag).
 */
import { svg } from '../core/dom.js';

function star(cx, cy, r, rot = -90) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.4 : r;
    const a = ((rot + i * 36) * Math.PI) / 180;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)},${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="#FFDE00"/>`;
}

const usStripes = Array.from({ length: 7 }, (_, i) => `<rect y="${(i * 2 * 20) / 13}" width="20" height="${20 / 13}" fill="#B22234"/>`).join('');

const ART = {
  us: `<rect width="20" height="20" fill="#fff"/>${usStripes}<rect width="10" height="${(7 * 20) / 13}" fill="#3C3B6E"/>`
    + [[2.5, 2.4], [5, 2.4], [7.5, 2.4], [3.75, 4.6], [6.25, 4.6], [2.5, 6.8], [5, 6.8], [7.5, 6.8], [3.75, 9], [6.25, 9]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".55" fill="#fff"/>`).join(''),
  es: '<rect width="20" height="20" fill="#AA151B"/><rect y="5" width="20" height="10" fill="#F1BF00"/>',
  it: '<rect width="20" height="20" fill="#fff"/><rect width="6.67" height="20" fill="#009246"/><rect x="13.33" width="6.67" height="20" fill="#CE2B37"/>',
  fr: '<rect width="20" height="20" fill="#fff"/><rect width="6.67" height="20" fill="#0055A4"/><rect x="13.33" width="6.67" height="20" fill="#EF4135"/>',
  de: '<rect width="20" height="6.67" fill="#000"/><rect y="6.67" width="20" height="6.67" fill="#DD0000"/><rect y="13.33" width="20" height="6.67" fill="#FFCE00"/>',
  jp: '<rect width="20" height="20" fill="#fff"/><circle cx="10" cy="10" r="5.2" fill="#BC002D"/>',
  kr: '<rect width="20" height="20" fill="#fff"/>'
    + '<g transform="rotate(33.7 10 10)"><path d="M5.5 10a4.5 4.5 0 0 1 9 0z" fill="#CD2E3A"/><path d="M5.5 10a4.5 4.5 0 0 0 9 0z" fill="#0047A0"/>'
    + '<circle cx="7.75" cy="10" r="2.25" fill="#CD2E3A"/><circle cx="12.25" cy="10" r="2.25" fill="#0047A0"/></g>'
    + ['rotate(-56.3 10 10)', 'rotate(56.3 10 10)', 'rotate(123.7 10 10)', 'rotate(236.3 10 10)'].map((t) => `<g transform="${t}"><rect x="9" y="1.6" width="2" height=".5" fill="#000"/><rect x="9" y="2.4" width="2" height=".5" fill="#000"/><rect x="9" y="3.2" width="2" height=".5" fill="#000"/></g>`).join(''),
  cn: `<rect width="20" height="20" fill="#EE1C25"/>${star(5.5, 6.5, 3.2)}${star(10, 3.2, 0.9, -60)}${star(11.8, 5.2, 0.9, -40)}${star(11.8, 8, 0.9, -90)}${star(10, 9.8, 0.9, -110)}`,
  pt: '<rect width="20" height="20" fill="#FF0000"/><rect width="8" height="20" fill="#006600"/><circle cx="8" cy="10" r="3.6" fill="#FFCC00"/><circle cx="8" cy="10" r="2.1" fill="#fff" stroke="#FF0000" stroke-width=".9"/>',
};

export function Flag({ country, size = 'md', label } = {}) {
  const node = svg(
    `<svg class="flag flag--${size}" viewBox="0 0 20 20" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false">${ART[country] || '<rect width="20" height="20" fill="#ccc"/>'}<circle cx="10" cy="10" r="9.7" fill="none" stroke="rgba(0,0,0,.14)" stroke-width=".6"/></svg>`,
  );
  return node;
}
