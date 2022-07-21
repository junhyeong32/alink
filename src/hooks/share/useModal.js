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

  const openModal = ({ modal, content = false, data }) => {
    setData(data);
    setModal(() => {
      const arr = [];
      arr.push(modal);
      return arr;
    });
    if (content) {
      setModalContent(content);
    }
  };
  return { modal, data, openModal, closeModal, modalContent };
}
