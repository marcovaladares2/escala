(() => {
const WEEKDAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const WEEKDAY_LABELS = {
  monday: "segunda-feira",
  tuesday: "terça-feira",
  wednesday: "quarta-feira",
  thursday: "quinta-feira",
  friday: "sexta-feira",
  saturday: "sábado",
  sunday: "domingo"
};

function parseCivilDate(value) {
  if (typeof value !== "string") throw new TypeError("A data deve usar o formato YYYY-MM-DD.");
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new RangeError("Data inválida. Use YYYY-MM-DD.");

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) {
    throw new RangeError("Data de calendário inválida.");
  }
  return { year, month, day, iso: value };
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(year, month) {
  const lengths = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return lengths[month - 1];
}

// Número ordinal de um dia civil no calendário gregoriano, sem Date/UTC/fuso horário.
function civilDateToOrdinal(value) {
  const { year, month, day } = typeof value === "string" ? parseCivilDate(value) : value;
  const adjustedYear = month <= 2 ? year - 1 : year;
  const era = Math.floor(adjustedYear / 400);
  const yearOfEra = adjustedYear - era * 400;
  const monthOffset = month > 2 ? -3 : 9;
  const dayOfYear = Math.floor((153 * (month + monthOffset) + 2) / 5) + day - 1;
  const dayOfEra = yearOfEra * 365 + Math.floor(yearOfEra / 4) - Math.floor(yearOfEra / 100) + dayOfYear;
  return era * 146097 + dayOfEra;
}

function differenceInCivilDays(startDate, endDate) {
  return civilDateToOrdinal(endDate) - civilDateToOrdinal(startDate);
}

function compareCivilDates(firstDate, secondDate) {
  const difference = differenceInCivilDays(secondDate, firstDate);
  return Math.sign(difference);
}

function getWeekdayKey(date) {
  // 2026-09-21 é segunda-feira; usar esta âncora evita construir Date em UTC.
  const offset = differenceInCivilDays("2026-09-21", date);
  return WEEKDAY_KEYS[((offset % 7) + 7) % 7];
}

if (typeof module !== "undefined") {
  module.exports = { WEEKDAY_KEYS, WEEKDAY_LABELS, parseCivilDate, isLeapYear, daysInMonth, civilDateToOrdinal, differenceInCivilDays, compareCivilDates, getWeekdayKey };
}
if (typeof window !== "undefined") Object.assign(window, { WEEKDAY_KEYS, WEEKDAY_LABELS, parseCivilDate, isLeapYear, daysInMonth, civilDateToOrdinal, differenceInCivilDays, compareCivilDates, getWeekdayKey });
})();
