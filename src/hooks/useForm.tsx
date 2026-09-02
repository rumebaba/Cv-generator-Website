import type { ReactNode } from 'react';
import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

import type {
  FormState,
  FormData,
  FormStep,
  PersonalData,
  Introduction,
  Experience,
  Education,
  MedicalScience,
  Project,
  Skill,
  Credential,
  Certification,
  Language,
  Reference,
  SocialLink,
} from '../types/form';

type FormAction =
  | { type: 'SET_PERSONAL_DATA'; payload: Partial<PersonalData> }
  | { type: 'SET_INTRODUCTION'; payload: Partial<Introduction> }
  | { type: 'SET_STEP'; payload: FormStep }
  | { type: 'COMPLETE_STEP'; payload: FormStep }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Partial<Experience> } }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<Education> } }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'ADD_MEDICAL_SCIENCE'; payload: MedicalScience }
  | { type: 'UPDATE_MEDICAL_SCIENCE'; payload: { id: string; data: Partial<MedicalScience> } }
  | { type: 'REMOVE_MEDICAL_SCIENCE'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<Project> } }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: { id: string; data: Partial<Skill> } }
  | { type: 'REMOVE_SKILL'; payload: string }
  | { type: 'ADD_CREDENTIAL'; payload: Credential }
  | { type: 'UPDATE_CREDENTIAL'; payload: { id: string; data: Partial<Credential> } }
  | { type: 'REMOVE_CREDENTIAL'; payload: string }
  | { type: 'ADD_CERTIFICATION'; payload: Certification }
  | { type: 'UPDATE_CERTIFICATION'; payload: { id: string; data: Partial<Certification> } }
  | { type: 'REMOVE_CERTIFICATION'; payload: string }
  | { type: 'ADD_LANGUAGE'; payload: Language }
  | { type: 'UPDATE_LANGUAGE'; payload: { id: string; data: Partial<Language> } }
  | { type: 'REMOVE_LANGUAGE'; payload: string }
  | { type: 'ADD_REFERENCE'; payload: Reference }
  | { type: 'UPDATE_REFERENCE'; payload: { id: string; data: Partial<Reference> } }
  | { type: 'REMOVE_REFERENCE'; payload: string }
  | { type: 'ADD_SOCIAL_LINK'; payload: SocialLink }
  | { type: 'UPDATE_SOCIAL_LINK'; payload: { id: string; data: Partial<SocialLink> } }
  | { type: 'REMOVE_SOCIAL_LINK'; payload: string }
  | { type: 'SET_ERRORS'; payload: Partial<Record<keyof FormData, Record<string, string>>> }
  | { type: 'CLEAR_ERROR'; payload: { section: keyof FormData; field: string } }
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_DATA'; payload: FormData };

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_PERSONAL_DATA':
      return {
        ...state,
        data: { ...state.data, personalData: { ...state.data.personalData, ...action.payload } },
        isDirty: true,
      };

    case 'SET_INTRODUCTION':
      return {
        ...state,
        data: { ...state.data, introduction: { ...state.data.introduction, ...action.payload } },
        isDirty: true,
      };

    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'COMPLETE_STEP':
      if (!state.completedSteps.includes(action.payload)) {
        return {
          ...state,
          completedSteps: [...state.completedSteps, action.payload].sort((a, b) => a - b),
        };
      }
      return state;

    case 'ADD_EXPERIENCE':
      return {
        ...state,
        data: { ...state.data, experiences: [...state.data.experiences, action.payload] },
        isDirty: true,
      };

    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        data: {
          ...state.data,
          experiences: state.data.experiences.map((exp) =>
            exp.id === action.payload.id ? { ...exp, ...action.payload.data } : exp
          ),
        },
        isDirty: true,
      };

    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        data: {
          ...state.data,
          experiences: state.data.experiences.filter((exp) => exp.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_EDUCATION':
      return {
        ...state,
        data: { ...state.data, educations: [...state.data.educations, action.payload] },
        isDirty: true,
      };

    case 'UPDATE_EDUCATION':
      return {
        ...state,
        data: {
          ...state.data,
          educations: state.data.educations.map((edu) =>
            edu.id === action.payload.id ? { ...edu, ...action.payload.data } : edu
          ),
        },
        isDirty: true,
      };

    case 'REMOVE_EDUCATION':
      return {
        ...state,
        data: {
          ...state.data,
          educations: state.data.educations.filter((edu) => edu.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_MEDICAL_SCIENCE':
      return {
        ...state,
        data: { ...state.data, medicalScience: [...state.data.medicalScience, action.payload] },
        isDirty: true,
      };

    case 'UPDATE_MEDICAL_SCIENCE':
      return {
        ...state,
        data: {
          ...state.data,
          medicalScience: state.data.medicalScience.map((ms) =>
            ms.id === action.payload.id ? { ...ms, ...action.payload.data } : ms
          ),
        },
        isDirty: true,
      };

    case 'REMOVE_MEDICAL_SCIENCE':
      return {
        ...state,
        data: {
          ...state.data,
          medicalScience: state.data.medicalScience.filter((ms) => ms.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        data: { ...state.data, projects: [...state.data.projects, action.payload] },
        isDirty: true,
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        data: {
          ...state.data,
          projects: state.data.projects.map((proj) =>
            proj.id === action.payload.id ? { ...proj, ...action.payload.data } : proj
          ),
        },
        isDirty: true,
      };

    case 'REMOVE_PROJECT':
      return {
        ...state,
        data: {
          ...state.data,
          projects: state.data.projects.filter((proj) => proj.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_SKILL':
      return {
        ...state,
        data: { ...state.data, skills: [...state.data.skills, action.payload] },
        isDirty: true,
      };

    case 'UPDATE_SKILL':
      return {
        ...state,
        data: {
          ...state.data,
          skills: state.data.skills.map((skill) =>
            skill.id === action.payload.id ? { ...skill, ...action.payload.data } : skill
          ),
        },
        isDirty: true,
      };

    case 'REMOVE_SKILL':
      return {
        ...state,
        data: {
          ...state.data,
          skills: state.data.skills.filter((skill) => skill.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_CREDENTIAL':
      return {
        ...state,
        data: { ...state.data, credentials: [...state.data.credentials, action.payload] },
        isDirty: true,
      };

    case 'UPDATE_CREDENTIAL':
      return {
        ...state,
        data: {
          ...state.data,
          credentials: state.data.credentials.map((cred) =>
            cred.id === action.payload.id ? { ...cred, ...action.payload.data } : cred
          ),
        },
        isDirty: true,
      };

    case 'REMOVE_CREDENTIAL':
      return {
        ...state,
        data: {
          ...state.data,
          credentials: state.data.credentials.filter((cred) => cred.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_CERTIFICATION':
      return {
        ...state,
        data: { ...state.data, certifications: [...state.data.certifications, action.payload] },
        isDirty: true,
      };

    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        data: {
          ...state.data,
          certifications: state.data.certifications.map((cert) =>
            cert.id === action.payload.id ? { ...cert, ...action.payload.data } : cert
          ),
        },
        isDirty: true,
      };

    case 'REMOVE_CERTIFICATION':
      return {
        ...state,
        data: {
          ...state.data,
          certifications: state.data.certifications.filter((cert) => cert.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_LANGUAGE':
      return {
        ...state,
        data: { ...state.data, languages: [...state.data.languages, action.payload] },
        isDirty: true,
      };

    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        data: {
          ...state.data,
          languages: state.data.languages.map((lang) =>
            lang.id === action.payload.id ? { ...lang, ...action.payload.data } : lang
          ),
        },
        isDirty: true,
      };

    case 'REMOVE_LANGUAGE':
      return {
        ...state,
        data: {
          ...state.data,
          languages: state.data.languages.filter((lang) => lang.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_REFERENCE':
      return {
        ...state,
        data: { ...state.data, references: [...state.data.references, action.payload] },
        isDirty: true,
      };

    case 'UPDATE_REFERENCE':
      return {
        ...state,
        data: {
          ...state.data,
          references: state.data.references.map((ref) =>
            ref.id === action.payload.id ? { ...ref, ...action.payload.data } : ref
          ),
        },
        isDirty: true,
      };

    case 'REMOVE_REFERENCE':
      return {
        ...state,
        data: {
          ...state.data,
          references: state.data.references.filter((ref) => ref.id !== action.payload),
        },
        isDirty: true,
      };

    case 'ADD_SOCIAL_LINK':
      return {
        ...state,
        data: {
          ...state.data,
          personalData: {
            ...state.data.personalData,
            customSocialLinks: [...state.data.personalData.customSocialLinks, action.payload],
          },
        },
        isDirty: true,
      };

    case 'UPDATE_SOCIAL_LINK':
      return {
        ...state,
        data: {
          ...state.data,
          personalData: {
            ...state.data.personalData,
            customSocialLinks: state.data.personalData.customSocialLinks.map((link) =>
              link.id === action.payload.id ? { ...link, ...action.payload.data } : link
            ),
          },
        },
        isDirty: true,
      };

    case 'REMOVE_SOCIAL_LINK':
      return {
        ...state,
        data: {
          ...state.data,
          personalData: {
            ...state.data.personalData,
            customSocialLinks: state.data.personalData.customSocialLinks.filter(
              (link) => link.id !== action.payload
            ),
          },
        },
        isDirty: true,
      };

    case 'SET_ERRORS':
      return { ...state, errors: { ...state.errors, ...action.payload } };

    case 'CLEAR_ERROR': {
      const sectionErrors = state.errors[action.payload.section] || {};
      const { [action.payload.field]: _fieldRemoved, ...restSectionErrors } = sectionErrors;
      const { [action.payload.section]: _sectionRemoved, ...restErrors } = state.errors;
      return { ...state, errors: { ...restErrors, [action.payload.section]: restSectionErrors } };
    }

    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload };

    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };

    case 'RESET_FORM':
      return initialFormState;

    case 'LOAD_DATA':
      return { ...state, data: action.payload, isDirty: false };

    default:
      return state;
  }
};

interface FormContextValue extends FormState {
  setPersonalData: (data: Partial<PersonalData>) => void;
  setIntroduction: (data: Partial<Introduction>) => void;
  setStep: (step: FormStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addMedicalScience: (ms: MedicalScience) => void;
  updateMedicalScience: (id: string, data: Partial<MedicalScience>) => void;
  removeMedicalScience: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addCredential: (cred: Credential) => void;
  updateCredential: (id: string, data: Partial<Credential>) => void;
  removeCredential: (id: string) => void;
  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  addLanguage: (lang: Language) => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  addReference: (ref: Reference) => void;
  updateReference: (id: string, data: Partial<Reference>) => void;
  removeReference: (id: string) => void;
  addSocialLink: (link: SocialLink) => void;
  updateSocialLink: (id: string, data: Partial<SocialLink>) => void;
  removeSocialLink: (id: string) => void;
  setErrors: (errors: Partial<Record<keyof FormData, Record<string, string>>>) => void;
  clearError: (section: keyof FormData, field: string) => void;
  setDirty: (dirty: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  resetForm: () => void;
  loadData: (data: FormData) => void;
  canProceed: () => boolean;
  getStepCompletion: (step: FormStep) => number;
}

const FormContext = createContext<FormContextValue | null>(null);

import { initialFormState } from '../types/form';

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const actions = useMemo<FormContextValue>(
    () => ({
      ...state,
      setPersonalData: (data) => dispatch({ type: 'SET_PERSONAL_DATA', payload: data }),
      setIntroduction: (data) => dispatch({ type: 'SET_INTRODUCTION', payload: data }),
      setStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
      nextStep: () =>
        dispatch({ type: 'SET_STEP', payload: Math.min(state.currentStep + 1, 9) as FormStep }),
      prevStep: () =>
        dispatch({ type: 'SET_STEP', payload: Math.max(state.currentStep - 1, 1) as FormStep }),
      addExperience: (exp) => dispatch({ type: 'ADD_EXPERIENCE', payload: exp }),
      updateExperience: (id, data) =>
        dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id, data } }),
      removeExperience: (id) => dispatch({ type: 'REMOVE_EXPERIENCE', payload: id }),
      addEducation: (edu) => dispatch({ type: 'ADD_EDUCATION', payload: edu }),
      updateEducation: (id, data) => dispatch({ type: 'UPDATE_EDUCATION', payload: { id, data } }),
      removeEducation: (id) => dispatch({ type: 'REMOVE_EDUCATION', payload: id }),
      addMedicalScience: (ms) => dispatch({ type: 'ADD_MEDICAL_SCIENCE', payload: ms }),
      updateMedicalScience: (id, data) =>
        dispatch({ type: 'UPDATE_MEDICAL_SCIENCE', payload: { id, data } }),
      removeMedicalScience: (id) => dispatch({ type: 'REMOVE_MEDICAL_SCIENCE', payload: id }),
      addProject: (project) => dispatch({ type: 'ADD_PROJECT', payload: project }),
      updateProject: (id, data) => dispatch({ type: 'UPDATE_PROJECT', payload: { id, data } }),
      removeProject: (id) => dispatch({ type: 'REMOVE_PROJECT', payload: id }),
      addSkill: (skill) => dispatch({ type: 'ADD_SKILL', payload: skill }),
      updateSkill: (id, data) => dispatch({ type: 'UPDATE_SKILL', payload: { id, data } }),
      removeSkill: (id) => dispatch({ type: 'REMOVE_SKILL', payload: id }),
      addCredential: (cred) => dispatch({ type: 'ADD_CREDENTIAL', payload: cred }),
      updateCredential: (id, data) =>
        dispatch({ type: 'UPDATE_CREDENTIAL', payload: { id, data } }),
      removeCredential: (id) => dispatch({ type: 'REMOVE_CREDENTIAL', payload: id }),
      addCertification: (cert) => dispatch({ type: 'ADD_CERTIFICATION', payload: cert }),
      updateCertification: (id, data) =>
        dispatch({ type: 'UPDATE_CERTIFICATION', payload: { id, data } }),
      removeCertification: (id) => dispatch({ type: 'REMOVE_CERTIFICATION', payload: id }),
      addLanguage: (lang) => dispatch({ type: 'ADD_LANGUAGE', payload: lang }),
      updateLanguage: (id, data) => dispatch({ type: 'UPDATE_LANGUAGE', payload: { id, data } }),
      removeLanguage: (id) => dispatch({ type: 'REMOVE_LANGUAGE', payload: id }),
      addReference: (ref) => dispatch({ type: 'ADD_REFERENCE', payload: ref }),
      updateReference: (id, data) => dispatch({ type: 'UPDATE_REFERENCE', payload: { id, data } }),
      removeReference: (id) => dispatch({ type: 'REMOVE_REFERENCE', payload: id }),
      addSocialLink: (link) => dispatch({ type: 'ADD_SOCIAL_LINK', payload: link }),
      updateSocialLink: (id, data) =>
        dispatch({ type: 'UPDATE_SOCIAL_LINK', payload: { id, data } }),
      removeSocialLink: (id) => dispatch({ type: 'REMOVE_SOCIAL_LINK', payload: id }),
      setErrors: (errors) => dispatch({ type: 'SET_ERRORS', payload: errors }),
      clearError: (section, field) =>
        dispatch({ type: 'CLEAR_ERROR', payload: { section, field } }),
      setDirty: (dirty) => dispatch({ type: 'SET_DIRTY', payload: dirty }),
      setSubmitting: (submitting) => dispatch({ type: 'SET_SUBMITTING', payload: submitting }),
      resetForm: () => dispatch({ type: 'RESET_FORM' }),
      loadData: (data) => dispatch({ type: 'LOAD_DATA', payload: data }),
      canProceed: () => {
        const currentStepData = getStepData(state.data, state.currentStep);
        return validateStep(state.currentStep, currentStepData).length === 0;
      },
      getStepCompletion: (step) => calculateStepCompletion(state.data, step),
    }),
    [state]
  );

  return <FormContext.Provider value={actions}>{children}</FormContext.Provider>;
};

export const useForm = (): FormContextValue => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

const getStepData = (data: FormData, step: FormStep) => {
  switch (step) {
    case 1:
      return data.personalData;
    case 2:
      return data.introduction;
    case 3:
      return data.experiences;
    case 4:
      return data.educations;
    case 5:
      return data.medicalScience;
    case 6:
      return data.projects;
    case 7:
      return data.skills;
    case 8:
      return data.credentials;
    case 9:
      return data.references;
    default:
      return null;
  }
};

const validateStep = (step: FormStep, data: unknown): string[] => {
  const errors: string[] = [];

  switch (step) {
    case 1: {
      const pd = data as PersonalData;
      if (!pd.fullName?.trim()) errors.push('Full name is required');
      if (!pd.email?.trim()) errors.push('Email is required');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pd.email)) errors.push('Invalid email format');
      break;
    }
    case 2: {
      const intro = data as Introduction;
      if (!intro.professionalSummary?.trim()) errors.push('Professional summary is required');
      break;
    }
    case 3: {
      const exps = data as Experience[];
      if (exps.length === 0) errors.push('At least one experience is required');
      break;
    }
    case 4: {
      const edus = data as Education[];
      if (edus.length === 0) errors.push('At least one education entry is required');
      break;
    }
    case 5: {
      const ms = data as MedicalScience[];
      if (ms.length === 0) errors.push('At least one medical science entry is required');
      break;
    }
    case 6: {
      const projects = data as Project[];
      if (projects.length === 0) errors.push('At least one project is required');
      break;
    }
    case 7: {
      const skills = data as Skill[];
      if (skills.length === 0) errors.push('At least one skill entry is required');
      break;
    }
    case 8: {
      const creds = data as Credential[];
      if (creds.length === 0) errors.push('At least one credential entry is required');
      break;
    }
  }
  return errors;
};

const calculateStepCompletion = (data: FormData, step: FormStep): number => {
  const stepData = getStepData(data, step);
  if (!stepData) return 0;

  switch (step) {
    case 1: {
      const pd = stepData as PersonalData;
      const fields = [
        pd.fullName,
        pd.email,
        pd.phone,
        pd.city,
        pd.country,
        pd.linkedin,
        pd.profilePhotoUrl,
        pd.nationality,
        pd.visaStatus,
        pd.dateOfBirth,
      ];
      const filled = fields.filter((f) => f?.trim()).length;
      return Math.round((filled / fields.length) * 100);
    }
    case 2: {
      const intro = stepData as Introduction;
      const fields = [
        intro.professionalSummary,
        intro.objectiveStatement,
        intro.keyCareerMilestones,
        intro.targetJobTitles,
      ];
      const filled = fields.filter((f) => f?.trim()).length;
      return Math.round((filled / fields.length) * 100);
    }
    case 3: {
      const exps = stepData as Experience[];
      if (exps.length === 0) return 0;
      const totalFields = exps.length * 7;
      let filled = 0;
      exps.forEach((exp) => {
        [
          exp.company,
          exp.position,
          exp.startDate,
          exp.endDate,
          exp.description,
          exp.location,
        ].forEach((f) => {
          if (f?.trim()) filled++;
        });
        if (exp.current) filled++;
      });
      return Math.round((filled / totalFields) * 100);
    }
    case 4: {
      const edus = stepData as Education[];
      if (edus.length === 0) return 0;
      const totalFields = edus.length * 8;
      let filled = 0;
      edus.forEach((edu) => {
        [
          edu.institution,
          edu.degree,
          edu.fieldOfStudy,
          edu.startDate,
          edu.endDate,
          edu.description,
          edu.location,
          edu.gpa,
        ].forEach((f) => {
          if (f?.trim()) filled++;
        });
        if (edu.current) filled++;
      });
      return Math.round((filled / totalFields) * 100);
    }
    case 5: {
      const ms = stepData as MedicalScience[];
      if (ms.length === 0) return 0;
      return 100;
    }
    case 6: {
      const projects = stepData as Project[];
      if (projects.length === 0) return 0;
      return 100;
    }
    case 7: {
      const skills = stepData as Skill[];
      if (skills.length === 0) return 0;
      return 100;
    }
    case 8: {
      const creds = stepData as Credential[];
      if (creds.length === 0) return 0;
      return 100;
    }
    case 9: {
      const refs = stepData as Reference[];
      if (refs.length === 0) return 0;
      return 100;
    }
    default:
      return stepData instanceof Array && stepData.length > 0 ? 100 : 0;
  }
};
