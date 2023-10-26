'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function DuelCreate() {
  return (
    <div className="w-full p-2 bg-slate-800">
      <Link href="/new">
        <Button size="lg" className="w-full border-b border-background">
          Create Game
        </Button>
      </Link>
    </div>
  );
}
