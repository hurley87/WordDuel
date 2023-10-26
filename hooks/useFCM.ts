import { useEffect, useState } from 'react';
import { messaging } from '@/lib/firebase';
import { MessagePayload, onMessage } from 'firebase/messaging';

const useFCM = () => {
  const [messages, setMessages] = useState<MessagePayload[]>([]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const fcmmessaging = messaging();

      const unsubscribe = onMessage(fcmmessaging, (payload) => {
        setMessages((messages) => [...messages, payload]);
      });
      return () => unsubscribe();
    }
  }, []);

  return { messages };
};

export default useFCM;
