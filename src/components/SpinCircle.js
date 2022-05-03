import { Typography, Box } from "@mui/material";
import Image from "next/image";

export default function SpinCircle(){
    return(
        <Box sx={{ position: "absolute", left: "50%", top: "7%" }}>
              <Box
                sx={{
                  position: "relative",
                  width: 200,
                  height: 200,
                  right: "30%",
                  top: "10%",
                  zIndex: "-1",
                }}
              >
                <Image
                  className="bigCircle"
                  src="/bigcircle.png"
                  width={200}
                  height={200}
                  layout="fill"
                  objectFit="contain"
                />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  width: 75,
                  height: 75,
                  left: "1%",
                  top: "31.5%",
                }}
              >
                <Image
                  className="smallCircle"
                  src="/smallcircle.png"
                  width={75}
                  height={75}
                  layout="fill"
                  objectFit="contain"
                />
              </Box>
            </Box>
    )
}