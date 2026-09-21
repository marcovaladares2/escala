const assert = require("node:assert/strict");
const { RESIDENTS } = require("../js/data/residents.js");
const { STORAGE_KEYS, createStorageService } = require("../js/storage/local-storage.js");
const { createPersonalChangesService, applyPersonalChanges } = require("../js/core/personal-changes.js");
const { getOfficialScheduleForResident } = require("../js/core/schedule-engine.js");

class MemoryStorage {
  constructor() { this.values = new Map(); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

let passed = 0;
let failed = 0;
function test(name, callback) { try { callback(); passed += 1; console.log(`PASS ${name}`); } catch (error) { failed += 1; console.error(`FAIL ${name}\n${error.stack}`); } }

const memory = new MemoryStorage();
const storage = createStorageService(memory);
const changes = createPersonalChangesService(storage);

test("1 — primeira visita não seleciona residente", () => assert.equal(storage.getSelectedResidentId(RESIDENTS), null));
test("2 — selecionar Marco salva marco", () => { assert.equal(storage.saveSelectedResidentId("marco", RESIDENTS), true); assert.equal(memory.getItem(STORAGE_KEYS.selectedResident), "marco"); });
test("3 — recarregar preserva Marco", () => assert.equal(createStorageService(memory).getSelectedResidentId(RESIDENTS), "marco"));
test("4 — trocar Marco por Júlia atualiza o perfil", () => { storage.saveSelectedResidentId("julia", RESIDENTS); assert.equal(storage.getSelectedResidentId(RESIDENTS), "julia"); });
test("5 — residente inválido é removido com segurança", () => { memory.setItem(STORAGE_KEYS.selectedResident, "inexistente"); assert.equal(storage.getSelectedResidentId(RESIDENTS), null); assert.equal(memory.getItem(STORAGE_KEYS.selectedResident), null); });
test("6 — JSON corrompido de alterações não quebra", () => { memory.setItem(STORAGE_KEYS.personalChanges, "{corrompido"); assert.deepEqual(changes.getPersonalChanges(), []); assert.equal(memory.getItem(STORAGE_KEYS.personalChanges), null); });
test("7 — alteração pessoal persiste após recarregar", () => {
  const change = { id: "test-marco-2026-10-05-update", residentId: "marco", date: "2026-10-05", activityId: "r2-d-monday-01", type: "update", changes: { title: "Plantão PS PED" } };
  assert.equal(changes.savePersonalChange(change), true);
  const reloadedChanges = createPersonalChangesService(createStorageService(memory));
  assert.deepEqual(reloadedChanges.getPersonalChangesForDate("marco", "2026-10-05"), [change]);
});
test("8 — limpar alterações remove todos os overrides", () => { assert.equal(changes.clearPersonalChanges(), true); assert.deepEqual(changes.getPersonalChanges(), []); });
test("9 — escala oficial permanece imutável após aplicar patch", () => {
  const official = getOfficialScheduleForResident("marco", "2026-10-05");
  const snapshot = structuredClone(official);
  const personal = applyPersonalChanges(official, [{ id: "test-update", residentId: "marco", date: "2026-10-05", activityId: "r2-d-monday-01", type: "update", changes: { title: "Plantão pessoal" } }]);
  assert.equal(personal.activities[0].title, "Plantão pessoal");
  assert.deepEqual(official, snapshot);
  assert.equal(official.activities[0].title, "Pronto Socorro");
});
test("10 — backup exporta, limpa e restaura dados pessoais", () => {
  const backupStorage = new MemoryStorage(); const backupService = createStorageService(backupStorage); const changesService = createPersonalChangesService(backupService);
  backupService.saveSelectedResidentId("marco", RESIDENTS); changesService.updateActivity("marco", "2026-10-05", "r2-d-monday-01", { title: "Plantão PS PED" });
  const backup = backupService.exportBackup(RESIDENTS); changesService.clearPersonalChanges(); assert.deepEqual(changesService.getPersonalChanges(), []);
  assert.equal(backupService.importBackup(backup, RESIDENTS).ok, true); assert.equal(createPersonalChangesService(backupService).getPersonalChanges().length, 1); assert.equal(backupService.getSelectedResidentId(RESIDENTS), "marco");
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
