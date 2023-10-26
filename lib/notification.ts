import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/db';

export async function sendNotification(address: string, msg: any, data: any) {
  try {
    const docRef = doc(db, 'subs', address);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      const token = docSnap.data()?.token;

      await fetch('/api/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          msg,
          data,
        }),
      });
    } else {
      console.log('No such document!');
    }
  } catch (e) {
    console.log('getFCMToken error', e);
    return undefined;
  }
}
