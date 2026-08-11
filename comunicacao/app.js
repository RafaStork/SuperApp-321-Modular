(function bootCommunicationApp(){
  'use strict';
  const $=id=>document.getElementById(id);
  const state={client:null,profile:null,capabilities:{view:false,create:false,update:false,delete:false},roles:[],items:[],filter:'todos',calendar:new Date(),loading:true,modalOpen:false,previousFocus:null};
  const typeMeta={aviso:{label:'Aviso',icon:'!',color:'#ed6b1d'},reuniao:{label:'Reunião',icon:'◷',color:'#2d5da9'},treinamento:{label:'Treinamento',icon:'◆',color:'#ed6b1d'}};

  function node(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=String(text);return el}
  function rows(value){if(Array.isArray(value))return value;if(Array.isArray(value?.items))return value.items;return value?[value]:[]}
  function safeMessage(error,fallback){console.error('[comunicacao]',error);return window.SuperAppAuth?.getSafeAuthMessage?.(error,fallback)||fallback}
  async function rpc(name,params){const {data,error}=await state.client.rpc(name,params||{});if(error)throw error;return data}
  function toast(message,type){const el=$('toast');el.textContent=message;el.className='toast show'+(type?' '+type:'');clearTimeout(toast.timer);toast.timer=setTimeout(()=>{el.className='toast'},3400)}
  function dateValue(value){const date=value?new Date(value):null;return date&&!Number.isNaN(date.getTime())?date:null}
  function formatDate(value,withTime=true){const date=dateValue(value);if(!date)return 'Data não informada';return new Intl.DateTimeFormat('pt-BR',withTime?{dateStyle:'medium',timeStyle:'short'}:{dateStyle:'medium'}).format(date)}
  function formatCreated(value){const date=dateValue(value);if(!date)return '';return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(date)}
  function safeHttpUrl(value){if(!value)return null;try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)?url.href:null}catch(_){return null}}
  function roleScope(profile){if(profile?.franchise_name)return 'Franquia · '+profile.franchise_name;if(profile?.unit_name)return 'Matriz · '+profile.unit_name;return 'Matriz · acesso global'}
  function audienceLabel(item){const codes=Array.isArray(item.audience_roles)?item.audience_roles:[];if(!codes.length)return 'Todos';return codes.map(code=>state.roles.find(role=>role.code===code)?.display_name||code).join(', ')}

  function applyTheme(theme,persist=true){const normalized=theme==='dark'?'dark':'light';document.documentElement.dataset.theme=normalized;const toggle=$('themeBtn'),knob=toggle?.querySelector('.knob');if(knob)knob.textContent=normalized==='dark'?'🌙':'☀️';if(toggle){toggle.setAttribute('aria-pressed',String(normalized==='dark'));toggle.setAttribute('aria-label',normalized==='dark'?'Ativar modo claro':'Ativar modo escuro')}if(persist){try{localStorage.setItem('321modular_theme',normalized)}catch(_){}}}
  function closeMenu(){const side=$('side');side?.classList.remove('open');$('asideBackdrop')?.classList.remove('active');$('menuBtn')?.setAttribute('aria-expanded','false')}
  function setupShell(){
    $('menuBtn').addEventListener('click',()=>{const open=$('side').classList.toggle('open');$('asideBackdrop').classList.toggle('active',open);$('menuBtn').setAttribute('aria-expanded',String(open))});
    $('asideBackdrop').addEventListener('click',closeMenu);
    $('themeBtn').addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
    $('logoutBtn').addEventListener('click',()=>{location.href=window.SuperAppAuth.getPortalUrl()});
    $('refreshBtn').addEventListener('click',loadItems);
    $('newBtn').addEventListener('click',()=>openEditor());
    $('prevMonthBtn').addEventListener('click',()=>{state.calendar=new Date(state.calendar.getFullYear(),state.calendar.getMonth()-1,1);renderCalendar()});
    $('nextMonthBtn').addEventListener('click',()=>{state.calendar=new Date(state.calendar.getFullYear(),state.calendar.getMonth()+1,1);renderCalendar()});
    document.querySelectorAll('.filter-chip').forEach(button=>button.addEventListener('click',()=>setFilter(button.dataset.filter)));
    window.addEventListener('resize',()=>{if(window.innerWidth>880)closeMenu()});
    window.addEventListener('storage',event=>{if(event.key==='321modular_theme')applyTheme(event.newValue||'light',false)});
    applyTheme(document.documentElement.dataset.theme||'light',false);
  }

  function setupEditor(){
    $('modalCloseBtn').addEventListener('click',closeEditor);$('cancelBtn').addEventListener('click',closeEditor);
    $('editorModal').addEventListener('mousedown',event=>{if(event.target===$('editorModal'))closeEditor()});
    $('typeInput').addEventListener('change',syncDateField);
    $('contentInput').addEventListener('input',()=>{$('contentCount').textContent=String($('contentInput').value.length)});
    $('editorForm').addEventListener('submit',saveRecord);
    document.addEventListener('keydown',event=>{
      if(!state.modalOpen)return;
      if(event.key==='Escape'){event.preventDefault();closeEditor();return}
      if(event.key!=='Tab')return;
      const focusable=[...$('editorModal').querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(item=>!item.hidden&&item.offsetParent!==null);
      if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    },true);
  }
  function syncDateField(){const isEvent=$('typeInput').value!=='aviso';$('dateField').hidden=!isEvent;$('dateInput').required=isEvent;if(!isEvent)$('dateInput').value=''}
  function fillAudience(selected){const selectedSet=new Set(selected||[]);const wrap=$('audienceGrid');wrap.replaceChildren();state.roles.forEach(role=>{const label=node('label','audience-option');const input=document.createElement('input');input.type='checkbox';input.value=role.code;input.checked=selectedSet.has(role.code);const text=node('span','',role.display_name+' · '+role.code);label.append(input,text);wrap.append(label)})}
  function localDateTime(value){const date=dateValue(value);if(!date)return '';const shifted=new Date(date.getTime()-date.getTimezoneOffset()*60000);return shifted.toISOString().slice(0,16)}
  function openEditor(item){
    if(item&&!state.capabilities.update)return;
    if(!item&&!state.capabilities.create)return;
    state.previousFocus=document.activeElement;state.modalOpen=true;$('editorForm').reset();$('formError').hidden=true;
    $('recordId').value=item?.id||'';$('recordVersion').value=item?.version||'';$('modalTitle').textContent=item?'Editar comunicado':'Novo comunicado';$('saveBtn').textContent=item?'Salvar alterações':'Salvar comunicado';
    $('titleInput').value=item?.title||'';$('typeInput').value=item?.type||'aviso';$('dateInput').value=localDateTime(item?.event_date);$('contentInput').value=item?.content||'';$('contentCount').textContent=String($('contentInput').value.length);$('linkInput').value=item?.link||'';fillAudience(item?.audience_roles||[]);syncDateField();
    $('editorModal').classList.add('open');$('editorModal').setAttribute('aria-hidden','false');document.body.classList.add('modal-open');requestAnimationFrame(()=>$('titleInput').focus())
  }
  function closeEditor(){if(!state.modalOpen)return;state.modalOpen=false;$('editorModal').classList.remove('open');$('editorModal').setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');setTimeout(()=>state.previousFocus?.focus?.(),10)}
  function formRecord(){const type=$('typeInput').value;const rawLink=$('linkInput').value.trim();const eventDate=type==='aviso'?null:$('dateInput').value;return{title:$('titleInput').value.trim(),type,content:$('contentInput').value.trim(),event_date:eventDate?new Date(eventDate).toISOString():null,link:rawLink||null,audience_roles:[...$('audienceGrid').querySelectorAll('input:checked')].map(input=>input.value)}}
  function validateRecord(record){if(!record.title)return 'Informe o título.';if(!['aviso','reuniao','treinamento'].includes(record.type))return 'Selecione um tipo válido.';if(!record.content)return 'Informe o conteúdo.';if(record.type!=='aviso'&&!record.event_date)return 'Informe a data e a hora do evento.';if(record.link&&!safeHttpUrl(record.link))return 'Informe um link HTTP ou HTTPS válido.';return ''}
  async function saveRecord(event){
    event.preventDefault();const record=formRecord();const validation=validateRecord(record);if(validation){$('formError').textContent=validation;$('formError').hidden=false;return}
    const button=$('saveBtn');button.disabled=true;button.textContent='Salvando…';$('formError').hidden=true;
    try{const id=$('recordId').value;if(id)await rpc('comunicacao_update',{p_id:id,p_version:Number($('recordVersion').value),p_record:record});else await rpc('comunicacao_create',{p_record:record});closeEditor();toast(id?'Comunicado atualizado.':'Comunicado publicado.');await loadItems()}
    catch(error){$('formError').textContent=safeMessage(error,'Não foi possível salvar o comunicado.');$('formError').hidden=false}
    finally{button.disabled=false;button.textContent=$('recordId').value?'Salvar alterações':'Salvar comunicado'}
  }
  async function deleteRecord(item){
    if(!state.capabilities.delete)return;const confirmed=await window.SuperAppConfirm.delete('O comunicado “'+item.title+'” será removido permanentemente.',{title:'Excluir comunicado?',confirmLabel:'Excluir'});if(!confirmed)return;
    try{await rpc('comunicacao_delete',{p_id:item.id,p_version:Number(item.version)});toast('Comunicado excluído.');await loadItems()}catch(error){toast(safeMessage(error,'Não foi possível excluir o comunicado.'),'error')}
  }

  function setFilter(filter){state.filter=filter;document.querySelectorAll('.filter-chip').forEach(button=>{const active=button.dataset.filter===filter;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});renderFeed()}
  function updateCounts(){const counts={todos:state.items.length,aviso:0,reuniao:0,treinamento:0};state.items.forEach(item=>{if(counts[item.type]!==undefined)counts[item.type]++});$('countTodos').textContent=counts.todos;$('countAviso').textContent=counts.aviso;$('countReuniao').textContent=counts.reuniao;$('countTreinamento').textContent=counts.treinamento}
  function emptyState(title,message,compact=false){const wrap=node('div','empty-state'+(compact?' compact':''));const content=node('div');content.append(node('div','empty-icon','◇'),node('h3','',title),node('p','',message));wrap.append(content);return wrap}
  function cardFor(item,index){
    const meta=typeMeta[item.type]||typeMeta.aviso;const card=node('article','communication-card type-'+(typeMeta[item.type]?item.type:'aviso'));card.id='communication-'+item.id;
    const icon=node('div','type-icon',meta.icon);icon.setAttribute('aria-hidden','true');const main=node('div','card-main');const topline=node('div','card-topline');topline.append(node('span','type-badge',meta.label),node('span','audience-badge',audienceLabel(item)));main.append(topline,node('h3','',item.title),node('p','card-content',item.content));
    const details=node('div','card-meta');details.append(node('span','',item.event_date?'◷ '+formatDate(item.event_date):'Publicado em '+formatCreated(item.created_at)),node('span','',item.created_by_name?'Por '+item.created_by_name:'Comunicação 321 Modular'));
    const url=safeHttpUrl(item.link);if(url){const link=node('a','', 'Abrir link ↗');link.href=url;link.target='_blank';link.rel='noopener noreferrer';details.append(link)}else details.append(node('span','','Sem link associado'));main.append(details);
    const actions=node('div','card-actions');if(state.capabilities.update){const edit=node('button','icon-btn','✎');edit.type='button';edit.title='Editar comunicado';edit.setAttribute('aria-label','Editar '+item.title);edit.addEventListener('click',()=>openEditor(item));actions.append(edit)}if(state.capabilities.delete){const remove=node('button','icon-btn delete','×');remove.type='button';remove.title='Excluir comunicado';remove.setAttribute('aria-label','Excluir '+item.title);remove.addEventListener('click',()=>deleteRecord(item));actions.append(remove)}
    card.append(icon,main,actions);return card
  }
  function renderSkeleton(){const feed=$('feed');feed.replaceChildren();for(let i=0;i<4;i++)feed.append(node('div','skeleton'))}
  function renderFeed(){const feed=$('feed');feed.replaceChildren();if(state.loading){renderSkeleton();return}const visible=state.filter==='todos'?state.items:state.items.filter(item=>item.type===state.filter);$('resultCount').textContent=visible.length+' '+(visible.length===1?'registro':'registros');if(!visible.length){feed.append(emptyState('Nenhuma publicação encontrada',state.items.length?'Não há publicações para este filtro.':'Os novos comunicados aparecerão aqui.'));return}visible.forEach((item,index)=>feed.append(cardFor(item,index)))}

  function eventItems(){return state.items.filter(item=>item.type!=='aviso'&&dateValue(item.event_date))}
  function renderCalendar(){
    const base=new Date(state.calendar.getFullYear(),state.calendar.getMonth(),1);$('calendarTitle').textContent=new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(base).replace(/^./,char=>char.toUpperCase());const grid=$('calendarGrid');grid.replaceChildren();
    const first=new Date(base);first.setDate(1-base.getDay());const today=new Date();const events=eventItems();
    for(let index=0;index<42;index++){const day=new Date(first);day.setDate(first.getDate()+index);const button=node('div','calendar-day',day.getDate());const outside=day.getMonth()!==base.getMonth();if(outside)button.classList.add('outside');if(day.toDateString()===today.toDateString())button.classList.add('today');const dayEvents=events.filter(item=>dateValue(item.event_date)?.toDateString()===day.toDateString());if(dayEvents.length){button.classList.add('has-events');button.title=dayEvents.map(item=>item.title).join('\n');const dots=node('span','day-dots');[...new Set(dayEvents.map(item=>item.type))].forEach(type=>dots.append(node('i','dot '+type)));button.append(dots)}grid.append(button)}
  }
  function renderUpcoming(){const wrap=$('upcomingList');wrap.replaceChildren();const now=Date.now();const upcoming=eventItems().filter(item=>dateValue(item.event_date).getTime()>=now).sort((a,b)=>dateValue(a.event_date)-dateValue(b.event_date)).slice(0,5);if(!upcoming.length){wrap.append(emptyState('Agenda livre','Nenhum evento futuro agendado.',true));return}upcoming.forEach(item=>{const date=dateValue(item.event_date);const button=node('button','upcoming-item');button.type='button';const dateBox=node('span','event-date');dateBox.append(node('strong','',String(date.getDate()).padStart(2,'0')),node('small','',new Intl.DateTimeFormat('pt-BR',{month:'short'}).format(date).replace('.','')));const copy=node('span','upcoming-copy');copy.append(node('strong','',item.title),node('small','',new Intl.DateTimeFormat('pt-BR',{weekday:'short',hour:'2-digit',minute:'2-digit'}).format(date)));button.append(dateBox,copy);button.addEventListener('click',()=>{setFilter('todos');requestAnimationFrame(()=>document.getElementById('communication-'+item.id)?.scrollIntoView({behavior:'smooth',block:'center'}))});wrap.append(button)})}
  function renderAll(){updateCounts();renderFeed();renderCalendar();renderUpcoming()}
  async function loadItems(){state.loading=true;renderFeed();$('refreshBtn').disabled=true;try{state.items=rows(await rpc('comunicacao_list'));state.items.sort((a,b)=>dateValue(b.created_at)-dateValue(a.created_at));state.loading=false;renderAll()}catch(error){state.loading=false;state.items=[];renderAll();$('feed').replaceChildren(emptyState('Não foi possível carregar',safeMessage(error,'Atualize a página e tente novamente.')));toast(safeMessage(error,'Não foi possível carregar os comunicados.'),'error')}finally{$('refreshBtn').disabled=false}}

  async function boot(event){
    try{
      state.client=window.SuperAppAuth.getScopedClient('core');state.profile=await window.SuperAppAuth.getProfile();
      const [capabilities,rolesList]=await Promise.all([rpc('comunicacao_capabilities'),rpc('comunicacao_roles')]);state.capabilities={...state.capabilities,...(capabilities||{})};state.roles=rows(rolesList);
      $('sideUserName').textContent=state.profile?.display_name||event?.detail?.session?.user?.email||'Usuário';$('sideUserRole').textContent=(state.profile?.role_name||state.profile?.role_code||'Acesso operacional')+' · '+roleScope(state.profile);$('newBtn').hidden=!state.capabilities.create;
      setupShell();setupEditor();state.calendar=new Date(new Date().getFullYear(),new Date().getMonth(),1);await loadItems();$('appShell').setAttribute('aria-busy','false')
    }catch(error){toast(safeMessage(error,'Não foi possível iniciar o Painel de Comunicação.'),'error')}finally{window.SuperAppAuth?.releaseAppGuard?.()}
  }
  window.addEventListener('superapp:authorized',boot,{once:true});
})();
