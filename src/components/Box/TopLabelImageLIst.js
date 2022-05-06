import { useEffect, useState } from "react";
import Image from "next/image";
import { Container, Typography, Button } from "@mui/material";
import Row from "./Row";

export default function TopLabelImageList({ label, img_obj, list, ...props }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!props.choice) {
      props.setCheckImgList([]);
      setChecked(false);
    }
  }, [props.choice]);

  return (
    <Row
      alignItems="start"
      justifyContent="between"
      wrap="wrap"
      sx={{
        position: "relative",
        width: "47%",
        height: "auto",
        // minHeight: "150px",
        border: "1.5px solid #CFCFCF",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        borderRadius: "20px",
        p: 1,
        cursor: "pointer",
      }}
      mt={2.2}
      onClick={() => {
        if (props.choice) {
          props.setCheckImgList([...props.check_img_list, list.code]);
          checked ? setChecked(false) : setChecked(true);
        } else {
          window.parent.postMessage(
            {
              message: "openUserModal",
              value: {
                code: list.code,
                key: props.index,
                params: props.params,
              },
            },
            "*"
          );
        }
      }}
      props
    >
      <Row
        alignItems="center"
        justifyContent="center"
        sx={{
          position: "absolute",
          background:
            label === "매칭실패"
              ? "#C14327"
              : label === "미서명"
              ? "#0F7BB8"
              : label === "확인필요"
              ? "#FFC700"
              : label === "보완"
              ? "#0D1D41"
              : "#797979",
          borderRadius: "5px",
          left: "5px",
          top: "5px",
          width: "61px",
          height: "29px",
          zIndex: 2,
        }}
      >
        <Typography variant="h6" component="div" color="primary.white">
          {label}
        </Typography>
      </Row>
      {props.choice && checked && (
        <Row
          alignItems="center"
          justifyContent="center"
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            background: "rgba(0, 0, 0, 0.5)",
            borderRadius: "20px",
            zIndex: 1,
            left: 0,
            top: 0,
          }}
        >
          <Image src="/image_check.png" width={74} height={54} alt="check" />
        </Row>
      )}

      {img_obj &&
        Object?.entries(img_obj)?.map(([a, src], key) => {
          return (
            <Typography
              key={key}
              variant="normal"
              sx={{
                border: src && "1px solid #000000",
                width: "30%",
                height: "100%",
                position: "relative",
              }}
            >
              {src && (
                <Image
                  src={src}
                  width="100%"
                  height="100%"
                  alt=""
                  layout="responsive"
                  objectFit="fill"
                />
              )}
            </Typography>
          );
        })}
    </Row>
  );
}
