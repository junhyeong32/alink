export function getReplaceMonth() {
  var d = new Date();
  var lastDayofLastMonth = new Date(d.getYear(), d.getMonth(), 0).getDate();
  if (d.getDate() > lastDayofLastMonth) {
    d.setDate(lastDayofLastMonth);
  }
  var month = d.getMonth() - 1;
  return new Date(d.setMonth(month));
}

export function getWeek() {
  var now = new Date();
  var nowDayOfWeek = now.getDay();
  var nowDay = now.getDate();
  var nowMonth = now.getMonth();
  var nowYear = now.getYear();
  nowYear += nowYear < 2000 ? 1900 : 0;
  var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
  var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));

  return { weekStartDate, weekEndDate };
}
