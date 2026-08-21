import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog';
import { useErrorDialogStore } from '@lib/errors/error-dialog.store';

export function GlobalErrorDialog() {
  const current = useErrorDialogStore((state) => state.queue[0]);
  const dismiss = useErrorDialogStore((state) => state.dismiss);

  return (
    <AlertDialog open={current !== undefined} onOpenChange={(open) => !open && dismiss()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{current?.title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">{current?.message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="col-span-2">知道了</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
