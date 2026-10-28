(() => {
const weeks = typeof require === "function" ? require("../data/standard-weeks-v2.js") : window;
const residents = typeof require === "function" ? require("../data/residents.js") : window;
const dates = typeof require === "function" ? require("./dates.js") : window;
const rotation = typeof require === "function" ? require("./rotation-v2.js") : window;
const { STANDARD_WEEKS_V2, WEEK_NAMES_V2 } = weeks; const { RESIDENTS } = residents; const { getWeekdayKey, WEEKDAY_LABELS } = dates;
const { OUT_OF_SCHEDULE2_RANGE, getSchedule2Period, getRotationBlockV2, getResidentLetterV2, getStandardWeekKeyV2 } = rotation;
function getOfficialScheduleForResidentV2(residentId, date) {
  const period = getSchedule2Period(date); if (!period) return { status: OUT_OF_SCHEDULE2_RANGE, date };
  const resident = RESIDENTS.find((item) => item.id === residentId); if (!resident) throw new RangeError(`Residente não encontrado: ${residentId}`);
  const letter = getResidentLetterV2(residentId, date, period); const weekday = getWeekdayKey(date);
  return { status: "OK", date, resident: { ...resident }, level: resident.level, letter, weekName: WEEK_NAMES_V2[resident.level][letter], standardWeekKey: getStandardWeekKeyV2(residentId, date), rotationBlock: getRotationBlockV2(date, period), weekday, weekdayLabel: WEEKDAY_LABELS[weekday], activities: STANDARD_WEEKS_V2[resident.level][letter][weekday].map((item) => ({ ...item })) };
}
function getOfficialScheduleForDateV2(date) {
  const period = getSchedule2Period(date); if (!period) return { status: OUT_OF_SCHEDULE2_RANGE, date, schedules: [] };
  return { status: "OK", date, rotationBlock: getRotationBlockV2(date, period), schedules: RESIDENTS.map((resident) => getOfficialScheduleForResidentV2(resident.id, date)) };
}
const exported = { getOfficialScheduleForResidentV2, getOfficialScheduleForDateV2 };
if (typeof module !== "undefined") module.exports = exported;
if (typeof window !== "undefined") Object.assign(window, exported);
})();
