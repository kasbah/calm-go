import * as React from "react";
import {
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogLabel,
  AlertDialogDescription,
} from "@reach/alert-dialog";
import VisuallyHidden from "@reach/visually-hidden";
import "@reach/dialog/styles.css";

export interface DialogProps {
  isOpen: boolean | undefined;
  label: string;
  description: string;
  leastDestructiveRef: React.Ref<HTMLElement>;
  buttons: React.ReactNode;
  onDismiss: Function;
}

export default function Dialog({
  isOpen,
  label,
  description,
  leastDestructiveRef,
  buttons,
  onDismiss,
}: DialogProps) {
  return (
    <>
      <AlertDialogOverlay
        className="z-50"
        isOpen={isOpen}
        leastDestructiveRef={leastDestructiveRef}
        style={{ background: "hsla(0, 100%, 100%, 0.9)" }}
        onDismiss={onDismiss}
      >
        <AlertDialogContent
          className="max-w-2xl"
          style={{
            width: "80vw",
            boxShadow: "0px 10px 50px hsla(0, 0%, 0%, 0.33)",
          }}
        >
          <VisuallyHidden>
            <AlertDialogLabel>{label}</AlertDialogLabel>
          </VisuallyHidden>
          <div className="space-y-4">
            <AlertDialogDescription className="text-center">
              {description}
            </AlertDialogDescription>
            <div className="flex justify-center">
              <div className="flex space-x-4 max-w-2xl">{buttons}</div>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </>
  );
}
