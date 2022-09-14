export function sortGeo(data) {
  //   let defaultGeo = { name: "서울", name: "경기", name: "인천" };
  //   let lastGeo = { name: "제주" };
  //   let result = {};

  console.log("data", data);

  return data.sort((a, b) => {
    if (a.name === "서울" || a.name === "인천") return -1;
    if (a?.name?.slice(0, 2) === "경기") return -1;

    return (a.name === "제주") - (b.name === "제주") || (a.name < b.name && -1);
  });

  //   Object.assign(result, defaultGeo, lastGeo);
}
