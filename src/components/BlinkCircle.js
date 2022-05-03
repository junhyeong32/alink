import { Typography , Box} from "@mui/material";
import useRelativePx from "/src/hooks/useRelativePx";

export default function BlinkCircle(){
    const rw = useRelativePx().getRelativeWidthPx;
  const rh = useRelativePx().getRelativeHeightPx;
    return (
        <>
        <Box 
            sx={{
              width:rw(30), 
              height:rh(30) ,
              backgroundColor:"#72BAC6",
              borderRadius:"50%",
              opacity:"1",
              animation:"blink-effect 1s step-end infinite"
              }}
        />
        </>
    )
}