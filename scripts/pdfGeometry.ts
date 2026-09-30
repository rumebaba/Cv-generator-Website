import { inflateSync } from 'node:zlib';

import { renderToBuffer } from '@react-pdf/renderer';
import type React from 'react';

type M = [number, number, number, number, number, number];

const CP1252: Record<number, string> = {
  0x85: '…',
  0x91: '‘',
  0x92: '’',
  0x93: '“',
  0x94: '”',
  0x95: '•',
  0x96: '–',
  0x97: '—',
};

export function pdfContent(buffer: Buffer): string {
  const raw = buffer.toString('latin1');
  let content = '';
  const re = /stream\r?\n?([\s\S]*?)endstream/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    try {
      content += inflateSync(Buffer.from(m[1], 'latin1')).toString('latin1');
    } catch {
      content += m[1];
    }
  }
  return content;
}

export const pageCount = (buffer: Buffer) =>
  (buffer.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;

export interface Draw {
  x: number;
  y: number;
  size: number;
  text: string;
}

const IDENTITY: M = [1, 0, 0, 1, 0, 0];

const mul = (m: M, n: M): M => [
  m[0] * n[0] + m[1] * n[2],
  m[0] * n[1] + m[1] * n[3],
  m[2] * n[0] + m[3] * n[2],
  m[2] * n[1] + m[3] * n[3],
  m[4] * n[0] + m[5] * n[2] + n[4],
  m[4] * n[1] + m[5] * n[3] + n[5],
];

const decodeHex = (hex: string) => {
  let t = '';
  for (let i = 0; i + 1 < hex.length; i += 2) {
    const code = parseInt(hex.slice(i, i + 2), 16);
    t += CP1252[code] ?? String.fromCharCode(code);
  }
  return t;
};

/**
 * Absolute page coordinates for every text run.
 * react-pdf nests `cm` transforms and always emits `Tm` as 0,0, so the CTM
 * must be tracked to get real positions.
 */
export function textDraws(content: string): Draw[] {
  const out: Draw[] = [];
  let ctm: M = [...IDENTITY] as M;
  let tm: M = [...IDENTITY] as M;
  const stack: { ctm: M; tm: M }[] = [];
  let size = 0;
  let pending = '';

  const emit = () => {
    if (!pending.trim()) return;
    const m = mul(tm, ctm);
    out.push({ x: m[4], y: m[5], size, text: pending });
    pending = '';
  };

  const re =
    /\bq\b|\bQ\b|BT\b|ET\b|\/F\d+ ([\d.]+) Tf|([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+) cm|1 0 0 1 ([-\d.]+) ([-\d.]+) Tm|<([0-9A-Fa-f]+)>/g;

  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const t = m[0];
    if (t === 'q') {
      stack.push({ ctm: [...ctm] as M, tm: [...tm] as M });
    } else if (t === 'Q') {
      const s = stack.pop();
      if (s) ({ ctm, tm } = s);
    } else if (t === 'BT') {
      tm = [...IDENTITY] as M;
    } else if (t === 'ET') {
      emit();
    } else if (t.endsWith('Tf')) {
      size = parseFloat(m[1]!);
    } else if (t.endsWith('cm')) {
      const n = m.slice(2, 8).map((v) => parseFloat(v!)) as M;
      ctm = mul(n, ctm);
    } else if (t.endsWith('Tm')) {
      tm = [1, 0, 0, 1, parseFloat(m[8]!), parseFloat(m[9]!)];
    } else if (t.startsWith('<')) {
      pending += decodeHex(m[10]!);
    }
  }
  emit();
  return out;
}

export async function renderToDraws(node: React.ReactElement) {
  const buffer = await renderToBuffer(node);
  return { draws: textDraws(pdfContent(buffer)), pages: pageCount(buffer), buffer };
}
