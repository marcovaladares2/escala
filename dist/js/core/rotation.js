(() => {
const dateUtilities = typeof require === "function" ? require("./dates.js") : window;
const periodData = typeof require === "function" ? require("../data/schedule-periods.js") : window;
const residentData = typeof require === "function" ? require("../data/residents.js") : window;

const { differenceInCivilDays, compareCivilDates } = dateUtilities;
const { SCHEDULE_PERIODS } = periodData;
const { RESIDENTS } = residentData;

const OUT_OF_SCHEDULE_RANGE = "OUT_OF_SCHEDULE_RANGE";

function getSchedulePeriod(date, periods = SCHEDULE_PERIODS) {
  return periods.find((period) =>
    compareCivilDates(period.startsOn, date) <= 0 && compareCivilDates(date, period.endsOn) <= 0
  ) || null;
}

function getRotationBlock(date, period = getSchedulePeriod(date)) {
  if (!period) return null;
  return Math.floor(differenceInCivilDays(period.startsOn, date) / period.rotationDays);
}

function getResidentById(residentId, residents = RESIDENTS) {
  return residents.find((resident) => resident.id === residentId) || null;
}

function getResidentLetter(residentId, date, options = {}) {
  const period = options.period || getSchedulePeriod(date, options.periods || SCHEDULE_PERIODS);
  if (!period) return OUT_OF_SCHEDULE_RANGE;

  const resident = getResidentById(residentId, options.residents || RESIDENTS);
  if (!resident) throw new RangeError(`Residente não encontrado: ${residentId}`);

  const initialLetter = period.residentInitialWeeks[residentId];
  if (!initialLetter) throw new RangeError(`Letra inicial não cadastrada para: ${residentId}`);

  const initialIndex = period.cycle.indexOf(initialLetter);
  if (initialIndex === -1) throw new RangeError(`Letra inicial inválida para: ${residentId}`);

  const block = getRotationBlock(date, period);
  return period.cycle[(initialIndex + block) % period.cycle.length];
}

function getStandardWeekKey(residentId, date, options = {}) {
  const letter = getResidentLetter(residentId, date, options);
  if (letter === OUT_OF_SCHEDULE_RANGE) return OUT_OF_SCHEDULE_RANGE;

  const resident = getResidentById(residentId, options.residents || RESIDENTS);
  return `${resident.level}-${letter}`;
}

if (typeof module !== "undefined") {
  module.exports = { OUT_OF_SCHEDULE_RANGE, getSchedulePeriod, getRotationBlock, getResidentById, getResidentLetter, getStandardWeekKey };
}
if (typeof window !== "undefined") Object.assign(window, { OUT_OF_SCHEDULE_RANGE, getSchedulePeriod, getRotationBlock, getResidentById, getResidentLetter, getStandardWeekKey });
})();
