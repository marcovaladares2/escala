/*
 * Fonte oficial das semanas-padrão de Pediatria.
 * Os valores deste arquivo não devem ser alterados por preferências pessoais.
 */

const STANDARD_WEEKS = {
  R1: {
    A: {
      monday: [
        { id: "r1-a-monday-01", title: "Ambulatório", startTime: "07:30", endTime: "10:30", location: "HUNA", preceptor: "Dra Renata" },
        { id: "r1-a-monday-02", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Andressa" }
      ],
      tuesday: [
        { id: "r1-a-tuesday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" },
        { id: "r1-a-tuesday-02", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Marielly" },
        { id: "r1-a-tuesday-03", title: "Aula teórica", startTime: "18:00", endTime: "22:00", location: null, preceptor: "Dra Lorena" }
      ],
      wednesday: [
        { id: "r1-a-wednesday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" },
        { id: "r1-a-wednesday-02", title: "Enfermaria", startTime: "13:00", endTime: "17:00", location: "HC", preceptor: "Dra Andressa" }
      ],
      thursday: [
        { id: "r1-a-thursday-01", title: "Amb. Geral", startTime: "07:30", endTime: "11:30", location: "HUNA", preceptor: "Dra Lidia" },
        { id: "r1-a-thursday-02", title: "PSF Primavera", startTime: "13:30", endTime: "17:30", location: null, preceptor: "Dra Lorena" }
      ],
      friday: [
        { id: "r1-a-friday-01", title: "Plantão Urgência", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dr. Paulo / Danielle" }
      ],
      saturday: [
        { id: "r1-a-saturday-01", title: "Maternidade", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Escala" }
      ],
      sunday: [{ id: "r1-a-sunday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }]
    },
    B: {
      monday: [{ id: "r1-b-monday-01", title: "Plantão Urgência", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Assiole / Marielly" }],
      tuesday: [
        { id: "r1-b-tuesday-01", title: "Amb. Geral", startTime: "07:30", endTime: "11:30", location: "HUNA", preceptor: "Dra Andressa" },
        { id: "r1-b-tuesday-02", title: "PSF São Sebastião", startTime: "13:00", endTime: "17:00", location: null, preceptor: "Dra Mariana" },
        { id: "r1-b-tuesday-03", title: "Aula teórica", startTime: "18:00", endTime: "22:00", location: null, preceptor: "Dra Lorena" }
      ],
      wednesday: [{ id: "r1-b-wednesday-01", title: "Maternidade", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Assiole / Lorena" }],
      thursday: [
        { id: "r1-b-thursday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" },
        { id: "r1-b-thursday-02", title: "Enfermaria", startTime: "13:00", endTime: "17:00", location: "HC", preceptor: "Escala" }
      ],
      friday: [
        { id: "r1-b-friday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Assiole" },
        { id: "r1-b-friday-02", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Mariana" }
      ],
      saturday: [{ id: "r1-b-saturday-01", title: "Enfermaria", startTime: "07:00", endTime: "13:00", location: "HC", preceptor: "Escala" }],
      sunday: [{ id: "r1-b-sunday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }]
    },
    C: {
      monday: [
        { id: "r1-c-monday-01", title: "Ambulatório", startTime: "07:30", endTime: "11:30", location: "HUNA", preceptor: "Dra Renata" },
        { id: "r1-c-monday-02", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Lorena" }
      ],
      tuesday: [
        { id: "r1-c-tuesday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" },
        { id: "r1-c-tuesday-02", title: "Enfermaria", startTime: "13:00", endTime: "17:00", location: "HC", preceptor: "Escala" },
        { id: "r1-c-tuesday-03", title: "Aula teórica", startTime: "18:00", endTime: "22:00", location: null, preceptor: "Dra Lorena" }
      ],
      wednesday: [
        { id: "r1-c-wednesday-01", title: "Amb. Geral", startTime: "07:30", endTime: "11:30", location: "HUNA", preceptor: "Dra Renata" },
        { id: "r1-c-wednesday-02", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Mariana" }
      ],
      thursday: [{ id: "r1-c-thursday-01", title: "Plantão Urgência", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Daniele / Nathália" }],
      friday: [{ id: "r1-c-friday-01", title: "Maternidade", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Lorena + Escala" }],
      saturday: [{ id: "r1-c-saturday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }],
      sunday: [{ id: "r1-c-sunday-01", title: "Enfermaria", startTime: "07:00", endTime: "13:00", location: "HC", preceptor: "Escala" }]
    },
    D: {
      monday: [{ id: "r1-d-monday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }],
      tuesday: [
        { id: "r1-d-tuesday-01", title: "Plantão Urgência", startTime: "07:00", endTime: "18:00", location: "HC", preceptor: "Paulo / Nathália" },
        { id: "r1-d-tuesday-02", title: "Aula teórica", startTime: "18:00", endTime: "22:00", location: null, preceptor: "Dra Lorena" }
      ],
      wednesday: [
        { id: "r1-d-wednesday-01", title: "Amb. Geral", startTime: "07:30", endTime: "11:30", location: "HUNA", preceptor: "Dra Renata" },
        { id: "r1-d-wednesday-02", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Lídia" }
      ],
      thursday: [
        { id: "r1-d-thursday-01", title: "Amb. Geral", startTime: "07:30", endTime: "11:30", location: "HUNA", preceptor: "Dra Lidia" },
        { id: "r1-d-thursday-02", title: "Ambulatório", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Daniele" }
      ],
      friday: [
        { id: "r1-d-friday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa / Escala" },
        { id: "r1-d-friday-02", title: "Enfermaria", startTime: "13:00", endTime: "17:00", location: "HC", preceptor: "Escala" }
      ],
      saturday: [{ id: "r1-d-saturday-01", title: "Enfermaria", startTime: "07:00", endTime: "15:00", location: "HC", preceptor: "Dra Larissa / Escala" }],
      sunday: [{ id: "r1-d-sunday-01", title: "Maternidade", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Escala" }]
    },
    E: {
      monday: [
        { id: "r1-e-monday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Escala" },
        { id: "r1-e-monday-02", title: "Enfermaria", startTime: "13:00", endTime: "17:00", location: "HC", preceptor: "Escala" },
        { id: "r1-e-monday-03", title: "Amb. Geral", startTime: "18:00", endTime: "22:00", location: "HUNA", preceptor: "Dra Marielly" }
      ],
      tuesday: [
        { id: "r1-e-tuesday-01", title: "Amb. Geral", startTime: "07:30", endTime: "11:30", location: "HUNA", preceptor: "Dra Andressa" },
        { id: "r1-e-tuesday-02", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Renata" },
        { id: "r1-e-tuesday-03", title: "Aula teórica", startTime: "18:00", endTime: "22:00", location: null, preceptor: "Dra Lorena" }
      ],
      wednesday: [{ id: "r1-e-wednesday-01", title: "Plantão Urgência", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Marielly" }],
      thursday: [{ id: "r1-e-thursday-01", title: "Maternidade", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Nathália e Andressa" }],
      friday: [{ id: "r1-e-friday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }],
      saturday: [{ id: "r1-e-saturday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Escala" }],
      sunday: [{ id: "r1-e-sunday-01", title: "Enfermaria", startTime: "07:00", endTime: "13:00", location: "HC", preceptor: "Escala" }]
    }
  },
  R2: {
    A: {
      monday: [{ id: "r2-a-monday-01", title: "Pronto Socorro", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Assiole / Mariely" }],
      tuesday: [
        { id: "r2-a-tuesday-01", title: "Maternidade", startTime: "07:00", endTime: "18:00", location: "HC", preceptor: "Dra Nathália / Isadora" },
        { id: "r2-a-tuesday-02", title: "Aula teórica", startTime: "18:00", endTime: "22:00", location: null, preceptor: "Dra Lorena" }
      ],
      wednesday: [
        { id: "r2-a-wednesday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:30", location: "HC", preceptor: "Dra Larissa" },
        { id: "r2-a-wednesday-02", title: "Ambulatório Reumato", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Dayane" }
      ],
      thursday: [
        { id: "r2-a-thursday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:30", location: "HC", preceptor: "Dra Larissa" },
        { id: "r2-a-thursday-02", title: "Amb. Geral", startTime: "13:30", endTime: "16:30", location: "HUNA", preceptor: "Dra Mariana" }
      ],
      friday: [
        { id: "r2-a-friday-01", title: "UTI Neonatal", startTime: "07:00", endTime: "13:00", location: "HC", preceptor: "Escala" },
        { id: "r2-a-friday-02", title: "Ambulatório Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Natália" },
        { id: "r2-a-friday-03", title: "Amb. Geral", startTime: "18:00", endTime: "22:00", location: "HUNA", preceptor: "Dra Natalia" }
      ],
      saturday: [{ id: "r2-a-saturday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }],
      sunday: [{ id: "r2-a-sunday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }]
    },
    B: {
      monday: [{ id: "r2-b-monday-01", title: "Maternidade", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Andressa / Nathália" }],
      tuesday: [
        { id: "r2-b-tuesday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" },
        { id: "r2-b-tuesday-02", title: "PSF São Sebastião", startTime: "13:30", endTime: "17:30", location: null, preceptor: "Dra Mariana" },
        { id: "r2-b-tuesday-03", title: "Aula teórica", startTime: "18:00", endTime: "22:00", location: null, preceptor: "Dra Lorena" }
      ],
      wednesday: [
        { id: "r2-b-wednesday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" },
        { id: "r2-b-wednesday-02", title: "UTI Neonatal", startTime: "13:00", endTime: "19:00", location: "HC", preceptor: "Escala" }
      ],
      thursday: [
        { id: "r2-b-thursday-01", title: "Amb. Dermato", startTime: "07:30", endTime: "11:30", location: "CEM", preceptor: "Dra Laura" },
        { id: "r2-b-thursday-02", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Lídia" },
        { id: "r2-b-thursday-03", title: "Amb. Geral", startTime: "18:00", endTime: "22:00", location: "HUNA", preceptor: "Dra Daniele" }
      ],
      friday: [{ id: "r2-b-friday-01", title: "Pronto Socorro", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dr. Paulo / Daniele" }],
      saturday: [{ id: "r2-b-saturday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }],
      sunday: [{ id: "r2-b-sunday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }]
    },
    C: {
      monday: [
        { id: "r2-c-monday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" },
        { id: "r2-c-monday-02", title: "Amb. neuro", startTime: "13:30", endTime: "17:30", location: "CEM", preceptor: "Dra Natalia" }
      ],
      tuesday: [
        { id: "r2-c-tuesday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" },
        { id: "r2-c-tuesday-02", title: "Pronto Socorro", startTime: "13:00", endTime: "18:00", location: null, preceptor: "Dra Nathália" },
        { id: "r2-c-tuesday-03", title: "Aula teórica", startTime: "18:00", endTime: "22:00", location: null, preceptor: "Dra Lorena" }
      ],
      wednesday: [{ id: "r2-c-wednesday-01", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Andressa" }],
      thursday: [{ id: "r2-c-thursday-01", title: "Maternidade", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Nathália / Andressa" }],
      friday: [
        { id: "r2-c-friday-01", title: "Ambulatório Neuro", startTime: "07:30", endTime: "11:30", location: "APAE", preceptor: "Dra Natália" },
        { id: "r2-c-friday-02", title: "Pronto Socorro", startTime: "13:00", endTime: "18:00", location: null, preceptor: "Dra Daniele" }
      ],
      saturday: [{ id: "r2-c-saturday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }],
      sunday: [{ id: "r2-c-sunday-01", title: "UTI Neonatal", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Escala" }]
    },
    D: {
      monday: [{ id: "r2-d-monday-01", title: "Pronto Socorro", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Assiole / Dra Marielly" }],
      tuesday: [
        { id: "r2-d-tuesday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Escala" },
        { id: "r2-d-tuesday-02", title: "PSF Primavera", startTime: "13:30", endTime: "16:30", location: null, preceptor: "Dra Andressa" },
        { id: "r2-d-tuesday-03", title: "Aula teórica", startTime: "18:00", endTime: "22:00", location: null, preceptor: "Dra Lorena" }
      ],
      wednesday: [
        { id: "r2-d-wednesday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Escala" },
        { id: "r2-d-wednesday-02", title: "Amb. Reumato", startTime: "13:30", endTime: "16:30", location: "HUNA", preceptor: "Dra Dayane" },
        { id: "r2-d-wednesday-03", title: "Amb. Geral", startTime: "18:00", endTime: "22:00", location: "CEM", preceptor: "Dra Assiole" }
      ],
      thursday: [{ id: "r2-d-thursday-01", title: "UTI Neonatal", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Escala" }],
      friday: [{ id: "r2-d-friday-01", title: "Maternidade", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Dra Lorena + Escala" }],
      saturday: [{ id: "r2-d-saturday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }],
      sunday: [{ id: "r2-d-sunday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }]
    },
    E: {
      monday: [{ id: "r2-e-monday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }],
      tuesday: [
        { id: "r2-e-tuesday-01", title: "Maternidade", startTime: "07:00", endTime: "18:00", location: "HC", preceptor: "Dra Isadora" },
        { id: "r2-e-tuesday-02", title: "Aula teórica", startTime: "18:00", endTime: "22:00", location: null, preceptor: "Dra Lorena" }
      ],
      wednesday: [{ id: "r2-e-wednesday-01", title: "Pronto Socorro", startTime: "07:00", endTime: "19:00", location: "HUNA", preceptor: "Dra Marielly" }],
      thursday: [
        { id: "r2-e-thursday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" },
        { id: "r2-e-thursday-02", title: "Amb. Geral", startTime: "13:30", endTime: "17:30", location: "HUNA", preceptor: "Dra Daniele" },
        { id: "r2-e-thursday-03", title: "Amb. Geral", startTime: "18:00", endTime: "22:00", location: "HUNA", preceptor: "Dra Mariana" }
      ],
      friday: [
        { id: "r2-e-friday-01", title: "Enfermaria", startTime: "07:00", endTime: "12:00", location: "HC", preceptor: "Dra Larissa" },
        { id: "r2-e-friday-02", title: "Amb.", startTime: "13:30", endTime: "16:30", location: "HUNA", preceptor: "Dra Mariana" }
      ],
      saturday: [{ id: "r2-e-saturday-01", title: "UTI Neonatal", startTime: "07:00", endTime: "19:00", location: "HC", preceptor: "Escala" }],
      sunday: [{ id: "r2-e-sunday-01", title: "Descanso semanal", startTime: null, endTime: null, location: null, preceptor: null }]
    }
  }
};

const WEEK_DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const REQUIRED_ACTIVITY_FIELDS = ["id", "title", "startTime", "endTime", "location", "preceptor"];

function isValidTime(value) {
  if (value === null) return true;
  if (typeof value !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return false;
  return true;
}

function validateStandardWeeks(weeks = STANDARD_WEEKS) {
  const errors = [];
  const expectedLevels = ["R1", "R2"];
  const expectedLetters = ["A", "B", "C", "D", "E"];

  for (const level of expectedLevels) {
    if (!weeks[level]) {
      errors.push(`Nível ausente: ${level}`);
      continue;
    }

    for (const letter of expectedLetters) {
      const week = weeks[level][letter];
      const weekLabel = `${level}-${letter}`;
      if (!week) {
        errors.push(`Semana ausente: ${weekLabel}`);
        continue;
      }

      for (const day of WEEK_DAYS) {
        const activities = week[day];
        if (!Array.isArray(activities)) {
          errors.push(`${weekLabel}/${day} deve ser um array.`);
          continue;
        }

        activities.forEach((activity, index) => {
          const activityLabel = `${weekLabel}/${day}[${index}]`;
          for (const field of REQUIRED_ACTIVITY_FIELDS) {
            if (!Object.prototype.hasOwnProperty.call(activity, field) || activity[field] === undefined) {
              errors.push(`${activityLabel}: campo obrigatório ausente ou undefined: ${field}.`);
            }
          }

          if (!isValidTime(activity.startTime)) errors.push(`${activityLabel}: startTime inválido.`);
          if (!isValidTime(activity.endTime)) errors.push(`${activityLabel}: endTime inválido.`);
          if (activity.startTime !== null && activity.endTime !== null && activity.startTime >= activity.endTime) {
            errors.push(`${activityLabel}: startTime deve ser anterior a endTime.`);
          }
          if (activity.title === "UTI Neonatal" && (activity.location !== "HC" || activity.preceptor !== "Escala")) {
            errors.push(`${activityLabel}: UTI Neonatal deve ter local HC e preceptor Escala.`);
          }
        });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

if (typeof module !== "undefined") {
  module.exports = { STANDARD_WEEKS, WEEK_DAYS, validateStandardWeeks };
}

if (typeof window !== "undefined") {
  window.STANDARD_WEEKS = STANDARD_WEEKS;
  window.WEEK_DAYS = WEEK_DAYS;
  window.validateStandardWeeks = validateStandardWeeks;
}
