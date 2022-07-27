export function getTitleOfOrg(org) {
  let str = "";

  if (org.region_name) str += org.region;
  if (org.branch_name) str += ">" + org.branch;
  if (org.team_name) str += ">" + org.team;

  return str;
}
