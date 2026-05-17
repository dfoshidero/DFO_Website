import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { ModalContext } from '../../utils/modalContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import './Modal.scss';

function Modal() {
  const {
    closeModal,
    clearModal,
    modalContent,
    modalTitle,
    isModalOpen,
  } = useContext(ModalContext);

  const [isPresent, setIsPresent] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);

  const backdropRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const hasAnimatedOpenRef = useRef(false);

  const trapActive = isPresent && dataOpen;
  useFocusTrap(dialogRef, trapActive, closeButtonRef);

  useEffect(() => {
    if (isModalOpen) {
      setIsPresent(true);
      const frameId = requestAnimationFrame(() => {
        setDataOpen(true);
      });
      return () => cancelAnimationFrame(frameId);
    }

    setDataOpen(false);
    return undefined;
  }, [isModalOpen]);

  useEffect(() => {
    if (dataOpen) {
      hasAnimatedOpenRef.current = true;
    }
  }, [dataOpen]);

  useEffect(() => {
    if (!isModalOpen && isPresent && !dataOpen && !hasAnimatedOpenRef.current) {
      setIsPresent(false);
      clearModal();
    }

    if (!isPresent) {
      hasAnimatedOpenRef.current = false;
    }
  }, [isModalOpen, isPresent, dataOpen, clearModal]);

  useEffect(() => {
    if (!isPresent) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isPresent]);

  useEffect(() => {
    if (!trapActive) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trapActive, closeModal]);

  const handleBackdropMouseDown = useCallback(
    (event) => {
      if (event.target === backdropRef.current) {
        closeModal();
      }
    },
    [closeModal]
  );

  const handleTransitionEnd = useCallback(
    (event) => {
      if (event.target !== backdropRef.current) return;
      if (event.propertyName !== 'opacity' && event.propertyName !== 'background-color') return;
      if (isModalOpen || dataOpen) return;

      hasAnimatedOpenRef.current = false;
      setIsPresent(false);
      clearModal();
    },
    [isModalOpen, dataOpen, clearModal]
  );

  if (!isPresent) return null;

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      data-open={dataOpen ? 'true' : 'false'}
      onMouseDown={handleBackdropMouseDown}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="modal-dialog-title" className="modal__title--sr-only">
          {modalTitle || 'Dialog'}
        </h2>
        <div className="modal__header">
          <button
            ref={closeButtonRef}
            type="button"
            className="modal__close"
            onClick={closeModal}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className="modal-content">
          {modalContent}
        </div>
      </div>
    </div>
  );
}

export default Modal;
