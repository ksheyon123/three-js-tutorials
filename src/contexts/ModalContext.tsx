import React, { ReactNode, createContext } from "react";
import Modal from "@/components/Modal/Modal";
import { useModal } from "@/hooks/useModal";
interface IProps {
  children: ReactNode;
}
export const ModalContext = createContext<{ toggleModal: Function }>({
  toggleModal: null,
});

export const ModalProvider: React.FC<IProps> = ({ children }) => {
  const { component, isOpened, toggleModal } = useModal();

  return (
    <ModalContext.Provider
      value={{
        toggleModal,
      }}
    >
      {children}
      {isOpened && <Modal {...component} />}
    </ModalContext.Provider>
  );
};
