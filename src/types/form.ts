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
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  githubUrl: string;
  startDate: string;
  endDate: string;
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
  skills: Skill[];
  projects: Project[];
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

export const initialFormData: FormData = {
  personalData: initialPersonalData,
  introduction: initialIntroduction,
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
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
