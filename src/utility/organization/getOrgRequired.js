import { getTitleOfOrg_name } from "./getTitleOfOrg";

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
