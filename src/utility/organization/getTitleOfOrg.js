export function getTitleOfOrg_name(org) {
  let str = "";

  if (org.region_name) str += org.region_name;
  if (org.branch_name) str += ">" + org.branch_name;
  if (org.team_name) str += ">" + org.team_name;

  return str;
}

export function getTitleOfOrg(org) {
  let str = "";

  if (org.region) str += org.region;
  if (org.branch) str += ">" + org.branch;
  if (org.team) str += ">" + org.team;

  return str;
}
