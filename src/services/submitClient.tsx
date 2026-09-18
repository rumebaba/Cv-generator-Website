import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';

import type { TemplateId } from '../hooks/useTemplate';
import { auth, db } from '../lib/firebase';
import { normalizeFormData } from '../types/form';
import type { FormData } from '../types/form';

export type SavedCV = FormData & {
  id: string;
  template: TemplateId;
  isDraft: boolean;
  updatedAt?: { toMillis(): number };
};

export function normalizeTemplate(value: unknown): TemplateId {
  return typeof value === 'string' &&
    ['classic', 'modern', 'minimal', 'executive', 'creative', 'compact'].includes(value)
    ? (value as TemplateId)
    : 'classic';
}

export function serializeFormData(data: FormData): Record<string, unknown> {
  return JSON.parse(JSON.stringify(normalizeFormData(data))) as Record<string, unknown>;
}

export function withTimeout<T>(promise: Promise<T>, label: string, timeoutMs = 20000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () =>
        reject(
          new Error(
            `${label} could not be confirmed. Check your connection and retry. Pending writes may sync when you reconnect.`
          )
        ),
      timeoutMs
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function requireUser(userId: string): void {
  if (!userId || auth.currentUser?.uid !== userId)
    throw new Error('Please sign in to save or load your CVs.');
}

export function createClientId(): string {
  return doc(collection(db, 'clients')).id;
}

export async function saveCV(
  data: FormData,
  template: TemplateId,
  userId: string,
  clientId: string,
  isDraft: boolean
): Promise<void> {
  requireUser(userId);
  const serialized = serializeFormData(data);
  if (new TextEncoder().encode(JSON.stringify(serialized)).length > 850000) {
    throw new Error(
      'This CV is too large for a free cloud document. Reduce or remove embedded photos/images, then retry. Local PDF and DOCX downloads are still available.'
    );
  }
  await withTimeout(
    setDoc(
      doc(db, 'clients', clientId),
      {
        ...serialized,
        template,
        userId,
        isDraft,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    ),
    'Cloud save'
  );
}

export async function submitClient(
  data: FormData,
  template: TemplateId,
  userId: string,
  clientId = createClientId()
): Promise<{ clientId: string }> {
  await saveCV(data, template, userId, clientId, false);
  return { clientId };
}

function readCV(id: string, value: Record<string, unknown>): SavedCV {
  const timestamp = value.updatedAt ?? value.createdAt;
  return {
    ...normalizeFormData(value as Partial<FormData>),
    id,
    template: normalizeTemplate(value.template),
    isDraft: value.isDraft === true,
    updatedAt:
      timestamp && typeof (timestamp as { toMillis?: unknown }).toMillis === 'function'
        ? (timestamp as { toMillis(): number })
        : undefined,
  };
}

export async function getUserCVs(userId: string): Promise<SavedCV[]> {
  requireUser(userId);
  const result = await withTimeout(
    getDocs(query(collection(db, 'clients'), where('userId', '==', userId))),
    'Loading CVs'
  );
  return result.docs
    .map((item) => readCV(item.id, item.data()))
    .sort((a, b) => (b.updatedAt?.toMillis() ?? 0) - (a.updatedAt?.toMillis() ?? 0));
}

export async function loadCV(userId: string, clientId: string): Promise<SavedCV> {
  requireUser(userId);
  const result = await withTimeout(getDoc(doc(db, 'clients', clientId)), 'Loading CV');
  if (!result.exists() || result.data().userId !== userId)
    throw new Error('This CV is unavailable for your account.');
  return readCV(result.id, result.data());
}
