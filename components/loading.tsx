'use client';

import '@/styles/globals.css';
import { Icons } from './icons';

function Loading() {
  return <Icons.spinner className="mt-32 h-10 w-10 animate-spin mx-auto" />;
}

export default Loading;
