import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage, type FirebaseStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const REQUIRED_KEYS = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
]

export const isFirebaseConfigured = REQUIRED_KEYS.every(
  (value) => typeof value === "string" && value.length > 0
)

let firebaseApp: FirebaseApp | null = null
let cachedAuth: Auth | null = null
let cachedDb: Firestore | null = null
let cachedStorage: FirebaseStorage | null = null

function initializeFirebase() {
  if (!isFirebaseConfigured) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Firebase não configurado: usando dados mock/fallback.")
    }
    return null
  }

  if (!firebaseApp) {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()
  }

  return firebaseApp
}

export function getFirebaseApp() {
  return initializeFirebase()
}

export function getFirebaseAuth() {
  const app = initializeFirebase()
  if (!app) return null
  if (!cachedAuth) {
    cachedAuth = getAuth(app)
  }
  return cachedAuth
}

export function getFirestoreClient() {
  const app = initializeFirebase()
  if (!app) return null
  if (!cachedDb) {
    cachedDb = getFirestore(app)
  }
  return cachedDb
}

export function getStorageClient() {
  const app = initializeFirebase()
  if (!app) return null
  if (!cachedStorage) {
    cachedStorage = getStorage(app)
  }
  return cachedStorage
}

