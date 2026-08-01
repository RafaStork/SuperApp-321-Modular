"use strict";

const PROPOSAL_PICTURES_BASE="https://pub-23aa4a72b2b54deabef4f4d1916eb601.r2.dev/Pictures/";
const PROPOSAL_PICTURES_MANIFEST=PROPOSAL_PICTURES_BASE+"index.json";
const PROPOSAL_MAX_IMAGES=6;
let lastPdfExportMode="technical";
function brazilPhoneDigits(value){
  let digits=String(value||"").replace(/\D/g,"");
  if(digits.length>11&&digits.startsWith("55"))digits=digits.slice(2);
  return digits.slice(0,11);
}
function formatBrazilPhone(value){
  const digits=brazilPhoneDigits(value);
  if(!digits)return "";
  if(digits.length<=2)return `(${digits}`;
  const area=digits.slice(0,2),number=digits.slice(2);
  if(number.length<=5)return `(${area}) ${number}`;
  return `(${area}) ${number.slice(0,5)}-${number.slice(5)}`;
}
function wireBrazilPhoneInput(input){
  if(!input)return;
  input.value=formatBrazilPhone(input.value);
  input.addEventListener("input",()=>{input.value=formatBrazilPhone(input.value);});
}
function hasIncompleteBrazilPhone(value){
  const digits=brazilPhoneDigits(value);
  return digits.length>0&&digits.length!==11;
}
function safePdfFilenamePart(value,fallback){
  const cleaned=String(value||fallback||"")
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g," ")
    .replace(/\s+/g," ").trim().replace(/[. ]+$/g,"");
  return (cleaned||fallback||"Documento").slice(0,70);
}
function buildPdfFileBase(meta,defaultModel){
  return [
    safePdfFilenamePart(meta?.cliente,"Cliente"),
    safePdfFilenamePart(String(meta?.local||"").split(/\s*(?:\/|,|\||\s-\s)\s*/)[0],"Cidade"),
    safePdfFilenamePart(meta?.modelo||defaultModel,"Modelo de chalé")
  ].join(" - ");
}

function applyPdfDocumentName(doc,fileName){
  const title=String(fileName||"Documento.pdf").replace(/\.pdf$/i,"");
  if(typeof doc?.setProperties==="function"){
    doc.setProperties({title,subject:title,author:"321 Modular",creator:"321 Modular"});
  }
  return title;
}
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
      catalog.push({url:normalizeProposalPictureUrl(file),label:file.replace(/\.png$/i,""),model});
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
      const model=String(typeof entry==="object"&&entry.model||label.match(/Modelo\s+([0-9]+[A-Z]?)/i)?.[1]||"Outros").toUpperCase();
      unique.set(url,{url,label,model});
    }catch(_error){}
  });
  return [...unique.values()];
}

function proposalPictureModel(item){
  if(item.local)return "IMAGENS LOCAIS";
  return String(item.model||item.label?.match(/Modelo\s+([0-9]+[A-Z]?)/i)?.[1]||"OUTROS").toUpperCase();
}
const proposalGroupAnimations=new WeakMap();
function wireProposalImageGroupAnimations(container){
  container.querySelectorAll(".pdf-image-group>summary").forEach(summary=>{
    summary.addEventListener("click",event=>{
      const group=summary.parentElement;
      const content=group.querySelector(":scope>.pdf-image-grid");
      if(!content)return;
      event.preventDefault();
      if(proposalGroupAnimations.has(group))return;
      const opening=!group.open;
      if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){
        if(opening){content.style.removeProperty("display");group.open=true;}
        else{group.open=false;content.style.display="none";}
        return;
      }
      content.getAnimations().forEach(animation=>animation.cancel());
      if(opening){
        content.style.removeProperty("display");
        group.open=true;
        void content.offsetHeight;
      }else{
        group.classList.add("closing");
      }
      const fullHeight=content.scrollHeight;
      const currentHeight=content.getBoundingClientRect().height||fullHeight;
      const from={height:opening?"0px":`${currentHeight}px`,opacity:opening?0:1,transform:opening?"translateY(-6px)":"translateY(0)"};
      const to={height:opening?`${fullHeight}px`:"0px",opacity:opening?1:0,transform:opening?"translateY(0)":"translateY(-6px)"};
      content.style.overflow="hidden";
      const animation=content.animate([from,to],{duration:260,easing:"cubic-bezier(.22,.61,.36,1)",fill:"forwards"});
      proposalGroupAnimations.set(group,animation);
      const clearAnimationStyles=()=>{
        proposalGroupAnimations.delete(group);
        group.classList.remove("closing");
        content.style.removeProperty("overflow");
        content.style.removeProperty("height");
        content.style.removeProperty("opacity");
        content.style.removeProperty("transform");
      };
      animation.onfinish=()=>{
        animation.onfinish=null;
        animation.oncancel=null;
        if(!opening){group.open=false;content.style.display="none";}
        else content.style.removeProperty("display");
        animation.cancel();
        clearAnimationStyles();
      };
      animation.oncancel=clearAnimationStyles;
    });
  });
}
function renderProposalPictureCatalog(message){
  const grid=document.getElementById("m_com_images");
  const status=document.getElementById("m_com_image_status");
  if(!grid||!status)return;
  const all=new Map(proposalPictureCatalog.map(item=>[item.url,item]));
  proposalSelectedPictures.forEach((item,url)=>all.set(url,item));
  const groups=new Map();
  [...all.values()].forEach(item=>{
    const model=proposalPictureModel(item);
    if(!groups.has(model))groups.set(model,[]);
    groups.get(model).push(item);
  });
  status.textContent=message||`Selecione até ${PROPOSAL_MAX_IMAGES} imagens. ${proposalSelectedPictures.size} selecionada(s).`;
  grid.innerHTML=[...groups.entries()].map(([model,items])=>`
    <details class="pdf-image-group" ${model==="IMAGENS LOCAIS"?"open":""}>
      <summary><span>${esc(model==="IMAGENS LOCAIS"?model:`MODELO ${model}`)}</span><small>${items.length} imagem(ns)</small></summary>
      <div class="pdf-image-grid">${items.map(item=>`
        <label class="pdf-image-choice" title="${esc(item.label)}">
          <input type="checkbox" data-proposal-picture="${esc(item.url)}" ${proposalSelectedPictures.has(item.url)?"checked":""}>
          <img src="${esc(item.url)}" alt="${esc(item.label)}" loading="lazy" referrerpolicy="no-referrer">
          <span>${esc(item.label)}</span>
        </label>`).join("")}</div>
    </details>`).join("");
  wireProposalImageGroupAnimations(grid);
  grid.onchange=event=>{
    const checkbox=event.target.closest("[data-proposal-picture]");
    if(!checkbox)return;
    const url=checkbox.getAttribute("data-proposal-picture");
    const item=all.get(url);
    if(checkbox.checked){
      if(proposalSelectedPictures.size>=PROPOSAL_MAX_IMAGES){
        checkbox.checked=false;
        toastError(`Escolha no máximo ${PROPOSAL_MAX_IMAGES} imagens.`);
        return;
      }
      proposalSelectedPictures.set(url,item||{url,label:proposalPictureLabel(url)});
    }else{
      const removed=proposalSelectedPictures.get(url);
      proposalSelectedPictures.delete(url);
      if(removed?.local&&String(removed.url).startsWith("blob:")){
        URL.revokeObjectURL(removed.url);
        renderProposalPictureCatalog();
        return;
      }
    }
    status.textContent=`Selecione até ${PROPOSAL_MAX_IMAGES} imagens. ${proposalSelectedPictures.size} selecionada(s).`;
  };
}
function addLocalProposalPictures(fileList){
  const files=[...fileList];
  for(const file of files){
    if(proposalSelectedPictures.size>=PROPOSAL_MAX_IMAGES){toastError(`O limite é de ${PROPOSAL_MAX_IMAGES} imagens.`);break;}
    if(!/^image\/(?:png|jpeg|webp)$/i.test(file.type)){toastError(`${file.name}: formato não permitido.`);continue;}
    if(file.size>20*1024*1024){toastError(`${file.name}: a imagem excede 20 MB.`);continue;}
    const url=URL.createObjectURL(file);
    proposalSelectedPictures.set(url,{url,label:String(file.name||"Imagem local").slice(0,100),model:"IMAGENS LOCAIS",local:true});
  }
  renderProposalPictureCatalog();
}
window.addEventListener("beforeunload",()=>{
  proposalSelectedPictures.forEach(item=>{if(item.local&&String(item.url).startsWith("blob:"))URL.revokeObjectURL(item.url);});
});

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


function openPdfModal(){
  const m=state.meta||{};
  let exportMode=lastPdfExportMode;
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
        <button type="button" class="pdf-kind" id="m_pdf_technical" role="tab" aria-selected="false">
          <strong>Documento técnico</strong>
          <span>Plantas, blocos, cotas, carimbo e quantitativo opcional.</span>
        </button>
        <button type="button" class="pdf-kind" id="m_pdf_commercial" role="tab" aria-selected="false">
          <strong>Proposta comercial</strong>
          <span>Apresentacao visual, beneficios, investimento, escopo e imagens.</span>
        </button>
      </div>

      <div class="two">
        <div class="field"><label>Nome do cliente</label><input id="m_cli" value="${esc(m.cliente||"")}" placeholder="ex: Joao Silva"></div>
        <div class="field"><label>Telefone do cliente</label><input id="m_cli_tel" value="${esc(formatBrazilPhone(m.telefoneCliente||""))}" placeholder="(48) 99999-9999" inputmode="tel" maxlength="15" autocomplete="tel"></div>
      </div>
      <div class="two">
        <div class="field"><label>Local da obra</label><input id="m_loc" value="${esc(m.local||"")}" placeholder="ex: Cidade/UF"></div>
        <div class="field"><label>Modelo / Projeto</label><input id="m_mod" value="${esc(m.modelo||"")}" placeholder="${esc(state.name||"Planta sem titulo")}"></div>
      </div>
      <div class="two">
        <div class="field"><label>Projetado por</label><input id="m_proj" value="${esc(m.projetadoPor||"")}" placeholder="321 MODULAR"></div>
        <div class="field"><label>Revisao</label><input id="m_rev" value="${esc(m.revisao||"")}" placeholder="01"></div>
      </div>

      <section class="pdf-section" id="m_pdf_technical_section" role="tabpanel">
        <div class="pdf-option-card">
          <label>Cotas no PDF</label>
          <div class="pdf-inline-actions">
            <button type="button" class="tbtn" id="m_dim_auto">Automáticas</button>
            <button type="button" class="tbtn" id="m_dim_manual">Manuais</button>
          </div>
          <p class="sub">Automáticas: cota geral e mezanino. Manuais: cotas criadas com a ferramenta da planta.</p>
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
          <label class="pdf-check"><input type="checkbox" id="m_incluir_labels" checked>Incluir descrições de esquadrias e oitões</label>
        </div>
      </section>

      <section class="pdf-section" id="m_pdf_commercial_section" role="tabpanel" hidden>
        <div class="pdf-option-card">
          <label>Franquia responsavel</label>
          <strong class="pdf-franchise-name">${esc(pricingData?.franquia||"Não informada")}</strong>
        </div>
        <div class="two">
          <div class="field"><label>Nome do vendedor</label><input id="m_vendedor" value="${esc(m.vendedor||"")}" placeholder="Nome do responsavel comercial"></div>
          <div class="field"><label>Telefone do vendedor</label><input id="m_vendedor_tel" value="${esc(formatBrazilPhone(m.telefoneVendedor||""))}" placeholder="(48) 99999-9999" inputmode="tel" maxlength="15" autocomplete="tel"></div>
        </div>
        <div class="field">
          <label>Validade da proposta</label><input id="m_validade" value="${esc(m.validadeProposta||"")}" placeholder="ex: 15 dias" maxlength="80">
          <p class="sub">Informe por quanto tempo as condições comerciais permanecerão válidas.</p>
        </div>
        <div class="pdf-option-card">
          <label class="pdf-check"><input type="checkbox" id="m_com_incluir_valor" checked>Apresentar investimento estimado</label>
          <p class="sub">Exibe o valor calculado no Quantitativo, quando estiver disponivel.</p>
        </div>
        <div class="field">
          <label>Imagens da proposta</label>
          <div class="pdf-local-upload">
            <input type="file" id="m_com_local_files" accept="image/png,image/jpeg,image/webp" multiple hidden>
            <button type="button" class="tbtn" id="m_com_local_upload">Enviar imagem deste dispositivo</button>
            <small>Somente nesta sessão. Nada é enviado ao banco de dados.</small>
          </div>
          <p class="pdf-image-status" id="m_com_image_status">Abra a proposta comercial para carregar o catalogo.</p>
          <div class="pdf-image-grid" id="m_com_images"></div>
        </div>
        <div class="field">
          <label for="m_com_included">Itens que compõem o orçamento</label>
          <textarea class="pdf-proposal-textarea" id="m_com_included" placeholder="Digite um item por linha">${esc(m.propostaItens||"")}</textarea>
          <p class="sub">Use uma linha para cada item. O texto podera ser editado antes de cada proposta.</p>
        </div>
        <div class="field">
          <label for="m_com_excluded">O que não está incluso</label>
          <textarea class="pdf-proposal-textarea" id="m_com_excluded" placeholder="Digite uma exclusão ou observação por linha">${esc(m.propostaNaoIncluso||"")}</textarea>
          <p class="sub">Use uma linha para cada exclusao ou observacao comercial.</p>
        </div>
      </section>
    </div>
    <div class="pdf-modal-footer">
      <div class="modal-actions">
        <button class="tbtn" id="m_cancel">Cancelar</button>
        <button class="tbtn" id="m_preview">Pré-visualizar</button>
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
    lastPdfExportMode=mode;
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
  wireBrazilPhoneInput(document.getElementById("m_cli_tel"));
  wireBrazilPhoneInput(document.getElementById("m_vendedor_tel"));
  const localUploadInput=document.getElementById("m_com_local_files");
  document.getElementById("m_com_local_upload").onclick=()=>localUploadInput.click();
  localUploadInput.onchange=()=>{addLocalProposalPictures(localUploadInput.files);localUploadInput.value="";};

  const updateMeta=()=>{
    state.meta={
      ...state.meta,
      cliente:document.getElementById("m_cli").value.trim(),
      telefoneCliente:formatBrazilPhone(document.getElementById("m_cli_tel").value),
      local:document.getElementById("m_loc").value.trim(),
      projetadoPor:document.getElementById("m_proj").value.trim()||"321 MODULAR",
      modelo:document.getElementById("m_mod").value.trim()||state.name||"Planta sem titulo",
      revisao:document.getElementById("m_rev").value.trim()||"01",
      vendedor:document.getElementById("m_vendedor").value.trim(),
      telefoneVendedor:formatBrazilPhone(document.getElementById("m_vendedor_tel").value),
      validadeProposta:document.getElementById("m_validade").value.trim(),
      propostaItens:document.getElementById("m_com_included").value.trim(),
      propostaNaoIncluso:document.getElementById("m_com_excluded").value.trim(),
      logo:DEFAULT_LOGO
    };
    state.incluirValorNaPlanta=document.getElementById("m_incluir_valor").checked;
  };
  const runExport=action=>{
    updateMeta();
    if(hasIncompleteBrazilPhone(state.meta.telefoneCliente)||(exportMode==="commercial"&&hasIncompleteBrazilPhone(state.meta.telefoneVendedor))){
      toastError("Informe o telefone completo no formato (xx) xxxxx-xxxx.");
      return;
    }
    window.__plantaPreviewReturn=action==="preview"?()=>openPdfModal():null;
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
  setExportMode(exportMode);

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


function rasterizeProposalImageSource(source,maxDimension=1800,options={}){
  return new Promise((resolve,reject)=>{
    const image=new Image();
    let settled=false;
    const finish=(callback,value)=>{
      if(settled)return;
      settled=true;
      clearTimeout(timer);
      callback(value);
    };
    const timer=setTimeout(()=>finish(reject,new Error("Tempo esgotado ao processar uma imagem.")),options.timeoutMs||45000);
    if(options.crossOrigin)image.crossOrigin="anonymous";
    image.referrerPolicy="no-referrer";
    image.onload=()=>{
      try{
        const sourceWidth=image.naturalWidth||image.width;
        const sourceHeight=image.naturalHeight||image.height;
        let sx=0,sy=0,sourceCropWidth=sourceWidth,sourceCropHeight=sourceHeight;
        if(options.aspectRatio){
          const sourceRatio=sourceWidth/sourceHeight;
          if(sourceRatio>options.aspectRatio){
            sourceCropWidth=sourceHeight*options.aspectRatio;
            sx=(sourceWidth-sourceCropWidth)/2;
          }else{
            sourceCropHeight=sourceWidth/options.aspectRatio;
            sy=(sourceHeight-sourceCropHeight)/2;
          }
        }
        const scale=Math.min(1,maxDimension/Math.max(sourceCropWidth,sourceCropHeight));
        const canvas=document.createElement("canvas");
        canvas.width=Math.max(1,Math.round(sourceCropWidth*scale));
        canvas.height=Math.max(1,Math.round(sourceCropHeight*scale));
        const context=canvas.getContext("2d",{alpha:false});
        context.fillStyle="#ffffff";
        context.fillRect(0,0,canvas.width,canvas.height);
        context.drawImage(image,sx,sy,sourceCropWidth,sourceCropHeight,0,0,canvas.width,canvas.height);
        finish(resolve,{dataUrl:canvas.toDataURL("image/jpeg",0.88),width:canvas.width,height:canvas.height});
      }catch(error){finish(reject,error);}
    };
    image.onerror=()=>finish(reject,new Error("Não foi possível processar uma das imagens."));
    image.src=source;
  });
}

async function loadProposalPictureForPdf(item){
  if(item?.local){
    const label=String(item.label||"Imagem local").slice(0,100);
    const raster=await rasterizeProposalImageSource(item.url,1800,{timeoutMs:45000,aspectRatio:16/9});
    return {...raster,label,url:item.url};
  }
  const url=normalizeProposalPictureUrl(item.url);
  const label=String(item.label||proposalPictureLabel(url)).slice(0,100);
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),45000);
  try{
    try{
      const response=await fetch(url,{
        method:"GET",mode:"cors",credentials:"omit",cache:"no-store",
        referrerPolicy:"no-referrer",signal:controller.signal
      });
      if(!response.ok)throw new Error(`Falha ao carregar ${label}: HTTP ${response.status}.`);
      const declaredSize=Number(response.headers.get("content-length")||0);
      if(declaredSize>20*1024*1024)throw new Error(`A imagem ${label} excede 20 MB.`);
      const blob=await response.blob();
      if(blob.size>20*1024*1024)throw new Error(`A imagem ${label} excede 20 MB.`);
      if(!/^image\/(?:png|jpeg|webp)$/i.test(blob.type))throw new Error(`Formato inválido em ${label}.`);
      const objectUrl=URL.createObjectURL(blob);
      try{
        const raster=await rasterizeProposalImageSource(objectUrl,1800,{timeoutMs:45000,aspectRatio:16/9});
        return {...raster,label,url};
      }finally{
        URL.revokeObjectURL(objectUrl);
      }
    }catch(error){
      if(/excede 20 MB|Formato inválido|HTTP 4\d\d/.test(String(error.message||"")))throw error;
      console.warn("Fetch da imagem falhou; tentando carregamento CORS direto.",error);
      try{
        const raster=await rasterizeProposalImageSource(url,1800,{crossOrigin:true,timeoutMs:45000,aspectRatio:16/9});
        return {...raster,label,url};
      }catch(directError){
        console.warn("Carregamento direto da imagem falhou.",directError);
        throw new Error(`Não foi possível carregar ${label}. Tente novamente ou escolha outra imagem.`);
      }
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

function addProposalImage16x9(doc,image,x,y,width){
  const height=width*9/16;
  addContainedProposalImage(doc,image,x,y,width,height);
  return height;
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
  doc.text("321 Modular | Seu chalé montado em horas",14,287);
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
  applyPdfDocumentName(doc,fileName);
  if(action==="preview"){
    const frame=document.getElementById("previewFrame");
    const saveButton=document.getElementById("previewSaveBtn");
    frame.title=fileName;
    frame.src=doc.output("bloburl");
    document.getElementById("previewScrim").classList.add("show");
    saveButton.title=`Salvar ${fileName}`;
    saveButton.onclick=()=>doc.save(fileName);
  }else{
    doc.save(fileName);
    toast(successMessage);
  }
}

function showPdfLoading(message="Preparando proposta...",title="Gerando PDF"){
  let overlay=document.getElementById("pdfGenerationLoading");
  if(!overlay){
    overlay=document.createElement("div");
    overlay.id="pdfGenerationLoading";
    overlay.className="pdf-generation-loading";
    overlay.setAttribute("role","status");
    overlay.setAttribute("aria-live","polite");
    overlay.innerHTML=`<div class="pdf-generation-loading-card"><span class="pdf-generation-spinner" aria-hidden="true"></span><strong class="pdf-generation-loading-title"></strong><span class="pdf-generation-loading-message"></span><small class="pdf-generation-loading-detail"></small></div>`;
    document.body.appendChild(overlay);
  }
  overlay.querySelector(".pdf-generation-loading-title").textContent=title;
  overlay.querySelector(".pdf-generation-loading-message").textContent=message;
  overlay.querySelector(".pdf-generation-loading-detail").textContent=title==="Carregando 3D"?"Aguarde enquanto modelos e texturas são preparados.":"Aguarde. Imagens maiores podem levar alguns segundos.";
  overlay.classList.add("show");
  document.body.setAttribute("aria-busy","true");
}
function updatePdfLoading(message){
  const target=document.querySelector("#pdfGenerationLoading .pdf-generation-loading-message");
  if(target)target.textContent=message;
}
function hidePdfLoading(){
  document.getElementById("pdfGenerationLoading")?.classList.remove("show");
  document.body.removeAttribute("aria-busy");
}
function waitForPdfLoadingPaint(){
  return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
}

function normalizeProposalLines(value,fallback){
  return String(value||fallback||"")
    .split(/\r?\n/)
    .map(line=>line.replace(/^[\s\-•]+/,"").trim())
    .filter(Boolean)
    .slice(0,80)
    .map(line=>line.slice(0,300));
}

function addCommercialDetailsPage(doc,fontFamily,includedItems,excludedItems,images){
  const sections=[
    {title:"ITENS QUE COMPÕEM O ORÇAMENTO",items:includedItems,color:[31,51,27]},
    {title:"O QUE NÃO ESTÁ INCLUSO",items:excludedItems,color:[180,58,45]}
  ].filter(section=>section.items.length);
  if(!sections.length&&!images.length)return;
  doc.addPage();
  doc.setFont(fontFamily,"bold");
  doc.setFontSize(15);
  doc.setTextColor(31,51,27);
  doc.text(sections.length?"ESCOPO E REFERÊNCIAS":"REFERÊNCIAS DO PROJETO",14,43);
  let galleryTop=55;
  if(sections.length){
    const columnWidth=87,scopeTop=53,scopeBottom=133;
    sections.forEach((section,index)=>{
      const x=index===0?14:109;
      let y=scopeTop;
      doc.setFillColor(...section.color);
      doc.roundedRect(x,y,columnWidth,10,2,2,"F");
      doc.setFont(fontFamily,"bold");
      doc.setFontSize(7.4);
      doc.setTextColor(255,255,255);
      doc.text(section.title,x+4,y+6.5);
      y+=15;
      let omitted=0;
      section.items.forEach(item=>{
        const wrapped=doc.splitTextToSize(item,columnWidth-13);
        const needed=Math.max(6,wrapped.length*3.25+1.5);
        if(y+needed>scopeBottom){omitted++;return;}
        doc.setFillColor(...section.color);
        doc.circle(x+3.7,y+1.8,0.9,"F");
        doc.setFont(fontFamily,"normal");
        doc.setFontSize(6.6);
        doc.setTextColor(58,65,56);
        doc.text(wrapped,x+7,y+3);
        y+=needed;
      });
      if(omitted){
        doc.setFont(fontFamily,"bold");
        doc.setFontSize(6.2);
        doc.setTextColor(...section.color);
        doc.text(`+ ${omitted} item(ns) adicional(is)`,x+7,scopeBottom);
      }
    });
    galleryTop=145;
  }
  if(images.length){
    doc.setFont(fontFamily,"bold");
    doc.setFontSize(8.5);
    doc.setTextColor(31,51,27);
    doc.text("IMAGENS SELECIONADAS",14,galleryTop);
    const gridTop=galleryTop+6,columns=3,gap=4;
    const cellWidth=(182-gap*(columns-1))/columns;
    const cellHeight=cellWidth*9/16;
    images.forEach((image,index)=>{
      const column=index%columns,row=Math.floor(index/columns);
      const x=14+column*(cellWidth+gap),y=gridTop+row*(cellHeight+gap);
      addProposalImage16x9(doc,image,x,y,cellWidth);
    });
  }
}

async function generateCommercialProposal(action="save",options={}){
  const js=window.jspdf&&window.jspdf.jsPDF;
  if(!js){toastError("Gerador de PDF indisponivel.");return;}
  showPdfLoading("Preparando a proposta comercial...");
  try{
    await waitForPdfLoadingPaint();
    const requested=(options.images||[]).slice(0,PROPOSAL_MAX_IMAGES);
    const loaded=[];
    for(let index=0;index<requested.length;index++){
      const item=requested[index];
      updatePdfLoading(`Carregando imagem ${index+1} de ${requested.length}...`);
      try{loaded.push(await loadProposalPictureForPdf(item));}
      catch(error){console.warn(error);toastError(error.message);}
    }
    updatePdfLoading("Montando as páginas do PDF...");
    const logo=await proposalLogoForPdf();
    const doc=new js({orientation:"portrait",unit:"mm",format:"a4"});
    let fontFamily="helvetica";
    try{await loadMontserratIntoDoc(doc);fontFamily="Montserrat";}
    catch(error){console.warn("Montserrat indisponivel na proposta.",error);}

    const meta=state.meta||{};
    const model=meta.modelo||state.name||"Projeto modular";
    const client=meta.cliente||"Cliente";
    const clientPhone=formatBrazilPhone(meta.telefoneCliente)||"Não informado";
    const location=meta.local||"Local a definir";
    const seller=meta.vendedor||"Não informado";
    const sellerPhone=formatBrazilPhone(meta.telefoneVendedor)||"Não informado";
    const validity=meta.validadeProposta||"Não informada";
    const franchise=pricingData?.franquia||"Não informada";
    const area=occupiedArea();
    const investment=proposalInvestmentValue();
    const includedItems=normalizeProposalLines(meta.propostaItens,"");
    const excludedItems=normalizeProposalLines(meta.propostaNaoIncluso,"");

    doc.setFont(fontFamily,"bold");
    doc.setTextColor(31,51,27);
    doc.setFontSize(22);
    doc.text("SEU PROJETO",14,43);
    doc.setTextColor(244,111,24);
    doc.text("321 MODULAR",14,52);
    doc.setFont(fontFamily,"normal");
    doc.setTextColor(89,97,87);
    doc.setFontSize(9);
    doc.text(doc.splitTextToSize("Uma proposta pensada para transformar seu projeto em uma construção ágil, previsivel e de alta qualidade.",118),14,59);
    doc.setFont(fontFamily,"bold");
    doc.setFontSize(8);
    doc.setTextColor(31,51,27);
    doc.text(`${model} | ${location} | ${area.toLocaleString("pt-BR",{maximumFractionDigits:2})} m2`,14,68);


    drawCommercialBenefit(doc,fontFamily,14,"AGILIDADE","Processo industrializado e montagem planejada.");
    drawCommercialBenefit(doc,fontFamily,77,"PREVISIBILIDADE","Escopo claro para decisoes mais seguras.");
    drawCommercialBenefit(doc,fontFamily,140,"QUALIDADE","Padrão construtivo e controle de execucao.");

    doc.setFont(fontFamily,"bold");
    doc.setFontSize(9);
    doc.setTextColor(31,51,27);
    doc.text("DADOS DA PROPOSTA",14,80);

    const drawContact=(x,y,label,value,width)=>{
      doc.setFont(fontFamily,"bold");
      doc.setFontSize(6.8);
      doc.setTextColor(105,113,103);
      doc.text(label,x,y);
      doc.setFont(fontFamily,"bold");
      doc.setFontSize(8.4);
      doc.setTextColor(31,51,27);
      doc.text(doc.splitTextToSize(String(value||"-"),width),x,y+5);
    };
    drawContact(14,89,"CLIENTE",client,80);
    drawContact(14,102,"TELEFONE DO CLIENTE",clientPhone,80);
    drawContact(14,115,"VALIDADE",validity,80);
    drawContact(105,89,"FRANQUIA",franchise,88);
    drawContact(105,102,"VENDEDOR",seller,88);
    drawContact(105,115,"TELEFONE DO VENDEDOR",sellerPhone,88);

    if(options.includeInvestment&&investment>0){
      doc.setFillColor(31,51,27);
      doc.roundedRect(14,246,182,25,3,3,"F");
      doc.setFont(fontFamily,"bold");
      doc.setTextColor(210,226,202);
      doc.setFontSize(7.5);
      doc.text("INVESTIMENTO ESTIMADO",21,255);
      doc.setTextColor(255,255,255);
      doc.setFontSize(15);
      doc.text(investment.toLocaleString("pt-BR",{style:"currency",currency:"BRL"}),21,265);
    }else{
      doc.setFont(fontFamily,"bold");
      doc.setFontSize(8);
      doc.setTextColor(105,113,103);
      doc.text("Valores e condicoes comerciais sujeitos a validacao do escopo final.",14,260);
    }

    addCommercialDetailsPage(doc,fontFamily,includedItems,excludedItems,loaded);

    const totalPages=doc.getNumberOfPages();
    for(let page=1;page<=totalPages;page++){
      doc.setPage(page);
      drawCommercialPdfChrome(doc,logo,page,totalPages,fontFamily);
    }
    const fileBase=buildPdfFileBase(meta,model);
    showGeneratedPdf(doc,action,`${fileBase}.pdf`,"Proposta comercial gerada.");
  }catch(error){
    console.error("Falha ao gerar proposta comercial.",error);
    toastError(error?.message||"Não foi possível gerar a proposta comercial.");
  }finally{
    hidePdfLoading();
  }
}
document.getElementById("btnPdf").onclick=openPdfModal;
