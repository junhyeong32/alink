import {
  getTitleOfOrg_name,
  getTitleOfStartBranchOrg_name,
} from "./getTitleOfOrg";

export function getOrgWithUnit(orgs, unit, result) {
  for (let org of orgs) {
    getOrgWithUnit(org.children, unit, result);

    if (org.unit === unit) {
      Object.assign(result, {
        [org.code]: getTitleOfOrg_name(org),
      });
    }
  }
}

export function getOrgWithUnitName(orgs, unit, result) {
  for (let org of orgs) {
    getOrgWithUnit(org.children, unit, result);

    if (org.unit === unit) {
      Object.assign(result, {
        [org.code]: org,
      });
    }
  }
}

//조건 : unit 2개 이상
export function getOrgWithManyUnit(orgs, unit1, unit2, result, unit3) {
  for (let org of orgs) {
    getOrgWithManyUnit(org.children, unit1, unit2, result);

    if (org.unit === unit1 || org.unit === unit2 || org.unit === unit3) {
      Object.assign(result, {
        [org.code]: getTitleOfOrg_name(org),
      });
    }
  }
}

//조건 : 조직만 뽑아ㅗㄹ때
export function getOrgHeadOffice(orgs, result) {
  orgs?.map((org) =>
    Object.assign(result, {
      [org.code]: org.name,
    })
  );
}

//조건 : 상위 코드 비교
export function getOrgByParentRank(orgs, unit, rank, result) {
  for (let org of orgs) {
    getOrgByParentRank(org.children, unit, rank, result);

    if (
      org.unit === unit &&
      (rank === "T0000" && unit === "region"
        ? org.parent_code === "T0001" || org.parent_code === "T0000"
        : rank === org.parent_code)
    ) {
      Object.assign(result, {
        [org.code]: getTitleOfOrg_name(org),
      });
    }
  }
}

//조건 : 상위 코드 비교해서 팀이름만 가져오기
export function getOrgWithTeam(orgs, unit, rank, result) {
  for (let org of orgs) {
    getOrgWithTeam(org.children, unit, rank, result);

    if (org.unit === unit && rank === org.parent_code) {
      Object.assign(result, {
        [org.code]: org?.name,
      });
    }
  }
}

//일회성
export function getOrgWithOfficeName(orgs, user_info, result) {
  for (let org of orgs) {
    getOrgWithOfficeName(org.children, user_info, result);

    if (
      user_info?.grade === "담당자" ||
      user_info?.grade === "지점장" ||
      user_info?.grade === "팀장"
        ? user_info?.branch === org?.branch_name
        : user_info?.region === org?.region_name
    ) {
      Object.assign(result, {
        [org.code]: getTitleOfOrg_name(org),
      });
    }
  }
}

//상위 소속 관련 하위 조직
export function getOrgByOfficeNameWithUnit(orgs, select, unit, result) {
  for (let org of orgs) {
    getOrgByOfficeNameWithUnit(org.children, select, unit, result);
    if (select === org?.region_name && unit === org?.unit) {
      Object.assign(result, {
        [org.code]: getTitleOfStartBranchOrg_name(org),
      });
    }
  }
}

//조건 : 검색 시 해당 이름이 포함되는지
export function getOrgWithName(orgs, search, result) {
  for (let org of orgs) {
    getOrgWithName(org.children, search, result);
    if (org.name?.includes(search)) {
      Object.assign(result, {
        [org.code]: getTitleOfOrg_name(org),
      });
    }
  }
}

//조건 : 검색 시 해당 이름이 포함되는지 + 카운트까지
export function getOrgWithNameGetCount(orgs, search, result) {
  for (let org of orgs) {
    getOrgWithNameGetCount(org.children, search, result);
    if (org.name?.includes(search)) {
      Object.assign(result, {
        code: org.code,
        title: getTitleOfOrg_name(org),
        name: org.name,
      });
    }
  }
}
