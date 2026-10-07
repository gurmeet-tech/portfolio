import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth'
import { ref as dbRef, set } from 'firebase/database'
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'
import { app, db } from './firebase'
import type { SiteContent } from './content'

const auth = getAuth(app)
const storage = getStorage(app)

export async function saveContent(content: SiteContent): Promise<void> {
  await set(dbRef(db, 'site'), { ...content, updatedAt: new Date().toISOString() })
}

export function watchAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb)
}

export function login(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function logout() {
  return signOut(auth)
}

export async function uploadImage(file: File, folder = 'uploads'): Promise<string> {
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  return getDownloadURL(fileRef)
}