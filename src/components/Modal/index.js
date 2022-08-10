import Upload from "./share/Upload";
import NeedConfirm from "./share/NeedConfirm";
import ReadFile from "./share/ReadFile";
import Result from "./dna/Result";
// import Area from "./setting/AreaModal";
import Change from "./bojang/ChangeOrg";
import Division from "./Division";
import Popup from "./Popup";
import Gift from "./db/gift";

import { useContext } from "react";

import { ModalContext } from "../../contexts/ModalContext";

export default function Modal() {
  const { modal } = useContext(ModalContext);

  return modal.map((data, index) => {
    if (data === "upload") {
      return <Upload key={index} index={index} />;
    } else if (data === "needConfirm") {
      return <NeedConfirm key={index} index={index} />;
    } else if (data === "readFile") {
      return <ReadFile key={index} index={index} />;
    } else if (data === "result") {
      return <Result key={index} index={index} />;
    }
    //  else if (data === "area") {
    //   return <Area key={index} index={index} />;
    // }
    else if (data === "change") {
      return <Change key={index} index={index} />;
    } else if (data === "division") {
      return <Division key={index} index={index} />;
    } else if (data === "needconfirm") {
      return <NeedConfirm key={index} index={index} />;
    } else if (data === "popup") {
      return <Popup key={index} index={index} />;
    } else if (data === "gift") {
      return <Gift key={index} index={index} />;
    } else {
      return;
    }
  });
}
