(() => {
const monthlyDates = typeof require === "function" ? require("./dates.js") : window;
const monthlyPersonal = typeof require === "function" ? require("./personal-changes.js") : window;
const { daysInMonth } = monthlyDates;
const { getPersonalScheduleForResident } = monthlyPersonal;

function getPersonalMonthSchedule(residentId, year, month, service) {
  const schedules = [];
  for (let day = 1; day <= daysInMonth(year, month); day += 1) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    schedules.push(getPersonalScheduleForResident(residentId, date, service));
  }
  return schedules;
}

if (typeof module !== "undefined") module.exports = { getPersonalMonthSchedule };
if (typeof window !== "undefined") window.getPersonalMonthSchedule = getPersonalMonthSchedule;
})();
