(function startPlanoCorte() {
  "use strict";

  const DEFAULT_PROFILE = Object.freeze({ widthMm: 90, thicknessMm: 45 });
  const COLORS = ["#cfe5da", "#f2d5c3", "#d8dfef", "#eee2b4", "#ddd2e8", "#cbe3e2"];
  const byId = (id) => document.getElementById(id);
  const formatMm = (value) => Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 1 });
  const uid = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const LIMITS = Object.freeze({
    maxFiles: 100,
    maxFileBytes: 2 * 1024 * 1024,
    maxPieces: 1000,
    maxPlans: 300,
    maxCutsPerPiece: 200,
    maxBarsPerPlan: 1000,
    maxQuantityPerPiece: 1000,
    maxRequestedPieces: 10000,
    maxDimensionMm: 100000,
    maxTextLength: 120,
  });
  const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
  const cleanText = (value, maxLength = LIMITS.maxTextLength) => String(value ?? "").trim().slice(0, maxLength);
  function boundedNumber(value, fallback, min = 0, max = LIMITS.maxDimensionMm) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  }

  const demoPieces = [
    {
      schemaVersion: 1, type: "piece", id: "demo-travessa-420", code: "TRAV-420", name: "Travessa 420",
      profile: DEFAULT_PROFILE, lengthMm: 420, source: "demonstração",
      cuts: [
        { id: "c1", p1: { x: 0, y: 0 }, p2: { x: 0, y: 90 }, inclinationDeg: 0 },
        { id: "c2", p1: { x: 420, y: 0 }, p2: { x: 400, y: 90 }, inclinationDeg: -12.53 },
      ],
    },
    {
      schemaVersion: 1, type: "piece", id: "demo-longarina-780", code: "LONG-780", name: "Longarina 780",
      profile: DEFAULT_PROFILE, lengthMm: 780, source: "demonstração",
      cuts: [
        { id: "c1", p1: { x: 0, y: 0 }, p2: { x: 30, y: 90 }, inclinationDeg: 18.43 },
        { id: "c2", p1: { x: 780, y: 0 }, p2: { x: 750, y: 90 }, inclinationDeg: -18.43 },
      ],
    },
    {
      schemaVersion: 1, type: "piece", id: "demo-montante-600", code: "MONT-600", name: "Montante 600",
      profile: DEFAULT_PROFILE, lengthMm: 600, source: "demonstração",
      cuts: [
        { id: "c1", p1: { x: 0, y: 0 }, p2: { x: 0, y: 90 }, inclinationDeg: 0 },
        { id: "c2", p1: { x: 600, y: 0 }, p2: { x: 600, y: 90 }, inclinationDeg: 0 },
      ],
    },
  ];

  const state = {
    pieces: demoPieces.map(normalizePiece),
    cuts: [],
    editingId: null,
    rootHandle: null,
    piecesHandle: null,
    plansHandle: null,
    savedPlans: [],
    quantities: {},
    activePlan: null,
  };

  let toastTimer;
  function toast(message, kind = "normal") {
    const element = byId("toast");
    element.textContent = message;
    element.className = `toast show${kind === "error" ? " error" : ""}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { element.className = "toast"; }, 3200);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
    })[character]);
  }

  function slug(value) {
    return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "arquivo";
  }

  function switchTab(name) {
    const selected = name === "plans" ? "plans" : "pieces";
    document.querySelectorAll(".tab[data-tab]").forEach((button) => {
      const active = button.dataset.tab === selected;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    [["piecesPage", "pieces"], ["plansPage", "plans"]].forEach(([id, tab]) => {
      const page = byId(id), active = tab === selected;
      page.classList.toggle("active", active);
      page.setAttribute("aria-hidden", active ? "false" : "true");
    });
    if (selected === "plans") renderOrderItems();
    document.querySelector(".main-shell")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function currentLength() {
    return boundedNumber(byId("partLength").value, 1, 1);
  }

  function currentProfile() {
    return normalizeProfile({ widthMm: byId("partWidth").value, thicknessMm: byId("partThickness").value });
  }

  function currentStockProfile() {
    return normalizeProfile({ widthMm: byId("stockWidth").value, thicknessMm: byId("stockThickness").value });
  }

  function requiredPieceSpan(piece) {
    const points = (piece.cuts || []).flatMap((cut) => [Number(cut.p1?.x), Number(cut.p2?.x)]).filter(Number.isFinite);
    return points.length ? Math.max(...points) - Math.min(...points) : Number(piece.lengthMm);
  }

  function isPieceCompatibleWithStock(piece) {
    const stock = currentStockProfile();
    const pieceProfile = normalizeProfile(piece.profile);
    const stockLength = Math.max(0, Number(byId("stockLength").value) || 0);
    return Math.abs(pieceProfile.widthMm - stock.widthMm) <= 0.01
      && Math.abs(pieceProfile.thicknessMm - stock.thicknessMm) <= 0.01
      && requiredPieceSpan(piece) <= stockLength + 0.01;
  }

  function normalizeProfile(profile = {}) {
    return {
      widthMm: boundedNumber(profile.widthMm, DEFAULT_PROFILE.widthMm, 1),
      thicknessMm: boundedNumber(profile.thicknessMm ?? profile.heightMm, DEFAULT_PROFILE.thicknessMm, 1),
    };
  }

  function normalizeCut(cut = {}, profile) {
    const faceWidthMm = profile.widthMm;
    const p1 = isPlainObject(cut.p1) ? cut.p1 : {};
    const p2 = isPlainObject(cut.p2) ? cut.p2 : {};
    const rawTop = Number(p1.y) === 0 ? p1 : p2;
    const rawBottom = rawTop === p1 ? p2 : p1;
    const topX = boundedNumber(rawTop.x, 0, -LIMITS.maxDimensionMm, LIMITS.maxDimensionMm);
    const bottomX = boundedNumber(rawBottom.x, topX, -LIMITS.maxDimensionMm, LIMITS.maxDimensionMm);
    const origin = cut.origin === "bottom" ? "bottom" : "top";
    const inferredAngle = Math.atan2(bottomX - topX, boundedNumber(rawBottom.y, faceWidthMm, 1)) * 180 / Math.PI;
    const angleDeg = Number.isFinite(Number(cut.angleDeg)) ? Number(cut.angleDeg) : Number.isFinite(Number(cut.inclinationDeg)) ? Number(cut.inclinationDeg) : inferredAngle;
    const startX = Number.isFinite(Number(cut.startX)) ? Number(cut.startX) : origin === "top" ? topX : bottomX;
    return projectCut(origin, startX, angleDeg, faceWidthMm, cleanText(cut.id, 120) || uid());
  }

  function normalizePiece(piece = {}) {
    const profile = normalizeProfile(isPlainObject(piece.profile) ? piece.profile : {});
    const updatedAt = Number.isFinite(Date.parse(piece.updatedAt)) ? new Date(piece.updatedAt).toISOString() : new Date().toISOString();
    return {
      schemaVersion: 2, type: "piece", id: cleanText(piece.id, 120) || uid(),
      code: cleanText(piece.code, 80).toUpperCase(), name: cleanText(piece.name, LIMITS.maxTextLength),
      profile, lengthMm: boundedNumber(piece.lengthMm, 1, 1),
      cuts: (Array.isArray(piece.cuts) ? piece.cuts : []).slice(0, LIMITS.maxCutsPerPiece).map((cut) => normalizeCut(cut, profile)),
      updatedAt, source: cleanText(piece.source, 80) || "arquivo JSON",
    };
  }

  function projectCut(origin, startX, angleDeg, faceWidthMm, id = uid()) {
    const x = Number(Number(startX).toFixed(2));
    const angle = Number(Number(angleDeg).toFixed(2));
    if (!Number.isFinite(x) || Math.abs(x) > LIMITS.maxDimensionMm) throw new Error(`Informe uma posição X entre -${LIMITS.maxDimensionMm} e ${LIMITS.maxDimensionMm} mm.`);
    if (!Number.isFinite(angle) || angle <= -89.9 || angle >= 89.9) {
      throw new Error("O ângulo deve estar entre -89,89° e 89,89°.");
    }
    const deltaX = Math.tan(angle * Math.PI / 180) * faceWidthMm;
    const topX = origin === "top" ? x : x - deltaX;
    const bottomX = origin === "bottom" ? x : x + deltaX;
    return {
      id,
      origin,
      startX: Number(x.toFixed(2)),
      angleDeg: Number(angle.toFixed(2)),
      p1: { x: Number(topX.toFixed(4)), y: 0 },
      p2: { x: Number(bottomX.toFixed(4)), y: faceWidthMm },
      inclinationDeg: Number(angle.toFixed(2)),
    };
  }

  function updateCutProjection() {
    const origin = byId("cutOrigin").value;
    const startX = Number(byId("cutStartX").value);
    const angle = Number(byId("cutAngle").value);
    const deltaX = Math.tan(angle * Math.PI / 180) * currentProfile().widthMm;
    const oppositeX = origin === "top" ? startX + deltaX : startX - deltaX;
    const oppositeEdge = origin === "top" ? "inferior" : "superior";
    const valid = Number.isFinite(oppositeX);
    const outside = valid && (startX < 0 || startX > currentLength() || oppositeX < 0 || oppositeX > currentLength());
    byId("cutProjection").textContent = Number.isFinite(oppositeX)
      ? `Ponto na borda ${oppositeEdge}: x ${oppositeX.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mm${outside ? " · avanço externo, irá para a beirada da barra" : ""}`
      : "Informe uma posição e um ângulo válidos.";
    byId("cutProjection").classList.toggle("invalid", !valid);
    byId("cutProjection").classList.toggle("edge", outside);
  }

  function addCutFromInputs() {
    if (state.cuts.length >= LIMITS.maxCutsPerPiece) { toast(`Limite de ${LIMITS.maxCutsPerPiece} cortes por peça atingido.`, "error"); return; }
    try {
      const cut = projectCut(
        byId("cutOrigin").value,
        Number(byId("cutStartX").value),
        Number(byId("cutAngle").value),
        currentProfile().widthMm,
      );
      state.cuts.push(cut);
      byId("cutInstruction").textContent = "Corte adicionado. Informe os dados do próximo corte ou salve a peça.";
      renderCanvas();
      toast(`Corte de ${cut.angleDeg.toFixed(2)}° adicionado.`);
    } catch (error) {
      toast(error.message, "error");
    }
  }

  function updateProfileDrawing() {
    const faceWidth = currentProfile().widthMm;
    state.cuts = state.cuts.map((cut) => projectCut(cut.origin, cut.startX, cut.angleDeg, faceWidth, cut.id));
    renderCanvas();
  }

  function renderCanvas() {
    const svg = byId("pieceCanvas");
    const length = currentLength();
    const profile = currentProfile();
    const faceWidth = profile.widthMm;
    const cutPointsX = state.cuts.flatMap((cut) => [Number(cut.p1.x), Number(cut.p2.x)]);
    const geometryMinX = Math.min(0, ...cutPointsX);
    const geometryMaxX = Math.max(length, ...cutPointsX);
    const horizontalPadding = Math.max(25, (geometryMaxX - geometryMinX) * .045);
    svg.setAttribute("viewBox", `${geometryMinX - horizontalPadding} -38 ${geometryMaxX - geometryMinX + horizontalPadding * 2} ${faceWidth + 76}`);
    byId("drawingCaption").textContent = `${formatMm(length)} × ${formatMm(faceWidth)} mm · esp. ${formatMm(profile.thicknessMm)} mm`;

    const ticks = [];
    const tickStep = length <= 800 ? 50 : length <= 2000 ? 100 : 250;
    for (let x = 0; x <= length; x += tickStep) {
      ticks.push(`<line class="piece-grid-line" x1="${x}" y1="-8" x2="${x}" y2="${faceWidth + 8}" stroke="#d9ddd6" stroke-width="1" vector-effect="non-scaling-stroke"/>`);
      ticks.push(`<text class="piece-grid-label" x="${x}" y="${faceWidth + 23}" text-anchor="middle" fill="#718079" font-size="9">${formatMm(x)}</text>`);
    }

    const cutMarkup = state.cuts.map((cut, index) => {
      const middleX = (cut.p1.x + cut.p2.x) / 2;
      return `
        <g>
          <line class="piece-cut-line" x1="${cut.p1.x}" y1="${cut.p1.y}" x2="${cut.p2.x}" y2="${cut.p2.y}"
                stroke="#d06b32" stroke-width="3" vector-effect="non-scaling-stroke"/>
          <circle class="piece-cut-point" cx="${cut.p1.x}" cy="${cut.p1.y}" r="4" fill="#fffefa" stroke="#d06b32" stroke-width="2" vector-effect="non-scaling-stroke"/>
          <circle class="piece-cut-point" cx="${cut.p2.x}" cy="${cut.p2.y}" r="4" fill="#fffefa" stroke="#d06b32" stroke-width="2" vector-effect="non-scaling-stroke"/>
          <text class="piece-cut-label" x="${middleX}" y="-14" text-anchor="middle" fill="#91451f" font-size="9" font-weight="800">C${index + 1} · ${cut.inclinationDeg.toFixed(1)}°</text>
        </g>`;
    }).join("");
    const boundaryCuts = [...state.cuts].sort((a, b) => ((a.p1.x + a.p2.x) - (b.p1.x + b.p2.x)));
    const leftCut = boundaryCuts[0];
    const rightCut = boundaryCuts.at(-1);
    const actualShape = boundaryCuts.length >= 2
      ? `<polygon class="piece-shape" points="${leftCut.p1.x},0 ${rightCut.p1.x},0 ${rightCut.p2.x},${faceWidth} ${leftCut.p2.x},${faceWidth}"
                  fill="#dcebe3" stroke="#235c48" stroke-width="2" vector-effect="non-scaling-stroke"/>`
      : `<rect class="piece-shape" x="0" y="0" width="${length}" height="${faceWidth}" rx="2"
               fill="#dcebe3" stroke="#235c48" stroke-width="2" vector-effect="non-scaling-stroke"/>`;

    svg.innerHTML = `
      ${ticks.join("")}
      <rect class="piece-reference" x="0" y="0" width="${length}" height="${faceWidth}" rx="2"
            fill="none" stroke="#a8b5ae" stroke-dasharray="5 5" stroke-width="1" vector-effect="non-scaling-stroke"/>
      ${actualShape}
      <line class="piece-centerline" x1="0" y1="${faceWidth / 2}" x2="${length}" y2="${faceWidth / 2}"
            stroke="#7aa18f" stroke-dasharray="5 5" stroke-width="1" vector-effect="non-scaling-stroke"/>
      ${cutMarkup}
      <text class="piece-dimension" x="${length / 2}" y="${faceWidth + 36}" text-anchor="middle" fill="#3d4b45" font-size="10" font-weight="700">${formatMm(length)} mm</text>
      <text class="piece-dimension" x="${-horizontalPadding * .55}" y="${faceWidth / 2}" text-anchor="middle" fill="#3d4b45" font-size="9" transform="rotate(-90 ${-horizontalPadding * .55} ${faceWidth / 2})">${formatMm(faceWidth)} mm</text>`;
    renderCutsList();
    updateCutProjection();
  }

  function renderCutsList() {
    byId("cutCount").textContent = String(state.cuts.length);
    const container = byId("cutsList");
    if (!state.cuts.length) {
      container.innerHTML = '<div class="cuts-empty">Nenhum corte definido. A peça precisa de pelo menos dois cortes.</div>';
      return;
    }
    container.innerHTML = state.cuts.map((cut, index) => `
      <article class="cut-card">
        <div class="cut-index">${index + 1}</div>
        <div>
          <strong>${cut.origin === "top" ? "Superior" : "Inferior"} · X ${Number(cut.startX).toFixed(2).replace(".", ",")} mm</strong>
          <span>ângulo ${Number(cut.angleDeg).toFixed(2).replace(".", ",")}° · topo ${formatMm(cut.p1.x)} / base ${formatMm(cut.p2.x)} mm</span>
        </div>
        <button class="remove-cut" type="button" data-remove-cut="${escapeHtml(cut.id)}" aria-label="Remover corte ${index + 1}">×</button>
      </article>`).join("");
  }

  function miniatureSvg(piece) {
    const length = Number(piece.lengthMm);
    const faceWidth = normalizeProfile(piece.profile).widthMm;
    const pointsX = (piece.cuts || []).flatMap((cut) => [Number(cut.p1.x), Number(cut.p2.x)]);
    const minX = Math.min(0, ...pointsX);
    const maxX = Math.max(length, ...pointsX);
    const padding = Math.max(10, (maxX - minX) * .03);
    const cuts = (piece.cuts || []).map((cut) => `
      <line class="piece-cut-line" x1="${cut.p1.x}" y1="${cut.p1.y}" x2="${cut.p2.x}" y2="${cut.p2.y}" stroke="#d06b32" stroke-width="2" vector-effect="non-scaling-stroke"/>`).join("");
    const boundaryCuts = [...(piece.cuts || [])].sort((a, b) => ((a.p1.x + a.p2.x) - (b.p1.x + b.p2.x)));
    const leftCut = boundaryCuts[0];
    const rightCut = boundaryCuts.at(-1);
    const shape = boundaryCuts.length >= 2
      ? `<polygon class="piece-shape" points="${leftCut.p1.x},0 ${rightCut.p1.x},0 ${rightCut.p2.x},${faceWidth} ${leftCut.p2.x},${faceWidth}" fill="#dcebe3" stroke="#235c48" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`
      : `<rect class="piece-shape" x="0" y="0" width="${length}" height="${faceWidth}" fill="#dcebe3" stroke="#235c48" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`;
    return `<svg viewBox="${minX - padding} -10 ${maxX - minX + padding * 2} ${faceWidth + 20}" aria-hidden="true">
      <rect class="piece-reference" x="0" y="0" width="${length}" height="${faceWidth}" fill="none" stroke="#a8b5ae" stroke-dasharray="4 4" stroke-width="1" vector-effect="non-scaling-stroke"/>
      ${shape}
      ${cuts}</svg>`;
  }

  function renderPieces() {
    byId("pieceLibraryCount").textContent = `${state.pieces.length} ${state.pieces.length === 1 ? "peça" : "peças"}`;
    const grid = byId("piecesGrid");
    if (!state.pieces.length) {
      grid.innerHTML = '<div class="cuts-empty">A pasta ainda não tem peças. Crie a primeira no editor acima.</div>';
      renderOrderItems();
      return;
    }
    grid.innerHTML = state.pieces.map((piece) => `
      <article class="piece-card">
        <div class="piece-card-top">
          <div><span class="code">${escapeHtml(piece.code)}</span><h3>${escapeHtml(piece.name)}</h3><p>${formatMm(piece.lengthMm)} mm · largura ${formatMm(piece.profile.widthMm)} · esp. ${formatMm(piece.profile.thicknessMm)} mm · ${piece.cuts.length} cortes</p></div>
        </div>
        <div class="mini-piece">${miniatureSvg(piece)}</div>
        <div class="card-actions">
          <span class="source-badge">${escapeHtml(piece.source || "arquivo JSON")}</span>
          <button class="icon-button" type="button" data-edit-piece="${escapeHtml(piece.id)}">Abrir no editor</button>
        </div>
      </article>`).join("");
    renderOrderItems();
  }

  function resetEditor() {
    state.editingId = null;
    state.cuts = [];
    byId("partCode").value = "";
    byId("partName").value = "";
    byId("partLength").value = "600";
    byId("partWidth").value = String(DEFAULT_PROFILE.widthMm);
    byId("partThickness").value = String(DEFAULT_PROFILE.thicknessMm);
    byId("cutOrigin").value = "top";
    byId("cutStartX").value = "0.00";
    byId("cutAngle").value = "0.00";
    byId("savePieceButton").textContent = "Salvar arquivo da peça";
    byId("cutInstruction").textContent = "Ângulo 0° é vertical. Positivo significa que o ponto inferior fica à direita do superior.";
    renderCanvas();
  }

  function editPiece(id) {
    const piece = state.pieces.find((item) => item.id === id);
    if (!piece) return;
    switchTab("pieces");
    state.editingId = piece.id;
    state.cuts = structuredClone(normalizePiece(piece).cuts);
    byId("partCode").value = piece.code;
    byId("partName").value = piece.name;
    byId("partLength").value = piece.lengthMm;
    byId("partWidth").value = piece.profile.widthMm;
    byId("partThickness").value = piece.profile.thicknessMm;
    byId("savePieceButton").textContent = "Atualizar arquivo da peça";
    renderCanvas();
    document.querySelector(".main-shell")?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function buildPieceFromEditor() {
    const code = cleanText(byId("partCode").value, 80).toUpperCase();
    const name = cleanText(byId("partName").value, LIMITS.maxTextLength);
    const lengthMm = currentLength();
    const profile = currentProfile();
    if (!code || !name) throw new Error("Preencha o código e o nome da peça.");
    if (state.cuts.length < 2) throw new Error("Defina pelo menos dois cortes para formar a peça.");
    return {
      schemaVersion: 2,
      type: "piece",
      id: state.editingId || uid(),
      code,
      name,
      profile,
      lengthMm,
      cuts: structuredClone(state.cuts).sort((a, b) => ((a.p1.x + a.p2.x) - (b.p1.x + b.p2.x))),
      updatedAt: new Date().toISOString(),
      source: state.rootHandle ? "pasta /pecas" : "sessão atual",
    };
  }

  async function writeJson(directoryHandle, filename, value) {
    const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(value, null, 2));
    await writable.close();
  }

  function downloadJson(filename, value) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function savePiece() {
    try {
      const piece = buildPieceFromEditor();
      const filename = `${slug(piece.code)}.json`;
      if (state.piecesHandle) await writeJson(state.piecesHandle, filename, piece);
      else downloadJson(filename, piece);
      const existingIndex = state.pieces.findIndex((item) => item.id === piece.id || item.code === piece.code);
      if (existingIndex >= 0) state.pieces.splice(existingIndex, 1, piece);
      else state.pieces.push(piece);
      renderPieces();
      toast(state.piecesHandle ? `Peça salva em pecas/${filename}.` : "Peça baixada como JSON. Selecione a pasta para salvar diretamente.");
      resetEditor();
    } catch (error) {
      toast(error.message, "error");
    }
  }

  function isValidImportedCut(cut) {
    if (!isPlainObject(cut)) return false;
    if (Number.isFinite(Number(cut.startX)) && Math.abs(Number(cut.startX)) <= LIMITS.maxDimensionMm && Number.isFinite(Number(cut.angleDeg ?? cut.inclinationDeg)) && Math.abs(Number(cut.angleDeg ?? cut.inclinationDeg)) < 89.9) return true;
    return isPlainObject(cut.p1) && isPlainObject(cut.p2) && [cut.p1.x, cut.p1.y, cut.p2.x, cut.p2.y].every((value) => Number.isFinite(Number(value)) && Math.abs(Number(value)) <= LIMITS.maxDimensionMm);
  }

  function isPieceFile(value) {
    return isPlainObject(value) && value.type === "piece"
      && typeof value.code === "string" && cleanText(value.code, 80).length > 0
      && typeof value.name === "string" && cleanText(value.name).length > 0
      && Number.isFinite(Number(value.lengthMm)) && Number(value.lengthMm) > 0 && Number(value.lengthMm) <= LIMITS.maxDimensionMm
      && Array.isArray(value.cuts) && value.cuts.length >= 2 && value.cuts.length <= LIMITS.maxCutsPerPiece
      && value.cuts.every(isValidImportedCut);
  }

  function isPlanFile(value) {
    return isPlainObject(value) && value.type === "cut-plan" && Array.isArray(value.bars) && value.bars.length <= LIMITS.maxBarsPerPlan;
  }

  async function loadDirectoryJson(directoryHandle, validator) {
    const values = [];
    let inspectedFiles = 0;
    for await (const entry of directoryHandle.values()) {
      if (entry.kind !== "file" || !entry.name.toLowerCase().endsWith(".json")) continue;
      inspectedFiles += 1;
      if (inspectedFiles > LIMITS.maxFiles) { console.warn("Limite de " + LIMITS.maxFiles + " arquivos JSON atingido na pasta."); break; }
      try {
        const file = await entry.getFile();
        if (file.size > LIMITS.maxFileBytes) throw new Error("arquivo acima de 2 MB");
        const value = JSON.parse(await file.text());
        if (validator(value)) values.push(value.type === "piece" ? { ...normalizePiece(value), source: "arquivo JSON" } : { ...value, source: "arquivo JSON" });
      } catch (error) { console.warn("Arquivo ignorado: " + entry.name, error); }
    }
    return values;
  }

  async function selectWorkspace() {
    if (!("showDirectoryPicker" in window)) {
      toast("Use Chrome ou Edge para selecionar e gravar pastas diretamente. A importação e o download continuam disponíveis.", "error");
      return;
    }
    try {
      const rootHandle = await window.showDirectoryPicker({ id: "planocorte-workspace", mode: "readwrite" });
      const piecesHandle = await rootHandle.getDirectoryHandle("pecas", { create: true });
      const plansHandle = await rootHandle.getDirectoryHandle("planos", { create: true });
      const pieces = await loadDirectoryJson(piecesHandle, isPieceFile);
      const plans = await loadDirectoryJson(plansHandle, isPlanFile);
      state.rootHandle = rootHandle;
      state.piecesHandle = piecesHandle;
      state.plansHandle = plansHandle;
      state.pieces = pieces;
      state.savedPlans = plans;
      state.quantities = {};
      try { localStorage.setItem("planocorte:lastWorkspaceName", rootHandle.name); } catch (error) { console.warn("Nome da pasta não persistido", error); }
      byId("workspaceStatus").textContent = `${rootHandle.name} · ${pieces.length} peças · ${plans.length} planos`;
      byId("openFolderButton").textContent = "Reabrir pasta";
      renderPieces();
      toast(`Pasta ${rootHandle.name} conectada. Os arquivos serão gravados diretamente.`);
    } catch (error) {
      if (error.name !== "AbortError") toast(`Não foi possível abrir a pasta: ${error.message}`, "error");
    }
  }

  async function importFiles(fileList) {
    const files = Array.from(fileList || []);
    let pieceCount = 0, planCount = 0, rejectedCount = Math.max(0, files.length - LIMITS.maxFiles);
    for (const file of files.slice(0, LIMITS.maxFiles)) {
      try {
        if (!file.name.toLowerCase().endsWith(".json") || file.size > LIMITS.maxFileBytes) throw new Error("arquivo inválido ou acima de 2 MB");
        const value = JSON.parse(await file.text());
        if (isPieceFile(value)) {
          const index = state.pieces.findIndex((piece) => piece.id === value.id || piece.code === cleanText(value.code, 80).toUpperCase());
          const imported = { ...normalizePiece(value), source: "arquivo importado" };
          if (index >= 0) state.pieces.splice(index, 1, imported);
          else if (state.pieces.length < LIMITS.maxPieces) state.pieces.push(imported);
          else throw new Error("limite de " + LIMITS.maxPieces + " peças atingido");
          pieceCount += 1;
        } else if (isPlanFile(value)) {
          if (state.savedPlans.length >= LIMITS.maxPlans) throw new Error("limite de " + LIMITS.maxPlans + " planos atingido");
          state.savedPlans.push(value); planCount += 1;
        } else throw new Error("estrutura JSON não reconhecida");
      } catch (error) { rejectedCount += 1; console.warn("Falha ao importar " + file.name, error); }
    }
    renderPieces();
    toast(pieceCount + " peça(s) e " + planCount + " plano(s) importados" + (rejectedCount ? " · " + rejectedCount + " rejeitado(s)" : "") + ".", rejectedCount && !pieceCount && !planCount ? "error" : "normal");
  }

  function renderOrderItems() {
    const container = byId("orderItems");
    const stock = currentStockProfile();
    const stockLength = Math.max(0, Number(byId("stockLength").value) || 0);
    byId("stockProfileSummary").textContent = `${formatMm(stock.widthMm)} × ${formatMm(stock.thicknessMm)} mm`;
    if (!state.pieces.length) {
      container.innerHTML = '<div class="cuts-empty">Nenhuma peça carregada.</div>';
      byId("compatibilitySummary").textContent = "Nenhuma peça disponível na biblioteca.";
      return;
    }
    for (const piece of state.pieces) {
      if (!(piece.id in state.quantities)) state.quantities[piece.id] = 0;
    }
    const compatiblePieces = state.pieces.filter(isPieceCompatibleWithStock);
    for (const piece of state.pieces) {
      if (!compatiblePieces.includes(piece)) state.quantities[piece.id] = 0;
    }
    byId("compatibilitySummary").textContent = `${compatiblePieces.length} de ${state.pieces.length} peça(s) compatível(is) com barra de ${formatMm(stockLength)} × ${formatMm(stock.widthMm)} × ${formatMm(stock.thicknessMm)} mm.`;
    if (!compatiblePieces.length) {
      container.innerHTML = '<div class="cuts-empty">Nenhuma peça combina com as dimensões desta matéria-prima.</div>';
      return;
    }
    container.innerHTML = compatiblePieces.map((piece) => `
      <label class="order-item">
        <div><strong>${escapeHtml(piece.code)} · ${escapeHtml(piece.name)}</strong><span>${formatMm(piece.lengthMm)} mm · largura ${formatMm(piece.profile.widthMm)} × esp. ${formatMm(piece.profile.thicknessMm)} mm · ${piece.cuts.length} cortes</span></div>
        <input type="number" class="gestao-number" data-ui-native inputmode="numeric" min="0" max="${LIMITS.maxQuantityPerPiece}" step="1" value="${Number(state.quantities[piece.id] || 0)}" data-quantity="${escapeHtml(piece.id)}" aria-label="Quantidade de ${escapeHtml(piece.code)}">
      </label>`).join("");
  }

  function generatePlan() {
    try {
      const stockLength = Number(byId("stockLength").value);
      if (!Number.isFinite(stockLength) || stockLength < 100 || stockLength > LIMITS.maxDimensionMm) throw new Error(`O comprimento da barra deve ficar entre 100 e ${LIMITS.maxDimensionMm} mm.`);
      const items = state.pieces.filter(isPieceCompatibleWithStock)
        .map((piece) => ({ piece, quantity: Number(state.quantities[piece.id] || 0) }));
      const requestedTotal = items.reduce((total, item) => total + Math.max(0, Math.floor(item.quantity || 0)), 0);
      if (requestedTotal > LIMITS.maxRequestedPieces) throw new Error("O plano aceita no máximo " + LIMITS.maxRequestedPieces + " peças por vez.");
      const plan = CutOptimizer.optimizeCutPlan({
        stockLengthMm: Number(byId("stockLength").value),
        stockProfile: currentStockProfile(),
        kerfMm: Number(byId("kerf").value),
        initialTrimMm: Number(byId("initialTrim").value),
        items,
      });
      plan.name = `Plano ${new Date().toLocaleString("pt-BR")}`;
      plan.items = items.filter((item) => item.quantity > 0).map((item) => ({
        pieceId: item.piece.id, code: item.piece.code, name: item.piece.name,
        lengthMm: item.piece.lengthMm, profile: item.piece.profile, quantity: item.quantity,
      }));
      state.activePlan = plan;
      renderPlan(plan);
      toast(`Plano gerado em ${plan.metrics.barCount} barra(s).`);
    } catch (error) {
      toast(error.message, "error");
    }
  }

  function rulerMarkup(length) {
    const step = length <= 3000 ? 500 : 1000;
    const marks = [];
    for (let value = 0; value <= length; value += step) {
      marks.push(`<div class="ruler-tick" style="left:${value / length * 100}%"><label>${formatMm(value)}</label></div>`);
    }
    if (length % step !== 0) marks.push(`<div class="ruler-tick" style="left:100%"><label>${formatMm(length)}</label></div>`);
    return marks.join("");
  }

  function renderBar(bar, settings) {
    const length = settings.stockLengthMm;
    const profile = normalizeProfile(bar.profile);
    const pieces = bar.placements.map((placement, index) => {
      const left = placement.envelopeStartMm / length * 100;
      const width = placement.spanMm / length * 100;
      const startCut = placement.cuts.find((cut) => cut.id === placement.startCutId) || placement.cuts[0];
      const endCut = placement.cuts.find((cut) => cut.id === placement.endCutId) || placement.cuts.at(-1);
      const localPercent = (x) => (placement.startMm + Number(x) - placement.envelopeStartMm) / placement.spanMm * 100;
      const shape = startCut && endCut
        ? `polygon(${localPercent(startCut.p1.x)}% 0, ${localPercent(endCut.p1.x)}% 0, ${localPercent(endCut.p2.x)}% 100%, ${localPercent(startCut.p2.x)}% 100%)`
        : "none";
      const details = [
        `${formatMm(placement.lengthMm)} mm nominais`,
        placement.rotated ? "girada 180°" : "",
        placement.edgePlacement ? `na beirada ${placement.edgePlacement === "left" ? "inicial" : "final"}` : "",
        placement.sharedStart ? "corte inicial reaproveitado" : "",
      ].filter(Boolean).join(" · ");
      return `<div class="bar-piece${placement.sharedStart ? " shared-start" : ""}${placement.edgePlacement ? " edge-piece" : ""}" style="left:${left}%;width:${width}%;background:${COLORS[index % COLORS.length]};clip-path:${shape}" title="${escapeHtml(placement.instance)} · ${escapeHtml(details)}"><strong>${placement.rotated ? "↻ " : ""}${escapeHtml(placement.instance)}</strong></div>`;
    }).join("");
    const remainingLeft = bar.remainingStartMm / length * 100;
    const remainingWidth = bar.remainingMm / length * 100;
    const cutOverlay = bar.operations.map((operation) => `
      <line class="plan-cut${operation.sharedWith ? " shared" : ""}"
            x1="${operation.topPointMm}" y1="2" x2="${operation.bottomPointMm}" y2="98"
            vector-effect="non-scaling-stroke"/>`).join("");
    const operations = bar.operations.map((operation, index) => `
      <tr><td>${index + 1}</td><td>${escapeHtml(operation.instance)}</td><td>${formatMm(operation.referenceMm)} mm</td><td>${formatMm(operation.topPointMm)} / ${formatMm(operation.bottomPointMm)} mm</td><td>${operation.inclinationDeg.toFixed(2)}°${operation.sharedWith ? ` ↔ ${escapeHtml(operation.sharedWith)}` : ""}</td></tr>`).join("");
    return `
      <article class="bar-card">
        <div class="bar-head"><h3>Modelo ${bar.number} · ${bar.quantity}× barra${bar.quantity === 1 ? "" : "s"}</h3><span>largura ${formatMm(profile.widthMm)} × esp. ${formatMm(profile.thicknessMm)} mm · ${bar.sharedCuts} corte(s) reaproveitado(s) · sobra ${formatMm(bar.remainingMm)} mm</span></div>
        <div class="bar-ruler">${rulerMarkup(length)}</div>
        <div class="bar-track">
          <div class="bar-trim" style="width:${bar.trimMm / length * 100}%" title="Refilo inicial"></div>
          ${pieces}
          <div class="bar-leftover" style="left:${remainingLeft}%;width:${remainingWidth}%">${bar.remainingMm >= 70 ? `${formatMm(bar.remainingMm)} mm` : ""}</div>
          <svg class="bar-cuts-overlay" viewBox="0 0 ${length} 100" preserveAspectRatio="none" aria-label="Cortes inclinados do modelo de barra">${cutOverlay}</svg>
        </div>
        <div class="bar-legend"><span class="cut-key"><i></i> corte da serra</span>${bar.placements.map((placement) => `<span><strong>${placement.rotated ? "↻ " : ""}${escapeHtml(placement.instance)}</strong> ${formatMm(placement.startMm)}–${formatMm(placement.endMm)} mm${placement.edgePlacement ? " · beirada" : ""}${placement.sharedStart ? " · ↔ mesmo ângulo" : ""}</span>`).join("")}</div>
        <details class="operations"><summary>${bar.operations.length} operações de corte calculadas</summary>
          <table class="operations-table"><thead><tr><th>#</th><th>Peça</th><th>Referência</th><th>Topo / base</th><th>Inclinação</th></tr></thead><tbody>${operations}</tbody></table>
        </details>
      </article>`;
  }

  function renderPlan(plan) {
    byId("planEmpty").classList.add("hidden");
    const container = byId("planResult");
    const stockProfile = normalizeProfile(plan.settings.stockProfile || plan.profiles?.[0]);
    container.classList.remove("hidden");
    container.innerHTML = `
      <section class="plan-summary">
        <div class="summary-header"><div><span class="step">RESULTADO</span><h2>${escapeHtml(plan.name)}</h2></div><span>${formatMm(plan.settings.stockLengthMm)} × ${formatMm(stockProfile.widthMm)} × ${formatMm(stockProfile.thicknessMm)} mm</span></div>
        <div class="summary-metrics">
          <div><span>BARRAS</span><strong>${plan.metrics.barCount}</strong></div>
          <div><span>MODELOS IGUAIS</span><strong>${plan.metrics.patternCount}</strong></div>
          <div><span>PEÇAS</span><strong>${plan.requestedPieces}</strong></div>
          <div><span>GIRADAS 180°</span><strong>${plan.metrics.rotatedPieces}</strong></div>
          <div><span>APROVEITAMENTO</span><strong>${plan.metrics.utilizationPercent.toFixed(1)}%</strong></div>
          <div><span>CORTES REAPROVEITADOS</span><strong>${plan.metrics.sharedCuts}</strong></div>
          <div><span>SOBRA TOTAL</span><strong>${formatMm(plan.metrics.leftoverMm)} mm</strong></div>
        </div>
      </section>
      <div class="notice">${escapeHtml(plan.warning)}</div>
      ${plan.bars.map((bar) => renderBar(bar, plan.settings)).join("")}
      <div class="save-row"><button id="savePlanButton" class="button button-primary" type="button">Salvar arquivo do plano</button></div>`;
    byId("savePlanButton").addEventListener("click", saveActivePlan);
  }

  async function saveActivePlan() {
    if (!state.activePlan) return;
    const filename = `plano-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    try {
      if (state.plansHandle) await writeJson(state.plansHandle, filename, state.activePlan);
      else downloadJson(filename, state.activePlan);
      toast(state.plansHandle ? `Plano salvo em planos/${filename}.` : "Plano baixado como JSON. Selecione a pasta para salvar diretamente.");
    } catch (error) {
      toast(`Não foi possível salvar o plano: ${error.message}`, "error");
    }
  }

  document.querySelectorAll(".tab").forEach((button) => button.addEventListener("click", () => switchTab(button.dataset.tab)));
  byId("openFolderButton").addEventListener("click", selectWorkspace);
  byId("importButton").addEventListener("click", () => byId("fileInput").click());
  byId("fileInput").addEventListener("change", async (event) => { try { await importFiles(event.target.files); } finally { event.target.value = ""; } });
  byId("partLength").addEventListener("input", renderCanvas);
  byId("partWidth").addEventListener("input", updateProfileDrawing);
  byId("partThickness").addEventListener("input", renderCanvas);
  [byId("stockLength"), byId("stockWidth"), byId("stockThickness")]
    .forEach((input) => input.addEventListener("input", renderOrderItems));
  byId("cutOrigin").addEventListener("change", updateCutProjection);
  byId("cutStartX").addEventListener("input", updateCutProjection);
  byId("cutAngle").addEventListener("input", updateCutProjection);
  [byId("cutStartX"), byId("cutAngle")].forEach((input) => input.addEventListener("blur", () => {
    const value = Number(input.value);
    if (Number.isFinite(value)) input.value = value.toFixed(2);
    updateCutProjection();
  }));
  byId("newPieceButton").addEventListener("click", resetEditor);
  byId("addCutButton").addEventListener("click", addCutFromInputs);
  byId("clearCutsButton").addEventListener("click", () => { state.cuts = []; renderCanvas(); });
  byId("savePieceButton").addEventListener("click", savePiece);
  byId("cutsList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-cut]");
    if (!button) return;
    state.cuts = state.cuts.filter((cut) => cut.id !== button.dataset.removeCut);
    renderCanvas();
  });
  byId("piecesGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-edit-piece]");
    if (button) editPiece(button.dataset.editPiece);
  });
  byId("orderItems").addEventListener("input", (event) => {
    if (event.target.matches("[data-quantity]")) state.quantities[event.target.dataset.quantity] = Math.min(LIMITS.maxQuantityPerPiece, Math.max(0, Math.floor(Number(event.target.value) || 0)));
  });
  byId("generatePlanButton").addEventListener("click", generatePlan);

  if (!("showDirectoryPicker" in window)) {
    byId("openFolderButton").textContent = "Pasta indisponível";
    byId("workspaceStatus").textContent = "Use Chrome/Edge ou importe arquivos";
  } else {
    let lastWorkspaceName = null;
    try { lastWorkspaceName = localStorage.getItem("planocorte:lastWorkspaceName"); } catch (error) { console.warn("Nome da pasta não recuperado", error); }
    if (lastWorkspaceName) {
      byId("workspaceStatus").textContent = `Última pasta: ${lastWorkspaceName}`;
      byId("openFolderButton").textContent = "Reabrir pasta";
    }
  }
  renderCanvas();
  renderPieces();
})();
