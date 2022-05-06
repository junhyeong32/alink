export default function getDepthOfTeam(region, studio, branch, team) {
  // debugger;
  let result = [];

  if (region) {
    result.push(region);
  }
  if (studio) {
    result.push(studio);
  }
  if (branch) {
    result.push(branch);
  }
  if (team) {
    result.push(team);
  }
  return result.join(" > ");
}
