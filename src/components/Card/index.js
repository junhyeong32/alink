import Image from "next/image";
import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Row from "../Box/Row";
import styles from "../../../styles/js/home";
import Column from "../Box/Column";
import replaceText from "../../utility/replaceText";

export default function MarketTool({ title, description }) {
  return (
    <Card
      sx={{
        width: "200px",
        height: "187px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderTop: "6px solid",
        borderImageSource:
          "radial-gradient(100% 8584901.02% at 0% 50.15%, rgba(65, 88, 217, 0) 0%, #4158D9 50%, rgba(65, 88, 217, 0) 100%)",
        background: "#4158D9",
        paddig: "19px",
      }}
    >
      <CardContent>
        <Column justifyContent="center" sx={{ rowGap: "23px" }}>
          <Typography variant="h4" color="primary.white" align="center">
            {replaceText(title)}
          </Typography>
          <Typography variant="normal" color="primary.white" align="center">
            {replaceText(description)}
          </Typography>
        </Column>
      </CardContent>
    </Card>
  );
}
