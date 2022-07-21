import { Radio, Box } from "@mui/material";
import React from "react";
import Image from "next/image";
export default function RadioInput({ checked, onClick, ...props }) {
  return (
    <Radio
      {...props}
      checked={checked}
      onClick={onClick}
      icon={
        <Image
          src="/radio.png"
          width={15}
          height={15}
          alt="radio"
          layout="fixed"
        />
      }
      checkedIcon={
        <Box sx={{ position: "relative" }}>
          <Box sx={{ position: "absolute", top: "-7px" }}>
            <Image
              src="/check.png"
              width={23}
              height={18}
              alt="radio"
              layout="fixed"
            />
          </Box>
          <Image
            src="/radio.png"
            width={15}
            height={15}
            alt="radio"
            layout="fixed"
          />
        </Box>
      }
    />
  );
}
