(() => {
const STORAGE_KEYS = Object.freeze({
  selectedResident: "pediatriaSchedule:v1:selectedResident",
  preferences: "pediatriaSchedule:v1:preferences",
  personalChanges: "pediatriaSchedule:v1:personalChanges"
});

const DEFAULT_PREFERENCES = Object.freeze({ defaultView: "today", lastSelectedDate: null, weekStartsOn: 1 });
const DEFAULT_PERSONAL_CHANGES = Object.freeze({ version: 1, changes: [] });

function createStorageService(storage) {
  function safely(action, fallback) {
    try { return action(); } catch { return fallback; }
  }

  function readRaw(key) { return safely(() => storage.getItem(key), null); }
  function writeRaw(key, value) { return safely(() => { storage.setItem(key, value); return true; }, false); }
  function remove(key) { return safely(() => { storage.removeItem(key); return true; }, false); }

  function readJson(key, fallback, validate) {
    const raw = readRaw(key);
    if (raw === null) return structuredClone(fallback);
    try {
      const parsed = JSON.parse(raw);
      if (!validate(parsed)) throw new Error("Formato inválido");
      return parsed;
    } catch {
      remove(key);
      return structuredClone(fallback);
    }
  }

  function getSelectedResidentId(residents) {
    const residentId = readRaw(STORAGE_KEYS.selectedResident);
    if (residentId === null) return null;
    if (typeof residentId !== "string" || !residents.some((resident) => resident.id === residentId)) {
      remove(STORAGE_KEYS.selectedResident);
      return null;
    }
    return residentId;
  }

  function saveSelectedResidentId(residentId, residents) {
    if (!residents.some((resident) => resident.id === residentId)) return false;
    return writeRaw(STORAGE_KEYS.selectedResident, residentId);
  }

  function getPreferences() {
    const document = readJson(STORAGE_KEYS.preferences, { version: 1, values: { ...DEFAULT_PREFERENCES } }, (value) =>
      value && value.version === 1 && value.values && typeof value.values === "object" && !Array.isArray(value.values)
    );
    return { ...DEFAULT_PREFERENCES, ...document.values };
  }

  function savePreferences(values) {
    const next = { ...getPreferences(), ...values };
    return writeRaw(STORAGE_KEYS.preferences, JSON.stringify({ version: 1, values: next }));
  }

  function resetPreferences() { return remove(STORAGE_KEYS.preferences); }

  function getPersonalChangesDocument() {
    return readJson(STORAGE_KEYS.personalChanges, structuredClone(DEFAULT_PERSONAL_CHANGES), (value) =>
      value && value.version === 1 && Array.isArray(value.changes)
    );
  }

  function savePersonalChangesDocument(document) {
    if (!document || document.version !== 1 || !Array.isArray(document.changes)) return false;
    return writeRaw(STORAGE_KEYS.personalChanges, JSON.stringify(document));
  }

  function clearPersonalChanges() { return remove(STORAGE_KEYS.personalChanges); }

  function exportBackup(residents) {
    return { version: 1, selectedResidentId: getSelectedResidentId(residents), preferences: { version: 1, values: getPreferences() }, personalChanges: getPersonalChangesDocument() };
  }

  function importBackup(backup, residents) {
    if (!backup || backup.version !== 1 || !Array.isArray(backup.personalChanges?.changes) || backup.personalChanges.version !== 1 || !backup.preferences?.values || backup.preferences.version !== 1) return { ok: false, error: "Arquivo de backup incompatível." };
    if (backup.selectedResidentId !== null && !residents.some((resident) => resident.id === backup.selectedResidentId)) return { ok: false, error: "O residente do backup não existe nesta escala." };
    if (!savePersonalChangesDocument(backup.personalChanges) || !writeRaw(STORAGE_KEYS.preferences, JSON.stringify(backup.preferences))) return { ok: false, error: "Não foi possível salvar o backup neste dispositivo." };
    if (backup.selectedResidentId) writeRaw(STORAGE_KEYS.selectedResident, backup.selectedResidentId); else remove(STORAGE_KEYS.selectedResident);
    return { ok: true };
  }

  return { STORAGE_KEYS, getSelectedResidentId, saveSelectedResidentId, getPreferences, savePreferences, resetPreferences, getPersonalChangesDocument, savePersonalChangesDocument, clearPersonalChanges, exportBackup, importBackup };
}

let browserStorage = null;
try { browserStorage = typeof localStorage !== "undefined" ? localStorage : null; } catch { browserStorage = null; }
const localScheduleStorage = browserStorage ? createStorageService(browserStorage) : null;

if (typeof module !== "undefined") module.exports = { STORAGE_KEYS, DEFAULT_PREFERENCES, DEFAULT_PERSONAL_CHANGES, createStorageService };
if (typeof window !== "undefined") Object.assign(window, { STORAGE_KEYS, DEFAULT_PREFERENCES, DEFAULT_PERSONAL_CHANGES, localScheduleStorage });
})();
