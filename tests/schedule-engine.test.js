const assert = require("node:assert/strict");
const { OUT_OF_SCHEDULE_RANGE, getRotationBlock, getResidentLetter, getStandardWeekKey } = require("../js/core/rotation.js");
const { getOfficialScheduleForResident, getOfficialScheduleForDate } = require("../js/core/schedule-engine.js");

let passed = 0;
let failed = 0;

function test(name, callback) {
  try {
    callback();
    passed += 1;
    console.log(`PASS ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}\n${error.stack}`);
  }
}

function expectActivity(activity, expected) {
  assert.deepEqual(activity, expected);
}

test("1 — Marco em 24/09/2026", () => {
  const schedule = getOfficialScheduleForResident("marco", "2026-09-24");
  assert.equal(schedule.level, "R2");
  assert.equal(schedule.letter, "C");
  assert.equal(schedule.weekdayLabel, "quinta-feira");
  expectActivity(schedule.activities[0], { id: "r2-c-thursday-01", title: "Maternidade", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Nathália / Andressa" });
});

test("2 — Mariana em 02/10/2026", () => {
  const schedule = getOfficialScheduleForResident("mariana", "2026-10-02");
  assert.equal(schedule.level, "R1");
  assert.equal(schedule.letter, "A");
  assert.equal(schedule.weekdayLabel, "sexta-feira");
  expectActivity(schedule.activities[0], { id: "r1-a-friday-01", title: "Plantão Urgência", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dr. Paulo / Danielle" });
});

test("3 — Marco em 05/10/2026", () => {
  const schedule = getOfficialScheduleForResident("marco", "2026-10-05");
  assert.equal(schedule.level, "R2");
  assert.equal(schedule.letter, "D");
  assert.equal(schedule.weekdayLabel, "segunda-feira");
  expectActivity(schedule.activities[0], { id: "r2-d-monday-01", title: "Pronto Socorro", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Assiole / Dra Marielly" });
});

test("4 — Michele em 05/10/2026", () => {
  const schedule = getOfficialScheduleForResident("michele", "2026-10-05");
  assert.equal(schedule.level, "R1");
  assert.equal(schedule.letter, "C");
  assert.equal(schedule.weekdayLabel, "segunda-feira");
  assert.equal(schedule.activities.length, 2);
  expectActivity(schedule.activities[0], { id: "r1-c-monday-01", title: "Ambulatório", startTime: "07:30", endTime: "11:30", location: "HUNA", preceptor: "Dra Renata" });
  expectActivity(schedule.activities[1], { id: "r1-c-monday-02", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Lorena" });
});

test("5 — Luisa em 14/10/2026", () => {
  const schedule = getOfficialScheduleForResident("luisa", "2026-10-14");
  assert.equal(schedule.level, "R2");
  assert.equal(schedule.letter, "E");
  assert.equal(schedule.weekdayLabel, "quarta-feira");
  expectActivity(schedule.activities[0], { id: "r2-e-wednesday-01", title: "Pronto Socorro", startTime: "07:00", endTime: "19:00", location: "HUNA", preceptor: "Dra Marielly" });
});

test("6 — Marco em 19/10/2026", () => {
  const schedule = getOfficialScheduleForResident("marco", "2026-10-19");
  assert.equal(schedule.level, "R2");
  assert.equal(schedule.letter, "E");
  assert.equal(schedule.weekdayLabel, "segunda-feira");
  assert.equal(schedule.activities[0].title, "Descanso semanal");
});

test("7 — Júlia em 19/10/2026", () => {
  const schedule = getOfficialScheduleForResident("julia", "2026-10-19");
  assert.equal(schedule.level, "R2");
  assert.equal(schedule.letter, "C");
  assert.equal(schedule.weekdayLabel, "segunda-feira");
  assert.equal(schedule.activities.length, 2);
  expectActivity(schedule.activities[0], { id: "r2-c-monday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" });
  expectActivity(schedule.activities[1], { id: "r2-c-monday-02", title: "Amb. neuro", startTime: "13:30", endTime: "17:30", location: "CEM", preceptor: "Dra Natalia" });
});

test("limite — 20/09/2026 está fora", () => assert.equal(getOfficialScheduleForResident("marco", "2026-09-20").status, OUT_OF_SCHEDULE_RANGE));
test("limite — 21/09/2026 é o primeiro dia e bloco zero", () => { assert.equal(getRotationBlock("2026-09-21"), 0); assert.equal(getResidentLetter("marco", "2026-09-21"), "C"); });
test("limite — 04/10/2026 ainda é bloco zero", () => assert.equal(getRotationBlock("2026-10-04"), 0));
test("limite — 05/10/2026 inicia bloco um", () => assert.equal(getRotationBlock("2026-10-05"), 1));
test("limite — 18/10/2026 ainda é bloco um", () => assert.equal(getRotationBlock("2026-10-18"), 1));
test("limite — 19/10/2026 inicia bloco dois", () => assert.equal(getRotationBlock("2026-10-19"), 2));
test("limite — 28/02/2027 é válido", () => assert.equal(getOfficialScheduleForResident("marco", "2027-02-28").status, "OK"));
test("limite — 01/03/2027 está fora", () => assert.equal(getOfficialScheduleForResident("marco", "2027-03-01").status, OUT_OF_SCHEDULE_RANGE));
test("consulta diária retorna os dez residentes", () => {
  const result = getOfficialScheduleForDate("2026-10-05");
  assert.equal(result.status, "OK");
  assert.equal(result.schedules.length, 10);
  assert.equal(getStandardWeekKey("marco", "2026-09-24"), "R2-C");
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
