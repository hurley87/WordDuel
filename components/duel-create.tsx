'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { NewDuel } from './new-duel';
import { usePrivy } from '@privy-io/react-auth';
import GetStarted from './get-started';

export function DuelCreate() {
  const { user } = usePrivy();

  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="w-full p-2 bg-slate-800">
          {user ? (
            <Button size="lg" className="w-full">
              Create Game
            </Button>
          ) : (
            <GetStarted />
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <NewDuel />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
