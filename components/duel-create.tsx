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

export function DuelCreate() {
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <div className="w-full p-2 bg-slate-800">
          <Button size="lg" className="w-full">
            Create Game
          </Button>
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
