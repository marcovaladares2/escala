const SCHEDULE_PERIODS = [
  {
    id: "pediatria-2026-09-21-a-2027-02-28",
    startsOn: "2026-09-21",
    endsOn: "2027-02-28",
    rotationDays: 14,
    cycle: ["A", "B", "C", "D", "E"],
    residentInitialWeeks: {
      mariana: "A",
      michele: "B",
      monyk: "C",
      "ana-carolina": "D",
      giovana: "E",
      julia: "A",
      andressa: "B",
      marco: "C",
      luisa: "D",
      anne: "E"
    }
  }
];

if (typeof module !== "undefined") module.exports = { SCHEDULE_PERIODS };
if (typeof window !== "undefined") window.SCHEDULE_PERIODS = SCHEDULE_PERIODS;
