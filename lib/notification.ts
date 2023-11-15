import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/db';
import { toast } from '@/components/ui/use-toast';

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
    const description = (e as Error)?.message || 'Please try again.';
    return toast({
      title: 'Token Error',
      description,
      variant: 'destructive',
    });
  }
}
