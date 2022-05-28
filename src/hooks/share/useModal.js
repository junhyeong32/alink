import { useEffect, useState } from "react";

export default function useModal() {
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modal, setModal] = useState("");

  const closeModal = () => {
    setVisible(false);
    setModal("");
    setModalContent("");
  };

  const openModal = ({ modal, content = false }) => {
    console.log("실행", modal, content);
    setModal(modal);
    setVisible(true);
    if (content) {
      setModalContent(content);
    }
  };
  return { visible, modal, openModal, closeModal, modalContent };
}
