import React from 'react';

import Creative from '../src/components/pdf/CVTemplateCreative';
import { initialFormData, type FormData } from '../src/types/form';

import { renderToDraws } from './pdfGeometry';

const flat = (draws: { text: string }[]) =>
  draws
    .map((d) => d.text)
    .join('')
    .replace(/\s+/g, ' ');

const data: FormData = {
  ...initialFormData,
  personalData: {
    ...initialFormData.personalData,
    fullName: 'Rumman Hamid',
    email: 'rumeansari5@gmail.com',
    phone: '+880 1700 000000',
    city: 'Dhaka',
    country: 'Bangladesh',
    linkedin: 'linkedin.com/in/rumebaba',
    nationality: 'Bangladeshi',
    visaStatus: 'No sponsorship required',
    dateOfBirth: '1998-04-12',
    customSocialLinks: [{ id: 'l1', label: 'GitHub', url: 'github.com/rumebaba' }],
  },
  introduction: {
    ...initialFormData.introduction,
    professionalSummary: 'Senior engineer focused on data platforms.',
    objectiveStatement: 'Lead a high performing analytics team.',
    keyCareerMilestones: 'Shipped 3 platforms to 1M users.',
    targetJobTitles: 'Senior Data Engineer',
  },
  skills: [
    {
      id: 's1',
      technicalSkills: 'TypeScript, React, Node.js, PostgreSQL',
      softSkills: 'Leadership, Communication',
      spokenLanguages: 'English, Bangla',
      proficiencyLevel: 'expert',
      yearsOfExperience: 7,
    },
  ],
  languages: [
    { id: 'l1', name: 'English', proficiency: 'fluent' },
    { id: 'l2', name: 'Bangla', proficiency: 'native' },
  ],
  certifications: [
    {
      id: 'c1',
      name: 'AWS Solutions Architect',
      issuer: 'Amazon',
      issueDate: '2023',
      expiryDate: '2026',
      credentialId: 'AWS-9911',
      credentialUrl: 'aws.amazon.com/cert',
    },
  ],
  credentials: [
    {
      id: 'cr1',
      certificateName: 'Professional Scrum Master',
      issuer: 'Scrum.org',
      dateIssued: '2022',
      credentialId: 'PSM-5521',
      expirationDate: '2025',
      volunteerWork: 'Mentored 40 juniors.',
      hobbies: 'Cycling, chess',
      militaryService: '',
      references: 'Available on request',
      securityClearance: 'Secret',
    },
  ],
  experiences: [
    {
      id: 'e1',
      company: 'Acme Corp',
      position: 'Lead Engineer',
      startDate: '2021-01',
      endDate: '',
      current: true,
      location: 'Remote',
      description: '<p>Owned the data platform roadmap.</p>',
      achievements: '<ul><li>Cut pipeline cost 40%</li><li>Led 6 engineers</li></ul>',
      directReports: '6',
      toolsUsed: 'Airflow, dbt, Snowflake',
      reasonForLeaving: 'Seeking broader scope',
      salaryHistory: 'Confidential',
    },
  ],
  projects: [
    {
      id: 'p1',
      name: 'Analytics Hub',
      role: 'Maintainer',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description:
        '<p>Intro sentence here.</p><ul><li><p>Built realtime dashboards</p></li><li><p>Cut query latency by 60%</p></li><li><p>Added RBAC</p></li></ul><p>Outro sentence.</p>',
      codeRepositoryUrl: 'github.com/rumebaba/analytics-hub',
      liveDemoUrl: 'analytics-hub.dev',
      technicalArchitecture: 'React SPA + Node API + Postgres',
    },
  ],
  educations: [
    {
      id: 'ed1',
      institution: 'BUET',
      degree: 'bachelors',
      fieldOfStudy: 'Computer Science',
      startDate: '2014',
      endDate: '2018',
      current: false,
      description: 'Focus on distributed systems.',
      location: 'Dhaka, Bangladesh',
      gpa: '3.90',
      resultType: 'cgpa',
      resultExpected: false,
      thesisTopic: 'Consensus protocols in wide area networks',
      academicHonors: 'Summa cum laude',
      relevantClasses: 'Algorithms, DBMS',
      classRank: 'Top 5%',
    },
  ],
  references: [
    {
      id: 'r1',
      name: 'Jane Doe',
      title: 'VP Engineering',
      company: 'Acme Corp',
      email: 'jane@acme.com',
      phone: '+1 555 0100',
      relationship: 'Former manager',
    },
  ],
  medicalScience: [
    {
      id: 'm1',
      clinicalRotations: 'Internal Medicine',
      researchGrants: 'NIH R01',
      publications: '3 papers',
      medicalLicenses: 'State License #123',
    },
  ],
};

const state = {
  data,
  currentStep: 10,
  completedSteps: [],
  errors: {},
  isDirty: false,
  isSubmitting: false,
  selectedSections: Object.fromEntries(Object.keys(initialFormData).map((k) => [k, true])),
} as never;

const { draws, pages: pageCount } = await renderToDraws(<Creative formState={state} />);
const text = flat(draws);

let failures = 0;
const check = (label: string, ok: boolean) => {
  console.log(`   ${ok ? 'OK  ' : 'FAIL'}: ${label}`);
  if (!ok) failures++;
};

console.log('\n=== 1. Previously missing fields now render ===');
const markers: [string, string][] = [
  ['Bangladeshi (nationality)', 'Bangladeshi'],
  ['No sponsorship required (visa)', 'No sponsorship required'],
  ['1998-04-12 (DOB)', '1998-04-12'],
  ['github.com/rumebaba (custom social)', 'github.com/rumebaba'],
  ['objective statement', 'Lead a high performing analytics team.'],
  ['career milestones', 'Shipped 3 platforms to 1M users.'],
  ['direct reports', 'Direct reports: 6'],
  ['tools used', 'Tools: Airflow, dbt, Snowflake'],
  ['reason for leaving', 'Reason for leaving: Seeking broader scope'],
  ['salary history', 'Salary: Confidential'],
  ['education location', 'Dhaka, Bangladesh'],
  ['thesis topic', 'Consensus protocols'],
  ['academic honors', 'Summa cum laude'],
  ['relevant classes', 'Coursework: Algorithms, DBMS'],
  ['class rank', 'Rank: Top 5%'],
  ['project repo url', 'github.com/rumebaba/analytics-hub'],
  ['project demo url', 'analytics-hub.dev'],
  ['project architecture', 'React SPA + Node API + Postgres'],
  ['project date range', 'Mar 2022 - Present'],
  ['soft skills', 'Leadership, Communication'],
  ['years of experience', '7+ yrs experience'],
  ['proficiency level', 'expert'],
  ['credential id', 'PSM-5521'],
  ['volunteer work', 'Mentored 40 juniors.'],
  ['hobbies', 'Cycling, chess'],
  ['security clearance', 'Security clearance: Secret'],
  ['credential references', 'References: Available on request'],
  ['certifications[] name', 'AWS Solutions Architect'],
  ['certifications[] credential id', 'AWS-9911'],
  ['languages[] proficiency', 'English (fluent)'],
  ['references[] name', 'Jane Doe'],
  ['references[] email', 'jane@acme.com'],
  ['medical science', 'State License #123'],
];
for (const [label, marker] of markers) check(label, text.includes(marker));

console.log('\n=== 2. No duplicate sections ===');
const countOf = (needle: string) =>
  draws.filter((d) => d.text.trim().toUpperCase() === needle.toUpperCase()).length;
check(`Education appears once (got ${countOf('EDUCATION')})`, countOf('EDUCATION') === 1);
check(
  `Certifications appears once (got ${countOf('CERTIFICATIONS')})`,
  countOf('CERTIFICATIONS') === 1
);
const eduHeading = draws.find((d) => d.text.trim().toUpperCase() === 'EDUCATION');
check('Education sits in the main column', !!eduHeading && eduHeading.x > 190);
check(
  'both certificate entries merged into one block',
  text.includes('Professional Scrum Master') && text.includes('AWS Solutions Architect')
);

console.log('\n=== 3. Long name never overlaps ===');
const NAMES = [
  'Rumman Hamid',
  'Abdulrahmanul Karim',
  'Md. Abdulur Rahman Choudhury',
  'Bartholomew Fitzgerald-Montgomery',
  'A',
];
const SIDEBAR_LEFT = 20;
const SIDEBAR_RIGHT = 190;
for (const name of NAMES) {
  const namedState = {
    ...(state as unknown as Record<string, unknown>),
    data: { ...data, personalData: { ...data.personalData, fullName: name } },
  } as never;
  const { draws: named } = await renderToDraws(<Creative formState={namedState} />);
  const inSidebar = named.filter((d) => d.x >= SIDEBAR_LEFT - 2 && d.x < SIDEBAR_RIGHT);
  const nameLines = inSidebar.filter((d) => d.size > 10).sort((a, b) => b.y - a.y);
  const subtitle = inSidebar.find((d) => d.text.includes('Senior Data'));

  check(`${name}: renders inside the sidebar`, nameLines.length > 0);
  const overflow = nameLines.filter((d) => d.x > SIDEBAR_RIGHT - 20);
  check(`${name}: no line overflows the sidebar`, overflow.length === 0);
  if (nameLines.length > 1 && subtitle) {
    const lineGap = nameLines[0].y - nameLines[1].y;
    check(`${name}: wrapped lines clear each other (${lineGap.toFixed(1)}pt >= 14)`, lineGap >= 14);
  }
  if (nameLines.length && subtitle) {
    const gap = nameLines[nameLines.length - 1].y - subtitle.y;
    check(`${name}: clears the subtitle (${gap.toFixed(1)}pt >= 10)`, gap >= 10);
  }
}

console.log('\n=== 4. Bullet / paragraph spacing ===');
if (process.argv.includes('--debug')) {
  draws.forEach((d, i) => console.log(`  [${i}] y=${d.y.toFixed(1)} ${JSON.stringify(d.text)}`));
}
const bulletDraws = draws.filter((d) => d.text.trim() === '•');
const expectedItems = 2 + 3; // 2 experience achievements + 3 project bullets
check(
  `bulleted items render as ${bulletDraws.length} rows (want ${expectedItems})`,
  bulletDraws.length === expectedItems
);
const textPitches = draws
  .filter((d) => d.size >= 8 && d.text.trim().length > 0 && d.text.trim() !== '•')
  .map((d) => d.y)
  .sort((a, b) => b - a);
let tightest = Infinity;
for (let i = 1; i < textPitches.length; i++) {
  const pitch = textPitches[i - 1] - textPitches[i];
  if (pitch > 0.5 && pitch < tightest) tightest = pitch;
}
check(
  `no vertical gap larger than 16pt between lines (tightest ${tightest.toFixed(1)}pt)`,
  tightest <= 16
);
check('no stray literal "p" from tag parsing', !draws.some((d) => d.text.trim() === 'p'));
// Reads top-to-bottom then left-to-right, matching how the page is scanned.
const readingOrder = [...draws].sort((a, b) => b.y - a.y || a.x - b.x).map((d) => d.text);
const order = readingOrder.join(' ');
check(
  'mixed paragraph + list content keeps reading order',
  order.indexOf('Intro sentence here.') < order.indexOf('Built realtime dashboards') &&
    order.indexOf('Added RBAC') < order.indexOf('Outro sentence.')
);

console.log('\n=== 5. Compact layout ===');
check(`stays within 2 pages (got ${pageCount})`, pageCount <= 2);

console.log(failures === 0 ? '\nALL CREATIVE CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
if (failures > 0) process.exit(1);
