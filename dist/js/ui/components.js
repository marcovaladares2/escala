function formatDateLong(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(year, month - 1, day));
}

function formatDateShort(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(year, month - 1, day));
}

function formatWeekdayDay(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short", day: "numeric", month: "short" }).format(new Date(year, month - 1, day)).replace(".", "");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function getActivityStatus(activity, isToday, nowMinutes) {
  if (!isToday || !activity.startTime || !activity.endTime) return null;
  const toMinutes = (time) => { const [hour, minute] = time.split(":").map(Number); return hour * 60 + minute; };
  if (nowMinutes >= toMinutes(activity.startTime) && nowMinutes < toMinutes(activity.endTime)) return "now";
  if (nowMinutes < toMinutes(activity.startTime)) return "next";
  return "done";
}

function activityIcon(title) {
  const label = (title || "").toLowerCase();
  const path = label.includes("descanso") ? "M15 3a9 9 0 1 0 6 15A8 8 0 0 1 15 3Z" : label.includes("aula") ? "M4 5.5 12 3l8 2.5v13L12 21l-8-2.5v-13ZM12 3v18" : label.includes("urgência") || label.includes("socorro") ? "M12 5v14M5 12h14" : "M5 5h14v14H5zM8 12h8";
  return `<span class="activity-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg></span>`;
}

function activityCard(activity, options = {}) {
  const status = options.status || null;
  const isRest = activity.title === "Descanso semanal";
  const time = activity.startTime && activity.endTime ? `${activity.startTime} – ${activity.endTime}` : "";
  const statusText = { now: "Agora", next: "Próximo", done: "Encerrada" }[status] || "";
  return `<button type="button" class="activity-card ${options.compact ? "compact-card" : ""} ${isRest ? "rest-card" : ""}" ${status ? `data-status="${status}"` : ""} ${options.editable ? "draggable=\"true\" data-personal-card=\"true\"" : ""} data-action="show-detail" data-resident-id="${escapeHtml(options.residentId)}" data-activity-id="${escapeHtml(activity.id)}" data-date="${escapeHtml(options.date)}">
    <span class="activity-top"><span class="activity-title">${activityIcon(activity.title)}${escapeHtml(activity.title)}</span>${time ? `<span class="activity-time">${time}</span>` : ""}</span>
    ${!isRest && (activity.location || activity.preceptor) ? `<span class="activity-meta">${activity.location ? `<span>${escapeHtml(activity.location)}</span>` : ""}${activity.preceptor ? `<span>${escapeHtml(activity.preceptor)}</span>` : ""}</span>` : ""}
    ${activity.personalStatus ? `<span class="personal-label">${activity.personalStatus}</span>` : ""}${statusText ? `<span class="status-label ${status}">${statusText}</span>` : ""}
  </button>`;
}

function dateControls(selectedDate) {
  return `<div class="date-controls" aria-label="Selecionar data">
    <button type="button" data-action="previous-day" aria-label="Dia anterior">‹</button>
    <label for="selected-date">Data selecionada</label>
    <input id="selected-date" type="date" value="${selectedDate}" aria-describedby="date-help">
    <button type="button" data-action="next-day" aria-label="Dia seguinte">›</button>
  </div>`;
}

window.formatDateLong = formatDateLong;
window.formatDateShort = formatDateShort;
window.formatWeekdayDay = formatWeekdayDay;
window.escapeHtml = escapeHtml;
window.getActivityStatus = getActivityStatus;
window.activityCard = activityCard;
window.dateControls = dateControls;
