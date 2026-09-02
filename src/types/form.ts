export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
}

export interface PersonalData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedin: string;
  profilePhotoUrl: string;
  nationality: string;
  visaStatus: string;
  dateOfBirth: string;
  customSocialLinks: SocialLink[];
}

export interface Introduction {
  professionalSummary: string;
  objectiveStatement: string;
  keyCareerMilestones: string;
  targetJobTitles: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location: string;
  achievements: string;
  directReports: string;
  toolsUsed: string;
  reasonForLeaving: string;
  salaryHistory: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location: string;
  gpa: string;
  thesisTopic: string;
  academicHonors: string;
  relevantClasses: string;
  classRank: string;
}

export interface MedicalScience {
  id: string;
  clinicalRotations: string;
  researchGrants: string;
  publications: string;
  medicalLicenses: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  codeRepositoryUrl: string;
  liveDemoUrl: string;
  technicalArchitecture: string;
}

export interface Skill {
  id: string;
  technicalSkills: string;
  softSkills: string;
  spokenLanguages: string;
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
}

export interface Credential {
  id: string;
  certificateName: string;
  issuer: string;
  dateIssued: string;
  credentialId: string;
  expirationDate: string;
  volunteerWork: string;
  hobbies: string;
  militaryService: string;
  references: string;
  securityClearance: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  credentialUrl: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'native' | 'fluent' | 'conversational' | 'basic';
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface FormData {
  personalData: PersonalData;
  introduction: Introduction;
  experiences: Experience[];
  educations: Education[];
  medicalScience: MedicalScience[];
  projects: Project[];
  skills: Skill[];
  credentials: Credential[];
  certifications: Certification[];
  languages: Language[];
  references: Reference[];
}

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface FormState {
  data: FormData;
  currentStep: FormStep;
  completedSteps: FormStep[];
  errors: Partial<Record<keyof FormData, Record<string, string>>>;
  isDirty: boolean;
  isSubmitting: boolean;
}

export const initialPersonalData: PersonalData = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  linkedin: '',
  profilePhotoUrl: '',
  nationality: '',
  visaStatus: '',
  dateOfBirth: '',
  customSocialLinks: [],
};

export const initialIntroduction: Introduction = {
  professionalSummary: '',
  objectiveStatement: '',
  keyCareerMilestones: '',
  targetJobTitles: '',
};

export const initialExperience: Experience = {
  id: '',
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  location: '',
  achievements: '',
  directReports: '',
  toolsUsed: '',
  reasonForLeaving: '',
  salaryHistory: '',
};

export const initialEducation: Education = {
  id: '',
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  location: '',
  gpa: '',
  thesisTopic: '',
  academicHonors: '',
  relevantClasses: '',
  classRank: '',
};

export const initialMedicalScience: MedicalScience = {
  id: '',
  clinicalRotations: '',
  researchGrants: '',
  publications: '',
  medicalLicenses: '',
};

export const initialProject: Project = {
  id: '',
  name: '',
  role: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  codeRepositoryUrl: '',
  liveDemoUrl: '',
  technicalArchitecture: '',
};

export const initialSkill: Skill = {
  id: '',
  technicalSkills: '',
  softSkills: '',
  spokenLanguages: '',
  proficiencyLevel: 'beginner',
  yearsOfExperience: 0,
};

export const initialCredential: Credential = {
  id: '',
  certificateName: '',
  issuer: '',
  dateIssued: '',
  credentialId: '',
  expirationDate: '',
  volunteerWork: '',
  hobbies: '',
  militaryService: '',
  references: '',
  securityClearance: '',
};

export const initialFormData: FormData = {
  personalData: initialPersonalData,
  introduction: initialIntroduction,
  experiences: [],
  educations: [],
  medicalScience: [],
  projects: [],
  skills: [],
  credentials: [],
  certifications: [],
  languages: [],
  references: [],
};

export const initialFormState: FormState = {
  data: initialFormData,
  currentStep: 1,
  completedSteps: [],
  errors: {},
  isDirty: false,
  isSubmitting: false,
};
