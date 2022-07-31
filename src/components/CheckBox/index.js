import { Checkbox } from "@mui/material";
import Image from "next/image";

export default function CustomCheckBox({ ...props }) {
  return (
    <Checkbox
      {...props}
      icon={<Image src="/web_unchecked.png" width={22} height={22} alt="" />}
      checkedIcon={
        <Image src="/web_checked.png" width={22} height={22} alt="" />
      }
    />
  );
}
