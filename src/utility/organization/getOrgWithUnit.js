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
  Object.assign(result, {
    전체: "전체",
  });
  orgs?.map((org) =>
    Object.assign(result, {
      [org.code]: org.name,
    })
  );
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
      console.log("org", org);
      Object.assign(result, {
        [org.code]: `${getTitleOfOrg_name(org)}/${org?.name} /${
          org?.user_count
        }`,
      });
    }
  }
}
