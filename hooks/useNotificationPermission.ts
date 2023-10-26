'use client';

import { useEffect, useState } from 'react';

const useNotificationPermissionStatus = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>('default');

  useEffect(() => {
    const notif = window?.Notification;
    if (notif) {
      const handler = () => setPermission(notif.permission);
      handler();
      notif.requestPermission().then(handler);

      navigator.permissions
        .query({ name: 'notifications' })
        .then((notificationPerm) => {
          notificationPerm.onchange = handler;
        });
    }
  }, []);

  return permission;
};

export default useNotificationPermissionStatus;
