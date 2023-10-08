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
        <Button variant="secondary" className="w-full rounded-none">
          Start Game
        </Button>
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
