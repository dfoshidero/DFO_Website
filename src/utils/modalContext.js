import React, { createContext, useCallback, useState } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (content, options = {}) => {
    setModalContent(content);
    setModalTitle(options.title ?? '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const clearModal = useCallback(() => {
    setModalContent(null);
    setModalTitle('');
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        clearModal,
        modalContent,
        modalTitle,
        isModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
