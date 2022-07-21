import { Get } from "./api";
import { useState, useTransition, useEffect } from "react";
import { getAccessToken } from "./getCookie";
import { useSnackbar } from "notistack";
import Axios from "./api";

export default async function uploadFile(_file) {
  // TODO
  // 태웅이 수정 후 작업

  // const { enqueueSnackbar } = useSnackbar();
  // if (!_file)
  //   return enqueueSnackbar("파일을 업로드 해주세요.", {
  //     variant: "error",
  //     autoHideDuration: 2000,
  //   });
  const formData = new FormData();

  // formData.append("token", getAccessToken());
  formData.append("file", _file);
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };

  const upload = await Axios.Post(`upload`, formData, config);

  if (upload?.code === 200) {
    return upload?.data.path;
  }
}
