import { getTitleOfOrg_name, getTitleOfOrg } from "./getTitleOfOrg";

export function getOrgWithUnit(orgs, unit, result) {
  Object.assign(result, {
    전체: "전체",
  });
  for (let org of orgs) {
    getOrgWithUnit(org.children, unit, result);

    if (org.unit === unit) {
      Object.assign(result, {
        [org.code]: getTitleOfOrg_name(org),
      });
    }
  }
}

export function getOrgHeadOffice(orgs, result) {
  orgs?.map((org) =>
    Object.assign(result, {
      [org.code]: org.name,
    })
  );
}

export function getOrgByParentRank(orgs, unit, rank, result) {
  for (let org of orgs) {
    getOrgByRank(org.children, unit, rank, result);
    console.log("rank", rank, org.parent_code);

    if (org.unit === unit && rank === org.parent_code) {
      Object.assign(result, {
        [org.code]: getTitleOfOrg_name(org),
      });
    }
  }
}

// export function getOrgByParentRank(orgs, unit, rank, result) {
//   for (let org of orgs) {
//     getOrgByRank(org.children, unit, rank, result);
//     console.log("rank", rank, org.parent_code);

//     if (org.unit === unit && rank === org.parent_code) {
//       Object.assign(result, {
//         [org.code]: getTitleOfOrg_name(org),
//       });
//     }
//   }
// }

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
