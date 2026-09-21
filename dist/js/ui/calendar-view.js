function renderMyScheduleView(state) {
  if (!state.selectedResidentId) return `<section><div class="view-heading"><div><h2>Minha escala</h2><p>Consulta diária e semanal.</p></div></div><div class="empty-state"><h2>Selecione seu nome</h2><p>Selecione seu nome para visualizar sua escala.</p><button class="primary-button" type="button" data-action="open-picker">Selecionar residente</button></div></section>`;
  const resident = RESIDENTS.find((item) => item.id === state.selectedResidentId);
  return `<section><div class="view-heading"><div><h2>Minha escala</h2><p>${escapeHtml(resident.name)} · ${resident.level}</p></div><button class="text-button" type="button" data-action="open-picker">Trocar</button></div>${state.myScheduleMode === "month" ? "" : dateControls(state.selectedDate)}<div class="tabs" role="tablist" aria-label="Visualização da escala"><button type="button" role="tab" aria-selected="${state.myScheduleMode === "day"}" data-action="my-mode" data-mode="day">Dia</button><button type="button" role="tab" aria-selected="${state.myScheduleMode === "week"}" data-action="my-mode" data-mode="week">Semana</button><button type="button" role="tab" aria-selected="${state.myScheduleMode === "month"}" data-action="my-mode" data-mode="month">Mês</button></div>${state.myScheduleMode === "month" ? renderMonthlyView(state) : state.myScheduleMode === "week" ? renderWeek(state) : renderDay(state)}`;
}

function renderDay(state) {
  const schedule = getPersonalScheduleForResident(state.selectedResidentId, state.selectedDate);
  if (schedule.status !== "OK") return `<div class="notice">Não há escala cadastrada para este período.</div>`;
  return `<div class="section-title"><h3>${formatDateLong(state.selectedDate)}</h3><span class="resident-chip">${schedule.standardWeekKey}</span></div><div class="day-actions"><button class="secondary-button" type="button" data-action="add-activity">+ Adicionar atividade</button><button class="text-button" type="button" data-action="restore-date">Restaurar este dia</button></div><div class="activity-list">${schedule.activities.length ? schedule.activities.map((activity) => activityCard(activity, { residentId: schedule.resident.id, date: state.selectedDate, editable: true })).join("") : `<p class="small-empty">Sem atividades cadastradas neste dia.</p>`}</div>`;
}

function renderWeek(state) {
  const dates = getWeekDates(state.selectedDate);
  return `<div class="week-list">${dates.map((date) => {
    const schedule = getPersonalScheduleForResident(state.selectedResidentId, date);
    if (schedule.status !== "OK") return `<article class="day-card"><div class="day-card-header"><strong>${formatWeekdayDay(date)}</strong></div><p class="small-empty">Sem escala cadastrada.</p></article>`;
    return `<article class="day-card ${date === state.today ? "today" : ""}" data-date="${date}"><div class="day-card-header"><strong>${formatWeekdayDay(date)}</strong><span class="week-letter">${schedule.standardWeekKey}</span></div><div class="activity-list">${schedule.activities.length ? schedule.activities.map((activity) => activityCard(activity, { residentId: schedule.resident.id, date, compact: true, editable: true })).join("") : `<p class="small-empty">Sem atividades cadastradas.</p>`}</div></article>`;
  }).join("")}</div>`;
}

function getWeekDates(selectedDate) {
  const offset = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(getWeekdayKey(selectedDate));
  return Array.from({ length: 7 }, (_, index) => addLocalDays(selectedDate, index - offset));
}

window.renderMyScheduleView = renderMyScheduleView;
window.getWeekDates = getWeekDates;
