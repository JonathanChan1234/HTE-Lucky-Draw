import { cert, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import * as serviceAccount from '../serviceAccountKey.json';

initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
const firestore = getFirestore();

export default firestore;
