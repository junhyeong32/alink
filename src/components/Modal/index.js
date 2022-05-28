import Confirm from "./share/Confirm";
import Upload from "./dna/upload";
import NeedConfirm from "./share/NeedConfirm";
import ReadFile from "./share/ReadFile";
import { useContext } from "react";

import { ModalContext } from "../../contexts/ModalContext";

export default function Modal() {
  const { modal } = useContext(ModalContext);
  return (
    <>
      {/* <Confirm /> */}
      {modal === "upload" && <Upload />}
      {modal === "needConfirm" && <NeedConfirm />}
      {modal === "readFile" && <ReadFile />}
    </>
  );
}
