function renderResidentPicker() {
  const groups = ["R1", "R2"].map((level) => `<section class="picker-group"><h3>${level}</h3>${RESIDENTS.filter((resident) => resident.level === level).map((resident) => `<button type="button" class="resident-option" data-action="select-resident" data-resident-id="${resident.id}"><span>${resident.name}</span><span>${resident.level}</span></button>`).join("")}</section>`).join("");
  return `<div class="dialog-content"><div class="dialog-header"><div><h2 id="resident-dialog-title">Selecione seu nome</h2><p class="muted">A seleção vale somente durante esta sessão.</p></div><button class="dialog-close" type="button" data-action="close-dialog" aria-label="Fechar">×</button></div>${groups}</div>`;
}

function openResidentPicker() {
  const dialog = document.getElementById("resident-dialog");
  dialog.innerHTML = renderResidentPicker();
  if (!dialog.open) dialog.showModal();
}

window.openResidentPicker = openResidentPicker;
