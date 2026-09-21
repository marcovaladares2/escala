const MONTH_LABELS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
function getMonthFromDate(date) { const [year, month] = date.split("-").map(Number); return { year, month }; }
function renderMonthlyView(state) {
  const { year, month } = getMonthFromDate(state.selectedDate);
  const resident = RESIDENTS.find((item) => item.id === state.selectedResidentId);
  const schedules = getPersonalMonthSchedule(state.selectedResidentId, year, month);
  const firstDay = getWeekdayKey(`${year}-${String(month).padStart(2, "0")}-01`);
  const blankCells = Array.from({ length: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].indexOf(firstDay) }, () => `<div class="month-blank" aria-hidden="true"></div>`).join("");
  const hasPrevious = year > 2026 || month > 9;
  const hasNext = year < 2027 || month < 2;
  return `<section class="monthly-view"><div class="print-heading"><h1>Escala Pediatria</h1><p>${escapeHtml(resident.name)} — ${resident.level}</p><p>${MONTH_LABELS[month - 1]} de ${year}</p><p>Escala pessoal</p></div><div class="view-heading screen-only"><div><h2>Meu mês</h2><p>${escapeHtml(resident.name)} · ${resident.level} · Escala pessoal</p></div><button class="secondary-button" type="button" data-action="print-month">Imprimir / Salvar PDF</button></div><div class="month-navigation screen-only"><button type="button" class="secondary-button" data-action="previous-month" ${hasPrevious ? "" : "disabled"}>‹ Mês anterior</button><h3>${MONTH_LABELS[month - 1]} de ${year}</h3><button type="button" class="secondary-button" data-action="next-month" ${hasNext ? "" : "disabled"}>Mês seguinte ›</button></div><div class="month-weekdays screen-only"><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span><span>DOM</span></div><div class="month-grid">${blankCells}${schedules.map((schedule) => renderMonthDay(schedule, state.today)).join("")}</div></section>`;
}
function renderMonthDay(schedule, today) {
  const number = Number(schedule.date.slice(-2));
  if (schedule.status !== "OK") return `<article class="month-day invalid-day"><strong>${number}</strong><p>Sem escala</p></article>`;
  const activities = schedule.activities.length ? schedule.activities.map((activity) => { const time = activity.startTime && activity.endTime ? `${activity.startTime}–${activity.endTime}` : ""; return `<div class="month-activity"><span>${time}</span><strong>${escapeHtml(activity.title)}</strong>${activity.location ? `<small>${escapeHtml(activity.location)}</small>` : ""}${activity.preceptor ? `<small class="print-preceptor">${escapeHtml(activity.preceptor)}</small>` : ""}${activity.personalStatus ? `<em class="screen-only">${activity.personalStatus}</em>` : ""}</div>`; }).join("") : `<p class="month-empty">Sem atividades</p>`;
  return `<article class="month-day ${schedule.date === today ? "today" : ""}"><strong class="month-number">${number}</strong>${activities}</article>`;
}
window.renderMonthlyView = renderMonthlyView;
