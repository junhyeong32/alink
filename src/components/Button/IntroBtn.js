import Image from "next/image";
import { useRouter } from "next/link";
import { Box } from "@mui/system";

export default function IntroBtn({ sx, action, id }) {
  return (
    <Box
      sx={{
        ...sx,
      }}
      id={id}
      onClick={action}
    ></Box>
  );
}
