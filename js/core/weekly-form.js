(function () {
  const TEMPLATE_BY_INSTITUTION = {
    AGAS: "assets/templates/ficha-agas.docx",
    UNIATENAS: "assets/templates/ficha-uniatenas.docx"
  };
  const WEEKDAY_KEYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const q = (parent, selector) => Array.from(parent.getElementsByTagNameNS(NS, selector));

  // Textos institucionais transcritos dos dois modelos oficiais fornecidos.
  const DESCRIPTIONS = {
    ENFERMARIA: "EVOLUÇÃO CLÍNICA DE PACIENTES INTERNADOS EM ENFERMARIA PEDIÁTRICA, DISCUSSÃO E CONDUÇÃO DE CASOS CLÍNICOS.",
    MATERNIDADE: "EVOLUÇÃO CLÍNICA DE RECÉM NASCIDOS INTERNADOS EM ALOJAMENTO CONJUNTO, RECEPÇÃO E ASSISTÊNCIA AO RECÉM NASCIDO EM SALA DE PARTO TANTO VAGINAIS QUANTO CESÁREAS, DISCUSSÃO E CONDUÇÃO DE CASOS CLÍNICOS.",
    "PRONTO SOCORRO": "EVOLUÇÃO CLÍNICA DE PACIENTES EM OBS, CONDUÇÃO DE CASOS GRAVES EM BOX DE EMERGÊNCIA, ATENDIMENTO DE PORTA E DISCUSSÃO E CONDUÇÃO DE CASOS CLÍNICOS.",
    AMBULATÓRIO: "ATENDIMENTO AMBULATORIAL EM PEDIATRIA, COM REALIZAÇÃO DE PUERICULTURA, ATENDIMENTOS CLÍNICOS GERAIS COM CONDUÇÃO DE CONDIÇÕES AGUDAS E CRÔNICAS DA INFÂNCIA ALÉM DA DISCUSSÃO DE CASOS CLÍNICOS.",
    "AULA TEÓRICA": "AULA TEÓRICA."
  };

  function pad(value) { return String(value).padStart(2, "0"); }
  function mondayOf(date) {
    const offset = WEEKDAY_KEYS.indexOf(getWeekdayKey(date));
    return addLocalDays(date, -offset);
  }
  function getWeeksForMonth(monthValue) {
    const [year, month] = monthValue.split("-").map(Number);
    const first = `${year}-${pad(month)}-01`;
    const last = `${year}-${pad(month)}-${pad(new Date(year, month, 0).getDate())}`;
    let current = mondayOf(first);
    if (current < first) current = addLocalDays(current, 7);
    const weeks = [];
    while (current <= last) {
      const end = addLocalDays(current, 6);
      weeks.push({ start: current, end, monthValue });
      current = addLocalDays(current, 7);
    }
    return weeks;
  }
  function safeFilename(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  }
  function fieldFor(activity) {
    const title = (activity.title || "").toLowerCase();
    if (title.includes("descanso")) return { field: "DESCANSO SEMANAL", description: "" };
    if (title.includes("enfermaria")) return { field: "ENFERMARIA", description: DESCRIPTIONS.ENFERMARIA };
    if (title.includes("maternidade") || title.includes("alojamento")) return { field: "MATERNIDADE", description: DESCRIPTIONS.MATERNIDADE };
    if (title.includes("pronto socorro") || title.includes("plantão urgência")) return { field: "PRONTO SOCORRO", description: DESCRIPTIONS["PRONTO SOCORRO"] };
    if (title.includes("aula")) return { field: "AULA TEÓRICA", description: DESCRIPTIONS["AULA TEÓRICA"] };
    if (title.includes("psf")) return { field: "AMB. PSF", description: DESCRIPTIONS.AMBULATÓRIO };
    if (title.includes("reumato")) return { field: "AMB. REUMATO", description: DESCRIPTIONS.AMBULATÓRIO };
    return { field: "AMBULATÓRIO", description: DESCRIPTIONS.AMBULATÓRIO };
  }
  function setText(element, value) {
    const texts = q(element, "t");
    if (!texts.length) return;
    texts[0].textContent = value || "";
    texts.slice(1).forEach((node) => { node.textContent = ""; });
  }
  function getCell(row, index) { return Array.from(row.children).filter((child) => child.namespaceURI === NS && child.localName === "tc")[index]; }
  function fillSlot(row, day, slot, activity, dailyDescription) {
    const cells = Array.from(row.children).filter((child) => child.namespaceURI === NS && child.localName === "tc");
    if (slot === 0 && cells[0]) setText(cells[0], day);
    if (cells[1]) setText(cells[1], `${slot + 1}º`);
    if (!activity) {
      [2, 3, 4].forEach((index) => cells[index] && setText(cells[index], ""));
      if (slot === 0 && cells[5]) setText(cells[5], dailyDescription || "");
      return;
    }
    const info = fieldFor(activity);
    if (cells[2]) setText(cells[2], activity.startTime || "");
    if (cells[3]) setText(cells[3], activity.endTime || "");
    if (cells[4]) setText(cells[4], info.field);
    // A coluna de atividade desenvolvida é uma descrição única do dia no modelo.
    // As linhas seguintes podem estar mescladas verticalmente, portanto só a primeira escreve nela.
    if (slot === 0 && cells[5]) setText(cells[5], dailyDescription || info.description);
  }
  function xmlTextNodes(documentXml) { return q(documentXml, "t"); }
  function replaceRanges(nodes, expression, replacement) {
    let joined = nodes.map((node) => node.textContent || "").join("");
    const matches = Array.from(joined.matchAll(expression));
    for (let matchIndex = matches.length - 1; matchIndex >= 0; matchIndex -= 1) {
      const match = matches[matchIndex]; const start = match.index; const end = start + match[0].length;
      let cursor = 0; let first = null; let last = null;
      nodes.forEach((node, index) => {
        const nodeStart = cursor; const nodeEnd = cursor + (node.textContent || "").length;
        if (first === null && start >= nodeStart && start <= nodeEnd) first = { index, offset: start - nodeStart };
        if (end >= nodeStart && end <= nodeEnd) last = { index, offset: end - nodeStart };
        cursor = nodeEnd;
      });
      if (!first || !last) continue;
      const initial = nodes[first.index].textContent || "";
      const final = nodes[last.index].textContent || "";
      nodes[first.index].textContent = initial.slice(0, first.offset) + replacement + (first.index === last.index ? initial.slice(last.offset) : "");
      for (let index = first.index + 1; index < last.index; index += 1) nodes[index].textContent = "";
      if (first.index !== last.index) nodes[last.index].textContent = final.slice(last.offset);
      joined = nodes.map((node) => node.textContent || "").join("");
    }
  }
  function keepFirstWeeklyForm(xml) {
    const body = q(xml, "body")[0]; if (!body) return;
    const children = Array.from(body.children);
    const starts = children.map((child, index) => ({ child, index, text: q(child, "t").map((node) => node.textContent || "").join("") }))
      .filter((entry) => entry.text.includes("Programa") && entry.text.includes("Resid"));
    if (starts.length < 2) return;
    for (let index = children.length - 1; index >= starts[1].index; index -= 1) {
      if (children[index].localName !== "sectPr") body.removeChild(children[index]);
    }
  }
  function removeUniatenasLeadingSpacer(xml) {
    const body = q(xml, "body")[0];
    const firstElement = body && Array.from(body.children).find((child) => child.localName !== "sectPr");
    if (!firstElement || firstElement.localName !== "p") return;
    const hasVisibleText = q(firstElement, "t").some((node) => (node.textContent || "").trim());
    const hasSectionProperties = q(firstElement, "sectPr").length > 0;
    if (!hasVisibleText && !hasSectionProperties) body.removeChild(firstElement);
  }
  function findCalendarTables(xml) {
    return q(xml, "tbl").filter((table) => {
      const firstRow = Array.from(table.children).find((child) => child.localName === "tr");
      return firstRow && q(firstRow, "t").map((node) => node.textContent || "").join("").includes("Dia");
    }).slice(0, 2);
  }
  function replaceMetadata(xml, resident, standardWeekKey, monthValue) {
    const textNodes = xmlTextNodes(xml);
    replaceRanges(textNodes, /\b\d{2}\/20\d{2}\b/g, `${monthValue.slice(5, 7)}/${monthValue.slice(0, 4)}`);
    replaceRanges(textNodes, /R[12]\s*[A-E]/g, standardWeekKey.replace("-", " "));
    const normalize = (value) => (value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const officialNames = RESIDENTS.map((item) => normalize(item.fullName)).filter(Boolean);
    const nameBoxes = Array.from(xml.getElementsByTagNameNS(NS, "txbxContent")).filter((box) => {
      const value = normalize(q(box, "t").map((node) => node.textContent || "").join(""));
      return officialNames.some((fullName) => value.includes(fullName));
    });
    // Limpa apenas textos de exemplo que estejam fora do campo institucional de nome.
    q(xml, "t").forEach((node) => {
      const value = normalize(node.textContent);
      if (officialNames.includes(value)) node.textContent = "";
    });
    // O modelo já possui a caixa de texto na posição correta da linha do residente.
    // Preenchê-la preserva a geometria, as fontes e as quebras de página do DOCX.
    nameBoxes.forEach((box) => setText(box, resident.fullName.toUpperCase()));
    // Os modelos retocados mantêm as caixas R1/R2/R3 sem marcação automática.
  }

  function getOrCreateWordChild(parent, localName, xml) {
    let child = Array.from(parent.children).find((item) => item.namespaceURI === NS && item.localName === localName);
    if (!child) { child = xml.createElementNS(NS, `w:${localName}`); parent.appendChild(child); }
    return child;
  }
  function compactAgasDescriptions(xml, tables) {
    // O formulário AGAS usa três linhas fixas por dia. Com duas ou três atividades,
    // a descrição concatenada precisa de entrelinha menor para não deslocar as notas
    // e as assinaturas para páginas isoladas.
    tables.forEach((table) => {
      const rows = Array.from(table.children).filter((child) => child.localName === "tr");
      rows.slice(2).forEach((row) => {
        const cells = Array.from(row.children).filter((child) => child.namespaceURI === NS && child.localName === "tc");
        const descriptionCell = cells[5];
        if (!descriptionCell) return;
        q(descriptionCell, "p").forEach((paragraph) => {
          const paragraphProperties = getOrCreateWordChild(paragraph, "pPr", xml);
          const spacing = getOrCreateWordChild(paragraphProperties, "spacing", xml);
          spacing.setAttributeNS(NS, "w:before", "0");
          spacing.setAttributeNS(NS, "w:after", "0");
          spacing.setAttributeNS(NS, "w:line", "200");
          spacing.setAttributeNS(NS, "w:lineRule", "atLeast");
        });
        q(descriptionCell, "rPr").forEach((runProperties) => {
          const size = getOrCreateWordChild(runProperties, "sz", xml);
          const complexSize = getOrCreateWordChild(runProperties, "szCs", xml);
          size.setAttributeNS(NS, "w:val", "18");
          complexSize.setAttributeNS(NS, "w:val", "18");
        });
      });
    });
    // Esses marcadores são apenas cache de uma renderização antiga do modelo.
    // Removê-los força Word/LibreOffice a recalcular a paginação compactada.
    Array.from(xml.getElementsByTagNameNS(NS, "lastRenderedPageBreak")).forEach((node) => node.parentNode.removeChild(node));
  }
  async function generate({ residentId, institution, weeks, monthValue }) {
    if (!window.JSZip) throw new Error("Biblioteca de documento não foi carregada.");
    const resident = RESIDENTS.find((item) => item.id === residentId);
    if (!resident || !weeks.length || !TEMPLATE_BY_INSTITUTION[institution]) throw new Error("Selecione residente, instituição e pelo menos uma semana.");
    const template = await fetch(TEMPLATE_BY_INSTITUTION[institution]).then((response) => {
      if (!response.ok) throw new Error("Não foi possível carregar o modelo institucional.");
      return response.arrayBuffer();
    });
    // Uma ficha é emitida por arquivo para preservar sem alterações as páginas e quebras do modelo.
    const results = [];
    for (const week of weeks) {
      const zip = await JSZip.loadAsync(template);
      const documentFile = zip.file("word/document.xml");
      const xml = new DOMParser().parseFromString(await documentFile.async("string"), "application/xml");
      keepFirstWeeklyForm(xml);
      if (institution === "UNIATENAS") removeUniatenasLeadingSpacer(xml);
      const mondaySchedule = getOfficialScheduleForResident(resident.id, week.start);
      if (mondaySchedule.status !== "OK") throw new Error("A semana selecionada está fora do período cadastrado.");
      replaceMetadata(xml, resident, mondaySchedule.standardWeekKey, monthValue);
      const tables = findCalendarTables(xml);
      if (tables.length !== 2) throw new Error("O modelo institucional não possui a estrutura semanal esperada.");
        for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const date = addLocalDays(week.start, dayIndex);
        const schedule = getOfficialScheduleForResident(resident.id, date);
        const activities = schedule.status === "OK" ? schedule.activities.slice(0, 3) : [];
        const dailyDescription = activities.map((activity) => fieldFor(activity).description).filter(Boolean).join(" ");
        const table = tables[dayIndex < 3 ? 0 : 1];
        const rows = Array.from(table.children).filter((child) => child.localName === "tr");
        const rowStart = 2 + (dayIndex < 3 ? dayIndex : dayIndex - 3) * 3;
        for (let slot = 0; slot < 3; slot += 1) fillSlot(rows[rowStart + slot], dayIndex === 0 || slot === 0 ? date.slice(8) : "", slot, activities[slot], dailyDescription);
        }
      if (institution === "AGAS") compactAgasDescriptions(xml, tables);
      zip.file("word/document.xml", new XMLSerializer().serializeToString(xml));
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
      const levelAndLetter = mondaySchedule.standardWeekKey.replace("-", "-");
      results.push({ blob, filename: `${safeFilename(resident.name)}_${levelAndLetter}_${week.start.split("-").reverse().join("-")}_a_${week.end.split("-").reverse().join("-")}_${institution}.docx` });
    }
    return results;
  }
  window.weeklyFormService = { getWeeksForMonth, mondayOf, generate };
}());
