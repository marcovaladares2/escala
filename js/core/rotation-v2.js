(() => {
const dates = typeof require === "function" ? require("./dates.js") : window;
const periods = typeof require === "function" ? require("../data/schedule-periods-v2.js") : window;
const residents = typeof require === "function" ? require("../data/residents.js") : window;
const { differenceInCivilDays, compareCivilDates } = dates;
const { SCHEDULE2_PERIODS } = periods;
const { RESIDENTS } = residents;
const OUT_OF_SCHEDULE2_RANGE = "OUT_OF_SCHEDULE2_RANGE";

function getSchedule2Period(date) {
  return SCHEDULE2_PERIODS.find((period) => compareCivilDates(period.startsOn, date) <= 0 && (!period.endsOn || compareCivilDates(date, period.endsOn) <= 0)) || null;
}
function getRotationBlockV2(date, period = getSchedule2Period(date)) {
  return period ? Math.floor(differenceInCivilDays(period.startsOn, date) / 7) : null;
}
function getResidentLetterV2(residentId, date, period = getSchedule2Period(date)) {
  if (!period) return OUT_OF_SCHEDULE2_RANGE;
  if (!RESIDENTS.some((resident) => resident.id === residentId)) throw new RangeError(`Residente não encontrado: ${residentId}`);
  const initial = period.residentInitialWeeks[residentId];
  if (!initial) throw new RangeError(`Letra inicial não cadastrada para: ${residentId}`);
  const initialIndex = period.cycle.indexOf(initial);
  return period.cycle[(initialIndex + getRotationBlockV2(date, period)) % period.cycle.length];
}
function getStandardWeekKeyV2(residentId, date) {
  const letter = getResidentLetterV2(residentId, date);
  if (letter === OUT_OF_SCHEDULE2_RANGE) return letter;
  const resident = RESIDENTS.find((item) => item.id === residentId);
  return `${resident.level}-${letter}`;
}
const exported = { OUT_OF_SCHEDULE2_RANGE, getSchedule2Period, getRotationBlockV2, getResidentLetterV2, getStandardWeekKeyV2 };
if (typeof module !== "undefined") module.exports = exported;
if (typeof window !== "undefined") Object.assign(window, exported);
})();
