const RESIDENTS = [
  { id: "mariana", name: "Mariana", fullName: "Mariana de Paula Ferreira", level: "R1" },
  { id: "michele", name: "Michele", fullName: "Michelle Lorrane Bezerra Hipólito", level: "R1" },
  { id: "monyk", name: "Monyk", fullName: "Monyk Karol Braga Gontijo", level: "R1" },
  { id: "ana-carolina", name: "Ana Carolina", fullName: "Ana Carolina Cândido Canêdo Estevam", level: "R1" },
  { id: "giovana", name: "Giovana", fullName: "Giovana Paula Caetano", level: "R1" },
  { id: "julia", name: "Júlia", fullName: "Julia Rabelo Bitencourt", level: "R2" },
  { id: "andressa", name: "Andressa", fullName: "Andressa Assunção Ferreira Da Silva", level: "R2" },
  { id: "marco", name: "Marco", fullName: "Marco Antonio Marques Valadares Santana", level: "R2" },
  { id: "luisa", name: "Luisa", fullName: "Luisa Canedo Lima", level: "R2" },
  { id: "anne", name: "Anne", fullName: "Anne Cristina Farias Mascarenhas", level: "R2" }
];

if (typeof module !== "undefined") module.exports = { RESIDENTS };
if (typeof window !== "undefined") window.RESIDENTS = RESIDENTS;
