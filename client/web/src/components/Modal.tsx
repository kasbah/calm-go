import * as React from "react";
import {
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog";
import VisuallyHidden from "@reach/visually-hidden";
import "@reach/dialog/styles.css";

export interface ModalProps {
  trigger: React.ReactNode;
  label: string;
  description: string;
  cancelRef: React.Ref<HTMLElement>;
  buttons: React.ReactNode;
}

export default function Modal({
  trigger: Trigger,
  label,
  description,
  cancelRef,
  buttons,
}: ModalProps) {
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  return (
    <>
      <Trigger open={open} />
      <AlertDialogOverlay
        className="z-50"
        style={{ background: "hsla(0, 100%, 100%, 0.9)" }}
        isOpen={showDialog}
        onDismiss={close}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogContent
          style={{ boxShadow: "0px 10px 50px hsla(0, 0%, 0%, 0.33)" }}
        >
          <VisuallyHidden>
            <AlertDialogLabel>{label}</AlertDialogLabel>
          </VisuallyHidden>
          <div className="space-y-4">
            <AlertDialogDescription className="text-center">
              {description}
            </AlertDialogDescription>
            <div className="flex space-x-4 justify-center">
              {buttons({ close })}
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </>
  );
}
