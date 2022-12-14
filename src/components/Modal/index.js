import Upload from "./share/Upload";
import NeedConfirm from "./share/NeedConfirm";
import ReadFile from "./share/ReadFile";
import Result from "./dna/Result";
import Area from "./setting/AreaModal";
import Change from "./bojang/ChangeOrg";
import Division from "./Division";
import Popup from "./Popup";
import Gift from "./db/gift";
import Deposit from "./db/Deposit";
import DepositConfirm from "./share/DepositConfirm";
import MultipleUpload from "./share/MultipleUpload";
import User from "./db/User";
import Guide from "./db/Guide";
import DbApply from "./db/DbApply";
import AsReason from "./db/AsReason";

import { useContext } from "react";

import { ModalContext } from "../../contexts/ModalContext";
import Imageslider from "./db/ImageSllider";

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
    } else if (data === "area") {
      return <Area key={index} index={index} />;
    } else if (data === "change") {
      return <Change key={index} index={index} />;
    } else if (data === "division") {
      return <Division key={index} index={index} />;
    } else if (data === "needconfirm") {
      return <NeedConfirm key={index} index={index} />;
    } else if (data === "popup") {
      return <Popup key={index} index={index} />;
    } else if (data === "gift") {
      return <Gift key={index} index={index} />;
    } else if (data === "deposit") {
      return <Deposit key={index} index={index} />;
    } else if (data === "depositconfirm") {
      return <DepositConfirm key={index} index={index} />;
    } else if (data === "multipleupload") {
      return <MultipleUpload key={index} index={index} />;
    } else if (data === "chooseuser") {
      return <User key={index} index={index} />;
    } else if (data === "guide") {
      return <Guide key={index} index={index} />;
    } else if (data === "dbapply") {
      return <DbApply key={index} index={index} />;
    } else if (data === "imageslider") {
      return <Imageslider key={index} index={index} />;
    } else if (data === "asreason") {
      return <AsReason key={index} index={index} />;
    } else {
      return;
    }
  });
}
