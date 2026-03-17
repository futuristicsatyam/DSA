'use client';
// apps/web/src/components/admin/confirm-dialog.tsx

import { Loader2, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDeleteProps {
  title?: string;
  description?: string;
  onConfirm: () => void;
  isPending?: boolean;
  trigger?: React.ReactNode;
}

export function ConfirmDelete({
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  onConfirm,
  isPending = false,
  trigger,
}: ConfirmDeleteProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
