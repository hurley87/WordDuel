'use client';

import { useEffect, useState } from 'react';
import { getToken, isSupported } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import useNotificationPermission from './useNotificationPermission';
import { createSub } from '@/lib/db';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';

const useFCMToken = () => {
  const { wallet } = usePrivyWagmi();
  const permission = useNotificationPermission();
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const retrieveToken = async () => {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        if (permission === 'granted') {
          const isFCMSupported = await isSupported();
          if (!isFCMSupported) return;
          const fcmToken = await getToken(messaging(), {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });

          if (fcmToken && wallet?.address)
            await createSub(
              {
                token: fcmToken,
              },
              wallet?.address
            );

          setFcmToken(fcmToken);
        }
      }
    };
    retrieveToken();
  }, [permission]);

  return fcmToken;
};

export default useFCMToken;
