import Upload from "./share/Upload";
import NeedConfirm from "./share/NeedConfirm";
import ReadFile from "./share/ReadFile";
import Result from "./dna/Result";
import Area from "./setting/Area";
import Change from "./bojang/ChangeOrg";

import { useContext } from "react";

import { ModalContext } from "../../contexts/ModalContext";

export default function Modal() {
  const { modal } = useContext(ModalContext);

  console.log("index", modal);
  modal.map((data, index) => {
    console.log(data);
    if (data === "upload") {
      return <Upload index={index} />;
    } else if (data === "needConfirm") {
      return <NeedConfirm index={index} />;
    } else if (data === "readFile") {
      return <ReadFile index={index} />;
    } else if (data === "result") {
      return <Result index={index} />;
    } else if (data === "area") {
      return <Area index={index} />;
    } else if (data === "change") {
      return <Change index={index} />;
    }
  });
}
