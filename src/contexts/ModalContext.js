import { useEffect, useState, createContext } from "react";

export const ModalContext = createContext({
  modal_list: [],
  modal_data: [],
  addModalList: () => {},
  deleteModalList: () => {},
  addModalData: () => {},
});

export function ModalProvider({ children }) {
  const [modal_list, setModalList] = useState([]);
  const [modal_data, setModalData] = useState([]);

  const addModalList = (modal_message) => {
    setModalList((prev) => {
      const new_modal_list = [...prev];
      new_modal_list.push(modal_message);

      return new_modal_list;
    });
  };

  const deleteModalList = (index) => {
    setModalList(() => {
      const new_modal_list = [...modal_list];
      new_modal_list.splice(index, 1);
      return new_modal_list;
    });
  };

  const addModalData = (data) => {
    setModalData(data);
  };

  return (
    <ModalContext.Provider
      value={{
        modal_list,
        modal_data,
        addModalList,
        deleteModalList,
        addModalData,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}
