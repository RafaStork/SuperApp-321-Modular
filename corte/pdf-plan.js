(function initCutPlanPdf(globalScope) {
  "use strict";

  const COLORS = {
    ink: [24, 27, 32],
    surface: [246, 247, 248],
    text: [31, 35, 40],
    muted: [104, 112, 122],
    line: [214, 218, 223],
    orange: [239, 108, 26],
    green: [25, 105, 78],
    leftover: [242, 232, 211],
    pieces: [
      [207, 229, 218], [242, 213, 195], [216, 223, 239],
      [238, 226, 180], [221, 210, 232], [203, 227, 226],
    ],
  };
  const PAGE = Object.freeze({ width: 297, height: 210, left: 14, right: 14, top: 25, bottom: 197 });
  let pdfFontName = "Montserrat";
  let pdfFontsPromise = null;

  const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const cleanText = (value) => String(value ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").trim();
  const formatMm = (value, digits = 1) => number(value).toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const formatPercent = (value) => `${number(value).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  const machineAngle = (value) => number(value) + 90;
  const profileOf = (value) => ({ widthMm: Math.max(1, number(value?.widthMm, 90)), thicknessMm: Math.max(1, number(value?.thicknessMm, 45)) });

  function edgeX(cut, edge) {
    const p1 = cut?.p1 || { x: 0, y: 0 };
    const p2 = cut?.p2 || { x: 0, y: 0 };
    const top = number(p1.y) <= number(p2.y) ? p1 : p2;
    const bottom = number(p1.y) <= number(p2.y) ? p2 : p1;
    return number(edge === "top" ? top.x : bottom.x);
  }

  function sortedCuts(placement, nominal = false) {
    const source = nominal
      ? (placement?.nominalCuts || placement?.piece?.cuts || placement?.cuts || [])
      : (placement?.cuts || placement?.nominalCuts || placement?.piece?.cuts || []);
    return [...source].sort((first, second) => {
      const firstReference = (edgeX(first, "top") + edgeX(first, "bottom")) / 2;
      const secondReference = (edgeX(second, "top") + edgeX(second, "bottom")) / 2;
      return firstReference - secondReference;
    });
  }

  function faceLengths(placement) {
    const cuts = sortedCuts(placement, true);
    if (cuts.length < 2) return { top: number(placement?.lengthMm), bottom: number(placement?.lengthMm) };
    return {
      top: Math.abs(edgeX(cuts.at(-1), "top") - edgeX(cuts[0], "top")),
      bottom: Math.abs(edgeX(cuts.at(-1), "bottom") - edgeX(cuts[0], "bottom")),
    };
  }

  function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = "";
    for (let index = 0; index < bytes.length; index += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
    }
    return btoa(binary);
  }

  async function registerFonts(doc) {
    if (!pdfFontsPromise) {
      pdfFontsPromise = Promise.all([
        fetch("../shared/Montserrat-Variable.ttf", { credentials: "same-origin", cache: "force-cache" }),
        fetch("../shared/Montserrat-Bold.ttf", { credentials: "same-origin", cache: "force-cache" }),
      ]).then(async (responses) => {
        if (responses.some((response) => !response.ok)) throw new Error("Não foi possível carregar as fontes locais.");
        return Promise.all(responses.map(async (response) => bufferToBase64(await response.arrayBuffer())));
      });
    }
    const [regular, bold] = await pdfFontsPromise;
    doc.addFileToVFS("Montserrat-Regular.ttf", regular);
    doc.addFont("Montserrat-Regular.ttf", "Montserrat", "normal");
    doc.addFileToVFS("Montserrat-Bold.ttf", bold);
    doc.addFont("Montserrat-Bold.ttf", "Montserrat", "bold");
  }

  function setFont(doc, style = "normal", size = 9) {
    doc.setFont(pdfFontName, style);
    doc.setFontSize(size);
  }

  function pageHeader(doc, title, subtitle = "") {
    doc.setFillColor(...COLORS.ink);
    doc.rect(0, 0, PAGE.width, 19, "F");
    doc.setFillColor(...COLORS.orange);
    doc.rect(0, 19, PAGE.width, 1.4, "F");
    doc.setTextColor(255, 255, 255);
    setFont(doc, "bold", 11);
    doc.text(cleanText(title), PAGE.left, 8.5);
    if (subtitle) {
      setFont(doc, "normal", 7.2);
      doc.setTextColor(205, 210, 216);
      doc.text(cleanText(subtitle), PAGE.left, 14.2);
    }
    doc.setTextColor(...COLORS.text);
  }

  function modelLabel(bar) {
    const profile = profileOf(bar?.profile);
    const unit = number(bar?.quantity, 1) === 1 ? "barra" : "barras";
    return `Modelo ${number(bar?.number)} · ${number(bar?.quantity, 1)}× ${unit}`;
  }

  function addModelPage(doc, bar, continuation = "") {
    doc.addPage("a4", "landscape");
    const settingsText = `Perfil ${formatMm(profileOf(bar?.profile).widthMm)} × ${formatMm(profileOf(bar?.profile).thicknessMm)} mm · sobra ${formatMm(bar?.remainingMm)} mm`;
    pageHeader(doc, modelLabel(bar), continuation ? `${settingsText} · ${continuation}` : settingsText);
    return PAGE.top + 2;
  }

  function sectionTitle(doc, title, y) {
    doc.setTextColor(...COLORS.orange);
    setFont(doc, "bold", 7.7);
    doc.text(cleanText(title).toUpperCase(), PAGE.left, y);
    doc.setDrawColor(...COLORS.line);
    doc.line(PAGE.left, y + 2, PAGE.width - PAGE.right, y + 2);
    doc.setTextColor(...COLORS.text);
    return y + 6;
  }

  function drawTableHeader(doc, columns, y) {
    doc.setFillColor(232, 235, 238);
    doc.roundedRect(PAGE.left, y, PAGE.width - PAGE.left - PAGE.right, 7, 1.5, 1.5, "F");
    let x = PAGE.left;
    setFont(doc, "bold", 6.3);
    doc.setTextColor(...COLORS.muted);
    columns.forEach((column) => {
      doc.text(cleanText(column.label).toUpperCase(), x + 2, y + 4.5);
      x += column.width;
    });
    doc.setTextColor(...COLORS.text);
    return y + 7;
  }

  function drawTable(doc, bar, title, columns, rows, y) {
    const availableWidth = PAGE.width - PAGE.left - PAGE.right;
    const declaredWidth = columns.reduce((sum, column) => sum + column.width, 0);
    const scale = declaredWidth ? availableWidth / declaredWidth : 1;
    const normalizedColumns = columns.map((column) => ({ ...column, width: column.width * scale }));
    const startSection = (continued = false) => {
      y = sectionTitle(doc, continued ? `${title} · continuação` : title, y);
      y = drawTableHeader(doc, normalizedColumns, y);
    };
    startSection(false);
    if (!rows.length) {
      setFont(doc, "normal", 7.5);
      doc.setTextColor(...COLORS.muted);
      doc.text("Nenhum registro nesta seção.", PAGE.left + 2, y + 5);
      doc.setTextColor(...COLORS.text);
      return y + 9;
    }
    rows.forEach((row, rowIndex) => {
      const cells = normalizedColumns.map((column) => {
        const value = cleanText(typeof column.value === "function" ? column.value(row, rowIndex) : row[column.key]);
        return doc.splitTextToSize(value || "—", Math.max(8, column.width - 4));
      });
      const rowHeight = Math.max(6.2, ...cells.map((lines) => lines.length * 3.45 + 2.2));
      if (y + rowHeight > PAGE.bottom - 3) {
        y = addModelPage(doc, bar, title);
        startSection(true);
      }
      if (rowIndex % 2 === 0) {
        doc.setFillColor(...COLORS.surface);
        doc.rect(PAGE.left, y, availableWidth, rowHeight, "F");
      }
      let x = PAGE.left;
      setFont(doc, "normal", 6.7);
      doc.setTextColor(...COLORS.text);
      cells.forEach((lines, columnIndex) => {
        if (columnIndex === 0) setFont(doc, "bold", 6.7);
        else setFont(doc, "normal", 6.7);
        doc.text(lines, x + 2, y + 4.1);
        x += normalizedColumns[columnIndex].width;
      });
      doc.setDrawColor(...COLORS.line);
      doc.line(PAGE.left, y + rowHeight, PAGE.width - PAGE.right, y + rowHeight);
      y += rowHeight;
    });
    return y + 5;
  }

  function drawScaledBar(doc, bar, settings, y) {
    const stockLength = Math.max(1, number(settings?.stockLengthMm));
    const profile = profileOf(bar?.profile || settings?.stockProfile);
    const maxWidth = PAGE.width - PAGE.left - PAGE.right;
    const maxHeight = 35;
    const uniformScale = Math.min(maxWidth / stockLength, maxHeight / profile.widthMm);
    const drawWidth = stockLength * uniformScale;
    const drawHeight = profile.widthMm * uniformScale;
    const x = PAGE.left + (maxWidth - drawWidth) / 2;
    const rulerY = y + 7;
    const barY = rulerY + 7;
    const step = stockLength <= 3000 ? 500 : 1000;

    doc.setTextColor(...COLORS.muted);
    setFont(doc, "normal", 6.2);
    doc.setDrawColor(135, 143, 151);
    doc.line(x, rulerY, x + drawWidth, rulerY);
    for (let value = 0; value <= stockLength; value += step) {
      const tickX = x + value * uniformScale;
      doc.line(tickX, rulerY - 1.5, tickX, rulerY + 1.5);
      doc.text(formatMm(value, 0), tickX, rulerY - 2.2, { align: "center" });
    }
    if (stockLength % step !== 0) {
      const tickX = x + drawWidth;
      doc.line(tickX, rulerY - 1.5, tickX, rulerY + 1.5);
      doc.text(formatMm(stockLength, 0), tickX, rulerY - 2.2, { align: "center" });
    }

    doc.setFillColor(...COLORS.leftover);
    doc.setDrawColor(151, 120, 74);
    doc.roundedRect(x, barY, drawWidth, drawHeight, Math.min(1.2, drawHeight / 4), Math.min(1.2, drawHeight / 4), "FD");

    const trimWidth = Math.max(0, number(bar?.trimMm)) * uniformScale;
    if (trimWidth > 0) {
      doc.setFillColor(239, 149, 91);
      doc.rect(x, barY, trimWidth, drawHeight, "F");
    }

    (bar?.placements || []).forEach((placement, index) => {
      const cuts = sortedCuts(placement, false);
      if (!cuts.length) return;
      const startCut = cuts[0];
      const endCut = cuts.at(-1);
      const startTop = x + (number(placement.startMm) + edgeX(startCut, "top")) * uniformScale;
      const startBottom = x + (number(placement.startMm) + edgeX(startCut, "bottom")) * uniformScale;
      const endTop = x + (number(placement.startMm) + edgeX(endCut, "top")) * uniformScale;
      const endBottom = x + (number(placement.startMm) + edgeX(endCut, "bottom")) * uniformScale;
      doc.setFillColor(...COLORS.pieces[index % COLORS.pieces.length]);
      doc.setDrawColor(67, 99, 86);
      doc.lines([
        [endTop - startTop, 0],
        [endBottom - endTop, drawHeight],
        [startBottom - endBottom, 0],
        [startTop - startBottom, -drawHeight],
      ], startTop, barY, [1, 1], "FD", true);
      const centerX = (Math.min(startTop, startBottom) + Math.max(endTop, endBottom)) / 2;
      if (drawHeight >= 5.5 && Math.abs(endTop - startTop) >= 11) {
        doc.setTextColor(25, 59, 48);
        setFont(doc, "bold", Math.min(6.2, Math.max(4.2, drawHeight * .48)));
        doc.text(String(index + 1), centerX, barY + drawHeight * .68, { align: "center" });
      }
    });

    (bar?.operations || []).forEach((operation) => {
      doc.setDrawColor(...(operation.sharedWith ? COLORS.green : COLORS.orange));
      doc.setLineWidth(operation.sharedWith ? .65 : .45);
      doc.line(
        x + number(operation.topPointMm) * uniformScale,
        barY,
        x + number(operation.bottomPointMm) * uniformScale,
        barY + drawHeight,
      );
    });
    doc.setLineWidth(.2);
    doc.setTextColor(...COLORS.muted);
    setFont(doc, "normal", 6.3);
    doc.text("Escala uniforme X/Y. Os números identificam as peças na tabela abaixo.", PAGE.left, barY + drawHeight + 5);
    doc.setTextColor(...COLORS.text);
    return barY + drawHeight + 10;
  }

  function placementRows(bar) {
    return (bar?.placements || []).map((placement, index) => {
      const faces = faceLengths(placement);
      const code = cleanText(placement?.piece?.code || placement?.instance || `Peça ${index + 1}`);
      return {
        piece: `${index + 1}. ${code}`,
        nominal: `${formatMm(placement?.lengthMm)} mm`,
        top: `${formatMm(faces.top)} mm`,
        bottom: `${formatMm(faces.bottom)} mm`,
        occupied: `${formatMm(placement?.spanMm)} mm`,
        range: `${formatMm(placement?.envelopeStartMm)}–${formatMm(placement?.envelopeEndMm)} mm`,
        orientation: placement?.rotated ? "Girado 180°" : "Original",
      };
    });
  }

  function cutRows(bar) {
    return (bar?.placements || []).flatMap((placement, placementIndex) => {
      const profile = profileOf(placement?.profile || placement?.piece?.profile || bar?.profile);
      const code = cleanText(placement?.piece?.code || placement?.instance || `Peça ${placementIndex + 1}`);
      return sortedCuts(placement, true).map((cut, cutIndex) => {
        const topX = edgeX(cut, "top");
        const bottomX = edgeX(cut, "bottom");
        const diagonal = Math.hypot(profile.widthMm, bottomX - topX);
        return {
          piece: `${placementIndex + 1}. ${code}`,
          cut: `C${cutIndex + 1}`,
          top: `${formatMm(topX, 2)} mm`,
          bottom: `${formatMm(bottomX, 2)} mm`,
          offset: `${formatMm(Math.abs(bottomX - topX), 2)} mm`,
          diagonal: `${formatMm(diagonal, 2)} mm`,
          angle: `${formatMm(machineAngle(cut?.angleDeg ?? cut?.inclinationDeg), 2)}°`,
        };
      });
    });
  }

  function operationRows(bar) {
    let previousReference = 0;
    return [...(bar?.operations || [])]
      .sort((first, second) => number(first?.referenceMm) - number(second?.referenceMm))
      .map((operation, index) => {
        const reference = number(operation?.referenceMm);
        const advance = Math.max(0, reference - previousReference);
        previousReference = reference;
        return {
          operation: String(index + 1),
          advance: `${formatMm(advance, 2)} mm`,
          angle: `${formatMm(machineAngle(operation?.inclinationDeg), 2)}°`,
          shared: operation?.sharedWith ? "Corte reaproveitado" : "Novo corte",
        };
      });
  }

  function drawCover(doc, plan) {
    const profile = profileOf(plan?.settings?.stockProfile || plan?.profiles?.[0]);
    doc.setFillColor(...COLORS.ink);
    doc.rect(0, 0, PAGE.width, 55, "F");
    doc.setFillColor(...COLORS.orange);
    doc.rect(0, 55, PAGE.width, 2, "F");
    doc.setTextColor(255, 255, 255);
    setFont(doc, "bold", 24);
    doc.text("Plano de corte completo", PAGE.left, 26);
    setFont(doc, "normal", 9);
    doc.setTextColor(202, 208, 214);
    doc.text(cleanText(plan?.name || "Plano de corte"), PAGE.left, 36);
    doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, PAGE.left, 44);

    const metrics = [
      ["Barras", number(plan?.metrics?.barCount)],
      ["Modelos", number(plan?.metrics?.patternCount)],
      ["Peças", number(plan?.requestedPieces)],
      ["Aproveitamento", formatPercent(plan?.metrics?.utilizationPercent)],
      ["Cortes reaproveitados", number(plan?.metrics?.sharedCuts)],
      ["Sobra total", `${formatMm(plan?.metrics?.leftoverMm)} mm`],
    ];
    const cardGap = 4;
    const cardWidth = (PAGE.width - PAGE.left - PAGE.right - cardGap * 2) / 3;
    metrics.forEach(([label, value], index) => {
      const column = index % 3;
      const row = Math.floor(index / 3);
      const x = PAGE.left + column * (cardWidth + cardGap);
      const y = 69 + row * 27;
      doc.setFillColor(...COLORS.surface);
      doc.setDrawColor(...COLORS.line);
      doc.roundedRect(x, y, cardWidth, 22, 2.5, 2.5, "FD");
      doc.setTextColor(...COLORS.muted);
      setFont(doc, "bold", 6.3);
      doc.text(label.toUpperCase(), x + 5, y + 7);
      doc.setTextColor(...COLORS.text);
      setFont(doc, "bold", 13);
      doc.text(String(value), x + 5, y + 16.5);
    });

    let y = 130;
    y = sectionTitle(doc, "Configuração da matéria-prima", y);
    setFont(doc, "normal", 8.3);
    doc.text(`Barra: ${formatMm(plan?.settings?.stockLengthMm)} × ${formatMm(profile.widthMm)} × ${formatMm(profile.thicknessMm)} mm`, PAGE.left, y + 3);
    doc.text(`Lâmina (kerf): ${formatMm(plan?.settings?.kerfMm, 2)} mm`, PAGE.left + 92, y + 3);
    doc.text(`Refilo inicial: ${formatMm(plan?.settings?.initialTrimMm, 2)} mm`, PAGE.left + 172, y + 3);
    y += 14;
    y = sectionTitle(doc, "Conteúdo", y);
    setFont(doc, "normal", 8.1);
    doc.setTextColor(...COLORS.muted);
    doc.text("Cada modelo possui desenho em escala uniforme, tabela das peças, medidas dos cortes e sequência completa de operações da serra.", PAGE.left, y + 3);
    const warningLines = doc.splitTextToSize(cleanText(plan?.warning || ""), PAGE.width - PAGE.left - PAGE.right - 8);
    if (warningLines.length) {
      doc.setFillColor(255, 241, 229);
      doc.setDrawColor(240, 187, 148);
      doc.roundedRect(PAGE.left, y + 10, PAGE.width - PAGE.left - PAGE.right, Math.max(15, warningLines.length * 4 + 8), 2.5, 2.5, "FD");
      doc.setTextColor(119, 66, 31);
      setFont(doc, "normal", 7.2);
      doc.text(warningLines, PAGE.left + 4, y + 16);
    }
    doc.setTextColor(...COLORS.text);
  }

  function drawModel(doc, bar, settings) {
    let y = addModelPage(doc, bar);
    y = sectionTitle(doc, "Desenho do modelo", y);
    y = drawScaledBar(doc, bar, settings, y);
    y = drawTable(doc, bar, "Peças deste modelo", [
      { key: "piece", label: "Peça", width: 58 },
      { key: "nominal", label: "Nominal", width: 26 },
      { key: "top", label: "Face superior", width: 28 },
      { key: "bottom", label: "Face inferior", width: 28 },
      { key: "occupied", label: "Ocupação", width: 25 },
      { key: "range", label: "Faixa na barra", width: 40 },
      { key: "orientation", label: "Orientação", width: 34 },
    ], placementRows(bar), y);
    if (y > PAGE.bottom - 32) y = addModelPage(doc, bar, "Medidas dos cortes");
    y = drawTable(doc, bar, "Medidas dos cortes", [
      { key: "piece", label: "Peça", width: 61 },
      { key: "cut", label: "Corte", width: 17 },
      { key: "top", label: "X superior", width: 28 },
      { key: "bottom", label: "X inferior", width: 28 },
      { key: "offset", label: "Deslocamento", width: 30 },
      { key: "diagonal", label: "Linha inclinada", width: 31 },
      { key: "angle", label: "Ângulo da serra", width: 32 },
    ], cutRows(bar), y);
    if (y > PAGE.bottom - 30) y = addModelPage(doc, bar, "Operações da serra");
    drawTable(doc, bar, "Operações da serra", [
      { key: "operation", label: "Operação", width: 25 },
      { key: "advance", label: "Avanço", width: 45 },
      { key: "angle", label: "Ângulo da serra", width: 45 },
      { key: "shared", label: "Tipo", width: 124 },
    ], operationRows(bar), y);
  }

  function addFooters(doc) {
    const pages = doc.getNumberOfPages();
    for (let page = 1; page <= pages; page += 1) {
      doc.setPage(page);
      doc.setDrawColor(...COLORS.line);
      doc.line(PAGE.left, 201, PAGE.width - PAGE.right, 201);
      doc.setTextColor(...COLORS.muted);
      setFont(doc, "normal", 6.3);
      doc.text("321 Modular · Plano de corte", PAGE.left, 205.5);
      doc.text(`Página ${page} de ${pages}`, PAGE.width - PAGE.right, 205.5, { align: "right" });
    }
  }

  async function build(plan) {
    const PDF = globalScope.jspdf?.jsPDF;
    if (!PDF) throw new Error("Gerador de PDF indisponível.");
    if (!plan?.bars?.length) throw new Error("Gere um plano de corte antes de exportar o PDF.");
    const doc = new PDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true, putOnlyUsedFonts: true });
    pdfFontName = "Montserrat";
    try {
      await registerFonts(doc);
    } catch (error) {
      console.warn("[Plano de corte PDF] Fonte local indisponível; usando fonte segura padrão.", error);
      pdfFontName = "helvetica";
    }
    doc.setProperties({
      title: cleanText(plan?.name || "Plano de corte completo"),
      subject: "Plano de corte detalhado por modelo",
      author: "321 Modular",
      creator: "SuperApp 321 Modular",
    });
    drawCover(doc, plan);
    for (let index = 0; index < plan.bars.length; index += 1) {
      drawModel(doc, plan.bars[index], plan.settings || {});
      if (index % 4 === 3) await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    }
    addFooters(doc);
    return doc;
  }

  async function download(plan) {
    const doc = await build(plan);
    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}-${String(now.getMinutes()).padStart(2, "0")}`;
    doc.save(`plano-de-corte-completo-${stamp}.pdf`);
    return doc;
  }

  globalScope.CutPlanPdf = Object.freeze({ build, download });
})(typeof globalThis !== "undefined" ? globalThis : window);
