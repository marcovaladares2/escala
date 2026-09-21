function renderGeneralView(state) {
  const result = getOfficialScheduleForDate(state.selectedDate);
  if (result.status !== "OK") return `<section><div class="view-heading"><div><h2>Visão geral</h2><p>${formatDateShort(state.selectedDate)}</p></div></div>${dateControls(state.selectedDate)}<div class="notice">Não há escala cadastrada para este período.</div></section>`;
  return `<section><div class="view-heading"><div><h2>Visão geral</h2><p>${formatDateLong(state.selectedDate)}</p></div></div>${dateControls(state.selectedDate)}${["R1", "R2"].map((level) => `<div class="group-heading"><span>${level}</span><h3>Residentes ${level}</h3></div><div class="general-list">${result.schedules.filter((schedule) => schedule.level === level).map((schedule) => residentSummaryCard(schedule)).join("")}</div>`).join("")}</section>`;
}

function residentSummaryCard(schedule) {
  const activities = schedule.activities;
  const summary = activities.map((activity) => {
    if (activity.title === "Descanso semanal") return `<p class="rest-text">Descanso semanal</p>`;
    const time = activity.startTime && activity.endTime ? `${activity.startTime}–${activity.endTime}` : "";
    const detail = [activity.title, activity.location].filter(Boolean).join(" · ");
    return `<div class="resident-activity"><span>${escapeHtml(detail)}</span><span>${time}</span></div>`;
  }).join("");
  return `<button type="button" class="resident-card" data-action="show-resident-details" data-resident-id="${schedule.resident.id}" data-date="${schedule.date}"><span class="resident-card-head"><strong>${escapeHtml(schedule.resident.name)}</strong><span>${schedule.standardWeekKey}</span></span>${summary || `<p class="rest-text">Sem atividades</p>`}</button>`;
}

window.renderGeneralView = renderGeneralView;
