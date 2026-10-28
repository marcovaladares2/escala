(() => {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const activity = (week, day, index, title, startTime = null, endTime = null, location = null, preceptor = null) => ({ id: `schedule2-${week}-${day}-${index}`, title, startTime, endTime, location, preceptor });
  const rest = (week, day, title = "Descanso semanal") => activity(week, day, 0, title);
  const week = (key, entries) => Object.fromEntries(days.map((day) => [day, entries[day] || []]));
  const a = (key, day, index, title, start, end, location, preceptor) => activity(key, day, index, title, start, end, location, preceptor);

  const WEEK_NAMES_V2 = {
    R1: { A: "Enfermaria/Ambulatório", B: "Maternidade", C: "Ambulatório", D: "Pronto Socorro", E: "Enfermaria/Ambulatório" },
    R2: { A: "Maternidade", B: "Maternidade", C: "Enfermaria", D: "Ambulatório", E: "Pronto Socorro" }
  };
  const STANDARD_WEEKS_V2 = {
    R1: {
      A: week("R1-A", {
        monday: [a("R1-A","monday",0,"Enfermaria","07:00","15:00","HC","Dra Larissa"), a("R1-A","monday",1,"Ambulatório","18:00","22:00","HUNA","Dra Marielly")],
        tuesday: [a("R1-A","tuesday",0,"Enfermaria","07:00","11:00","HC","Dra Larissa"), a("R1-A","tuesday",1,"Ambulatório","13:30","17:00","HUNA","Dra Marielly"), a("R1-A","tuesday",2,"Aula Teórica","17:00","22:00",null,"Dra Lorena")],
        wednesday: [a("R1-A","wednesday",0,"Enfermaria","07:00","15:00","HC","Dra Larissa")],
        thursday: [a("R1-A","thursday",0,"Enfermaria","07:00","11:00","HC","Dra Larissa"), a("R1-A","thursday",1,"Ambulatório","13:30","17:30","PRIM.","Dra Lorena")],
        friday: [a("R1-A","friday",0,"Enfermaria","07:00","15:00","HC","Dra Larissa")], saturday: [rest("R1-A","saturday")], sunday: [a("R1-A","sunday",0,"Maternidade","07:00","19:00","HC","Escala")]
      }),
      B: week("R1-B", {
        monday: [a("R1-B","monday",0,"Maternidade","07:00","19:00","HC","Escala")], tuesday: [a("R1-B","tuesday",0,"Maternidade","07:00","17:00","HC","Escala"), a("R1-B","tuesday",1,"Aula Teórica","17:00","22:00",null,"Dra Lorena")],
        wednesday: [a("R1-B","wednesday",0,"Maternidade","07:00","19:00","HC","Escala")], thursday: [a("R1-B","thursday",0,"Maternidade","07:00","19:00","HC","Escala")], friday: [a("R1-B","friday",0,"Maternidade","07:00","19:00","HC","Escala")], saturday: [rest("R1-B","saturday")], sunday: [rest("R1-B","sunday")]
      }),
      C: week("R1-C", {
        monday: [a("R1-C","monday",0,"Ambulatório","07:30","11:30","HUNA","Dra Renata"), a("R1-C","monday",1,"Ambulatório","13:30","17:30","HUNA","Dra Andressa")],
        tuesday: [a("R1-C","tuesday",0,"Ambulatório","07:30","11:30","HUNA","Dra Andressa"), a("R1-C","tuesday",1,"Ambulatório","13:30","17:00","PRIM.","Dra Andressa"), a("R1-C","tuesday",2,"Aula Teórica","17:00","22:00",null,"Dra Lorena")],
        wednesday: [a("R1-C","wednesday",0,"Ambulatório","07:30","11:30","HUNA","Dra Renata"), a("R1-C","wednesday",1,"Ambulatório","13:30","17:30","HUNA","Dra Lídia")], thursday: [a("R1-C","thursday",0,"Ambulatório","07:30","11:30","HUNA","Dra Lídia"), a("R1-C","thursday",1,"Ambulatório","13:30","17:30","HUNA","Dra Mariana")], friday: [a("R1-C","friday",0,"Ambulatório","07:30","11:30","HUNA","Dra Andressa"), a("R1-C","friday",1,"Ambulatório","13:30","17:30","HUNA","Dra Mariana")], saturday: [a("R1-C","saturday",0,"Maternidade","07:00","13:00","HC","Escala")], sunday: [a("R1-C","sunday",0,"Maternidade","07:00","13:00","HC","Escala")]
      }),
      D: week("R1-D", { monday:[a("R1-D","monday",0,"Pronto Socorro","07:00","19:00","HC","Escala")], tuesday:[a("R1-D","tuesday",0,"Pronto Socorro","07:00","17:00","HC","Escala"),a("R1-D","tuesday",1,"Aula Teórica","17:00","22:00",null,"Dra Lorena")], wednesday:[a("R1-D","wednesday",0,"Pronto Socorro","07:00","19:00","HC","Escala")], thursday:[a("R1-D","thursday",0,"Pronto Socorro","07:00","19:00","HC","Escala")], friday:[a("R1-D","friday",0,"Pronto Socorro","07:00","19:00","HC","Escala")], saturday:[rest("R1-D","saturday")], sunday:[rest("R1-D","sunday")] }),
      E: week("R1-E", { monday:[a("R1-E","monday",0,"Enfermaria","07:00","11:00","HC","Dra Larissa"),a("R1-E","monday",1,"Ambulatório","13:30","17:30","HUNA","Dra Lorena")], tuesday:[a("R1-E","tuesday",0,"Enfermaria","07:00","15:00","HC","Dra Larissa"),a("R1-E","tuesday",1,"Aula Teórica","17:00","22:00",null,"Dra Lorena")], wednesday:[a("R1-E","wednesday",0,"Enfermaria","07:00","11:00","HC","Dra Larissa"),a("R1-E","wednesday",1,"Ambulatório","13:30","17:30","HUNA","Dra Lídia")], thursday:[a("R1-E","thursday",0,"Enfermaria","07:00","15:00","HC","Dra Larissa")], friday:[a("R1-E","friday",0,"Enfermaria","07:00","11:00","HC","Dra Larissa"),a("R1-E","friday",1,"Ambulatório","13:30","17:30","HUNA","Dra Nathalia")], saturday:[a("R1-E","saturday",0,"Maternidade","07:00","19:00","HC","Escala")], sunday:[rest("R1-E","sunday")] })
    },
    R2: {
      A: week("R2-A", { monday:[a("R2-A","monday",0,"Maternidade","07:00","19:00")], tuesday:[a("R2-A","tuesday",0,"Maternidade","07:00","17:00"),a("R2-A","tuesday",1,"Aula Teórica","17:00","22:00")], wednesday:[a("R2-A","wednesday",0,"Maternidade","07:00","19:00")], thursday:[a("R2-A","thursday",0,"Maternidade","07:00","19:00")], friday:[a("R2-A","friday",0,"Maternidade","07:00","19:00")], saturday:[rest("R2-A","saturday","Folga")], sunday:[rest("R2-A","sunday","Folga")] }),
      B: week("R2-B", { monday:[a("R2-B","monday",0,"Maternidade","07:00","19:00")], tuesday:[a("R2-B","tuesday",0,"Maternidade","07:00","17:00"),a("R2-B","tuesday",1,"Aula Teórica","17:00","22:00")], wednesday:[a("R2-B","wednesday",0,"Maternidade","07:00","19:00")], thursday:[a("R2-B","thursday",0,"Maternidade","07:00","19:00")], friday:[a("R2-B","friday",0,"Maternidade","07:00","19:00")], saturday:[rest("R2-B","saturday","Folga")], sunday:[rest("R2-B","sunday","Folga")] }),
      C: week("R2-C", { monday:[a("R2-C","monday",0,"Enfermaria","07:00","15:00")], tuesday:[a("R2-C","tuesday",0,"Enfermaria","07:00","15:00"),a("R2-C","tuesday",1,"Aula Teórica","17:00","22:00")], wednesday:[a("R2-C","wednesday",0,"Enfermaria","07:00","15:00"),a("R2-C","wednesday",1,"Ambulatório Assiole CEM","18:00","22:00")], thursday:[a("R2-C","thursday",0,"Enfermaria","07:00","15:00")], friday:[a("R2-C","friday",0,"Enfermaria","07:00","15:00")], saturday:[a("R2-C","saturday",0,"Enfermaria","07:00","12:00")], sunday:[a("R2-C","sunday",0,"Enfermaria","07:00","12:00")] }),
      D: week("R2-D", { monday:[a("R2-D","monday",0,"Livre"),a("R2-D","monday",1,"Nath Neuro CEM","13:30","17:00"),a("R2-D","monday",2,"Dani Neuro - HUNA","18:00","22:00")], tuesday:[a("R2-D","tuesday",0,"Andressa - HUNA","07:30","11:00"),a("R2-D","tuesday",1,"Ambulatório conforme escala","13:30","17:00"),a("R2-D","tuesday",2,"Aula Teórica","17:00","22:00")], wednesday:[a("R2-D","wednesday",0,"Renata","07:30","11:00"),a("R2-D","wednesday",1,"Dayane Reumato","13:30","17:00"),a("R2-D","wednesday",2,"Lidia","18:00","22:00")], thursday:[a("R2-D","thursday",0,"Laura DermatoPed CEM","07:30","11:00"),a("R2-D","thursday",1,"Ambulatório conforme escala","13:30","17:00"),a("R2-D","thursday",2,"Daniele ou Mariana","18:00","22:00")], friday:[a("R2-D","friday",0,"Ambulatório conforme escala","07:30","11:00"),a("R2-D","friday",1,"Mariana ou Nathalia","13:30","17:00"),a("R2-D","friday",2,"Nathalia","18:00","22:00")], saturday:[rest("R2-D","saturday","Folga")], sunday:[rest("R2-D","sunday","Folga")] }),
      E: week("R2-E", { monday:[a("R2-E","monday",0,"Pronto Socorro","07:00","19:00")], tuesday:[a("R2-E","tuesday",0,"Pronto Socorro","07:00","17:00"),a("R2-E","tuesday",1,"Aula Teórica","17:00","22:00")], wednesday:[a("R2-E","wednesday",0,"Pronto Socorro","07:00","19:00")], thursday:[a("R2-E","thursday",0,"Pronto Socorro","07:00","19:00")], friday:[a("R2-E","friday",0,"Pronto Socorro","07:00","19:00")], saturday:[rest("R2-E","saturday","Folga")], sunday:[rest("R2-E","sunday","Folga")] })
    }
  };
  if (typeof module !== "undefined") module.exports = { STANDARD_WEEKS_V2, WEEK_NAMES_V2 };
  if (typeof window !== "undefined") Object.assign(window, { STANDARD_WEEKS_V2, WEEK_NAMES_V2 });
})();
