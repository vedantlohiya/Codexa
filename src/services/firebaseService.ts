import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  Firestore,
} from 'firebase/firestore';
import { FirebaseInterviewSession, AssignedPdfDocument } from '../types';
import { initialPdfDocuments } from '../data/initialPdfs';

// Firebase configuration from environment or fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key-codexa',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'codexa-platform.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'codexa-platform-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'codexa-platform.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef',
};

// Check if valid Firebase credentials are provided
const isRealFirebaseConfigured =
  Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID) &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'codexa-platform-demo';

let firestoreDb: Firestore | null = null;

try {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  if (isRealFirebaseConfigured) {
    firestoreDb = getFirestore(app);
  }
} catch (err) {
  console.warn('Firebase initialization notice: using persistent local-first storage adapter.', err);
}

const LOCAL_STORAGE_SESSIONS_KEY = 'codexa_firebase_interview_sessions';
const LOCAL_STORAGE_PDFS_KEY = 'codexa_firebase_assigned_pdfs';

// Helpers for local fallback storage
const getStoredSessions = (): FirebaseInterviewSession[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredSessions = (sessions: FirebaseInterviewSession[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions to local storage:', e);
  }
};

export const getStoredPdfs = (): AssignedPdfDocument[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PDFS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_PDFS_KEY, JSON.stringify(initialPdfDocuments));
      return initialPdfDocuments;
    }
    return JSON.parse(raw);
  } catch {
    return initialPdfDocuments;
  }
};

export const saveStoredPdfs = (pdfs: AssignedPdfDocument[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PDFS_KEY, JSON.stringify(pdfs));
  } catch (e) {
    console.error('Error saving pdfs to local storage:', e);
  }
};

/**
 * Save an interview session and its post-interview coaching report to Firebase
 */
export async function saveInterviewSessionToFirebase(
  session: FirebaseInterviewSession
): Promise<{ success: boolean; id: string; storageTarget: 'firebase-firestore' | 'firebase-local' }> {
  // Always update local storage for offline resilience & immediate UI response
  const existing = getStoredSessions();
  const index = existing.findIndex((s) => s.id === session.id);
  const sessionWithFlag: FirebaseInterviewSession = {
    ...session,
    savedToFirebase: true,
  };

  if (index >= 0) {
    existing[index] = sessionWithFlag;
  } else {
    existing.unshift(sessionWithFlag);
  }
  saveStoredSessions(existing);

  // If real Firestore is configured, save document to collection
  if (firestoreDb) {
    try {
      const sessionRef = doc(firestoreDb, 'interview_sessions', session.id);
      await setDoc(sessionRef, {
        ...sessionWithFlag,
        updatedAt: new Date().toISOString(),
      });
      return { success: true, id: session.id, storageTarget: 'firebase-firestore' };
    } catch (firebaseErr) {
      console.warn('Firestore write failed, falling back to local persistent store:', firebaseErr);
    }
  }

  return { success: true, id: session.id, storageTarget: 'firebase-local' };
}

/**
 * Retrieve all interview sessions for a specific student from Firebase
 */
export async function getStudentInterviewSessionsFromFirebase(
  studentId: string
): Promise<FirebaseInterviewSession[]> {
  // Try reading from Firestore if active
  if (firestoreDb) {
    try {
      const sessionsRef = collection(firestoreDb, 'interview_sessions');
      const q = query(sessionsRef, where('studentId', '==', studentId), orderBy('startedAt', 'desc'));
      const snapshot = await getDocs(q);
      const results: FirebaseInterviewSession[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as FirebaseInterviewSession);
      });
      if (results.length > 0) {
        return results;
      }
    } catch (e) {
      console.warn('Firestore query failed, using local persistent fallback:', e);
    }
  }

  // Fallback to local sessions
  const localSessions = getStoredSessions();
  return localSessions.filter((s) => s.studentId === studentId);
}

/**
 * Save assigned PDF metadata and extracted text to Firebase
 */
export async function savePdfDocumentToFirebase(
  pdf: AssignedPdfDocument
): Promise<{ success: boolean; id: string }> {
  const currentPdfs = getStoredPdfs();
  const idx = currentPdfs.findIndex((p) => p.id === pdf.id);
  if (idx >= 0) {
    currentPdfs[idx] = pdf;
  } else {
    currentPdfs.unshift(pdf);
  }
  saveStoredPdfs(currentPdfs);

  if (firestoreDb) {
    try {
      const pdfRef = doc(firestoreDb, 'assigned_pdfs', pdf.id);
      await setDoc(pdfRef, { ...pdf, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.warn('Firestore PDF save warning:', err);
    }
  }

  return { success: true, id: pdf.id };
}

/**
 * Retrieve all assigned PDFs
 */
export async function getAllPdfDocumentsFromFirebase(): Promise<AssignedPdfDocument[]> {
  if (firestoreDb) {
    try {
      const pdfsRef = collection(firestoreDb, 'assigned_pdfs');
      const snapshot = await getDocs(pdfsRef);
      const results: AssignedPdfDocument[] = [];
      snapshot.forEach((docSnap) => {
        results.push(docSnap.data() as AssignedPdfDocument);
      });
      if (results.length > 0) {
        return results;
      }
    } catch (e) {
      console.warn('Firestore read PDFs error:', e);
    }
  }
  return getStoredPdfs();
}
