import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

import * as serviceAccount from '../serviceAccountKey.json';

initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
export const firestore = getFirestore();
export const auth = getAuth();
