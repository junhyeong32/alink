export function getReplaceMonth() {
  var d = new Date();
  var lastDayofLastMonth = new Date(d.getYear(), d.getMonth(), 0).getDate();
  if (d.getDate() > lastDayofLastMonth) {
    d.setDate(lastDayofLastMonth);
  }
  var month = d.getMonth() - 1;
  return new Date(d.setMonth(month));
}
