(() => {
const weeksData = typeof require === "function" ? require("../data/standard-weeks.js") : window;
const residentsData = typeof require === "function" ? require("../data/residents.js") : window;
const datesData = typeof require === "function" ? require("./dates.js") : window;
const rotationData = typeof require === "function" ? require("./rotation.js") : window;

const { STANDARD_WEEKS } = weeksData;
const { RESIDENTS } = residentsData;
const { getWeekdayKey, WEEKDAY_LABELS } = datesData;
const { OUT_OF_SCHEDULE_RANGE, getSchedulePeriod, getRotationBlock, getResidentById, getResidentLetter, getStandardWeekKey } = rotationData;

function cloneActivities(activities) {
  return activities.map((activity) => ({ ...activity }));
}

function getOfficialScheduleForResident(residentId, date) {
  const period = getSchedulePeriod(date);
  if (!period) return { status: OUT_OF_SCHEDULE_RANGE, date };

  const resident = getResidentById(residentId);
  if (!resident) throw new RangeError(`Residente não encontrado: ${residentId}`);

  const letter = getResidentLetter(residentId, date, { period });
  const weekday = getWeekdayKey(date);
  const activities = STANDARD_WEEKS[resident.level][letter][weekday];

  return {
    status: "OK",
    date,
    resident: { ...resident },
    level: resident.level,
    letter,
    standardWeekKey: getStandardWeekKey(residentId, date, { period }),
    rotationBlock: getRotationBlock(date, period),
    weekday,
    weekdayLabel: WEEKDAY_LABELS[weekday],
    activities: cloneActivities(activities)
  };
}

function getOfficialScheduleForDate(date) {
  const period = getSchedulePeriod(date);
  if (!period) return { status: OUT_OF_SCHEDULE_RANGE, date, schedules: [] };

  return {
    status: "OK",
    date,
    rotationBlock: getRotationBlock(date, period),
    schedules: RESIDENTS.map((resident) => getOfficialScheduleForResident(resident.id, date))
  };
}

if (typeof module !== "undefined") {
  module.exports = { getOfficialScheduleForResident, getOfficialScheduleForDate };
}
if (typeof window !== "undefined") Object.assign(window, { getOfficialScheduleForResident, getOfficialScheduleForDate });
})();
