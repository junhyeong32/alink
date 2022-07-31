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
// import { Modal, Box, Typography, Grid, Divider } from "@mui/material";
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

// /*

// geomaps

// [{
//   parent: "경기",
//   name: "경기",
//   childred: ["과천시"]
// }, {
//   parent: "경기",
//   name: "경기(서부)",
//   childred: ["의정부시"]
// }]

// 1. 상위에 지역 셀렉트 박스에 보여지는 것은 무조건 첫 뎁스의 parent, 중복된건 거르고. (또는 그냥 첫 지역은 고정으로 넣어도 됨)
// 2. 지역 셀렉스 박스 선택하면, 지역이 분할된 것은 parent는 선택한 것이고 parent와 name이 다른 것을 보여주면 됨.
// 3. children은 저 parent와 name이 다른 것을 소속된 것으로 보여주면 됨

// */

// /*

// 1. 분할하기
//  - 지역선택 시 기존에 있던 것 + 지금 생성하려고 있던 리스트 목록 보여주기

// 2. 소속설정
//  -

// 3. 테이블(db 상세 조회)
//  - 소속 보여주기
//  -

// */

// function Geomaps() {
//   const [geomaps, setGeomaps] = useState([]);
//   const [selectedParent, setSelectedParent] = useState(""); // 지역 셀렉트 박스
//   const [splitedGeos, setSplitedGeos] = useState([]); // 분할지역 목록
//   const [selectedSplitedDetailGeo, setSelectedSplitedDetailGeo] = useState(""); // 선택한 지역의 상세 지역
//   const [
//     selectedSplitedDetailGeoForParent,
//     setSelectedSplitedDetailGeoForParent,
//   ] = useState({}); // 선택한 지역의 상세 지역의 소속 맵

//   useEffect(() => {
//     setGeomaps([
//       {
//         parent: "경기",
//         name: "경기",
//         children: ["과천시"],
//       },
//       {
//         parent: "경기",
//         name: "경기(서부)",
//         children: ["의정부시"],
//       },
//     ]);
//   }, []); // API Call

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

//   // 분할된 지역 목록 그리기
//   splitedGeos.map((geo) => {
//     return <Component>{geo.name} X</Component>;
//   });

//   // 테이블 그리기
//   selectedSplitedDetailGeo.map((geo) => {
//     return (
//       <Component>
//         {geo} | 소속: {selectedSplitedDetailGeoForParent[geo]}
//       </Component>
//     );
//   });

//   // 분할 지역 목록 추가 시 (팝업에서 만들었을 때 호출)
//   const addedSplitedGeo = "";
//   setGeomaps((prevState) => {
//     if (prev.filter((geo) => geo.name === addedSplitedGeo).length > 0)
//       return prevState; // 중복됨

//     const newState = [
//       ...prev,
//       {
//         parent: selectedParent,
//         name: addedSplitedGeo,
//         children: [],
//       },
//     ];

//     return newState;
//   });

//   // 분할 지역 목록 삭제 시
//   const deletedSplitedGeo = ""; // 삭제한 소속 지역
//   setGeomaps((prevState) => {
//     const newState = [...prev];

//     // 인덱스 찾아서 맵안돌려도 됨
//     const deletedDetailGeos = [];
//     newState.map((s, i) => {
//       if (s.parent === selectedParent) {
//         if (s.name === deletedSplitedGeo) {
//           deletedDetailGeos.push([...s.children]);
//         }
//       }
//     });

//     // 인덱스 찾아서 맵안돌려도 됨
//     newState.map((s, i) => {
//       if (s.parent === selectedParent) {
//         if (s.name === s.parent) {
//           newState[i].children.push([...deletedDetailGeos]);
//         }
//       }
//     });

//     return newState;
//   });

//   // 상세 지역에 소속 설정 시
//   const popupSelectedSplitedGeo = ""; // 바꿀 소속 지역
//   const popupSelectedDetailGeos = []; // 선택한 상세 지역들
//   setGeomaps((prevState) => {
//     const newState = [...prev];
//     // 선택한 분할 지역의 children에 선택된 상세 지역들을 넣어주고
//     // 분할 지역의 parent의 children에서 모두 빼준다.
//     //selectedParent

//     newState.map((s, i) => {
//       if (s.parent === selectedParent) {
//         for (let children of s.children) {
//           const idx = popupSelectedDetailGeos.indexOf(children);
//           if (idx) s.children.splice(idx, 1); // 기존거 삭제
//         }
//         if (s.name === popupSelectedSplitedGeo) {
//           // 분할지역이 바꿀 소속 지역이면
//           newState[i].push([...popupSelectedDetailGeos]);
//         }
//       }
//     });

//     return newState;
//   });
// }

// export default function Area({ index }) {
//   const { enqueueSnackbar } = useSnackbar();
//   const [area_list, setAreaList] = useState([]);

//   const [parent_area, setParentArea] = useState("");
//   const [menuItems, setMenuItems] = useState({});
//   const [table_data, setTableData] = useState([]);
//   const [division, setDivision] = useState([]);

//   const [select, setSelect] = useState("");

//   const { modal, data, openModal, closeModal, modalContent } =
//     useContext(ModalContext);

//   const { buttonAction } = modalContent[index];

//   useEffect(() => {
//     setMenuItems(() => {
//       const obj = {};
//       data[index]?.map((d, key) => {
//         Object.assign(obj, { [d.parent]: d.parent });
//       });
//       return obj;
//     });
//   }, []);

//   useEffect(() => {
//     setDivision([]);
//     setAreaList([]);
//   }, [parent_area]);

//   useEffect(() => {
//     const foundSelectedList = data[index].filter(
//       (d) => d.parent === parent_area
//     );

//     console.log(foundSelectedList);
//     //분할지역
//     setDivision(() => {
//       const _division = [];

//       foundSelectedList?.map((list, key) => {
//         if (list.parent === list.name) return;
//         _division.push(list.name);
//       });

//       return _division;
//     });

//     //테이블 데이터 지역 + 소속
//     setTableData(() => {
//       let origin_data = [];

//       foundSelectedList?.map((list, key) => {
//         if (list.parent === list.name) return (origin_data = list.children);
//         list.children.map((child, _key) => {
//           const foundIndex = origin_data.indexOf(child);
//           if (foundIndex !== -1) {
//             origin_data.splice(foundIndex, 1, {
//               area: child,
//               org: list.name,
//             });
//           }
//         });
//       });

//       return origin_data;
//     });
//   }, [parent_area]);

//   console.log("division", data);

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
//                     value: splitedGeos,
//                     setValue: setSplitedGeos,
//                   },
//                 });
//               }}
//             />
//           </Row>
//           <OutLineSelectInput
//             w="100%"
//             value={parent_area}
//             setValue={setParentArea}
//             menuItems={menuItems}
//           />
//           {division.length !== 0 && (
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
//                 {division.map((d, key) => (
//                   <Row sx={{ width: "100%" }} alignItems={"center"} key={key}>
//                     <BackgroundInput
//                       h={25}
//                       defaultValue={d}
//                       onBlur={(e) => {
//                         setDivision((prev) => {
//                           const arr = [...prev];
//                           arr[key] = e.target.value;

//                           return arr;
//                         });
//                       }}
//                       endAdornment={
//                         <Image
//                           src="/cancel.png"
//                           width={15}
//                           height={15}
//                           alt="x"
//                           layout="fixed"
//                           className="pointer"
//                           onClick={() =>
//                             setDivision((prev) => {
//                               const arr = [...prev];
//                               arr.splice(key, 1);

//                               return arr;
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
//                     if (division.length === 0)
//                       return enqueueSnackbar(
//                         "분할 지역을 입력해 선택해주세요",
//                         {
//                           variant: "error",
//                           autoHideDuration: 2000,
//                         }
//                       );
//                     if (area_list.length === 0)
//                       return enqueueSnackbar("지역을 선택해주세요", {
//                         variant: "error",
//                         autoHideDuration: 2000,
//                       });

//                     let obj = {};
//                     division.map((d) => Object.assign(obj, { ...obj, [d]: d }));
//                     openModal({
//                       modal: "change",
//                       data: obj,
//                       content: {
//                         title: "소속 설정",
//                         buttonName: "설정",
//                         buttonAction: setSelect,
//                       },
//                     });
//                   }}
//                 />
//                 <AreaTable
//                   data={table_data}
//                   area_list={area_list}
//                   setAreaList={setAreaList}
//                 />
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
//               action={() => {
//                 if (area_list.length === 0)
//                   return enqueueSnackbar("지역을 선택해주세요", {
//                     variant: "error",
//                     autoHideDuration: 2000,
//                   });

//                 buttonAction({
//                   parent: parent_area,
//                   name: select,
//                   children: area_list,
//                 });
//                 closeModal(index);
//               }}
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
