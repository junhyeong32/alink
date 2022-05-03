import Image from "next/image";
import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Row from "../Box/Row";
import styles from "../../../styles/js/home";
import Column from "../Box/Column";
import replaceText from "../../utility/replaceText";

export default function Price({ title, description, explanation, price }) {
  return (
    <Card
      sx={{
        width: "222px",
        height: "247px",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderTop: "6px solid",
        borderImageSource:
          "radial-gradient(100% 8584901.02% at 0% 50.15%, rgba(65, 88, 217, 0) 0%, #4158D9 50%, rgba(65, 88, 217, 0) 100%)",
        padding: "22px 30px 21px 31px",
      }}
    >
      <CardContent
        sx={{ p: 0, paddingBottom: "0px !important", height: "100%" }}
      >
        <Column justifyContent="between" sx={{ height: "100%" }}>
          <Typography variant="h1">{title}</Typography>
          <Column>
            <Typography variant="normal">{replaceText(description)}</Typography>
            <Typography variant="normal">{replaceText(explanation)}</Typography>
          </Column>
          <Row justifyContent="end">
            <Typography variant="h1" color="primary">
              {price}
            </Typography>
          </Row>
        </Column>
      </CardContent>
    </Card>
  );
}
