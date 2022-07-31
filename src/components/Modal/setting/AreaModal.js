// import Link from "next/link";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import {
//   useContext,
//   useEffect,
//   useRef,
//   useState,
//   forwardRef,
//   createRef,
// } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   Grid,
//   Divider,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import Column from "../../Box/Column";
// import RowLabel from "../../Box/RowLabel";
// import { useCookies } from "react-cookie";
// import { useSnackbar } from "notistack";
// import TopLabelContents from "../../Box/TopLableContents";
// import Button from "../../Button";
// import UnderLineSelectInput from "../../Input/Select";
// import { OutLineInput } from "../../Input";
// import Row from "../../Box/Row";
// import { ModalContext } from "../../../contexts/ModalContext";
// import OutLineSelectInput from "../../Input/Select";
// // import AreaTable from "../../Table/setting/area";
// import NeedConfirmModal from "../share/NeedConfirm";
// import AreaTable from "../../Table/setting/Area";
// import BackgroundInput from "../../Input/Background";
// import RadioInput from "../../Radio";

// const areaHeaderList = ["", "지역", "소속"];

// const style = {
//   width: { lg: "322px", md: "322px", sm: "322px", xs: "90%" },
//   height: "784px",
//   overflowX: "hidden",
//   background: "#FFFFFF",
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   bgcolor: "background.paper",
//   borderRadius: "5px",
//   boxShadow: 24,
//   p: 3,
// };

// const Root = styled("div")`
//   table {
//     box-shadow: none;
//     width: 100%;
//     height: 100%;
//   }

//   th {
//     border-top: 3px solid #0d1d41;
//     border-bottom: none;
//     height: 37px;
//     text-align: center;
//     box-shadow: none;
//     font-weight: bold;
//     font-size: 12px;
//     padding: 0;
//     min-width: 80px;
//   }
//   td {
//     padding: 8px;
//     font-size: 12px;
//     padding: 0;
//   }
// `;

// export default function AreaModal({ index }) {
//   const { enqueueSnackbar } = useSnackbar();
//   const [menuItems, setMenuItems] = useState({});
//   const [selectedParent, setSelectedParent] = useState(""); // 지역 셀렉트 박스
//   const [splitedGeos, setSplitedGeos] = useState([]); // 분할지역 목록
//   const [selectedSplitedDetailGeo, setSelectedSplitedDetailGeo] = useState([]); // 선택한 지역의 상세 지역
//   const [
//     selectedSplitedDetailGeoForParent,
//     setSelectedSplitedDetailGeoForParent,
//   ] = useState({}); // 선택한 지역의 상세 지역의 소속 맵

//   const [popupSelectedSplitedGeo, setPopupSelectedSplitedGeo] = useState("");
//   const [popupSelectedDetailGeos, setPopupSelectedDetailGeos] = useState([]);
//   const [addedSplitedGeo, setAddedSplitedGeo] = useState("");

//   const { modal, data, openModal, closeModal, modalContent } =
//     useContext(ModalContext);

//   const { geomaps, setGeomaps } = data[index];
//   const { buttonAction } = modalContent[index];

//   useEffect(() => {
//     setMenuItems(() => {
//       const obj = {};
//       geomaps?.map((d, key) => {
//         Object.assign(obj, { [d.parent]: d.parent });
//       });
//       return obj;
//     });
//   }, []);
//   console.log("menuItems", menuItems);

//   useEffect(() => {
//     setSplitedGeos(
//       geomaps.filter(
//         (geomap) =>
//           geomap.parent === selectedParent && geomap.name !== selectedParent
//       )
//     ); // 선택된 지역의 분할지역 목록 필터 및 셋팅
//   }, [selectedParent]);

//   useEffect(() => {
//     // geomap.name
//     const _selectedSplitedDetailGeoForParent = {};
//     setSelectedSplitedDetailGeo(
//       geomaps
//         .filter((geomap) => geomap.parent === selectedParent)
//         .map((geomap) => {
//           if (geomap.name !== selectedParent) {
//             for (let children of geomap.children) {
//               _selectedSplitedDetailGeoForParent[children] = geomap.name;
//             }
//           }
//           return geomap.children;
//         })
//         .flat()
//     );
//     setSelectedSplitedDetailGeoForParent(_selectedSplitedDetailGeoForParent);
//   }, [splitedGeos]);

//   console.log(splitedGeos, geomaps);

//   return (
//     <Modal open={modal[index] === "area" ? true : false} onClose={closeModal}>
//       <Box>
//         <Column alignItems={"center"} justifyContent={"start"} sx={style}>
//           <RowLabel label="담당 지역 설정" fs="h4"></RowLabel>
//           <Row justifyContent={"between"} sx={{ width: "100%", mt: 3.1 }}>
//             <Typography variant="h5">지역</Typography>
//             <Button
//               text="분할하기"
//               fs="h6"
//               w={62}
//               h={20}
//               action={() => {
//                 openModal({
//                   modal: "division",
//                   data: {
//                     setValue: setGeomaps,
//                     selectedParent: selectedParent,
//                   },
//                 });
//               }}
//             />
//           </Row>
//           <OutLineSelectInput
//             w="100%"
//             value={selectedParent}
//             setValue={setSelectedParent}
//             menuItems={menuItems}
//           />
//           {splitedGeos.length !== 0 && (
//             <Column
//               justifyContent={"start"}
//               sx={{ width: "100%", mt: 1.3, gap: 1 }}
//               wrap={"wrap"}
//             >
//               <Typography variant="h5">지역 분할</Typography>
//               <Grid
//                 container
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   border: "3px solid #E2E2E2",
//                   borderRadius: "5px",
//                   gap: 1,
//                   p: 1,
//                 }}
//               >
//                 {splitedGeos.map((d, key) => (
//                   <Row sx={{ width: "100%" }} alignItems={"center"} key={key}>
//                     <BackgroundInput
//                       h={25}
//                       defaultValue={d.name}
//                       disabled
//                       endAdornment={
//                         <Image
//                           src="/cancel.png"
//                           width={15}
//                           height={15}
//                           alt="x"
//                           layout="fixed"
//                           className="pointer"
//                           onClick={() =>
//                             setGeomaps((prevState) => {
//                               const newState = [...prev];

//                               // 인덱스 찾아서 맵안돌려도 됨
//                               const deletedDetailGeos = [];
//                               newState.map((s, i) => {
//                                 if (s.parent === selectedParent) {
//                                   if (s.name === deletedSplitedGeo) {
//                                     deletedDetailGeos.push([...s.children]);
//                                   }
//                                 }
//                               });

//                               // 인덱스 찾아서 맵안돌려도 됨
//                               newState.map((s, i) => {
//                                 if (s.parent === selectedParent) {
//                                   if (s.name === s.parent) {
//                                     newState[i].children.push([
//                                       ...deletedDetailGeos,
//                                     ]);
//                                   }
//                                 }
//                               });

//                               return newState;
//                             })
//                           }
//                         />
//                       }
//                     />
//                   </Row>
//                 ))}
//               </Grid>
//             </Column>
//           )}

//           <Column
//             justifyContent={"start"}
//             sx={{ width: "100%", mt: 1.3, gap: 1 }}
//           >
//             <Typography variant="h5">
//               상세 리스트 - {"지역" || parent_area}
//             </Typography>
//             <Column
//               sx={{
//                 border: "3px solid #E2E2E2",
//                 borderRadius: "5px",
//                 gap: 1,
//                 p: 1,
//               }}
//             >
//               <Column alignItems={"end"} sx={{ gap: 1 }}>
//                 <Button
//                   text="소속설정"
//                   fs="h6"
//                   w={62}
//                   h={20}
//                   action={() => {
//                     //   if (division.length === 0)
//                     //     return enqueueSnackbar(
//                     //       "분할 지역을 입력해 선택해주세요",
//                     //       {
//                     //         variant: "error",
//                     //         autoHideDuration: 2000,
//                     //       }
//                     //     );
//                     //   if (area_list.length === 0)
//                     //     return enqueueSnackbar("지역을 선택해주세요", {
//                     //       variant: "error",
//                     //       autoHideDuration: 2000,
//                     //     });

//                     openModal({
//                       modal: "change",
//                       //   data: ,
//                       content: {
//                         title: "소속 설정",
//                         buttonName: "설정",
//                         buttonAction: () => {
//                           setGeomaps((prevState) => {
//                             const newState = [...prevState];
//                             // 선택한 분할 지역의 children에 선택된 상세 지역들을 넣어주고
//                             // 분할 지역의 parent의 children에서 모두 빼준다.
//                             //selectedParent

//                             newState.map((s, i) => {
//                               if (s.parent === selectedParent) {
//                                 for (let children of s.children) {
//                                   const idx =
//                                     popupSelectedDetailGeos.indexOf(children);
//                                   if (idx) s.children.splice(idx, 1); // 기존거 삭제
//                                 }
//                                 if (s.name === popupSelectedSplitedGeo) {
//                                   // 분할지역이 바꿀 소속 지역이면
//                                   newState[i].push([
//                                     ...popupSelectedDetailGeos,
//                                   ]);
//                                 }
//                               }
//                             });

//                             return newState;
//                           });
//                         },
//                       },
//                     });
//                   }}
//                 />

//                 <Root sx={{ width: "100%" }}>
//                   <TableContainer>
//                     <Table
//                       sx={{
//                         width: "100%",
//                       }}
//                     >
//                       <TableHead>
//                         <TableRow key="head">
//                           {areaHeaderList?.map((data, key) => {
//                             if (data === "") {
//                               return (
//                                 <TableCell key={key} align="center">
//                                   <RadioInput
//                                   // checked={

//                                   // }
//                                   // onClick={() =>
//                                   //   setAreaList((prev) => {
//                                   //     const new_data = [...prev];

//                                   //     if (new_data.length < data.length) return [data];
//                                   //     return [];
//                                   //   })
//                                   // }
//                                   />
//                                 </TableCell>
//                               );
//                             } else {
//                               return (
//                                 <TableCell key={key} align="center">
//                                   {data}
//                                 </TableCell>
//                               );
//                             }
//                           })}
//                         </TableRow>
//                       </TableHead>

//                       <TableBody>
//                         {selectedSplitedDetailGeo?.map((geo, key) => {
//                           return (
//                             <TableRow align="center" key={key}>
//                               <TableCell align="center">
//                                 <RadioInput
//                                   //   checked={

//                                   //   }
//                                   onClick={(e) => {
//                                     setGeomaps((prevState) => {
//                                       const newState = [...prevState];
//                                       // 선택한 분할 지역의 children에 선택된 상세 지역들을 넣어주고
//                                       // 분할 지역의 parent의 children에서 모두 빼준다.
//                                       //selectedParent

//                                       newState.map((s, i) => {
//                                         if (s.parent === selectedParent) {
//                                           for (let children of s.children) {
//                                             const idx =
//                                               popupSelectedDetailGeos.indexOf(
//                                                 children
//                                               );
//                                             if (idx) s.children.splice(idx, 1); // 기존거 삭제
//                                           }
//                                           if (
//                                             s.name === popupSelectedSplitedGeo
//                                           ) {
//                                             // 분할지역이 바꿀 소속 지역이면
//                                             newState[i].push([
//                                               ...popupSelectedDetailGeos,
//                                             ]);
//                                           }
//                                         }
//                                       });

//                                       return newState;
//                                     });
//                                   }}
//                                 />
//                               </TableCell>
//                               <TableCell align="center">
//                                 <Row
//                                   alignItems={"center"}
//                                   justifyContent={"center"}
//                                   sx={{
//                                     background: "#E6E6E6",
//                                     borderRadius: "5px",
//                                   }}
//                                 >
//                                   {geo}
//                                 </Row>
//                               </TableCell>
//                               <TableCell align="center">
//                                 {selectedSplitedDetailGeoForParent[geo]}
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </Root>
//               </Column>
//             </Column>
//           </Column>
//           <Row sx={{ mt: 3, gap: 1 }}>
//             <Button
//               text="등록"
//               fs="h6"
//               color="primary.white"
//               w={100}
//               h={20}
//                 action={() => {
//                   if (area_list.length === 0)
//                     return enqueueSnackbar("지역을 선택해주세요", {
//                       variant: "error",
//                       autoHideDuration: 2000,
//                     });

//                   buttonAction({
//                     parent: parent_area,
//                     name: select,
//                     children: area_list,
//                   });
//                   closeModal(index);
//                 }}
//             />
//             <Button
//               text="취소"
//               bgColor={"gray"}
//               fs="h6"
//               color="primary.white"
//               w={100}
//               h={20}
//               action={closeModal}
//             />
//           </Row>
//         </Column>
//       </Box>
//     </Modal>
//   );
// }
