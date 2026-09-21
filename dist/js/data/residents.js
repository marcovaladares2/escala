const RESIDENTS = [
  { id: "mariana", name: "Mariana", level: "R1" },
  { id: "michele", name: "Michele", level: "R1" },
  { id: "monyk", name: "Monyk", level: "R1" },
  { id: "ana-carolina", name: "Ana Carolina", level: "R1" },
  { id: "giovana", name: "Giovana", level: "R1" },
  { id: "julia", name: "Júlia", level: "R2" },
  { id: "andressa", name: "Andressa", level: "R2" },
  { id: "marco", name: "Marco", level: "R2" },
  { id: "luisa", name: "Luisa", level: "R2" },
  { id: "anne", name: "Anne", level: "R2" }
];

if (typeof module !== "undefined") module.exports = { RESIDENTS };
if (typeof window !== "undefined") window.RESIDENTS = RESIDENTS;
