export default function getLastTeam(region, studio, branch, team) {
  if (team) {
    return team;
  } else if (branch) {
    return branch;
  } else if (studio) {
    return studio;
  } else if (region) {
    return region;
  } else {
    return "";
  }
}
