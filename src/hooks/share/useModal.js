import { useEffect, useState } from "react";

export default function useModal() {
  const [modalContent, setModalContent] = useState([]);
  const [modal, setModal] = useState([]);
  const [data, setData] = useState([]);

  const closeModal = (index, count) => {
    setModal(() => {
      const new_modal_list = [...modal];
      new_modal_list.splice(index, count || 1);
      return new_modal_list;
    });
    setModalContent(() => {
      const new_modal_list = [...modalContent];
      new_modal_list.splice(index, count || 1);

      return new_modal_list;
    });
  };

  const openModal = ({ modal, content, data }) => {
    console.log("hello", modal, content, data);
    setData((prev) => [...prev, data]);
    setModalContent((prev) => [...prev, content]);
    setModal((prev) => [...prev, modal]);
  };
  return { modal, data, openModal, closeModal, modalContent };
}
