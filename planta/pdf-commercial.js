"use strict";

const PROPOSAL_PICTURES_BASE="https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/Pictures/";
const PROPOSAL_PICTURES_MANIFEST=PROPOSAL_PICTURES_BASE+"index.json";
const PROPOSAL_MAX_IMAGES=6;
const PROPOSAL_PICTURE_GROUPS=[
  ["01A",["R1","R2","R3","V2 R1"]],["01C",["R1","R2","R3","V2 R1"]],
  ["02A",["R1","R2","R3","V2 R1"]],["02C",["R1","R2","R3","V2 R1"]],
  ["03A",["R1","R2","R3","V2 R1"]],["03C",["R1","R2","R3","V2 R1"]],
  ["04A",["R1","R2","R3","V2 R1"]],["04C",["R1","R2","R3","V2 R1"]],
  ["05A",["R1","R2","R3","V2 R1"]],["05C",["R1","R2","R3","V2 R1"]],
  ["06A",["R1","R2","R3","V2 R1"]],["06C",["R1","R2","R3","V2 R1"]],
  ["07A",["R1","R2","R3","V2 R1"]],["07C",["R1","R2","R3","V2 R1"]],
  ["08A",["R1","R2","R3","V2 R1"]],["08C",["R1","R2","R3","R4","V2 R1"]],
  ["09",["R1","R2","V2 R1"]],["10",["R1","R2","R3","V2 R1"]]
];

let proposalPictureCatalog=[];
let proposalPictureCatalogLoaded=false;
let proposalPictureCatalogLoading=false;
const proposalSelectedPictures=new Map();

function normalizeProposalPictureUrl(raw){
  const value=String(raw||"").trim();
  if(!value||value.length>2048)throw new Error("URL de imagem invalida.");
  const url=new URL(value,PROPOSAL_PICTURES_BASE);
  const base=new URL(PROPOSAL_PICTURES_BASE);
  if(url.protocol!=="https:"||url.origin!==base.origin||!url.pathname.startsWith(base.pathname)){
    throw new Error("Use somente imagens publicas da pasta Pictures informada.");
  }
  if(!/\.(?:png|jpe?g|webp)$/i.test(url.pathname)){
    throw new Error("Formato permitido: PNG, JPG, JPEG ou WEBP.");
  }
  url.hash="";
  return url.href;
}
function buildBundledProposalPictureCatalog(){
  const catalog=[];
  PROPOSAL_PICTURE_GROUPS.forEach(group=>{
    const model=group[0],variants=group[1];
    variants.forEach(variant=>{
      const file="Modelo "+model+" "+variant+".png";
      catalog.push({url:normalizeProposalPictureUrl(file),label:file.replace(/\.png$/i,"")});
    });
  });
  return catalog;
}


function proposalPictureLabel(url){
  try{
    const pathname=new URL(url).pathname;
    const file=decodeURIComponent(pathname.split("/").pop()||"Imagem");
    return file.replace(/\.[^.]+$/,"").replace(/[-_]+/g," ").trim()||"Imagem";
  }catch(_error){return "Imagem";}
}

function parseProposalPictureManifest(payload){
  const source=Array.isArray(payload)?payload:(Array.isArray(payload?.images)?payload.images:[]);
  const unique=new Map();
  source.slice(0,100).forEach(entry=>{
    try{
      const raw=typeof entry==="string"?entry:(entry?.url||entry?.file||entry?.src);
      if(!raw)return;
      const url=normalizeProposalPictureUrl(raw);
      const label=String(typeof entry==="object"&&(entry.title||entry.name)||proposalPictureLabel(url)).slice(0,100);
      unique.set(url,{url,label});
    }catch(_error){}
  });
  return [...unique.values()];
}

function renderProposalPictureCatalog(message){
  const grid=document.getElementById("m_com_images");
  const status=document.getElementById("m_com_image_status");
  if(!grid||!status)return;
  const all=new Map(proposalPictureCatalog.map(item=>[item.url,item]));
  proposalSelectedPictures.forEach((item,url)=>all.set(url,item));
  const items=[...all.values()];
  status.textContent=message||(items.length
    ? `Selecione ate ${PROPOSAL_MAX_IMAGES} imagens. ${proposalSelectedPictures.size} selecionada(s).`
    : "Nenhuma imagem listada. Adicione URLs publicas da pasta Pictures abaixo.");
  grid.innerHTML=items.map(item=>`
    <label class="pdf-image-choice" title="${esc(item.label)}">
      <input type="checkbox" data-proposal-picture="${esc(item.url)}" ${proposalSelectedPictures.has(item.url)?"checked":""}>
      <img src="${esc(item.url)}" alt="${esc(item.label)}" loading="lazy" referrerpolicy="no-referrer">
      <span>${esc(item.label)}</span>
    </label>`).join("");
  grid.onchange=event=>{
    const checkbox=event.target.closest("[data-proposal-picture]");
    if(!checkbox)return;
    const url=checkbox.getAttribute("data-proposal-picture");
    const item=all.get(url);
    if(checkbox.checked){
      if(proposalSelectedPictures.size>=PROPOSAL_MAX_IMAGES){
        checkbox.checked=false;
        toastError(`Escolha no maximo ${PROPOSAL_MAX_IMAGES} imagens.`);
        return;
      }
      proposalSelectedPictures.set(url,item||{url,label:proposalPictureLabel(url)});
    }else{
      proposalSelectedPictures.delete(url);
    }
    status.textContent=`Selecione ate ${PROPOSAL_MAX_IMAGES} imagens. ${proposalSelectedPictures.size} selecionada(s).`;
  };
}

async function loadProposalPictureCatalog(){
  if(!proposalPictureCatalog.length)proposalPictureCatalog=buildBundledProposalPictureCatalog();
  if(proposalPictureCatalogLoaded||proposalPictureCatalogLoading){
    renderProposalPictureCatalog(proposalPictureCatalogLoading?"Carregando imagens do catalogo...":"");
    return;
  }
  proposalPictureCatalogLoading=true;
  renderProposalPictureCatalog("Carregando imagens do catalogo...");
  try{
    const response=await fetch(PROPOSAL_PICTURES_MANIFEST,{
      method:"GET",mode:"cors",credentials:"omit",cache:"no-store",referrerPolicy:"no-referrer"
    });
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const contentType=response.headers.get("content-type")||"";
    if(!contentType.includes("json"))throw new Error("manifesto nao e JSON");
    const manifestItems=parseProposalPictureManifest(await response.json());
    const merged=new Map(proposalPictureCatalog.map(item=>[item.url,item]));
    manifestItems.forEach(item=>merged.set(item.url,item));
    proposalPictureCatalog=[...merged.values()];
    proposalPictureCatalogLoaded=true;
    renderProposalPictureCatalog(proposalPictureCatalog.length+" imagens disponiveis. Selecione ate "+PROPOSAL_MAX_IMAGES+".");
  }catch(error){
    console.info("Manifesto complementar de imagens indisponivel.",error);
    proposalPictureCatalogLoaded=true;
    renderProposalPictureCatalog(proposalPictureCatalog.length+" imagens cadastradas. Selecione ate "+PROPOSAL_MAX_IMAGES+".");
  }finally{
    proposalPictureCatalogLoading=false;
  }
}

function addProposalPictureUrls(){
  const input=document.getElementById("m_com_urls");
  if(!input)return;
  const values=input.value.split(/\r?\n/).map(value=>value.trim()).filter(Boolean);
  let added=0;
  for(const raw of values){
    if(proposalSelectedPictures.size>=PROPOSAL_MAX_IMAGES){
      toastError(`Limite de ${PROPOSAL_MAX_IMAGES} imagens atingido.`);
      break;
    }
    try{
      const url=normalizeProposalPictureUrl(raw);
      proposalSelectedPictures.set(url,{url,label:proposalPictureLabel(url)});
      added++;
    }catch(error){
      toastError(error.message);
      return;
    }
  }
  if(added){
    input.value="";
    renderProposalPictureCatalog();
    toast(`${added} imagem(ns) adicionada(s).`);
  }
}

function openPdfModal(){
  const m=state.meta;
  let exportMode="technical";
  let dimMode=(state.manualDims&&state.manualDims.some(d=>(d.andar||1)===1))?"manual":"auto";
  modalBody.dataset.modal="";
  modalBody.classList.remove("q-wide","pm-modal");
  modalBody.classList.add("pdf-export-modal");
  modalBody.innerHTML=`
    <div class="pdf-modal-header">
      <h3>Gerar PDF</h3>
      <p class="sub">Escolha entre o documento tecnico completo e uma proposta comercial voltada a apresentacao.</p>
    </div>
    <div class="pdf-modal-scroll">
      <div class="pdf-export-kinds" role="tablist" aria-label="Tipo de PDF">
        <button type="button" class="pdf-kind active" id="m_pdf_technical" role="tab" aria-selected="true">
          <strong>Documento tecnico</strong>
          <span>Plantas, blocos, cotas, carimbo e quantitativo opcional.</span>
        </button>
        <button type="button" class="pdf-kind" id="m_pdf_commercial" role="tab" aria-selected="false">
          <strong>Proposta comercial</strong>
          <span>Apresentacao visual, beneficios, investimento e imagens.</span>
        </button>
      </div>

      <div class="two">
        <div class="field"><label>Nome do cliente</label><input id="m_cli" value="${esc(m.cliente||"")}" placeholder="ex: Joao Silva"></div>
        <div class="field"><label>Local da obra</label><input id="m_loc" value="${esc(m.local||"")}" placeholder="ex: Cidade/UF"></div>
      </div>
      <div class="two">
        <div class="field"><label>Projetado por</label><input id="m_proj" value="${esc(m.projetadoPor||"")}" placeholder="321 MODULAR"></div>
        <div class="field"><label>Modelo / Projeto</label><input id="m_mod" value="${esc(m.modelo||"")}" placeholder="${esc(state.name||"Planta sem titulo")}"></div>
      </div>
      <div class="field"><label>Revisao</label><input id="m_rev" value="${esc(m.revisao||"")}" placeholder="01"></div>

      <section class="pdf-section" id="m_pdf_technical_section" role="tabpanel">
        <div class="pdf-option-card">
          <label>Cotas no PDF</label>
          <div class="pdf-inline-actions">
            <button type="button" class="tbtn" id="m_dim_auto">Automaticas</button>
            <button type="button" class="tbtn" id="m_dim_manual">Manuais</button>
          </div>
          <p class="sub">Automaticas: cota geral e mezanino. Manuais: cotas criadas com a ferramenta da planta.</p>
        </div>
        <div class="pdf-option-card">
          <label class="pdf-check"><input type="checkbox" id="m_incluir_orc">Incluir quantitativo</label>
          <p class="sub">Adiciona a lista de componentes ao documento tecnico.</p>
        </div>
        <div class="pdf-option-card">
          <label class="pdf-check"><input type="checkbox" id="m_incluir_blocos" checked>Gerar planta de blocos</label>
          <p class="sub">Inclui a marcacao dos blocos de fundacao em folha propria.</p>
        </div>
        <div class="pdf-option-card">
          <label class="pdf-check"><input type="checkbox" id="m_incluir_valor" ${state.incluirValorNaPlanta!==false?"checked":""}>Incluir valor na planta</label>
          <p class="sub">Mostra o valor total no carimbo das folhas tecnicas.</p>
        </div>
        <div class="pdf-option-card">
          <label class="pdf-check"><input type="checkbox" id="m_incluir_labels" checked>Incluir descricoes de esquadrias e oitoes</label>
        </div>
      </section>

      <section class="pdf-section" id="m_pdf_commercial_section" role="tabpanel" hidden>
        <div class="pdf-option-card">
          <label class="pdf-check"><input type="checkbox" id="m_com_incluir_valor" checked>Apresentar investimento estimado</label>
          <p class="sub">Exibe o valor calculado no Quantitativo, quando estiver disponivel.</p>
        </div>
        <div class="field">
          <label>Imagens da proposta</label>
          <p class="pdf-image-status" id="m_com_image_status">Abra a proposta comercial para carregar o catalogo.</p>
          <div class="pdf-image-grid" id="m_com_images"></div>
        </div>
        <div class="field">
          <label for="m_com_urls">Adicionar URLs da pasta Pictures</label>
          <textarea class="pdf-url-input" id="m_com_urls" placeholder="Uma URL publica por linha"></textarea>
          <p class="sub">Somente PNG, JPG ou WEBP hospedados em ${esc(PROPOSAL_PICTURES_BASE)}</p>
          <div class="pdf-inline-actions"><button type="button" class="tbtn" id="m_com_add_urls">Adicionar imagens</button></div>
        </div>
      </section>
    </div>
    <div class="pdf-modal-footer">
      <div class="modal-actions">
        <button class="tbtn" id="m_cancel">Cancelar</button>
        <button class="tbtn" id="m_preview">Pre-visualizar</button>
        <button class="tbtn accent" id="m_go">Gerar PDF</button>
      </div>
    </div>`;

  const paintDimMode=()=>{
    document.getElementById("m_dim_auto").classList.toggle("primary",dimMode==="auto");
    document.getElementById("m_dim_manual").classList.toggle("primary",dimMode==="manual");
  };
  document.getElementById("m_dim_auto").onclick=()=>{dimMode="auto";paintDimMode();};
  document.getElementById("m_dim_manual").onclick=()=>{dimMode="manual";paintDimMode();};
  paintDimMode();

  const setExportMode=mode=>{
    exportMode=mode;
    const technical=mode==="technical";
    document.getElementById("m_pdf_technical").classList.toggle("active",technical);
    document.getElementById("m_pdf_technical").setAttribute("aria-selected",String(technical));
    document.getElementById("m_pdf_commercial").classList.toggle("active",!technical);
    document.getElementById("m_pdf_commercial").setAttribute("aria-selected",String(!technical));
    document.getElementById("m_pdf_technical_section").hidden=!technical;
    document.getElementById("m_pdf_commercial_section").hidden=technical;
    document.getElementById("m_go").textContent=technical?"Gerar PDF":"Gerar proposta";
    if(!technical)loadProposalPictureCatalog();
  };
  document.getElementById("m_pdf_technical").onclick=()=>setExportMode("technical");
  document.getElementById("m_pdf_commercial").onclick=()=>setExportMode("commercial");
  document.getElementById("m_com_add_urls").onclick=addProposalPictureUrls;

  const updateMeta=()=>{
    state.meta={
      cliente:document.getElementById("m_cli").value.trim(),
      local:document.getElementById("m_loc").value.trim(),
      projetadoPor:document.getElementById("m_proj").value.trim()||"321 MODULAR",
      modelo:document.getElementById("m_mod").value.trim()||state.name||"Planta sem titulo",
      revisao:document.getElementById("m_rev").value.trim()||"01",
      logo:DEFAULT_LOGO
    };
    state.incluirValorNaPlanta=document.getElementById("m_incluir_valor").checked;
  };
  const runExport=action=>{
    updateMeta();
    if(exportMode==="technical"){
      const inclOrc=document.getElementById("m_incluir_orc").checked;
      const inclLabels=document.getElementById("m_incluir_labels").checked;
      const inclBlocos=document.getElementById("m_incluir_blocos").checked;
      closeModal();
      generatePDF(action,dimMode,inclOrc,inclLabels,inclBlocos);
      return;
    }
    const includeInvestment=document.getElementById("m_com_incluir_valor").checked;
    const images=[...proposalSelectedPictures.values()].slice(0,PROPOSAL_MAX_IMAGES);
    closeModal();
    generateCommercialProposal(action,{includeInvestment,images});
  };
  document.getElementById("m_cancel").onclick=()=>{updateMeta();closeModal();};
  document.getElementById("m_preview").onclick=()=>runExport("preview");
  document.getElementById("m_go").onclick=()=>runExport("save");

  scrim.classList.add("show");
  setTimeout(()=>document.getElementById("m_cli")?.focus(),50);
}


function proposalInvestmentValue(){
  if(!pricingData)return 0;
  const total=gerarItensOrcamento().reduce((sum,item)=>sum+(Number(item.subtotal)||0),0);
  const discount=qDesconto.tipo==="percent"
    ? total*(Math.max(0,Number(qDesconto.valor)||0)/100)
    : Math.min(Math.max(0,Number(qDesconto.valor)||0),total);
  return Math.max(0,total-discount);
}

function rasterizeProposalImageSource(source,maxDimension=1800){
  return new Promise((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>{
      try{
        const scale=Math.min(1,maxDimension/Math.max(image.naturalWidth||image.width,image.naturalHeight||image.height));
        const canvas=document.createElement("canvas");
        canvas.width=Math.max(1,Math.round((image.naturalWidth||image.width)*scale));
        canvas.height=Math.max(1,Math.round((image.naturalHeight||image.height)*scale));
        const context=canvas.getContext("2d",{alpha:false});
        context.fillStyle="#ffffff";
        context.fillRect(0,0,canvas.width,canvas.height);
        context.drawImage(image,0,0,canvas.width,canvas.height);
        resolve({dataUrl:canvas.toDataURL("image/jpeg",0.9),width:canvas.width,height:canvas.height});
      }catch(error){reject(error);}
    };
    image.onerror=()=>reject(new Error("Nao foi possivel processar uma das imagens."));
    image.src=source;
  });
}

async function loadProposalPictureForPdf(item){
  const url=normalizeProposalPictureUrl(item.url);
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15000);
  try{
    const response=await fetch(url,{
      method:"GET",mode:"cors",credentials:"omit",cache:"force-cache",
      referrerPolicy:"no-referrer",signal:controller.signal
    });
    if(!response.ok)throw new Error(`Falha ao carregar ${item.label}: HTTP ${response.status}.`);
    const declaredSize=Number(response.headers.get("content-length")||0);
    if(declaredSize>12*1024*1024)throw new Error(`A imagem ${item.label} excede 12 MB.`);
    const blob=await response.blob();
    if(blob.size>12*1024*1024)throw new Error(`A imagem ${item.label} excede 12 MB.`);
    if(!/^image\/(?:png|jpeg|webp)$/i.test(blob.type))throw new Error(`Formato invalido em ${item.label}.`);
    const objectUrl=URL.createObjectURL(blob);
    try{
      const raster=await rasterizeProposalImageSource(objectUrl);
      return {...raster,label:String(item.label||proposalPictureLabel(url)).slice(0,100),url};
    }finally{
      URL.revokeObjectURL(objectUrl);
    }
  }finally{
    clearTimeout(timer);
  }
}

async function proposalLogoForPdf(){
  try{
    const source=await preloadDefaultLogoForExport();
    return await rasterizeProposalImageSource(source,900);
  }catch(error){
    console.warn("Logo nao incorporada na proposta.",error);
    return null;
  }
}

function addContainedProposalImage(doc,image,x,y,width,height){
  doc.setFillColor(245,247,244);
  doc.roundedRect(x,y,width,height,2,2,"F");
  if(!image)return;
  const scale=Math.min(width/image.width,height/image.height);
  const drawW=image.width*scale;
  const drawH=image.height*scale;
  doc.addImage(image.dataUrl,"JPEG",x+(width-drawW)/2,y+(height-drawH)/2,drawW,drawH,undefined,"FAST");
}

function drawCommercialPdfChrome(doc,logo,page,total,fontFamily){
  doc.setFillColor(31,51,27);
  doc.rect(0,0,210,7,"F");
  doc.setFillColor(244,111,24);
  doc.rect(0,7,210,2,"F");
  if(logo)doc.addImage(logo.dataUrl,"JPEG",14,12,38,12,undefined,"FAST");
  doc.setFont(fontFamily,"bold");
  doc.setFontSize(8);
  doc.setTextColor(31,51,27);
  doc.text("PROPOSTA COMERCIAL",196,18,{align:"right"});
  doc.setDrawColor(218,224,215);
  doc.setLineWidth(0.35);
  doc.line(14,29,196,29);
  doc.line(14,280,196,280);
  doc.setFont(fontFamily,"normal");
  doc.setFontSize(7.5);
  doc.setTextColor(105,113,103);
  doc.text("321 Modular | Solucoes construtivas inteligentes",14,287);
  doc.text(`${page} / ${total}`,196,287,{align:"right"});
}

function drawCommercialBenefit(doc,fontFamily,x,title,text){
  doc.setFillColor(245,247,244);
  doc.setDrawColor(218,224,215);
  doc.roundedRect(x,158,56,38,3,3,"FD");
  doc.setFont(fontFamily,"bold");
  doc.setFontSize(9);
  doc.setTextColor(31,51,27);
  doc.text(title,x+5,169);
  doc.setFont(fontFamily,"normal");
  doc.setFontSize(7.3);
  doc.setTextColor(86,94,84);
  doc.text(doc.splitTextToSize(text,46),x+5,177);
}

function showGeneratedPdf(doc,action,fileName,successMessage){
  if(action==="preview"){
    document.getElementById("previewFrame").src=doc.output("bloburl");
    document.getElementById("previewScrim").classList.add("show");
    document.getElementById("previewSaveBtn").onclick=()=>doc.save(fileName);
  }else{
    doc.save(fileName);
    toast(successMessage);
  }
}

async function generateCommercialProposal(action="save",options={}){
  const js=window.jspdf&&window.jspdf.jsPDF;
  if(!js){toastError("Gerador de PDF indisponivel.");return;}
  toast("Gerando proposta comercial...");
  try{
    const requested=(options.images||[]).slice(0,PROPOSAL_MAX_IMAGES);
    const loaded=[];
    for(const item of requested){
      try{loaded.push(await loadProposalPictureForPdf(item));}
      catch(error){console.warn(error);toastError(error.message);}
    }
    const logo=await proposalLogoForPdf();
    const doc=new js({orientation:"portrait",unit:"mm",format:"a4"});
    let fontFamily="helvetica";
    try{await loadMontserratIntoDoc(doc);fontFamily="Montserrat";}
    catch(error){console.warn("Montserrat indisponivel na proposta.",error);}

    const meta=state.meta||{};
    const model=meta.modelo||state.name||"Projeto modular";
    const client=meta.cliente||"Cliente";
    const location=meta.local||"Local a definir";
    const area=occupiedArea();
    const investment=proposalInvestmentValue();
    const hero=loaded[0]||null;

    doc.setFont(fontFamily,"bold");
    doc.setTextColor(31,51,27);
    doc.setFontSize(22);
    doc.text("SEU PROJETO",14,43);
    doc.setTextColor(244,111,24);
    doc.text("321 MODULAR",14,52);
    doc.setFont(fontFamily,"normal");
    doc.setTextColor(89,97,87);
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize("Uma proposta pensada para transformar seu projeto em uma construcao agil, previsivel e de alta qualidade.",118),14,59);

    if(hero){
      addContainedProposalImage(doc,hero,14,72,182,78);
    }else{
      doc.setFillColor(31,51,27);
      doc.roundedRect(14,72,182,78,4,4,"F");
      doc.setFillColor(244,111,24);
      doc.circle(169,91,22,"F");
      doc.setFont(fontFamily,"bold");
      doc.setFontSize(21);
      doc.setTextColor(255,255,255);
      doc.text(model.slice(0,36),24,108);
      doc.setFont(fontFamily,"normal");
      doc.setFontSize(10);
      doc.text("Engenharia modular sob medida",24,120);
    }

    drawCommercialBenefit(doc,fontFamily,14,"AGILIDADE","Processo industrializado e montagem planejada.");
    drawCommercialBenefit(doc,fontFamily,77,"PREVISIBILIDADE","Escopo claro para decisoes mais seguras.");
    drawCommercialBenefit(doc,fontFamily,140,"QUALIDADE","Padrao construtivo e controle de execucao.");

    doc.setFont(fontFamily,"bold");
    doc.setFontSize(9);
    doc.setTextColor(31,51,27);
    doc.text("RESUMO DO PROJETO",14,208);
    doc.setFont(fontFamily,"normal");
    doc.setTextColor(68,75,66);
    doc.setFontSize(8.5);
    doc.text(`Cliente: ${client}`,14,217);
    doc.text(`Modelo: ${model}`,14,224);
    doc.text(`Local: ${location}`,105,217);
    doc.text(`Area estimada: ${area.toLocaleString("pt-BR",{maximumFractionDigits:2})} m2`,105,224);

    if(options.includeInvestment&&investment>0){
      doc.setFillColor(31,51,27);
      doc.roundedRect(14,235,182,29,3,3,"F");
      doc.setFont(fontFamily,"normal");
      doc.setTextColor(210,226,202);
      doc.setFontSize(8);
      doc.text("INVESTIMENTO ESTIMADO",21,245);
      doc.setFont(fontFamily,"bold");
      doc.setTextColor(255,255,255);
      doc.setFontSize(16);
      doc.text(investment.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),21,257);
    }else{
      doc.setFont(fontFamily,"normal");
      doc.setFontSize(8);
      doc.setTextColor(105,113,103);
      doc.text("Valores e condicoes comerciais sujeitos a validacao do escopo final.",14,247);
    }

    const gallery=loaded.slice(1);
    for(let index=0;index<gallery.length;index+=2){
      doc.addPage();
      doc.setFont(fontFamily,"bold");
      doc.setFontSize(16);
      doc.setTextColor(31,51,27);
      doc.text("INSPIRACOES PARA O PROJETO",14,43);
      doc.setFont(fontFamily,"normal");
      doc.setFontSize(8);
      doc.setTextColor(105,113,103);
      doc.text("Referencias visuais selecionadas para esta apresentacao.",14,50);
      gallery.slice(index,index+2).forEach((image,position)=>{
        const y=position===0?60:165;
        addContainedProposalImage(doc,image,14,y,182,86);
        doc.setFont(fontFamily,"bold");
        doc.setFontSize(8);
        doc.setTextColor(31,51,27);
        doc.text(image.label.slice(0,70),14,y+94);
      });
    }

    const totalPages=doc.getNumberOfPages();
    for(let page=1;page<=totalPages;page++){
      doc.setPage(page);
      drawCommercialPdfChrome(doc,logo,page,totalPages,fontFamily);
    }
    const fileBase=(model||"proposta").replace(/[^\w-]+/g,"_");
    showGeneratedPdf(doc,action,`Proposta_${fileBase}.pdf`,"Proposta comercial gerada.");
  }catch(error){
    console.error("Falha ao gerar proposta comercial.",error);
    toastError("Nao foi possivel gerar a proposta comercial.");
  }
}


document.getElementById("btnPdf").onclick=openPdfModal;
