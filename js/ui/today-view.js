function renderTodayView(state) {
  const schedule = state.selectedResidentId ? getPersonalScheduleForResident(state.selectedResidentId, state.selectedDate) : null;
  const title = state.selectedDate === state.today ? "Hoje" : "Consulta do dia";
  const dateResult = getOfficialScheduleForDate(state.selectedDate);
  if (dateResult.status !== "OK") return `<section><div class="view-heading"><div><h2>${title}</h2><p>${formatDateLong(state.selectedDate)}</p></div></div>${dateControls(state.selectedDate)}<div class="notice">Não há escala cadastrada para este período.</div></section>`;
  if (!state.selectedResidentId) return `<section><div class="view-heading"><div><h2>${title}</h2><p>${formatDateLong(state.selectedDate)}</p></div></div>${dateControls(state.selectedDate)}<div class="empty-state"><h2>Qual é o seu nome?</h2><p>Selecione seu nome para consultar sua programação.</p><button class="primary-button" type="button" data-action="open-picker">Selecionar meu nome</button></div></section>`;
  if (schedule.status !== "OK") return `<section><div class="view-heading"><div><h2>${title}</h2><p>${formatDateLong(state.selectedDate)}</p></div></div>${dateControls(state.selectedDate)}<div class="notice">Não há escala cadastrada para este período.</div></section>`;
  const now = new Date();
  const isToday = state.selectedDate === state.today;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const statuses = schedule.activities.map((activity) => getActivityStatus(activity, isToday, nowMinutes));
  const current = statuses.indexOf("now");
  const next = statuses.indexOf("next");
  const message = schedule.activities.some((activity) => activity.title === "Descanso semanal") ? "Hoje é seu descanso semanal." : current >= 0 ? `Agora: ${schedule.activities[current].title}` : next >= 0 ? `Próximo: ${schedule.activities[next].title}` : "Suas atividades de hoje terminaram.";
  return `<section><div class="view-heading"><div><h2>${title}</h2><p>${formatDateLong(state.selectedDate)}</p></div><button class="text-button" type="button" data-action="open-picker">Trocar</button></div>${dateControls(state.selectedDate)}<div class="summary-card"><p class="eyebrow">Olá, ${escapeHtml(schedule.resident.name)}</p><h2>${schedule.standardWeekKey}</h2><p>${message}</p></div><div class="section-title"><h3>Programação</h3><span class="resident-chip">${schedule.level} • Semana ${schedule.letter}</span></div><div class="activity-list">${schedule.activities.length ? schedule.activities.map((activity, index) => activityCard(activity, { residentId: schedule.resident.id, date: state.selectedDate, status: statuses[index] })).join("") : `<p class="small-empty">Sem atividades cadastradas neste dia.</p>`}</div></section>`;
}

window.renderTodayView = renderTodayView;
