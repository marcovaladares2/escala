const SCHEDULE2_PERIODS = [{
  id: "pediatria-2026-11-02-semanal",
  startsOn: "2026-11-02",
  endsOn: null,
  rotationDays: 7,
  cycle: ["A", "B", "C", "D", "E"],
  residentInitialWeeks: {
    mariana: "D", michele: "E", monyk: "A", "ana-carolina": "B", giovana: "C",
    marco: "D", anne: "E", julia: "C", luisa: "A", andressa: "B"
  }
}];

if (typeof module !== "undefined") module.exports = { SCHEDULE2_PERIODS };
if (typeof window !== "undefined") window.SCHEDULE2_PERIODS = SCHEDULE2_PERIODS;
