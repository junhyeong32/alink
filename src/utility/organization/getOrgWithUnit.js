import { getTitleOfOrg } from "./getTitleOfOrg";
const str = getTitleOfOrg(text);
export function getOrgWithUnit(orgs, unit, result) {
  str(org.children);
  for (let org of orgs) {
    getOrgWithUnit(org.children, unit, result);

    if (org.unit === unit) {
      Object.assign(result, {
        [org.code]: str,
      });
    }
  }
}
