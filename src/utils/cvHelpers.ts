import { stripHtml } from './stripHtml';

const degreeLabels: Record<string, string> = {
  high_school: 'High School Diploma',
  associate: "Associate Degree",
  bachelor: "Bachelor's Degree",
  master: "Master's Degree",
  phd: 'PhD / Doctorate',
  certificate: 'Certificate',
  diploma: 'Diploma',
  other: 'Other',
};

export function getDegreeLabel(value: string): string {
  return degreeLabels[value] || value;
}

export function getResultLabel(resultType: string, gpa: string): string {
  if (!gpa || !gpa.trim()) return '';
  const labels: Record<string, string> = {
    cgpa: 'CGPA',
    percentage: 'Percentage',
    marks: 'Marks',
  };
  const label = labels[resultType] || 'GPA';
  return `${label}: ${gpa}`;
}

export function formatDateForPdf(date: string): string {
  if (!date) return '';
  return new Date(date + '-01').toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function htmlToBullets(html: string): string[] {
  if (!html) return [];
  const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  const matches: string[] = [];
  let match;
  while ((match = liRegex.exec(html)) !== null) {
    const text = match[1]
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
    if (text) matches.push(text);
  }
  if (matches.length > 0) return matches;
  return stripHtml(html)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}
