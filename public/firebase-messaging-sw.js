// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');
importScripts('swenv.js');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    image: 'https://www.wordduel.xyz/logo.png',
    requireInteraction: true,
  };
  // self.registration.showNotification(notificationTitle, notificationOptions);
});

// Not necessary, but if you want to handle clicks on notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // const pathname = event.notification?.data?.FCM_MSG?.notification?.data?.link;
  // if (!pathname) return;
  // const url = new URL(pathname, self.location.origin).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientsArr) => {
        // const hadWindowToFocus = clientsArr.some((windowClient) =>
        //   windowClient.url === url ? (windowClient.focus(), true) : false
        // );

        self.clients.openWindow('https://miyauchi.dev/posts/fcm-push-message/');

        // if (!hadWindowToFocus)
        // .then((windowClient) =>
        //   windowClient ? windowClient.focus() : null
        // );
      })
  );
});
