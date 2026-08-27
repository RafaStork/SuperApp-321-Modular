(function attachCutOptimizer(globalScope) {
  "use strict";

  const EPSILON = 1e-9;
  const ANGLE_TOLERANCE = 0.0051;
  const EDGE_TOLERANCE_MM = 0.011;

  function assertPositiveNumber(value, label) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) throw new Error(`${label} deve ser maior que zero.`);
    return number;
  }

  function normalizeProfile(profile = {}) {
    return {
      widthMm: assertPositiveNumber(profile.widthMm || 90, "Largura do perfil"),
      thicknessMm: assertPositiveNumber(profile.thicknessMm ?? profile.heightMm ?? 45, "Espessura do perfil"),
    };
  }

  function pointOnEdge(cut, edge) {
    const firstY = Number(cut.p1.y);
    const secondY = Number(cut.p2.y);
    const topPoint = firstY <= secondY ? cut.p1 : cut.p2;
    const bottomPoint = firstY <= secondY ? cut.p2 : cut.p1;
    return Number(edge === "top" ? topPoint.x : bottomPoint.x);
  }

  function cutReference(cut) {
    return (pointOnEdge(cut, "top") + pointOnEdge(cut, "bottom")) / 2;
  }

  function cutAngle(cut) {
    const value = Number(cut.angleDeg ?? cut.inclinationDeg);
    return Number.isFinite(value) ? Number(value.toFixed(2)) : null;
  }

  function sameAngle(first, second) {
    return first !== null && second !== null && Math.abs(first - second) <= ANGLE_TOLERANCE;
  }

  function rotateCut(cut, lengthMm, faceWidthMm) {
    const oldTopX = pointOnEdge(cut, "top");
    const oldBottomX = pointOnEdge(cut, "bottom");
    const origin = cut.origin === "bottom" ? "top" : "bottom";
    const topX = lengthMm - oldBottomX;
    const bottomX = lengthMm - oldTopX;
    return {
      ...cut,
      origin,
      startX: Number((origin === "top" ? topX : bottomX).toFixed(2)),
      p1: { x: Number(topX.toFixed(4)), y: 0 },
      p2: { x: Number(bottomX.toFixed(4)), y: faceWidthMm },
      angleDeg: cutAngle(cut) ?? 0,
      inclinationDeg: cutAngle(cut) ?? 0,
    };
  }

  function reverseCutEndForEnd(cut, lengthMm, faceWidthMm) {
    const oldTopX = pointOnEdge(cut, "top");
    const oldBottomX = pointOnEdge(cut, "bottom");
    const topX = lengthMm - oldTopX;
    const bottomX = lengthMm - oldBottomX;
    const angle = -(cutAngle(cut) ?? 0);
    const origin = cut.origin === "bottom" ? "bottom" : "top";
    return {
      ...cut,
      origin,
      startX: Number((origin === "top" ? topX : bottomX).toFixed(2)),
      p1: { x: Number(topX.toFixed(4)), y: 0 },
      p2: { x: Number(bottomX.toFixed(4)), y: faceWidthMm },
      angleDeg: Number(angle.toFixed(2)),
      inclinationDeg: Number(angle.toFixed(2)),
    };
  }

  function flipCutAcrossLengthAxis(cut, faceWidthMm) {
    const oldTopX = pointOnEdge(cut, "top");
    const oldBottomX = pointOnEdge(cut, "bottom");
    const topX = oldBottomX;
    const bottomX = oldTopX;
    const angle = -(cutAngle(cut) ?? 0);
    const origin = cut.origin === "bottom" ? "top" : "bottom";
    return {
      ...cut,
      origin,
      startX: Number((origin === "top" ? topX : bottomX).toFixed(2)),
      p1: { x: Number(topX.toFixed(4)), y: 0 },
      p2: { x: Number(bottomX.toFixed(4)), y: faceWidthMm },
      angleDeg: Number(angle.toFixed(2)),
      inclinationDeg: Number(angle.toFixed(2)),
    };
  }

  function orientPiece(piece, rotated, reverseAngle = false, flipFace = false) {
    const lengthMm = Number(piece.lengthMm);
    const profile = normalizeProfile(piece.profile);
    const cuts = (piece.cuts || []).map((cut) => rotated
      ? (flipFace
        ? flipCutAcrossLengthAxis(cut, profile.widthMm)
        : reverseAngle
          ? reverseCutEndForEnd(cut, lengthMm, profile.widthMm)
          : rotateCut(cut, lengthMm, profile.widthMm))
      : {
      ...cut,
      p1: { x: pointOnEdge(cut, "top"), y: 0 },
      p2: { x: pointOnEdge(cut, "bottom"), y: profile.widthMm },
      angleDeg: cutAngle(cut) ?? 0,
      inclinationDeg: cutAngle(cut) ?? 0,
    }).sort((a, b) => cutReference(a) - cutReference(b));
    const allX = cuts.flatMap((cut) => [pointOnEdge(cut, "top"), pointOnEdge(cut, "bottom")]);
    const minX = allX.length ? Math.min(...allX) : 0;
    const maxX = allX.length ? Math.max(...allX) : lengthMm;
    const leftOverhangMm = Math.max(0, -minX);
    const rightOverhangMm = Math.max(0, maxX - lengthMm);
    const startCut = cuts[0] || null;
    const endCut = cuts[cuts.length - 1] || null;
    return {
      rotated,
      rotationMode: !rotated ? "original" : flipFace ? "face-flip" : reverseAngle ? "end-for-end" : "in-plane",
      profile,
      cuts,
      lengthMm,
      minX,
      maxX,
      leftOverhangMm,
      rightOverhangMm,
      spanMm: maxX - minX,
      hasOverhang: leftOverhangMm > EDGE_TOLERANCE_MM || rightOverhangMm > EDGE_TOLERANCE_MM,
      startAngleDeg: startCut ? cutAngle(startCut) : null,
      endAngleDeg: endCut ? cutAngle(endCut) : null,
      startCutId: startCut?.id || null,
      endCutId: endCut?.id || null,
      startTopX: startCut ? pointOnEdge(startCut, "top") : minX,
      startBottomX: startCut ? pointOnEdge(startCut, "bottom") : minX,
      endTopX: endCut ? pointOnEdge(endCut, "top") : maxX,
      endBottomX: endCut ? pointOnEdge(endCut, "bottom") : maxX,
      startIsBoundary: Boolean(startCut && Math.min(pointOnEdge(startCut, "top"), pointOnEdge(startCut, "bottom")) <= EDGE_TOLERANCE_MM),
      endIsBoundary: Boolean(endCut && Math.max(pointOnEdge(endCut, "top"), pointOnEdge(endCut, "bottom")) >= lengthMm - EDGE_TOLERANCE_MM),
    };
  }

  function normalizeItems(items) {
    const instances = [];
    for (const item of items) {
      const quantity = Math.floor(Number(item.quantity));
      if (!Number.isFinite(quantity) || quantity < 0) throw new Error(`Quantidade inválida para ${item.piece.code}.`);
      const lengthMm = assertPositiveNumber(item.piece.lengthMm, `Comprimento de ${item.piece.code}`);
      const profile = normalizeProfile(item.piece.profile);
      const orientations = [
        orientPiece(item.piece, false),
        orientPiece(item.piece, true),
        orientPiece(item.piece, true, true),
        orientPiece(item.piece, true, false, true),
      ];
      for (let serial = 1; serial <= quantity; serial += 1) {
        instances.push({
          piece: item.piece,
          instance: `${item.piece.code}-${String(serial).padStart(3, "0")}`,
          lengthMm,
          profile,
          orientations,
        });
      }
    }
    return instances;
  }

  function byLength(instances) {
    return [...instances].sort((a, b) => b.lengthMm - a.lengthMm || a.instance.localeCompare(b.instance));
  }

  function angleKey(angle) {
    const value = Number(angle);
    return Number.isFinite(value) ? value.toFixed(2) : "none";
  }

  function byPotentialAngleChains(instances) {
    const remaining = byLength(instances);
    const ordered = [];
    const startAngleCounts = new Map();

    const itemStartKeys = (item) => new Set(item.orientations.map((orientation) => angleKey(orientation.startAngleDeg)));
    const changeStartCounts = (item, difference) => {
      for (const key of itemStartKeys(item)) {
        const next = (startAngleCounts.get(key) || 0) + difference;
        if (next > 0) startAngleCounts.set(key, next);
        else startAngleCounts.delete(key);
      }
    };
    for (const item of remaining) changeStartCounts(item, 1);

    let desiredAngle = null;
    while (remaining.length) {
      let selectedIndex = 0;
      let selectedOrientation = remaining[0].orientations[0];

      if (desiredAngle !== null) {
        const matches = [];
        for (let index = 0; index < remaining.length; index += 1) {
          const item = remaining[index];
          const ownStartKeys = itemStartKeys(item);
          for (const orientation of item.orientations) {
            if (!sameAngle(desiredAngle, orientation.startAngleDeg)) continue;
            const nextKey = angleKey(orientation.endAngleDeg);
            const continuationCount = Math.max(0, (startAngleCounts.get(nextKey) || 0) - Number(ownStartKeys.has(nextKey)));
            matches.push({ index, item, orientation, continuationCount });
          }
        }
        if (matches.length) {
          matches.sort((first, second) => (
            second.continuationCount - first.continuationCount
            || Number(first.orientation.rotated) - Number(second.orientation.rotated)
            || second.item.lengthMm - first.item.lengthMm
            || first.item.instance.localeCompare(second.item.instance)
          ));
          selectedIndex = matches[0].index;
          selectedOrientation = matches[0].orientation;
        }
      }

      const item = remaining.splice(selectedIndex, 1)[0];
      changeStartCounts(item, -1);
      ordered.push(item);
      desiredAngle = selectedOrientation.endAngleDeg;
    }
    return ordered;
  }

  function emptyBar(number, settings) {
    return {
      number,
      quantity: 1,
      profile: { ...settings.profile },
      usedMm: settings.initialTrimMm,
      trimMm: settings.initialTrimMm,
      rightStartMm: settings.stockLengthMm,
      closedRight: false,
      placements: [],
      lastEndAngleDeg: null,
      lastEndIsBoundary: false,
      lastEndTopMm: null,
      lastEndBottomMm: null,
    };
  }

  function canShare(bar, orientation) {
    return Boolean(
      bar.placements.length
      && sameAngle(bar.lastEndAngleDeg, orientation.startAngleDeg)
      && Number.isFinite(bar.lastEndTopMm)
      && Number.isFinite(bar.lastEndBottomMm)
    );
  }

  function candidatesForBar(bar, item, settings) {
    const candidates = [];
    const empty = bar.placements.length === 0;
    const emptySequential = !bar.placements.some((placement) => placement.edgePlacement !== "right");

    for (const orientation of item.orientations) {
      if (!orientation.hasOverhang) {
        let sharedStart = false;
        let transitionKerfMm = 0;
        let translationMm;
        if (emptySequential) {
          translationMm = bar.usedMm - orientation.minX;
        } else if (canShare(bar, orientation)) {
          translationMm = bar.lastEndTopMm - orientation.startTopX;
          const alignedBottomMm = translationMm + orientation.startBottomX;
          sharedStart = Math.abs(alignedBottomMm - bar.lastEndBottomMm) <= EDGE_TOLERANCE_MM;
          if (!sharedStart) translationMm = null;
        }
        if (!Number.isFinite(translationMm)) {
          transitionKerfMm = settings.kerfMm;
          translationMm = bar.usedMm + transitionKerfMm - orientation.minX;
        }
        // Uma peça só pode ser girada quando o próprio giro elimina o corte
        // de transição ao compartilhar exatamente o corte anterior.
        if (orientation.rotated && !sharedStart) continue;
        const envelopeStartMm = translationMm + orientation.minX;
        const envelopeEndMm = translationMm + orientation.maxX;
        const nextUsedMm = Math.max(bar.usedMm, envelopeEndMm);
        if (nextUsedMm <= bar.rightStartMm + EPSILON) {
          candidates.push({
            type: "sequential", orientation, sharedStart, transitionKerfMm,
            translationMm, envelopeStartMm, envelopeEndMm, nextUsedMm,
            remainingAfter: bar.rightStartMm - nextUsedMm,
            edgePriority: 1,
          });
        }
        continue;
      }

      if (!orientation.rotated && empty && orientation.leftOverhangMm > EDGE_TOLERANCE_MM) {
        const translationMm = -orientation.minX;
        const envelopeStartMm = 0;
        const envelopeEndMm = translationMm + orientation.maxX;
        const nextUsedMm = envelopeEndMm;
        if (nextUsedMm <= settings.stockLengthMm + EPSILON) {
          candidates.push({
            type: "sequential", orientation, sharedStart: false, transitionKerfMm: 0,
            translationMm, envelopeStartMm, envelopeEndMm, nextUsedMm,
            remainingAfter: settings.stockLengthMm - nextUsedMm,
            edgePriority: 0,
            clearsTrim: true,
            edgePlacement: "left",
          });
        }
      }

      if (!bar.closedRight && orientation.rightOverhangMm > EDGE_TOLERANCE_MM) {
        const translationMm = settings.stockLengthMm - orientation.maxX;
        const envelopeStartMm = translationMm + orientation.minX;
        const envelopeEndMm = settings.stockLengthMm;
        const sharedStart = canShare(bar, orientation)
          && Math.abs(translationMm + orientation.startTopX - bar.lastEndTopMm) <= EDGE_TOLERANCE_MM
          && Math.abs(translationMm + orientation.startBottomX - bar.lastEndBottomMm) <= EDGE_TOLERANCE_MM;
        if (orientation.rotated && !sharedStart) continue;
        const transitionKerfMm = emptySequential || sharedStart ? 0 : settings.kerfMm;
        const baseUsedMm = bar.usedMm;
        if (sharedStart || baseUsedMm + transitionKerfMm <= envelopeStartMm + EPSILON) {
          candidates.push({
            type: "right-edge", orientation, sharedStart, transitionKerfMm,
            translationMm, envelopeStartMm, envelopeEndMm, nextUsedMm: baseUsedMm,
            remainingAfter: sharedStart ? 0 : envelopeStartMm - transitionKerfMm - baseUsedMm,
            edgePriority: empty ? 2 : 0,
            edgePlacement: "right",
          });
        }
      }
    }
    return candidates;
  }

  function chooseCandidate(candidates, mode) {
    return [...candidates].sort((a, b) => {
      const materialFirst = mode === "material-first" || mode === "material-best-fit";
      if (!materialFirst) {
        const sharedDifference = Number(b.sharedStart) - Number(a.sharedStart);
        if (sharedDifference) return sharedDifference;
      }
      const edgeDifference = a.edgePriority - b.edgePriority;
      if (edgeDifference) return edgeDifference;
      if (mode !== "first-fit" && mode !== "material-first") {
        const remainderDifference = a.remainingAfter - b.remainingAfter;
        if (Math.abs(remainderDifference) > EPSILON) return remainderDifference;
      }
      return Number(a.orientation.rotated) - Number(b.orientation.rotated);
    })[0];
  }

  function applyCandidate(bar, item, candidate, settings) {
    if (candidate.clearsTrim) {
      bar.usedMm = 0;
      bar.trimMm = 0;
    }
    const orientation = candidate.orientation;
    const nominalStartMm = candidate.translationMm;
    const placement = {
      instance: item.instance,
      piece: item.piece,
      profile: { ...orientation.profile },
      rotated: orientation.rotated,
      rotationMode: orientation.rotationMode,
      cuts: orientation.cuts,
      startMm: nominalStartMm,
      endMm: nominalStartMm + orientation.lengthMm,
      lengthMm: orientation.lengthMm,
      envelopeStartMm: candidate.envelopeStartMm,
      envelopeEndMm: candidate.envelopeEndMm,
      spanMm: orientation.spanMm,
      leftOverhangMm: orientation.leftOverhangMm,
      rightOverhangMm: orientation.rightOverhangMm,
      edgePlacement: candidate.edgePlacement || null,
      kerfMm: settings.kerfMm,
      transitionKerfMm: candidate.transitionKerfMm,
      sharedStart: candidate.sharedStart,
      startAngleDeg: orientation.startAngleDeg,
      endAngleDeg: orientation.endAngleDeg,
      startCutId: orientation.startCutId,
      endCutId: orientation.endCutId,
      startTopMm: nominalStartMm + orientation.startTopX,
      startBottomMm: nominalStartMm + orientation.startBottomX,
      endTopMm: nominalStartMm + orientation.endTopX,
      endBottomMm: nominalStartMm + orientation.endBottomX,
    };
    bar.placements.push(placement);

    if (candidate.type === "right-edge") {
      bar.rightStartMm = candidate.sharedStart ? bar.usedMm : candidate.envelopeStartMm - candidate.transitionKerfMm;
      bar.closedRight = true;
    } else {
      bar.usedMm = candidate.nextUsedMm;
      bar.lastEndAngleDeg = orientation.endAngleDeg;
      bar.lastEndIsBoundary = orientation.endIsBoundary;
      bar.lastEndTopMm = nominalStartMm + orientation.endTopX;
      bar.lastEndBottomMm = nominalStartMm + orientation.endBottomX;
    }
  }

  function pack(ordered, settings, mode) {
    const bars = [];
    for (const item of ordered) {
      const allCandidates = [];
      for (const bar of bars) {
        for (const candidate of candidatesForBar(bar, item, settings)) {
          allCandidates.push({ bar, candidate });
        }
      }

      let selection;
      if (allCandidates.length) {
        const candidate = chooseCandidate(allCandidates.map((entry) => entry.candidate), mode);
        selection = allCandidates.find((entry) => entry.candidate === candidate);
      } else {
        const bar = emptyBar(bars.length + 1, settings);
        const candidates = candidatesForBar(bar, item, settings);
        if (!candidates.length) {
          const largestSpan = Math.min(...item.orientations.map((orientation) => orientation.spanMm));
          throw new Error(
            `A peça ${item.piece.code} precisa de ${largestSpan.toFixed(2)} mm e não cabe em uma barra de ${settings.stockLengthMm.toFixed(2)} mm.`,
          );
        }
        bars.push(bar);
        selection = { bar, candidate: chooseCandidate(candidates, mode) };
      }
      applyCandidate(selection.bar, item, selection.candidate, settings);
    }

    for (const bar of bars) {
      bar.placements.sort((a, b) => a.envelopeStartMm - b.envelopeStartMm);
      bar.remainingStartMm = bar.usedMm;
      bar.remainingEndMm = bar.rightStartMm;
      bar.remainingMm = Math.max(0, bar.remainingEndMm - bar.remainingStartMm);
      bar.occupiedMm = settings.stockLengthMm - bar.remainingMm;
      bar.sharedCuts = bar.placements.filter((placement) => placement.sharedStart).length;
      bar.additionalAngleCuts = bar.placements.filter((placement) => placement.transitionKerfMm > EPSILON).length;
      bar.operations = buildOperations(bar);
    }
    return bars;
  }

  function buildOperations(bar) {
    const operations = [];
    let previousEndOperation = null;
    for (const placement of bar.placements) {
      const cuts = [...(placement.cuts || placement.piece.cuts || [])].sort((a, b) => cutReference(a) - cutReference(b));
      for (const cut of cuts) {
        if (placement.sharedStart && cut.id === placement.startCutId) {
          if (previousEndOperation) previousEndOperation.sharedWith = placement.instance;
          continue;
        }
        const operation = {
          instance: placement.instance,
          cutId: cut.id,
          referenceMm: placement.startMm + cutReference(cut),
          topPointMm: placement.startMm + pointOnEdge(cut, "top"),
          bottomPointMm: placement.startMm + pointOnEdge(cut, "bottom"),
          inclinationDeg: cutAngle(cut) ?? 0,
          sharedWith: null,
          rotated: placement.rotated,
        };
        operations.push(operation);
        if (cut.id === placement.endCutId) previousEndOperation = operation;
      }
    }
    return operations.sort((a, b) => a.referenceMm - b.referenceMm);
  }

  function planScore(bars) {
    const sharedCuts = bars.reduce((sum, bar) => sum + bar.sharedCuts, 0);
    const remaining = bars.reduce((sum, bar) => sum + bar.remainingMm, 0);
    const reusableRemnantScore = bars.reduce((sum, bar) => {
      const remnant = Math.max(0, Number(bar.remainingMm) || 0);
      return sum + remnant * remnant;
    }, 0);
    return [bars.length, -sharedCuts, -reusableRemnantScore, -remaining];
  }

  function isBetter(candidate, current) {
    const candidateScore = planScore(candidate);
    const currentScore = planScore(current);
    for (let index = 0; index < candidateScore.length; index += 1) {
      if (candidateScore[index] < currentScore[index]) return true;
      if (candidateScore[index] > currentScore[index]) return false;
    }
    return false;
  }

  function sameProfile(first, second) {
    return Math.abs(first.widthMm - second.widthMm) <= 0.01
      && Math.abs(first.thicknessMm - second.thicknessMm) <= 0.01;
  }

  function optimizeProfileGroup(instances, baseSettings, profile) {
    const settings = { ...baseSettings, profile };
    const lengthOrder = byLength(instances);
    const angleOrder = byPotentialAngleChains(instances);
    const variants = [];
    for (const order of [lengthOrder, angleOrder]) {
      for (const mode of ["material-first", "material-best-fit", "first-fit", "best-fit", "angle-fit"]) {
        variants.push(pack(order, settings, mode));
      }
    }
    return variants.reduce((best, candidate) => isBetter(candidate, best) ? candidate : best);
  }

  function rounded(value) {
    return Number(Number(value).toFixed(4));
  }

  function barSignature(bar) {
    return JSON.stringify({
      profile: bar.profile,
      trimMm: rounded(bar.trimMm),
      remainingStartMm: rounded(bar.remainingStartMm),
      remainingEndMm: rounded(bar.remainingEndMm),
      placements: bar.placements.map((placement) => ({
        code: placement.piece.code,
        rotated: placement.rotated,
        rotationMode: placement.rotationMode,
        startMm: rounded(placement.startMm),
        endMm: rounded(placement.endMm),
        envelopeStartMm: rounded(placement.envelopeStartMm),
        envelopeEndMm: rounded(placement.envelopeEndMm),
        sharedStart: placement.sharedStart,
        edgePlacement: placement.edgePlacement,
        cuts: placement.cuts.map((cut) => ({
          topX: rounded(pointOnEdge(cut, "top")),
          bottomX: rounded(pointOnEdge(cut, "bottom")),
          angleDeg: cutAngle(cut),
        })),
      })),
    });
  }

  function consolidateBars(rawBars) {
    const patterns = new Map();
    for (const bar of rawBars) {
      const signature = barSignature(bar);
      const existing = patterns.get(signature);
      if (existing) {
        existing.quantity += 1;
        existing.sourceBarNumbers.push(bar.number);
      } else {
        patterns.set(signature, {
          ...bar,
          quantity: 1,
          sourceBarNumbers: [bar.number],
        });
      }
    }
    return [...patterns.values()].map((bar, index) => ({ ...bar, number: index + 1 }));
  }

  function optimizeCutPlan(input) {
    const requestedItems = (input.items || []).filter((item) => Number(item.quantity) > 0);
    const stockProfile = normalizeProfile(input.stockProfile || requestedItems[0]?.piece?.profile || {});
    const settings = {
      stockLengthMm: assertPositiveNumber(input.stockLengthMm, "Comprimento da barra"),
      stockProfile,
      kerfMm: Number(input.kerfMm),
      initialTrimMm: Number(input.initialTrimMm),
      angleToleranceDeg: 0.01,
    };
    if (!Number.isFinite(settings.kerfMm) || settings.kerfMm < 0) throw new Error("A largura do corte não pode ser negativa.");
    if (!Number.isFinite(settings.initialTrimMm) || settings.initialTrimMm < 0) throw new Error("O refilo inicial não pode ser negativo.");

    const instances = normalizeItems(input.items || []);
    if (!instances.length) throw new Error("Informe a quantidade de pelo menos uma peça.");
    for (const instance of instances) {
      if (!sameProfile(instance.profile, stockProfile)) {
        throw new Error(
          `A peça ${instance.piece.code} usa largura ${instance.profile.widthMm.toFixed(2)} mm e espessura ${instance.profile.thicknessMm.toFixed(2)} mm, incompatíveis com a matéria-prima ${stockProfile.widthMm.toFixed(2)} × ${stockProfile.thicknessMm.toFixed(2)} mm.`,
        );
      }
    }
    const rawBars = optimizeProfileGroup(instances, settings, stockProfile)
      .map((bar, index) => ({ ...bar, number: index + 1 }));
    const bars = consolidateBars(rawBars);

    const usefulLengthMm = instances.reduce((sum, instance) => sum + instance.lengthMm, 0);
    const suppliedLengthMm = rawBars.length * settings.stockLengthMm;
    const leftoverMm = rawBars.reduce((sum, bar) => sum + bar.remainingMm, 0);
    const sharedCuts = rawBars.reduce((sum, bar) => sum + bar.sharedCuts, 0);
    const additionalAngleCuts = rawBars.reduce((sum, bar) => sum + bar.additionalAngleCuts, 0);
    const rotatedPieces = rawBars.reduce((sum, bar) => sum + bar.placements.filter((placement) => placement.rotated).length, 0);
    const edgePieces = rawBars.reduce((sum, bar) => sum + bar.placements.filter((placement) => placement.edgePlacement).length, 0);
    const kerfLossMm = (instances.length + additionalAngleCuts) * settings.kerfMm;
    const trimLossMm = rawBars.reduce((sum, bar) => sum + bar.trimMm, 0);
    const cutCount = rawBars.reduce((sum, bar) => sum + bar.operations.length, 0);

    return {
      schemaVersion: 5,
      type: "cut-plan",
      createdAt: new Date().toISOString(),
      profiles: [stockProfile],
      settings,
      requestedPieces: instances.length,
      bars,
      metrics: {
        barCount: rawBars.length,
        patternCount: bars.length,
        profileCount: 1,
        usefulLengthMm,
        suppliedLengthMm,
        leftoverMm,
        kerfLossMm,
        trimLossMm,
        sharedCuts,
        additionalAngleCuts,
        cutCount,
        rotatedPieces,
        edgePieces,
        savedKerfMm: sharedCuts * settings.kerfMm,
        utilizationPercent: suppliedLengthMm ? usefulLengthMm / suppliedLengthMm * 100 : 0,
      },
      warning: "Plano geométrico preliminar para uma única dimensão de matéria-prima. Avanços externos ficam nas extremidades, a rotação aplicada é de 180° e 90° representa o corte vertical.",
    };
  }

  const api = { optimizeCutPlan, buildOperations, sameAngle, orientPiece };
  globalScope.CutOptimizer = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
