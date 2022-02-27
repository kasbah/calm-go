import React from "react";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

export default function Modal({
  trigger: Trigger,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}) {
  const [showDialog, setShowDialog] = React.useState(false);
  const open = () => setShowDialog(true);
  const close = () => setShowDialog(false);
  return (
    <>
      <Trigger open={open} />
      <DialogOverlay
        className="z-50"
        style={{ background: "hsla(0, 100%, 100%, 0.9)" }}
        isOpen={showDialog}
        onDismiss={close}
      >
        <DialogContent
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          style={{ boxShadow: "0px 10px 50px hsla(0, 0%, 0%, 0.33)" }}
        >
          {children({ close })}
        </DialogContent>
      </DialogOverlay>
    </>
  );
}
