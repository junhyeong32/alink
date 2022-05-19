import { Radio } from "@mui/material";
import React from "react";
import Image from "next/image";
export default function RadioInput({ value, setValue }) {
  return (
    <Radio
      icon={<Image src="/radio.png" width={15} height={15} alt="radio" />}
    />
  );
}
