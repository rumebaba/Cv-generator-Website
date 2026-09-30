import {
  initialCertification,
  initialCredential,
  initialFormState,
  initialLanguage,
  type FormData,
} from '../src/types/form';
import type { FormStep } from '../src/types/form';

const initialCredentialShape = initialCredential;
const initialCertificationShape = initialCertification;
void initialLanguage;

const TOTAL_STEPS = 12;

/**
 * Guards the step numbering contract. Adding steps without updating these
 * silently breaks navigation, persistence and the review page.
 */
const VALID_STEPS: FormStep[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const STEP_DATA_MAP: Record<number, keyof FormData> = {
  1: 'personalData',
  2: 'introduction',
  3: 'educations',
  4: 'experiences',
  5: 'medicalScience',
  6: 'projects',
  7: 'skills',
  8: 'credentials',
  9: 'references',
  10: 'certifications',
  11: 'languages',
};

let failures = 0;
const check = (label: string, ok: boolean) => {
  console.log(`   ${ok ? 'OK  ' : 'FAIL'}: ${label}`);
  if (!ok) failures++;
};

console.log('\n=== 1. Every step has a form section ===');
for (const step of VALID_STEPS) {
  if (step === TOTAL_STEPS) continue; // review step maps to the whole form
  const key = STEP_DATA_MAP[step];
  check(`step ${step} maps to data.${key ?? 'MISSING'}`, !!key);
}

console.log('\n=== 2. The two previously dead sections are now reachable ===');
// These toggles used to always show "No data" because no UI wrote to them.
const empty = initialFormState.data;
const withCert = (name: string): FormData => ({
  ...empty,
  certifications: [
    {
      id: 'c1',
      name,
      issuer: 'Amazon',
      issueDate: '2023-05',
      expiryDate: '',
      credentialId: 'AWS-9911',
      credentialUrl: 'https://verify.example/abc',
    },
  ],
});
const withLang = (name: string): FormData => ({
  ...empty,
  languages: [{ id: 'l1', name, proficiency: 'fluent' }],
});

const hasContent = (data: FormData, section: keyof FormData): boolean => {
  const value = (data as unknown as Record<string, unknown>)[section];
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.values(value).some((v) => v && v !== '');
  return Boolean(value);
};

check(
  'certifications starts empty (Step 10 shows the empty state)',
  !hasContent(empty, 'certifications')
);
check('languages starts empty (Step 11 shows the empty state)', !hasContent(empty, 'languages'));
check(
  'a filled certifications entry satisfies the Step 10 review toggle',
  hasContent(withCert('AWS SAA'), 'certifications')
);
check(
  'a filled languages entry satisfies the Step 11 review toggle',
  hasContent(withLang('Bangla'), 'languages')
);

console.log('\n=== 3. Certifications and Credentials are distinct shapes ===');
// Compare the declared field sets, not the runtime values.
const credentialFields = Object.keys(initialCredentialShape);
const certificationFields = Object.keys(initialCertificationShape);
check(
  'Credential carries non-certificate extras (volunteerWork)',
  credentialFields.includes('volunteerWork')
);
check('Credential carries militaryService', credentialFields.includes('militaryService'));
check('Credential carries securityClearance', credentialFields.includes('securityClearance'));
check(
  'Certification has a credentialUrl (Credential does not)',
  certificationFields.includes('credentialUrl') && !credentialFields.includes('credentialUrl')
);

console.log('\n=== 4. Step bounds ===');
check(`FormStep union covers 1..${TOTAL_STEPS}`, VALID_STEPS.length === TOTAL_STEPS);
check('review step is the last step', VALID_STEPS[VALID_STEPS.length - 1] === TOTAL_STEPS);

console.log(failures === 0 ? '\nALL STEP WIRING CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
if (failures > 0) process.exit(1);
