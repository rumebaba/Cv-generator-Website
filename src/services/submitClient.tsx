import { pdf } from '@react-pdf/renderer';
import { collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import CVTemplate from '../components/pdf/CVTemplate';
import CVTemplateCompact from '../components/pdf/CVTemplateCompact';
import CVTemplateCreative from '../components/pdf/CVTemplateCreative';
import CVTemplateExecutive from '../components/pdf/CVTemplateExecutive';
import CVTemplateMinimal from '../components/pdf/CVTemplateMinimal';
import CVTemplateModern from '../components/pdf/CVTemplateModern';
import type { TemplateId } from '../hooks/useTemplate';
import { db, storage } from '../lib/firebase';
import type { FormData } from '../types/form';
import type { FormState } from '../types/form';

function stripEmptyArrays(obj: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value) && value.length === 0) continue;
    cleaned[key] = value;
  }
  return cleaned;
}

function serializeFormData(data: FormData): Record<string, unknown> {
  const raw = {
    personalData: data.personalData,
    introduction: data.introduction,
    experiences: data.experiences,
    educations: data.educations,
    medicalScience: data.medicalScience,
    projects: data.projects,
    skills: data.skills,
    credentials: data.credentials,
    certifications: data.certifications,
    languages: data.languages,
    references: data.references,
  };

  const cleaned: Record<string, unknown> = {};
  for (const [section, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      const nonEmpty = value.filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          Object.values(item).some((v) => v !== '' && v !== 0 && v !== false)
      );
      if (nonEmpty.length > 0) cleaned[section] = nonEmpty;
    } else if (value && typeof value === 'object') {
      const stripped = stripEmptyArrays(value as unknown as Record<string, unknown>);
      if (Object.keys(stripped).length > 0) cleaned[section] = stripped;
    }
  }
  return cleaned;
}

const templateMap = {
  classic: CVTemplate,
  modern: CVTemplateModern,
  minimal: CVTemplateMinimal,
  executive: CVTemplateExecutive,
  creative: CVTemplateCreative,
  compact: CVTemplateCompact,
} as const;

async function generatePDFBlob(data: FormData, template: TemplateId = 'classic'): Promise<Blob> {
  const TemplateComponent = templateMap[template];
  const formState: FormState = {
    data,
    currentStep: 9,
    completedSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    errors: {},
    isDirty: false,
    isSubmitting: false,
  };
  return pdf(<TemplateComponent formState={formState} />).toBlob();
}

export interface SubmitClientResult {
  clientId: string;
  pdfUrl: string;
}

export async function submitClient(
  formData: FormData,
  template: TemplateId = 'classic'
): Promise<SubmitClientResult> {
  const serialized = serializeFormData(formData);

  const docRef = await addDoc(collection(db, 'clients'), {
    ...serialized,
    template,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const pdfBlob = await generatePDFBlob(formData, template);

  const fileName = `${formData.personalData.fullName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  const storageRef = ref(storage, `cv-pdfs/${docRef.id}/${fileName}`);
  await uploadBytes(storageRef, pdfBlob);

  const downloadUrl = await getDownloadURL(storageRef);

  await updateDoc(docRef, {
    pdfUrl: downloadUrl,
    pdfFileName: fileName,
    updatedAt: serverTimestamp(),
  });

  return { clientId: docRef.id, pdfUrl: downloadUrl };
}
