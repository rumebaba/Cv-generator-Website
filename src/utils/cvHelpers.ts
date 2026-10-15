import type { Certification, Language, Skill } from '../types/form';

import { stripHtml } from './stripHtml';

const degreeLabels: Record<string, string> = {
  high_school: 'High School Diploma',
  associate: 'Associate Degree',
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

export interface CertificationEntry {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  expires: string;
  credentialId: string;
  url: string;
}

/**
 * Normalises the Certifications step into a render-ready list.
 * Entries without a name are dropped so an empty draft row never
 * produces a blank line in the PDF.
 */
export function buildCertificationEntries(certifications: Certification[]): CertificationEntry[] {
  return certifications
    .filter((c) => (c.name || '').trim())
    .map((c) => ({
      id: c.id,
      title: c.name.trim(),
      issuer: (c.issuer || '').trim(),
      issued: formatDateForPdf(c.issueDate),
      expires: formatDateForPdf(c.expiryDate),
      credentialId: (c.credentialId || '').trim(),
      url: (c.credentialUrl || '').trim(),
    }));
}

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: string;
}

/**
 * Normalises a proficiency value for display. Values are passed through
 * unchanged (e.g. "fluent") to preserve the existing PDF output wording that
 * scripts/verifyCreativeTemplate.tsx asserts against.
 */
export function formatProficiency(value: string): string {
  return (value || '').trim();
}

/**
 * Builds the Languages list. Step 11 (languages[]) is authoritative; when it is
 * empty we fall back to the free-text spokenLanguages field on Step 7 so older
 * CVs saved before Step 11 existed still render languages. Names are deduped
 * case-insensitively so a language entered in both places only shows once.
 */
export function buildLanguageEntries(languages: Language[], skills: Skill[]): LanguageEntry[] {
  const entries: LanguageEntry[] = [];

  if (languages.length > 0) {
    languages.forEach((lang, i) => {
      const name = (lang.name || '').trim();
      if (!name) return;
      entries.push({
        id: lang.id || `lang-${i}`,
        name,
        proficiency: formatProficiency(lang.proficiency),
      });
    });
  } else {
    skills.forEach((skill, i) => {
      (skill.spokenLanguages || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .forEach((name, j) => {
          entries.push({
            id: `skill-lang-${i}-${j}`,
            name,
            proficiency: formatProficiency(skill.proficiencyLevel),
          });
        });
    });
  }

  const seen = new Set<string>();
  return entries.filter((e) => {
    const key = e.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
