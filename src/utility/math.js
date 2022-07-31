export function numberFormat(number) {
  if (!number && number !== 0) return;
  var sNumber = typeof number === "string" ? number : number.toString();
  var [top, bottom] = sNumber.split(".");
  var newTop = top.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  return bottom ? `${newTop}.${bottom}` : newTop;
}
