const assert = require("node:assert/strict");
const { createStorageService } = require("../js/storage/local-storage.js");
const { createPersonalChangesService, getPersonalScheduleForResident } = require("../js/core/personal-changes.js");
const { getOfficialScheduleForResident } = require("../js/core/schedule-engine.js");

class MemoryStorage { constructor() { this.data = new Map(); } getItem(key) { return this.data.get(key) ?? null; } setItem(key, value) { this.data.set(key, String(value)); } removeItem(key) { this.data.delete(key); } }
let passed = 0; let failed = 0;
function test(name, fn) { try { fn(); passed += 1; console.log(`PASS ${name}`); } catch (error) { failed += 1; console.error(`FAIL ${name}\n${error.stack}`); } }
const memory = new MemoryStorage(); const service = createPersonalChangesService(createStorageService(memory));
const personal = (date, currentService = service) => getPersonalScheduleForResident("marco", date, currentService);

test("1 — editar persiste sem alterar a Visão Geral oficial", () => {
  service.updateActivity("marco", "2026-10-05", "r2-d-monday-01", { title: "Plantão PS PED" });
  assert.equal(personal("2026-10-05").activities[0].title, "Plantão PS PED");
  assert.equal(getOfficialScheduleForResident("marco", "2026-10-05").activities[0].title, "Pronto Socorro");
  assert.equal(personal("2026-10-05", createPersonalChangesService(createStorageService(memory))).activities[0].title, "Plantão PS PED");
});
test("2 — restaurar atividade remove a edição", () => { service.restoreActivity("marco", "r2-d-monday-01"); assert.equal(personal("2026-10-05").activities[0].title, "Pronto Socorro"); });
test("3 — exclusão pessoal não altera o registro oficial", () => { service.deleteActivity("marco", "2026-10-05", "r2-d-monday-01"); assert.equal(personal("2026-10-05").activities.some((a) => a.id === "r2-d-monday-01"), false); assert.equal(getOfficialScheduleForResident("marco", "2026-10-05").activities[0].title, "Pronto Socorro"); });
test("4 — restaurar dia recupera a escala oficial", () => { service.restoreDate("marco", "2026-10-05"); assert.equal(personal("2026-10-05").activities[0].title, "Pronto Socorro"); });
test("5 — criar atividade pessoal", () => { assert.equal(service.createPersonalActivity("marco", "2026-10-06", { title: "Reunião", startTime: "17:00", endTime: "18:00", location: "HC", preceptor: null }), true); assert.equal(personal("2026-10-06").activities.some((a) => a.title === "Reunião"), true); });
test("6 — mover Reunião para outra data", () => {
  const meeting = personal("2026-10-06").activities.find((a) => a.title === "Reunião"); service.moveActivity("marco", "2026-10-06", "2026-10-07", meeting);
  assert.equal(personal("2026-10-06").activities.some((a) => a.title === "Reunião"), false);
  assert.equal(personal("2026-10-07").activities.some((a) => a.title === "Reunião"), true);
});
test("7 — movimentação persiste após reload", () => { const reloaded = createPersonalChangesService(createStorageService(memory)); assert.equal(personal("2026-10-07", reloaded).activities.some((a) => a.title === "Reunião"), true); });
test("8 — trocar duas atividades entre datas", () => {
  const first = personal("2026-10-05").activities[0]; const second = personal("2026-10-06").activities[0];
  assert.equal(service.swapActivities("marco", "2026-10-05", first, "2026-10-06", second), true);
  assert.equal(personal("2026-10-05").activities.some((a) => a.id === second.id), true);
  assert.equal(personal("2026-10-06").activities.some((a) => a.id === first.id), true);
  const reloaded = createPersonalChangesService(createStorageService(memory)); assert.equal(personal("2026-10-06", reloaded).activities.some((a) => a.id === first.id), true);
});
test("9 — escala oficial continua intacta", () => {
  assert.equal(getOfficialScheduleForResident("marco", "2026-10-05").activities[0].title, "Pronto Socorro");
  assert.equal(getOfficialScheduleForResident("marco", "2026-10-06").activities[0].title, "Enfermaria");
});
console.log(`\n${passed} passed, ${failed} failed`); if (failed) process.exit(1);
