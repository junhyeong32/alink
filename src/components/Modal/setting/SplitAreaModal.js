import {Modal} from '@mui/material';
import Box from '@mui/material/Box';
import {styled} from '@mui/system';
import {useState, useContext, useEffect} from 'react';
import {useCookies} from 'react-cookie';
import useAsyncEffect from 'use-async-effect';
import {ModalContext} from '../../../contexts/ModalContext';
import Axios from '../../../utility/api';
import Column from '../../Box/Column';
import {OutLineSelectInput} from '../../Input/Select';

const style = {
  width: {lg: '322px', md: '322px', sm: '322px', xs: '90%'},
  height: '784px',
  overflowX: 'hidden',
  background: '#FFFFFF',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 3,
};

const Root = styled('div')`
  table {
    box-shadow: none;
    width: 100%;
    height: 100%;
  }

  th {
    border-top: 3px solid #0d1d41;
    border-bottom: none;
    height: 37px;
    text-align: center;
    box-shadow: none;
    font-weight: bold;
    font-size: 12px;
    padding: 0;
    min-width: 80px;
  }

  td {
    padding: 8px;
    font-size: 12px;
    padding: 0;
  }
`;

export default function SplitAreaModal({index}) {
  const {modal, data, openModal, closeModal, modalContent} = useContext(ModalContext);

  const [cookies] = useCookies();

  const [geomaps, setGeomaps] = useState([]);
  const [selectedParent, setSelectedParent] = useState(0); // 지역 셀렉트 박스
  const [splitedGeos, setSplitedGeos] = useState([]); // 분할지역 목록
  const [selectedSplitedDetailGeo, setSelectedSplitedDetailGeo] = useState(''); // 선택한 지역의 상세 지역
  const [
    selectedSplitedDetailGeoForParent,
    setSelectedSplitedDetailGeoForParent,
  ] = useState({}); // 선택한 지역의 상세 지역의 소속 맵

  useAsyncEffect(async () => {
    const res = (
      await Axios.Get('db/geomap', {
        params: {
          platform: 'web',
          token: cookies.access_token,
        },
      })
    )?.data;

    setGeomaps(res?.data || []);

    console.log(res?.data);
  }, []); // API Call

  useEffect(() => {
    setSplitedGeos(
      geomaps.filter(
        (geomap) =>
          geomap.parent === geomaps[selectedParent].name && geomap.name !== geomaps[selectedParent].name,
      ),
    ); // 선택된 지역의 분할지역 목록 필터 및 셋팅
  }, [selectedParent]);

  useEffect(() => {
    // geomap.name
    const _selectedSplitedDetailGeoForParent = {};
    setSelectedSplitedDetailGeo(
      geomaps
        .filter((geomap) => geomap.parent === geomaps[selectedParent].name)
        .map((geomap) => {
          if (geomap.name !== geomaps[selectedParent].name) {
            for (let children of geomap.children) {
              _selectedSplitedDetailGeoForParent[children] = geomap.name;
            }
          }
          return geomap.children;
        })
        .flat(),
    );
    setSelectedSplitedDetailGeoForParent(_selectedSplitedDetailGeoForParent);
  }, [splitedGeos]);

  // // 분할 지역 목록 추가 시 (팝업에서 만들었을 때 호출)
  // const addedSplitedGeo = '';
  // setGeomaps((prevState) => {
  //   if (prevState.filter((geo) => geo.name === addedSplitedGeo).length > 0)
  //     return prevState; // 중복됨
  //
  //   return [
  //     ...prevState,
  //     {
  //       parent: geomaps[selectedParent].name,
  //       name: addedSplitedGeo,
  //       children: [],
  //     },
  //   ];
  // });
  //
  // // 분할 지역 목록 삭제 시
  // const deletedSplitedGeo = ''; // 삭제한 소속 지역
  // setGeomaps((prevState) => {
  //   const newState = [...prevState];
  //
  //   const deletedDetailGeos = [];
  //   newState.map((s, i) => {
  //     if (s.parent === geomaps[selectedParent].name) {
  //       if (s.name === deletedSplitedGeo) {
  //         deletedDetailGeos.push([...s.children]);
  //       }
  //     }
  //   });
  //
  //   newState.map((s, i) => {
  //     if (s.parent === geomaps[selectedParent].name) {
  //       if (s.name === s.parent) {
  //         newState[i].children.push([...deletedDetailGeos]);
  //       }
  //     }
  //   });
  //
  //   return newState;
  // });
  //
  // // 상세 지역에 소속 설정 시
  // const popupSelectedSplitedGeo = ''; // 바꿀 소속 지역
  // const popupSelectedDetailGeos = []; // 선택한 상세 지역들
  // setGeomaps((prevState) => {
  //   const newState = [...prevState];
  //   // 선택한 분할 지역의 children에 선택된 상세 지역들을 넣어주고
  //   // 분할 지역의 parent의 children에서 모두 빼준다.
  //
  //   newState.map((s, i) => {
  //     if (s.parent === geomaps[selectedParent].name) {
  //       for (let children of s.children) {
  //         const idx = popupSelectedDetailGeos.indexOf(children);
  //         if (idx) s.children.splice(idx, 1); // 기존거 삭제
  //       }
  //       if (s.name === popupSelectedSplitedGeo) {
  //         // 분할지역이 바꿀 소속 지역이면
  //         newState[i].push([...popupSelectedDetailGeos]);
  //       }
  //     }
  //   });
  //
  //   return newState;
  // });

  return (
    <Modal open={modal[index] === 'area'} onClose={closeModal}>
      <Box>
        <Column alignItems={'center'} justifyContent={'start'} sx={style}>
          {/*지역 선택*/}
          <OutLineSelectInput
            w="100%"
            value={selectedParent}
            setValue={setSelectedParent}
            menuItems={geomaps.map((geo, key) => {
              return geo.name;
            })}
          />

          {/*분할된 지역 목록*/}
          {splitedGeos.map((geo, key) => {
            return <div key={key}>{geo.name}^</div>;
          })}

          {/*상세 지역 목록*/}
          {selectedSplitedDetailGeo.map((geo, key) => {
            return (
              <div key={key}>
                {geo} | 소속: {selectedSplitedDetailGeoForParent[geo]}
              </div>
            );
          })}
        </Column>
      </Box>
    </Modal>
  );
}