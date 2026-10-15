import { inflateSync } from 'node:zlib';

import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';

import Classic from '../src/components/pdf/CVTemplate';
import Compact from '../src/components/pdf/CVTemplateCompact';
import Creative from '../src/components/pdf/CVTemplateCreative';
import Executive from '../src/components/pdf/CVTemplateExecutive';
import Minimal from '../src/components/pdf/CVTemplateMinimal';
import Modern from '../src/components/pdf/CVTemplateModern';
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
  credentials: 'ZQXCREDENTIAL',
  certifications: 'ZQXCERTIFICATION',
  languages: 'ZQXSPOKENLANG',
  references: 'ZQXREFERENCE',
};

/** Marker that only exists on the legacy Step 7 free-text languages field. */
const SKILLS_LANG_FALLBACK = 'ZQXSKILLSLANG';

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
        spokenLanguages: SKILLS_LANG_FALLBACK,
        proficiencyLevel: 'expert' as const,
        yearsOfExperience: 5,
      },
    ],
    credentials: [
      {
        id: 'c1',
        certificateName: 'ZQXCREDENTIAL',
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
    certifications: [
      {
        id: 'cert1',
        name: 'ZQXCERTIFICATION',
        issuer: 'ZQXISSUER',
        issueDate: '2022-03',
        expiryDate: '',
        credentialId: 'ZQXCERTID',
        credentialUrl: '',
      },
    ],
    languages: [
      {
        id: 'lang1',
        name: 'ZQXSPOKENLANG',
        proficiency: 'fluent' as const,
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
  sections: Record<string, boolean>,
  mutate?: (data: FormState['data']) => void
) {
  const Component = template as never;
  const state = buildState(sections);
  if (mutate) mutate(state.data);
  return decodePdfText(await renderToBuffer(<Component formState={state} />));
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

    // Step 11 data must win over the legacy Step 7 free-text field.
    if (hasMarker(all, SKILLS_LANG_FALLBACK)) {
      failures++;
      console.log('   FAIL: Step 7 spokenLanguages rendered even though Step 11 has entries');
    }

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
    if (bad === 0)
      console.log(`   OK: all ${rendered.length} rendered sections hide when deselected`);

    // Backwards compatibility: CVs saved before Step 11 existed only have the
    // Step 7 free-text field, so templates must still fall back to it.
    const legacy = await render(Tpl, ALL_ON, (data) => {
      data.languages = [];
    });
    if (hasMarker(legacy, SKILLS_LANG_FALLBACK)) {
      console.log('   OK: falls back to Step 7 spokenLanguages when Step 11 is empty');
    } else {
      failures++;
      console.log('   FAIL: no languages rendered when Step 11 is empty (no Step 7 fallback)');
    }
  }

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
