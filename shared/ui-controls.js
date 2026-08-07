"use strict";
(()=>{
  const isObras=/(^|\/)obras\//i.test(location.pathname);
  const isFinanceiro=/(^|\/)financeiro\//i.test(location.pathname);
  const isGestao=/(^|\/)gestao\//i.test(location.pathname);
  const appOwnsSelects=isObras||isFinanceiro;
  const appOwnsDates=isObras||isFinanceiro;

  let active=null;
  const enhancedSelects=new Set();
  const enhancedDates=new Set();
  const enhancedNumbers=new Set();
  const numberSelector='input[type="number"],input[data-money-masked]';
  const monthNames=["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const weekNames=["dom","seg","ter","qua","qui","sex","sáb"];

  function closeActive(){
    if(!active)return;
    const current=active;
    active=null;
    current.trigger?.setAttribute("aria-expanded","false");
    current.popover?.classList.remove("is-open");
    setTimeout(()=>{if(!current.popover?.classList.contains("is-open"))current.popover?.setAttribute("hidden","");},170);
  }
  function positionPopover(trigger,popover){
    if(!trigger||!popover)return;
    popover.removeAttribute("hidden");
    const shell=popover.closest(".ui-control-shell");
    if(!shell)return;
    shell.classList.remove("ui-align-right","ui-drop-up");
    const triggerRect=trigger.getBoundingClientRect();
    const popoverRect=popover.getBoundingClientRect();
    const expectedWidth=Math.max(triggerRect.width,popoverRect.width);
    if(triggerRect.left+expectedWidth>innerWidth-10)shell.classList.add("ui-align-right");
    const below=innerHeight-triggerRect.bottom;
    const above=triggerRect.top;
    if(below<Math.min(popoverRect.height,340)+10&&above>below)shell.classList.add("ui-drop-up");
  }
  function announceControlOpen(trigger){
    document.dispatchEvent(new CustomEvent("superapp:control-open",{detail:{trigger}}));
  }
  function openPopover(trigger,popover,afterOpen){
    if(active?.trigger===trigger){closeActive();return false;}
    announceControlOpen(trigger);
    closeActive();
    popover.removeAttribute("hidden");
    positionPopover(trigger,popover);
    requestAnimationFrame(()=>{
      popover.classList.add("is-open");
      trigger.setAttribute("aria-expanded","true");
      afterOpen?.();
    });
    active={trigger,popover};
    return true;
  }

  function selectText(select){
    return select.selectedOptions?.[0]?.textContent?.trim()||select.getAttribute("placeholder")||"Selecione";
  }
  function buildSelectOptions(select,popover,button){
    popover.replaceChildren();
    [...select.options].forEach((option,index)=>{
      const item=document.createElement("button");
      item.type="button";
      item.className="ui-select-option";
      item.textContent=option.textContent||"";
      item.disabled=option.disabled;
      item.setAttribute("role","option");
      item.setAttribute("aria-selected",String(index===select.selectedIndex));
      item.addEventListener("click",event=>{
        event.stopPropagation();
        if(option.disabled)return;
        const changed=select.selectedIndex!==index;
        select.selectedIndex=index;
        if(changed){
          select.dispatchEvent(new Event("input",{bubbles:true}));
          select.dispatchEvent(new Event("change",{bubbles:true}));
        }
        refreshSelect(select);
        closeActive();
        button.focus();
      });
      popover.append(item);
    });
  }
  function refreshSelect(select){
    const data=select.__uiControl;
    if(!data)return;
    data.label.textContent=selectText(select);
    data.button.hidden=select.hidden;
    data.button.disabled=select.disabled;
    data.button.setAttribute("aria-disabled",String(select.disabled));
    data.button.title=selectText(select);
    if(active?.trigger===data.button)buildSelectOptions(select,data.popover,data.button);
  }
  function enhanceSelect(select){
    if(isGestao||appOwnsSelects||select.dataset.uiNative!==undefined||select.dataset.uiEnhanced||select.dataset.enhanced||select.multiple||Number(select.size)>1||select.closest(".ui-select-popover")||getComputedStyle(select).display==="none")return;
    select.dataset.uiEnhanced="true";
    const button=document.createElement("button");
    button.type="button";
    button.className="ui-select-button";
    button.setAttribute("aria-haspopup","listbox");
    button.setAttribute("aria-expanded","false");
    const label=document.createElement("span");
    label.className="ui-select-button-label";
    const chevron=document.createElement("span");
    chevron.className="ui-select-button-chevron";
    chevron.setAttribute("aria-hidden","true");
    button.append(label,chevron);
    const popover=document.createElement("div");
    popover.className="ui-select-popover";
    popover.setAttribute("role","listbox");
    popover.setAttribute("hidden","");
    const shell=document.createElement("span");
    shell.className="ui-control-shell ui-select-shell";
    select.parentNode.insertBefore(shell,select);
    shell.append(select,button,popover);
    select.classList.add("ui-native-select-hidden");
    select.__uiControl={button,label,popover};
    enhancedSelects.add(select);
    refreshSelect(select);
    button.addEventListener("click",event=>{
      event.preventDefault();event.stopPropagation();
      if(button.disabled)return;
      refreshSelect(select);
      buildSelectOptions(select,popover,button);
      openPopover(button,popover,()=>{
        popover.querySelector('[aria-selected="true"]')?.scrollIntoView({block:"nearest"});
        popover.querySelector('[aria-selected="true"]')?.focus({preventScroll:true});
      });
    });
    button.addEventListener("keydown",event=>{
      if(["ArrowDown","ArrowUp","Enter"," "].includes(event.key)){event.preventDefault();button.click();}
      if(event.key==="Escape")closeActive();
    });
    select.addEventListener("change",()=>refreshSelect(select));
  }

  function parseIso(value){
    const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value||""));
    if(!match)return null;
    const date=new Date(Number(match[1]),Number(match[2])-1,Number(match[3]));
    return Number.isNaN(date.getTime())?null:date;
  }
  function toIso(date){
    return [date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
  }
  function dateLabel(value){
    const date=parseIso(value);
    return date?new Intl.DateTimeFormat("pt-BR").format(date):"Selecionar data";
  }
  function dateAllowed(input,iso){
    return(!input.min||iso>=input.min)&&(!input.max||iso<=input.max);
  }
  function setDateValue(input,value){
    input.value=value;
    input.dispatchEvent(new Event("input",{bubbles:true}));
    input.dispatchEvent(new Event("change",{bubbles:true}));
    refreshDate(input);
  }
  function buildCalendar(input,popover,viewDate){
    popover.replaceChildren();
    const selected=parseIso(input.value);
    const head=document.createElement("div");
    head.className="ui-date-head";
    const previous=document.createElement("button");
    previous.type="button";previous.className="ui-date-nav";previous.setAttribute("aria-label","Mês anterior");previous.textContent="‹";
    const title=document.createElement("div");
    title.className="ui-date-title";title.textContent=monthNames[viewDate.getMonth()]+" de "+viewDate.getFullYear();
    const next=document.createElement("button");
    next.type="button";next.className="ui-date-nav";next.setAttribute("aria-label","Próximo mês");next.textContent="›";
    head.append(previous,title,next);
    const week=document.createElement("div");
    week.className="ui-date-week";
    weekNames.forEach(name=>{const span=document.createElement("span");span.textContent=name;week.append(span);});
    const grid=document.createElement("div");
    grid.className="ui-date-grid";
    const first=new Date(viewDate.getFullYear(),viewDate.getMonth(),1);
    const start=new Date(first);start.setDate(1-first.getDay());
    const todayIso=toIso(new Date());
    for(let index=0;index<42;index++){
      const day=new Date(start);day.setDate(start.getDate()+index);
      const iso=toIso(day);
      const cell=document.createElement("button");
      cell.type="button";cell.className="ui-date-day";cell.textContent=String(day.getDate());
      cell.disabled=!dateAllowed(input,iso);
      if(day.getMonth()!==viewDate.getMonth())cell.classList.add("is-outside");
      if(iso===todayIso)cell.classList.add("is-today");
      if(selected&&iso===toIso(selected))cell.classList.add("is-selected");
      cell.addEventListener("click",event=>{event.stopPropagation();setDateValue(input,iso);closeActive();input.__uiControl.button.focus();});
      grid.append(cell);
    }
    const actions=document.createElement("div");
    actions.className="ui-date-actions";
    const clear=document.createElement("button");
    clear.type="button";clear.className="ui-date-action";clear.textContent="Limpar";clear.disabled=input.required;
    clear.addEventListener("click",event=>{event.stopPropagation();setDateValue(input,"");closeActive();});
    const today=document.createElement("button");
    today.type="button";today.className="ui-date-action";today.textContent="Hoje";today.disabled=!dateAllowed(input,todayIso);
    today.addEventListener("click",event=>{event.stopPropagation();setDateValue(input,todayIso);closeActive();});
    actions.append(clear,today);
    popover.append(head,week,grid,actions);
    previous.addEventListener("click",event=>{event.stopPropagation();const nextView=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);buildCalendar(input,popover,nextView);});
    next.addEventListener("click",event=>{event.stopPropagation();const nextView=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);buildCalendar(input,popover,nextView);});
  }
  function refreshDate(input){
    const data=input.__uiControl;
    if(!data)return;
    data.label.textContent=dateLabel(input.value);
    data.button.hidden=input.hidden;
    data.button.disabled=input.disabled||input.readOnly;
    data.button.setAttribute("aria-disabled",String(data.button.disabled));
  }
  function enhanceDate(input){
    if(appOwnsDates||input.dataset.uiNative!==undefined||input.dataset.uiEnhanced||input.closest(".ui-date-popover"))return;
    input.dataset.uiEnhanced="true";
    const button=document.createElement("button");
    button.type="button";button.className="ui-date-button";button.setAttribute("aria-haspopup","dialog");button.setAttribute("aria-expanded","false");
    const label=document.createElement("span");
    label.className="ui-date-button-label";button.append(label);
    const popover=document.createElement("div");
    popover.className="ui-date-popover";popover.setAttribute("role","dialog");popover.setAttribute("aria-label","Selecionar data");popover.setAttribute("hidden","");
    const shell=document.createElement("span");
    shell.className="ui-control-shell ui-date-shell";
    input.parentNode.insertBefore(shell,input);
    shell.append(input,button,popover);
    input.classList.add("ui-native-date-hidden");
    input.__uiControl={button,label,popover};
    enhancedDates.add(input);
    refreshDate(input);
    button.addEventListener("click",event=>{
      event.preventDefault();event.stopPropagation();
      if(button.disabled)return;
      const selected=parseIso(input.value)||new Date();
      buildCalendar(input,popover,new Date(selected.getFullYear(),selected.getMonth(),1));
      openPopover(button,popover);
    });
    input.addEventListener("change",()=>refreshDate(input));
    input.addEventListener("focus",()=>button.focus());
  }
  function numberHidden(input){
    return input.hidden||getComputedStyle(input).display==="none";
  }
  function refreshNumber(input){
    const data=input.__uiNumberControl;
    if(!data)return;
    data.shell.hidden=numberHidden(input);
    const disabled=input.disabled||input.readOnly;
    data.up.disabled=disabled;
    data.down.disabled=disabled;
    data.shell.classList.toggle("is-disabled",disabled);
  }
  function numericInputValue(input){
    let raw=String(input.value||"").trim().replace(/\s/g,"").replace(/[^\d,.\-]/g,"");
    if(raw.includes(","))raw=raw.replace(/\./g,"").replace(",",".");
    return Number.parseFloat(raw);
  }
  function changeNumber(input,direction){
    const before=input.value;
    let changedByNative=false;
    if(input.type==="number"){
      try{
        if(direction>0)input.stepUp();else input.stepDown();
        changedByNative=true;
      }catch{}
    }
    if(!changedByNative){
      const current=numericInputValue(input);
      const stepAttr=input.getAttribute("step");
      const step=stepAttr&&stepAttr!=="any"&&Number.isFinite(Number(stepAttr))?Number(stepAttr):1;
      let next=(Number.isFinite(current)?current:0)+(direction*step);
      const min=Number.parseFloat(input.getAttribute("min")),max=Number.parseFloat(input.getAttribute("max"));
      if(Number.isFinite(min))next=Math.max(min,next);
      if(Number.isFinite(max))next=Math.min(max,next);
      input.value=String(Number(next.toFixed(10)));
    }
    if(input.value!==before){
      input.dispatchEvent(new Event("input",{bubbles:true}));
      input.dispatchEvent(new Event("change",{bubbles:true}));
      input.dispatchEvent(new CustomEvent("superapp:number-step",{bubbles:true,detail:{direction,value:input.value}}));
    }
  }
  function enhanceNumber(input){
    if(!input.matches(numberSelector)||input.dataset.uiNumberEnhanced||input.dataset.uiNative!==undefined||input.closest(".number-input,.timeline-year-control,[data-ui-number-native]"))return;
    input.dataset.uiNumberEnhanced="true";
    const shell=document.createElement("span");
    shell.className="ui-number-shell";
    const stepper=document.createElement("span");
    stepper.className="ui-number-stepper";
    const up=document.createElement("button");
    up.type="button";up.className="ui-number-step ui-number-up";up.setAttribute("aria-label","Aumentar valor");
    const down=document.createElement("button");
    down.type="button";down.className="ui-number-step ui-number-down";down.setAttribute("aria-label","Diminuir valor");
    input.parentNode.insertBefore(shell,input);
    shell.append(input,stepper);
    stepper.append(up,down);
    input.classList.add("ui-number-input");
    input.__uiNumberControl={shell,up,down};
    enhancedNumbers.add(input);
    up.addEventListener("pointerdown",event=>event.preventDefault());
    down.addEventListener("pointerdown",event=>event.preventDefault());
    up.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();changeNumber(input,1);});
    down.addEventListener("click",event=>{event.preventDefault();event.stopPropagation();changeNumber(input,-1);});
    refreshNumber(input);
  }
  const modalFrameSelector=[
    '[data-app-code="gestao"] .modal-backdrop > .modal',
    '[data-app-code="gestao"] #confirm-backdrop > .confirm-box',
    '[data-app-code="planta"] .scrim > .modal',
    '[data-app-code="planta"] #gestorOverlay > .modal',
    '[data-app-code="planta"] #confirmOverlay > .modal',
    '[data-app-code="financeiro"] .mb > .modal',
    '[data-app-code="financeiro"] #confirmBackdrop > .confirm-box',
    '[data-app-code="obras"] .modal-backdrop > .modal',
    '[data-app-code="simulacao"] #modal > .modalbox'
  ].join(',');

  function decorateModalFrame(frame){
    if(!frame||frame.dataset.superappModalDecorated==="true")return;
    frame.dataset.superappModalDecorated="true";
    frame.classList.add("superapp-modal-frame");
    if(document.documentElement.dataset.appCode==="obras")return;

    let head=frame.querySelector(':scope > .superapp-modal-head');
    const nativeHead=frame.querySelector(':scope > header,:scope > .modal-fixed-head,:scope > .pm-header,:scope > .pdf-modal-header');
    if(nativeHead)nativeHead.classList.add("superapp-modal-head-native");
    if(!head&&nativeHead)head=nativeHead;
    if(head){
      if(!head.classList.contains("superapp-modal-head-native"))head.classList.add("superapp-modal-head");
    }else{
      const children=[...frame.children];
      const title=children.find(node=>node.matches?.('h2,h3,.welcome-lead'));
      if(title){
        const nodes=[];
        const eyebrow=title.previousElementSibling?.matches?.('.eyebrow')?title.previousElementSibling:null;
        const close=children.find(node=>node.matches?.('.modal-close-top,.mc'));
        const subtitle=title.nextElementSibling?.matches?.('.sub,.msub')?title.nextElementSibling:null;
        [eyebrow,close,title,subtitle].forEach(node=>{if(node&&!nodes.includes(node))nodes.push(node);});
        nodes.sort((a,b)=>(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING)?-1:1);
        head=document.createElement("header");
        head.className="superapp-modal-head";
        frame.insertBefore(head,nodes[0]||frame.firstChild);
        nodes.forEach(node=>head.append(node));
      }
    }

    const footers=[...frame.querySelectorAll(':scope > .modal-actions,:scope > .btns,:scope > .actions:last-child,:scope > footer,:scope > form > .modal-actions:last-child,:scope > form > .btns:last-child')];
    footers.forEach(footer=>footer.classList.add("superapp-modal-foot"));
  }

  function decorateModals(root=document){
    root.querySelectorAll?.(modalFrameSelector).forEach(decorateModalFrame);
    if(root.matches?.(modalFrameSelector))decorateModalFrame(root);
    const owner=root.closest?.(modalFrameSelector);
    if(owner){
      owner.dataset.superappModalDecorated="false";
      decorateModalFrame(owner);
    }
  }

  function closeTopFloating(){
    const code=document.documentElement.dataset.appCode||"";
    if(code==="gestao"){
      const lightbox=document.querySelector('#lightbox-backdrop.active');
      if(lightbox){lightbox.click();return true;}
      const confirmation=document.querySelector('#confirm-backdrop.active');
      if(confirmation){
        confirmation.querySelector('#confirm-cancelar')?.click();
        return true;
      }
      if(document.querySelector('.modal-backdrop.active')){
        window.closeModal?.();
        return true;
      }
    }
    if(code==="planta"){
      const preview=document.querySelector('#previewScrim.show');
      if(preview){preview.querySelector('[data-planta-close-preview]')?.click();return true;}
      const confirm=document.querySelector('#confirmOverlay.show');
      if(confirm){
        const cancel=confirm.querySelector('#cf_cancelar,#mq_cancelar,[data-planta-close-confirm]');
        if(cancel)cancel.click();else confirm.classList.remove("show");
        return true;
      }
      const manager=document.querySelector('#gestorOverlay.show');
      if(manager){
        const cancel=manager.querySelector('#gci_nao,#gc_nao,[data-planta-action="close-gestor"]');
        if(cancel)cancel.click();else manager.classList.remove("show");
        return true;
      }
      if(document.querySelector('#scrim.show')){window.closeModal?.();return true;}
    }
    if(code==="financeiro"){
      const confirmation=document.querySelector('#confirmBackdrop.open');
      if(confirmation){
        confirmation.querySelector('#confirmCancelBtn')?.click();
        return true;
      }
      const modals=[...document.querySelectorAll('.mb.open')];
      const top=modals.at(-1);
      if(top){top.querySelector('.mc,[data-fin-close-modal]')?.click();if(top.classList.contains("open"))window.closeModal?.(top.id);return true;}
    }
    if(code==="obras"){
      const modals=[...document.querySelectorAll('.modal-backdrop.open')];
      const top=modals.at(-1);
      if(top){top.querySelector('[aria-label="Fechar"],#modal-close,#cancel-btn')?.click();return true;}
    }
    if(code==="simulacao"){
      const modal=document.getElementById("modal");
      if(modal?.classList.contains("open")){modal.classList.remove("open");return true;}
    }
    return false;
  }
  function scan(root=document){
    decorateModals(root);
    if(!isGestao&&!appOwnsSelects)root.querySelectorAll?.("select").forEach(enhanceSelect);
    if(!appOwnsDates)root.querySelectorAll?.('input[type="date"]').forEach(enhanceDate);
    root.querySelectorAll?.(numberSelector).forEach(enhanceNumber);
    if(!isGestao&&!appOwnsSelects&&root.matches?.("select"))enhanceSelect(root);
    if(!appOwnsDates&&root.matches?.('input[type="date"]'))enhanceDate(root);
    if(root.matches?.(numberSelector))enhanceNumber(root);
  }
  document.addEventListener("superapp:control-open",event=>{
    if(active&&active.trigger!==event.detail?.trigger)closeActive();
  });
  document.addEventListener("click",event=>{
    if(active&&!active.popover.contains(event.target)&&!active.trigger.contains(event.target))closeActive();
  });
  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape")return;
    if(active){
      event.preventDefault();
      closeActive();
      return;
    }
    if(closeTopFloating())event.preventDefault();

  });
  const observer=new MutationObserver(records=>{
    records.forEach(record=>{
      record.addedNodes.forEach(node=>{if(node.nodeType===1)scan(node);});
      if(record.type==="attributes"){
        if(record.target.matches?.("select"))refreshSelect(record.target);
        if(record.target.matches?.('input[type="date"]'))refreshDate(record.target);
        if(record.target.matches?.(numberSelector)){enhanceNumber(record.target);refreshNumber(record.target);}
      }
      if(record.target.closest?.("select"))refreshSelect(record.target.closest("select"));
    });
    enhancedSelects.forEach(select=>{if(!select.isConnected){select.__uiControl?.popover.remove();enhancedSelects.delete(select);}});
    enhancedDates.forEach(input=>{if(!input.isConnected){input.__uiControl?.popover.remove();enhancedDates.delete(input);}});
    enhancedNumbers.forEach(input=>{if(!input.isConnected)enhancedNumbers.delete(input);});
  });
  function start(){
    scan();
    observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:["disabled","readonly","hidden","style","value","min","max","type","inputmode","data-money-masked"]});
    document.addEventListener("reset",()=>setTimeout(()=>{enhancedSelects.forEach(refreshSelect);enhancedDates.forEach(refreshDate);enhancedNumbers.forEach(refreshNumber);}));
    window.SuperAppUIControls={refresh(){enhancedSelects.forEach(refreshSelect);enhancedDates.forEach(refreshDate);enhancedNumbers.forEach(refreshNumber);},scan,close:closeActive};
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();