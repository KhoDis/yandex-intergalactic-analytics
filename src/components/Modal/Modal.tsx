import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import { CancelButton } from "../CancelButton/CancelButton.tsx";

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    // TODO
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      // Block scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      // Unblock scroll
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles["modal-container"]}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal}>{children}</div>
        <CancelButton onClick={onClose} className={styles["cancel-button"]} />
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
