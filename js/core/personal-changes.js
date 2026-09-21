(() => {
const changesStorageModule = typeof require === "function" ? require("../storage/local-storage.js") : window;
const personalEngineModule = typeof require === "function" ? require("./schedule-engine.js") : window;
const { getOfficialScheduleForResident } = personalEngineModule;
const ALLOWED_CHANGE_TYPES = new Set(["update", "delete", "create", "move"]);
const ALLOWED_ACTIVITY_FIELDS = new Set(["title", "startTime", "endTime", "location", "preceptor"]);

function createChangeId(prefix = "change") { return typeof crypto !== "undefined" && crypto.randomUUID ? `${prefix}-${crypto.randomUUID()}` : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }
function isValidDate(value) { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value); }
function validateActivity(activity) { return !!(activity && typeof activity === "object" && typeof activity.title === "string" && (!activity.startTime || /^([01]\d|2[0-3]):[0-5]\d$/.test(activity.startTime)) && (!activity.endTime || /^([01]\d|2[0-3]):[0-5]\d$/.test(activity.endTime)) && !(activity.startTime && activity.endTime && activity.startTime >= activity.endTime)); }
function validateChange(change) {
  if (!change || typeof change !== "object" || !ALLOWED_CHANGE_TYPES.has(change.type) || typeof change.id !== "string" || typeof change.residentId !== "string") return false;
  if (change.type === "move") return typeof change.activityId === "string" && isValidDate(change.sourceDate) && isValidDate(change.targetDate) && validateActivity(change.activity);
  if (!isValidDate(change.date)) return false;
  if ((change.type === "update" || change.type === "delete") && typeof change.activityId !== "string") return false;
  if (change.type === "update") return !!change.changes && typeof change.changes === "object";
  return change.type !== "create" || validateActivity(change.activity);
}
function sortActivities(activities) { return [...activities].sort((a, b) => !a.startTime && !b.startTime ? a.title.localeCompare(b.title) : !a.startTime ? 1 : !b.startTime ? -1 : a.startTime.localeCompare(b.startTime)); }

function createPersonalChangesService(storageService) {
  const all = () => storageService.getPersonalChangesDocument().changes.filter(validateChange);
  const save = (change) => { if (!validateChange(change)) return false; const doc = storageService.getPersonalChangesDocument(); return storageService.savePersonalChangesDocument({ version: 1, changes: [...doc.changes.filter((item) => item.id !== change.id), structuredClone(change)] }); };
  const removeWhere = (predicate) => { const doc = storageService.getPersonalChangesDocument(); return storageService.savePersonalChangesDocument({ version: 1, changes: doc.changes.filter((change) => !predicate(change)) }); };
  const service = {
    getPersonalChanges: all,
    getPersonalChangesForResident: (residentId) => all().filter((change) => change.residentId === residentId),
    getPersonalChangesForDate: (residentId, date) => all().filter((change) => change.residentId === residentId && (change.date === date || change.sourceDate === date || change.targetDate === date)),
    savePersonalChange: save,
    removePersonalChange: (changeId) => removeWhere((change) => change.id === changeId),
    clearPersonalChanges: () => storageService.clearPersonalChanges(),
    updateActivity: (residentId, date, activityId, changes) => save({ id: `update-${residentId}-${date}-${activityId}`, residentId, date, activityId, type: "update", changes }),
    deleteActivity: (residentId, date, activityId) => save({ id: `delete-${residentId}-${date}-${activityId}`, residentId, date, activityId, type: "delete" }),
    createPersonalActivity: (residentId, date, activity) => { const id = activity.id || `personal-${createChangeId("activity")}`; return save({ id: `create-${id}`, residentId, date, type: "create", activity: { ...activity, id, source: "personal" } }); },
    moveActivity: (residentId, sourceDate, targetDate, activity) => save({ id: `move-${residentId}-${activity.id}-${sourceDate}-${targetDate}`, residentId, type: "move", activityId: activity.id, sourceDate, targetDate, activity: { ...activity } }),
    restoreActivity: (residentId, activityId) => removeWhere((change) => change.residentId === residentId && (change.activityId === activityId || change.activity?.id === activityId)),
    restoreDate: (residentId, date) => removeWhere((change) => change.residentId === residentId && (change.date === date || change.sourceDate === date || change.targetDate === date))
  };
  service.swapActivities = (residentId, firstDate, firstActivity, secondDate, secondActivity) => service.moveActivity(residentId, firstDate, secondDate, firstActivity) && service.moveActivity(residentId, secondDate, firstDate, secondActivity);
  return service;
}

function applyPersonalChanges(officialSchedule, changes) {
  const result = { ...officialSchedule, resident: officialSchedule.resident ? { ...officialSchedule.resident } : null, activities: officialSchedule.activities.map((activity) => ({ ...activity })) };
  const residentChanges = changes.filter((change) => validateChange(change) && change.residentId === result.resident.id);
  const current = residentChanges.filter((change) => change.date === result.date);
  const sourceMoves = residentChanges.filter((change) => change.type === "move" && change.sourceDate === result.date);
  const targetMoves = residentChanges.filter((change) => change.type === "move" && change.targetDate === result.date);
  for (const change of current.filter((item) => item.type === "update")) result.activities = result.activities.map((activity) => activity.id === change.activityId ? { ...activity, ...Object.fromEntries(Object.entries(change.changes).filter(([field]) => ALLOWED_ACTIVITY_FIELDS.has(field))), personalStatus: "Alterado" } : activity);
  const removed = new Set([...current.filter((item) => item.type === "delete").map((item) => item.activityId), ...sourceMoves.map((item) => item.activityId)]);
  result.activities = result.activities.filter((activity) => !removed.has(activity.id));
  for (const change of current.filter((item) => item.type === "create")) if (!removed.has(change.activity.id)) result.activities.push({ ...change.activity, personalStatus: "Adicionado" });
  for (const change of targetMoves) if (!removed.has(change.activity.id)) result.activities.push({ ...change.activity, personalStatus: "Movido" });
  result.activities = sortActivities(result.activities);
  return result;
}

const personalChangesService = typeof window !== "undefined" && window.localScheduleStorage ? createPersonalChangesService(window.localScheduleStorage) : null;
function getPersonalScheduleForResident(residentId, date, service = personalChangesService) { const official = getOfficialScheduleForResident(residentId, date); return official.status !== "OK" || !service ? official : applyPersonalChanges(official, service.getPersonalChangesForResident(residentId)); }
if (typeof module !== "undefined") module.exports = { validateChange, createChangeId, createPersonalChangesService, applyPersonalChanges, getPersonalScheduleForResident };
if (typeof window !== "undefined") Object.assign(window, { personalChangesService, applyPersonalChanges, getPersonalScheduleForResident, createChangeId });
})();
