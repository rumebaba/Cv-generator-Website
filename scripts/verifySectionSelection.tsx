import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { inflateSync } from 'node:zlib';

import Classic from '../src/components/pdf/CVTemplate';
import Modern from '../src/components/pdf/CVTemplateModern';
import Minimal from '../src/components/pdf/CVTemplateMinimal';
import Executive from '../src/components/pdf/CVTemplateExecutive';
import Creative from '../src/components/pdf/CVTemplateCreative';
import Compact from '../src/components/pdf/CVTemplateCompact';
import type { FormState } from '../src/types/form';
import { initialFormData } from '../src/types/form';

const TEMPLATES = {
  classic: Classic,
  modern: Modern,
  minimal: Minimal,
  executive: Executive,
  creative: Creative,
  compact: Compact,
} as const;

type SectionKey = keyof typeof initialFormData;

const MARKERS: Record<SectionKey, string> = {
  personalData: 'ZQXPERSONAL',
  introduction: 'ZQXSUMMARY',
  experiences: 'ZQXCAREER',
  educations: 'ZQXEDUCATION',
  medicalScience: 'ZQXMEDICAL',
  projects: 'ZQXPROJECT',
  skills: 'ZQXSKILLS',
  credentials: 'ZQXCERTIFY',
  certifications: 'ZQXLANG',
  languages: 'ZQXSPOKEN',
  references: 'ZQXREFERENCE',
};

function buildData() {
  return {
    ...initialFormData,
    personalData: {
      ...initialFormData.personalData,
      fullName: 'ZQXPERSONAL Name',
      email: 'zqx@example.com',
    },
    introduction: {
      ...initialFormData.introduction,
      professionalSummary: 'ZQXSUMMARY text',
    },
    experiences: [
      {
        id: 'e1',
        company: 'ZQXCAREER Corp',
        position: 'Engineer',
        startDate: '2020-01',
        endDate: '2021-01',
        current: false,
        description: 'ZQXCAREER work',
        location: '',
        achievements: '',
        directReports: '',
        toolsUsed: '',
        reasonForLeaving: '',
        salaryHistory: '',
      },
    ],
    educations: [
      {
        id: 'd1',
        institution: 'ZQXEDUCATION Uni',
        degree: 'bachelor',
        fieldOfStudy: 'CS',
        startDate: '2016-01',
        endDate: '2020-01',
        current: false,
        description: '',
        location: '',
        gpa: '',
        resultType: '' as const,
        resultExpected: false,
        thesisTopic: '',
        academicHonors: '',
        relevantClasses: '',
        classRank: '',
      },
    ],
    medicalScience: [
      {
        id: 'm1',
        clinicalRotations: 'ZQXMEDICAL rotations',
        researchGrants: '',
        publications: '',
        medicalLicenses: '',
      },
    ],
    projects: [
      {
        id: 'p1',
        name: 'ZQXPROJECT App',
        role: 'Dev',
        startDate: '',
        endDate: '',
        current: false,
        description: 'ZQXPROJECT build',
        codeRepositoryUrl: '',
        liveDemoUrl: '',
        technicalArchitecture: '',
      },
    ],
    skills: [
      {
        id: 's1',
        technicalSkills: 'ZQXSKILLS',
        softSkills: '',
        spokenLanguages: 'ZQXSPOKEN',
        proficiencyLevel: 'expert' as const,
        yearsOfExperience: 5,
      },
    ],
    credentials: [
      {
        id: 'c1',
        certificateName: 'ZQXCERTIFY',
        issuer: 'Issuer',
        dateIssued: '2021-01',
        credentialId: '',
        expirationDate: '',
        volunteerWork: '',
        hobbies: '',
        militaryService: '',
        references: '',
        securityClearance: '',
      },
    ],
    references: [
      {
        id: 'r1',
        name: 'ZQXREFERENCE',
        title: 'Manager',
        company: 'Corp',
        email: '',
        phone: '',
        relationship: '',
      },
    ],
  } as unknown as FormState['data'];
}

function buildState(sections: Record<string, boolean>): FormState {
  return {
    data: buildData(),
    currentStep: 10,
    completedSteps: [],
    errors: {},
    isDirty: false,
    isSubmitting: false,
    selectedSections: sections as FormState['selectedSections'],
  };
}

function decodePdfText(buffer: Buffer): string {
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
  // Text is drawn as hex glyph codes inside TJ/Tj arrays, e.g. <5a5a4d41>
  let text = '';
  const hexRe = /<([0-9A-Fa-f]+)>/g;
  let h: RegExpExecArray | null;
  while ((h = hexRe.exec(content)) !== null) {
    const hex = h[1];
    for (let i = 0; i + 1 < hex.length; i += 2) {
      text += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
    }
  }
  // Strip everything non-alphanumeric: the layout engine can inject hyphens
  // and spacing that would otherwise break a literal match.
  return text.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

const hasMarker = (text: string, marker: string) =>
  text.includes(marker.toUpperCase().replace(/[^A-Z0-9]/g, ''));

const ALL_ON = Object.fromEntries(Object.keys(MARKERS).map((k) => [k, true]));

async function render(
  template: React.ComponentType<{ formState: FormState }>,
  sections: Record<string, boolean>
) {
  const Component = template as never;
  return decodePdfText(await renderToBuffer(<Component formState={buildState(sections)} />));
}

async function main() {
  let failures = 0;

  for (const [name, Tpl] of Object.entries(TEMPLATES)) {
    const all = await render(Tpl, ALL_ON);
    const rendered = Object.keys(MARKERS).filter((k) => hasMarker(all, MARKERS[k]));

    if (rendered.length === 0) {
      failures++;
      console.log(`${name.toUpperCase()} — SANITY FAIL: no marker text found; extraction broken`);
      continue;
    }
    console.log(`\n${name.toUpperCase()} — sections rendered: [${rendered.join(', ')}]`);

    let bad = 0;
    for (const section of rendered) {
      const off = { ...ALL_ON, [section]: false };
      const text = await render(Tpl, off);
      if (hasMarker(text, MARKERS[section])) {
        bad++;
        failures++;
        console.log(`   FAIL: deselecting "${section}" left its content in the PDF`);
      }
    }
    if (bad === 0) console.log(`   OK: all ${rendered.length} rendered sections hide when deselected`);
  }

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});