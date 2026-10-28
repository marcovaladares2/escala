(() => {
const engine1 = typeof require === "function" ? require("./schedule-engine.js") : window;
const engine2 = typeof require === "function" ? require("./schedule-engine-v2.js") : window;
const SCHEDULE_IDS = Object.freeze({ SCHEDULE1: "schedule1", SCHEDULE2: "schedule2" });
function normalizeScheduleId(scheduleId) { return scheduleId === SCHEDULE_IDS.SCHEDULE2 ? SCHEDULE_IDS.SCHEDULE2 : SCHEDULE_IDS.SCHEDULE1; }
function getScheduleOfficialForResident(scheduleId, residentId, date) { return normalizeScheduleId(scheduleId) === SCHEDULE_IDS.SCHEDULE2 ? engine2.getOfficialScheduleForResidentV2(residentId, date) : engine1.getOfficialScheduleForResident(residentId, date); }
function getScheduleOfficialForDate(scheduleId, date) { return normalizeScheduleId(scheduleId) === SCHEDULE_IDS.SCHEDULE2 ? engine2.getOfficialScheduleForDateV2(date) : engine1.getOfficialScheduleForDate(date); }
const exported = { SCHEDULE_IDS, normalizeScheduleId, getScheduleOfficialForResident, getScheduleOfficialForDate };
if (typeof module !== "undefined") module.exports = exported;
if (typeof window !== "undefined") Object.assign(window, exported);
})();
