'use client';

import React, { useEffect } from 'react';
import { detect } from 'detect-browser';
import { MdOutlineIosShare } from 'react-icons/md';
import { isSupported } from 'firebase/messaging';
import { Button } from './ui/button';

function DownloadDialog() {
  const [isReady, setIsReady] = React.useState(false);
  const [isPWA, setIsPWA] = React.useState(false);
  useEffect(() => {
    const browser = detect();
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    const notificationsAllowed =
      navigator.serviceWorker && window.PushManager && window.Notification;
    console.log('notificationsAllowed');
    console.log(notificationsAllowed);
    setIsPWA(isPWA);
    if (browser) {
      console.log(browser);
      if (parseInt(browser?.version || '0') >= 16) {
        setIsReady(true);
      }
    }
  }, []);
  return isPWA ? null : isReady ? (
    <div className="block md:hidden fixed top-0 bottom inset-0 z-50 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/80">
      <div className=" py-20 text-center block md:hidden fixed left-4 rounded-md right-4 top-32 grid gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full dark:border-slate-800 dark:bg-slate-950">
        <h1>
          <MdOutlineIosShare className="w-10 h-10 mx-auto" />
        </h1>
        <h1 className="text-center text-lg font-bold">Add To Home Screen</h1>
        <p className="text-sm">
          To Install the app, you need to add this website to your home screen.
        </p>
        <p className="text-sm">
          In your Safari browser menu, tap the Share icon and choose{' '}
          <b>Add to Home Screen</b> in the options. Then open the WordDuel app
          on your home screen.
        </p>
      </div>
    </div>
  ) : (
    <div className="block md:hidden fixed top-0 bottom inset-0 z-50 bg-white/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-slate-950/80">
      <div className=" py-20 text-center block md:hidden fixed left-4 rounded-md right-4 top-32 grid gap-4 border border-slate-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full dark:border-slate-800 dark:bg-slate-950">
        <h1>
          <MdOutlineIosShare className="w-10 h-10 mx-auto" />
        </h1>
        <h1 className="text-center text-lg font-bold">Wrong System Detected</h1>
        <p className="text-sm">
          WordDuel requires iOS 16.4 or later to send push notifications.
        </p>
        <p className="text-sm">
          Visit Settings to update your device to the latest version of iOS and
          come back to install the app.
        </p>
      </div>
    </div>
  );
}

export default DownloadDialog;
