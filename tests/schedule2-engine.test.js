const assert = require("assert");
const { getOfficialScheduleForResidentV2 } = require("../js/core/schedule-engine-v2.js");
let passed = 0;
function check(name, resident, date, letter, activities) { const value = getOfficialScheduleForResidentV2(resident, date); assert.equal(value.standardWeekKey, letter); if (activities) assert.deepEqual(value.activities.map((item) => `${item.title}|${item.startTime}|${item.endTime}`), activities); passed += 1; console.log(`PASS ${name}`); }
check("Marco 02/11", "marco", "2026-11-02", "R2-D", ["Livre|null|null", "Nath Neuro CEM|13:30|17:00", "Dani Neuro - HUNA|18:00|22:00"]);
check("Marco 08/11", "marco", "2026-11-08", "R2-D"); check("Marco 09/11", "marco", "2026-11-09", "R2-E", ["Pronto Socorro|07:00|19:00"]);
check("Marco 16/11", "marco", "2026-11-16", "R2-A", ["Maternidade|07:00|19:00"]); check("Marco 23/11", "marco", "2026-11-23", "R2-B"); check("Marco 30/11", "marco", "2026-11-30", "R2-C", ["Enfermaria|07:00|15:00"]); check("Marco ciclo", "marco", "2026-12-07", "R2-D");
check("Monyk A", "monyk", "2026-11-02", "R1-A"); check("Monyk B", "monyk", "2026-11-09", "R1-B"); check("Monyk C", "monyk", "2026-11-16", "R1-C"); check("Anne E", "anne", "2026-11-02", "R2-E"); check("Anne A", "anne", "2026-11-09", "R2-A");
check("Marco terça D", "marco", "2026-11-03", "R2-D", ["Andressa - HUNA|07:30|11:00", "Ambulatório conforme escala|13:30|17:00", "Aula Teórica|17:00|22:00"]); check("Marco terça E", "marco", "2026-11-10", "R2-E", ["Pronto Socorro|07:00|17:00", "Aula Teórica|17:00|22:00"]);
check("R1-A terça", "monyk", "2026-11-03", "R1-A", ["Enfermaria|07:00|11:00", "Ambulatório|13:30|17:00", "Aula Teórica|17:00|22:00"]); check("R2-C quarta", "marco", "2026-12-02", "R2-C", ["Enfermaria|07:00|15:00", "Ambulatório Assiole CEM|18:00|22:00"]); console.log(`${passed} passed, 0 failed`);
