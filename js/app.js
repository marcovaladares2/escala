const state = {
  today: getDeviceToday(),
  selectedDate: getDeviceToday(),
  selectedResidentId: null,
  currentView: null,
  myScheduleMode: "day"
};

function getDeviceToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function addLocalDays(isoDate, amount) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);
  localDate.setDate(localDate.getDate() + amount);
  return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;
}

function setSelectedDate(date) { parseCivilDate(date); state.selectedDate = date; persistUiPreferences(); renderApp(); }
function goToPreviousDay() { setSelectedDate(addLocalDays(state.selectedDate, -1)); }
function goToNextDay() { setSelectedDate(addLocalDays(state.selectedDate, 1)); }
function goToToday() { if (getOfficialScheduleForDate(state.today).status !== "OK") state.currentView = "today"; setSelectedDate(state.today); }
function changeSelectedMonth(offset) {
  const [year, month, day] = state.selectedDate.split("-").map(Number);
  const next = new Date(year, month - 1 + offset, 1);
  const nextYear = next.getFullYear(); const nextMonth = next.getMonth() + 1;
  if (nextYear < 2026 || nextYear > 2027 || (nextYear === 2026 && nextMonth < 9) || (nextYear === 2027 && nextMonth > 2)) return;
  state.selectedDate = `${nextYear}-${String(nextMonth).padStart(2, "0")}-${String(Math.min(day, daysInMonth(nextYear, nextMonth))).padStart(2, "0")}`;
  persistUiPreferences(); renderApp();
}
function printMonth() {
  const resident = RESIDENTS.find((item) => item.id === state.selectedResidentId); if (!resident) return;
  const [year, month] = state.selectedDate.split("-").map(Number); const originalTitle = document.title;
  document.title = `Escala-${resident.name}-${MONTH_LABELS[month - 1]}-${year}`; document.body.classList.add("printing");
  window.addEventListener("afterprint", () => { document.title = originalTitle; document.body.classList.remove("printing"); }, { once: true }); window.print();
}

function persistUiPreferences() {
  if (!localScheduleStorage) return;
  localScheduleStorage.savePreferences({ defaultView: state.currentView, lastSelectedDate: state.selectedDate });
}

function loadPersistedState() {
  if (!localScheduleStorage) return;
  state.selectedResidentId = localScheduleStorage.getSelectedResidentId(RESIDENTS);
  const preferences = localScheduleStorage.getPreferences();
  state.currentView = null;
  try { if (preferences.lastSelectedDate) parseCivilDate(preferences.lastSelectedDate); } catch { preferences.lastSelectedDate = null; }
  state.selectedDate = state.today;
}

function renderApp() {
  try {
    if (!state.currentView) { document.body.classList.add("hero-only"); document.getElementById("app-content").innerHTML = ""; return; }
    document.body.classList.remove("hero-only");
    const renderers = { today: renderTodayView, "my-schedule": renderMyScheduleView, general: renderGeneralView };
    document.getElementById("app-content").innerHTML = renderers[state.currentView](state);
    document.getElementById("header-date").textContent = formatDateLong(state.selectedDate);
    const activeResident = RESIDENTS.find((resident) => resident.id === state.selectedResidentId);
    const profileIndicator = document.getElementById("profile-indicator");
    profileIndicator.hidden = false;
    profileIndicator.textContent = activeResident ? `Perfil: ${activeResident.name} · ${activeResident.level}` : "Perfil: selecione seu nome";
    document.getElementById("profile-avatar").textContent = activeResident ? activeResident.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() : "EP";
    document.querySelectorAll(".bottom-nav [data-view]").forEach((button) => button.setAttribute("aria-current", button.dataset.view === state.currentView ? "page" : "false"));
  } catch (error) {
    console.error("Falha ao renderizar a escala:", error);
    document.getElementById("app-content").innerHTML = `<div class="notice">Não foi possível exibir esta tela. Tente novamente.</div>`;
  }
}

function showDetail(residentId, date, activityId, editable = false) {
  const schedule = editable ? getPersonalScheduleForResident(residentId, date) : getOfficialScheduleForResident(residentId, date);
  const activity = schedule.activities.find((item) => item.id === activityId);
  if (!activity) return;
  const official = getOfficialScheduleForResident(residentId, date).activities.find((item) => item.id === activityId);
  const hasOverride = editable && personalChangesService?.getPersonalChangesForResident(residentId).some((change) => change.activityId === activityId || change.activity?.id === activityId);
  const dialog = document.getElementById("detail-dialog");
  const time = activity.startTime && activity.endTime ? `${activity.startTime} – ${activity.endTime}` : "Sem horário informado";
  dialog.innerHTML = `<div class="dialog-content"><div class="dialog-header"><div><p class="eyebrow">${escapeHtml(schedule.resident.name)} · ${schedule.standardWeekKey}</p><h2 class="detail-title" id="detail-dialog-title">${escapeHtml(activity.title)}</h2></div><button class="dialog-close" type="button" data-action="close-dialog" aria-label="Fechar">×</button></div><div class="detail-activity"><p class="detail-label">Data</p><p class="detail-value">${formatDateShort(date)}</p><p class="detail-label">Horário</p><p class="detail-value">${time}</p>${activity.location ? `<p class="detail-label">Local</p><p class="detail-value">${escapeHtml(activity.location)}</p>` : ""}${activity.preceptor ? `<p class="detail-label">Preceptor</p><p class="detail-value">${escapeHtml(activity.preceptor)}</p>` : ""}</div>${editable ? `<div class="dialog-actions"><button class="secondary-button" data-action="edit-activity" data-date="${date}" data-activity-id="${activity.id}">Editar</button><button class="secondary-button" data-action="move-activity" data-date="${date}" data-activity-id="${activity.id}">Mover</button><button class="secondary-button" data-action="swap-activity" data-date="${date}" data-activity-id="${activity.id}">Trocar</button><button class="secondary-button danger-button" data-action="delete-activity" data-date="${date}" data-activity-id="${activity.id}">Excluir</button>${hasOverride ? `<button class="text-button" data-action="restore-activity" data-date="${date}" data-activity-id="${activity.id}">Restaurar ${official ? "atividade oficial" : "atividade pessoal"}</button>` : ""}</div>${official && activity.personalStatus ? `<details><summary>Ver original</summary><p class="muted">Versão oficial: ${escapeHtml(official.title)} · ${official.startTime || ""}–${official.endTime || ""}</p></details>` : ""}` : ""}</div>`;
  dialog.showModal();
}

function openActivityForm(date, activity = null) {
  const dialog = document.getElementById("detail-dialog");
  const isEdit = !!activity;
  dialog.innerHTML = `<form class="dialog-content" id="activity-form"><div class="dialog-header"><div><h2 id="detail-dialog-title">${isEdit ? "Editar atividade" : "Adicionar atividade"}</h2><p class="muted">Alterações ficam somente neste dispositivo.</p></div><button class="dialog-close" type="button" data-action="close-dialog" aria-label="Fechar">×</button></div><input type="hidden" name="activityId" value="${activity?.id || ""}"><label>Nome<input required name="title" value="${escapeHtml(activity?.title || "")}"></label><label>Data<input required type="date" min="2026-09-21" max="2027-02-28" name="date" value="${date}"></label><label>Horário inicial<input type="time" name="startTime" value="${activity?.startTime || ""}"></label><label>Horário final<input type="time" name="endTime" value="${activity?.endTime || ""}"></label><label>Local<input name="location" value="${escapeHtml(activity?.location || "")}"></label><label>Preceptor<input name="preceptor" value="${escapeHtml(activity?.preceptor || "")}"></label>${activity?.title === "Descanso semanal" ? `<p class="muted">Descanso semanal não deve receber horários nesta versão.</p>` : ""}<p class="form-warning" hidden></p><button class="primary-button" type="submit">Salvar</button></form>`;
  dialog.showModal();
}

function openMoveForm(date, activity) {
  const dialog = document.getElementById("detail-dialog");
  dialog.innerHTML = `<form class="dialog-content" id="move-form"><div class="dialog-header"><div><h2 id="detail-dialog-title">Mover atividade</h2><p class="muted">${escapeHtml(activity.title)}</p></div><button class="dialog-close" type="button" data-action="close-dialog" aria-label="Fechar">×</button></div><input type="hidden" name="activityId" value="${activity.id}"><input type="hidden" name="sourceDate" value="${date}"><label>Nova data<input required type="date" min="2026-09-21" max="2027-02-28" name="targetDate" value="${date}"></label><p class="form-warning" hidden></p><button class="primary-button" type="submit">Confirmar movimentação</button></form>`;
  dialog.showModal();
}

function openSwapForm(firstDate, firstActivity, targetDate = firstDate) {
  const target = getPersonalScheduleForResident(state.selectedResidentId, targetDate).activities.filter((activity) => !(targetDate === firstDate && activity.id === firstActivity.id));
  const dialog = document.getElementById("detail-dialog");
  dialog.innerHTML = `<form class="dialog-content" id="swap-form"><div class="dialog-header"><div><h2 id="detail-dialog-title">Trocar atividade</h2><p class="muted">${escapeHtml(firstActivity.title)}</p></div><button class="dialog-close" type="button" data-action="close-dialog" aria-label="Fechar">×</button></div><input type="hidden" name="firstDate" value="${firstDate}"><input type="hidden" name="firstActivityId" value="${firstActivity.id}"><label>Data da outra atividade<input required type="date" min="2026-09-21" max="2027-02-28" name="targetDate" data-action="swap-target-date" value="${targetDate}"></label><label>Atividade<select required name="secondActivityId">${target.map((activity) => `<option value="${activity.id}">${escapeHtml(activity.title)}${activity.startTime ? ` · ${activity.startTime}` : ""}</option>`).join("") || `<option value="">Nenhuma atividade nesta data</option>`}</select></label><button class="primary-button" type="submit" ${target.length ? "" : "disabled"}>Confirmar troca</button></form>`;
  dialog.showModal();
}

function showResidentDetails(residentId, date) {
  const schedule = getOfficialScheduleForResident(residentId, date);
  if (!schedule.activities.length) return;
  showDetail(residentId, date, schedule.activities[0].id);
}

function getPersonalActivity(date, activityId) { return getPersonalScheduleForResident(state.selectedResidentId, date).activities.find((activity) => activity.id === activityId); }
function hasOverlap(date, candidate, ignoredId = null) {
  if (!candidate.startTime || !candidate.endTime) return false;
  return getPersonalScheduleForResident(state.selectedResidentId, date).activities.some((activity) => activity.id !== ignoredId && activity.startTime && activity.endTime && candidate.startTime < activity.endTime && activity.endTime > candidate.startTime);
}

document.addEventListener("click", (event) => {
  try {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.dataset.view) { state.currentView = button.dataset.view; if (state.currentView === "today") state.selectedDate = state.today; persistUiPreferences(); renderApp(); document.getElementById("app-content").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  switch (button.dataset.action) {
    case "previous-day": goToPreviousDay(); break;
    case "next-day": goToNextDay(); break;
    case "go-today": goToToday(); break;
    case "open-picker": openResidentPicker(); break;
    case "open-settings": openSettings(state); break;
    case "open-picker-from-settings": document.getElementById("settings-dialog").close(); openResidentPicker(); break;
    case "close-dialog": button.closest("dialog").close(); break;
    case "select-resident": state.selectedResidentId = button.dataset.residentId; localScheduleStorage?.saveSelectedResidentId(state.selectedResidentId, RESIDENTS); document.getElementById("resident-dialog").close(); renderApp(); showToast("Perfil atualizado"); break;
    case "my-mode": state.myScheduleMode = button.dataset.mode; renderApp(); break;
    case "previous-month": changeSelectedMonth(-1); break;
    case "next-month": changeSelectedMonth(1); break;
    case "print-month": printMonth(); break;
    case "reset-preferences": localScheduleStorage?.resetPreferences(); state.currentView = "today"; state.selectedDate = state.today; document.getElementById("settings-dialog").close(); renderApp(); break;
    case "clear-personal-changes": {
      const confirmed = window.confirm("Isso removerá todas as alterações que você fez na sua escala neste dispositivo. A escala oficial continuará disponível.");
      if (confirmed) { personalChangesService?.clearPersonalChanges(); document.getElementById("settings-dialog").close(); showToast("Alterações pessoais removidas"); }
      break;
    }
    case "export-backup": exportBackup(); break;
    case "trigger-import": document.getElementById("backup-file")?.click(); break;
    case "add-activity": openActivityForm(state.selectedDate); break;
    case "restore-date": if (window.confirm("Restaurar este dia removerá todas as alterações pessoais desta data.")) { personalChangesService?.restoreDate(state.selectedResidentId, state.selectedDate); renderApp(); } break;
    case "edit-activity": { const activity = getPersonalActivity(button.dataset.date, button.dataset.activityId); if (activity) openActivityForm(button.dataset.date, activity); break; }
    case "move-activity": { const activity = getPersonalActivity(button.dataset.date, button.dataset.activityId); if (activity) openMoveForm(button.dataset.date, activity); break; }
    case "swap-activity": { const activity = getPersonalActivity(button.dataset.date, button.dataset.activityId); if (activity) openSwapForm(button.dataset.date, activity); break; }
    case "delete-activity": if (window.confirm("Excluir esta atividade da sua escala pessoal? A escala oficial não será alterada.")) { personalChangesService?.deleteActivity(state.selectedResidentId, button.dataset.date, button.dataset.activityId); document.getElementById("detail-dialog").close(); renderApp(); } break;
    case "restore-activity": personalChangesService?.restoreActivity(state.selectedResidentId, button.dataset.activityId); document.getElementById("detail-dialog").close(); renderApp(); break;
    case "show-detail": showDetail(button.dataset.residentId, button.dataset.date, button.dataset.activityId, button.dataset.personalCard === "true"); break;
    case "show-resident-details": showResidentDetails(button.dataset.residentId, button.dataset.date); break;
  }
  } catch (error) { console.error("Falha ao processar ação da interface:", error); showToast("Não foi possível concluir esta ação. Tente novamente."); }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "selected-date" && event.target.value) setSelectedDate(event.target.value);
  if (event.target.dataset.action === "swap-target-date") { const firstId = document.querySelector("#swap-form [name=firstActivityId]").value; const firstDate = document.querySelector("#swap-form [name=firstDate]").value; const activity = getPersonalActivity(firstDate, firstId); if (activity) openSwapForm(firstDate, activity, event.target.value); }
  if (event.target.id === "backup-file" && event.target.files[0]) importBackupFile(event.target.files[0]);
});
document.addEventListener("submit", (event) => {
  if (!event.target.matches("#activity-form, #move-form, #swap-form")) return;
  event.preventDefault();
  const form = new FormData(event.target);
  if (event.target.id === "activity-form") {
    const activity = { title: String(form.get("title")).trim(), startTime: form.get("startTime") || null, endTime: form.get("endTime") || null, location: form.get("location") || null, preceptor: form.get("preceptor") || null };
    if (activity.startTime && activity.endTime && activity.startTime >= activity.endTime) { event.target.querySelector(".form-warning").hidden = false; event.target.querySelector(".form-warning").textContent = "O horário inicial deve ser anterior ao final."; return; }
    const activityId = form.get("activityId"); const date = form.get("date");
    if (hasOverlap(date, activity, activityId || null) && !window.confirm("Esta atividade se sobrepõe a outra atividade neste dia. Salvar mesmo assim?")) return;
    if (activityId) personalChangesService?.updateActivity(state.selectedResidentId, date, activityId, activity); else personalChangesService?.createPersonalActivity(state.selectedResidentId, date, activity);
  }
  if (event.target.id === "move-form") {
    const sourceDate = form.get("sourceDate"); const targetDate = form.get("targetDate"); const activity = getPersonalActivity(sourceDate, form.get("activityId"));
    if (!activity || sourceDate === targetDate) return;
    if (hasOverlap(targetDate, activity) && !window.confirm("Esta atividade se sobrepõe a outra atividade neste dia. Mover mesmo assim?")) return;
    if (!window.confirm(`Mover ${activity.title} de ${formatDateShort(sourceDate)} para ${formatDateShort(targetDate)}?`)) return;
    personalChangesService?.moveActivity(state.selectedResidentId, sourceDate, targetDate, activity);
  }
  if (event.target.id === "swap-form") {
    const firstDate = form.get("firstDate"); const secondDate = form.get("targetDate"); const firstActivity = getPersonalActivity(firstDate, form.get("firstActivityId")); const secondActivity = getPersonalActivity(secondDate, form.get("secondActivityId"));
    if (!firstActivity || !secondActivity || !window.confirm(`Trocar ${firstActivity.title} por ${secondActivity.title}?`)) return;
    personalChangesService?.swapActivities(state.selectedResidentId, firstDate, firstActivity, secondDate, secondActivity);
  }
  document.getElementById("detail-dialog").close(); renderApp();
});
document.addEventListener("dragstart", (event) => { const card = event.target.closest("[data-personal-card]"); if (card) event.dataTransfer.setData("text/plain", JSON.stringify({ date: card.dataset.date, activityId: card.dataset.activityId })); });
document.addEventListener("dragover", (event) => { if (event.target.closest(".day-card[data-date]")) event.preventDefault(); });
document.addEventListener("drop", (event) => { const day = event.target.closest(".day-card[data-date]"); if (!day) return; event.preventDefault(); try { const payload = JSON.parse(event.dataTransfer.getData("text/plain")); const activity = getPersonalActivity(payload.date, payload.activityId); if (activity && payload.date !== day.dataset.date && window.confirm(`Mover ${activity.title} de ${formatDateShort(payload.date)} para ${formatDateShort(day.dataset.date)}?`)) { personalChangesService?.moveActivity(state.selectedResidentId, payload.date, day.dataset.date, activity); renderApp(); } } catch {} });
function exportBackup() {
  if (!localScheduleStorage) return showToast("Armazenamento local indisponível");
  const blob = new Blob([JSON.stringify(localScheduleStorage.exportBackup(RESIDENTS), null, 2)], { type: "application/json" });
  const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "backup-escala-pediatria.json"; link.click(); URL.revokeObjectURL(link.href); showToast("Backup exportado");
}
async function importBackupFile(file) {
  try { const parsed = JSON.parse(await file.text()); if (!window.confirm("Importar este backup substituirá seus dados locais atuais. Continuar?")) return; const result = localScheduleStorage?.importBackup(parsed, RESIDENTS); if (!result?.ok) throw new Error(result?.error || "Backup inválido."); loadPersistedState(); document.getElementById("settings-dialog").close(); renderApp(); showToast("Backup importado"); } catch (error) { console.error("Falha ao importar backup:", error); showToast(error.message || "Não foi possível importar o backup"); }
}
window.addEventListener("error", (event) => console.error("Erro não tratado na Escala Pediatria:", event.error || event.message));
window.addEventListener("unhandledrejection", (event) => console.error("Promessa não tratada na Escala Pediatria:", event.reason));
window.addEventListener("DOMContentLoaded", () => { loadPersistedState(); renderApp(); if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch((error) => console.error("Service worker não registrado:", error)); });
window.goToPreviousDay = goToPreviousDay;
window.goToNextDay = goToNextDay;
window.goToToday = goToToday;
window.setSelectedDate = setSelectedDate;
