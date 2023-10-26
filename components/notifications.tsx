'use client';

import { MdOutlineIosShare } from 'react-icons/md';
import { Button } from './ui/button';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { getToken, isSupported } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { createSub, db } from '@/lib/db';
import useFCM from '@/hooks/useFCM';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { Icons } from './icons';

export default function Notifications() {
  const { messages } = useFCM();
  const { wallet } = usePrivyWagmi();
  const address = wallet?.address as string;
  const [tokenExists, setTokenExists] = useState(true);

  console.log(messages);

  console.log(messages.length);

  console.log(wallet);

  useEffect(() => {
    async function goodTimes() {
      console.log('wllet', address);
      if (address) {
        const docRef = doc(db, 'subs', address);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());
          const token = docSnap.data()?.token;

          console.log(token);
        } else {
          setTokenExists(false);
        }
      }
    }
    goodTimes();
  }, []);

  async function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then(async (permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
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
      } else {
        console.log('Unable to get permission to notify.');
      }
    });
  }

  return (
    <div>
      {messages?.map((message) => {
        return (
          <Link
            key={message?.data?.duelId}
            href={`/${message?.data?.duelType}/${message?.data?.duelId}`}
            className="w-full"
          >
            <div className="flex justify-between rounded-none px-2 py-4 transition-all border-b border-accent hover:bg-accent hover:text-accent-foreground w-full">
              <p className="font-medium text-sm">
                {message?.notification?.title} : {message?.notification?.body}
              </p>
              <p className="font-bold flex flex-col items-center">
                <Icons.chevronRight />
              </p>
            </div>
          </Link>
        );
      })}
      {!tokenExists && (
        <div className=" py-20 text-center rounded-md right-4 top-32 grid gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full dark:border-slate-800 dark:bg-slate-950">
          <h1>
            <MdOutlineIosShare className="w-10 h-10 mx-auto" />
          </h1>
          <h1 className="text-center text-lg font-bold">Setup Notifications</h1>
          <p className="text-sm">All WordDuel to send you notifications.</p>
          <Button onClick={() => requestPermission()}>
            Request Permission
          </Button>
        </div>
      )}
    </div>
  );
}
