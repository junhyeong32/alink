import React from "react";
import useModal from "../hooks/share/useModal";
import { createContext } from "react";

let ModalContext;
const { Provider } = (ModalContext = createContext());

const ModalProvider = ({ children }) => {
  const {  modal, openModal, closeModal, modalContent, data } =
    useModal();
  return (
    <Provider
      value={{  modal, data, openModal, closeModal, modalContent }}
    >
      {children}
    </Provider>
  );
};

export { ModalContext, ModalProvider };
