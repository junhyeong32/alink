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
