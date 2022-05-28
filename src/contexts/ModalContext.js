import React from "react";
import useModal from "../hooks/share/useModal";
import { createContext } from "react";

let ModalContext;
const { Provider } = (ModalContext = createContext());

const ModalProvider = ({ children }) => {
  const { visible, modal, openModal, closeModal, modalContent } = useModal();
  return (
    <Provider value={{ visible, modal, openModal, closeModal, modalContent }}>
      {children}
    </Provider>
  );
};

export { ModalContext, ModalProvider };
