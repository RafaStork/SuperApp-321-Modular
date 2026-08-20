
const DEFAULT_LOGO="../shared/Logo321Modular.svg";
const sb=window.SuperAppAuth?.getScopedClient?.('legacy_gestao');
let currentUser = null;      // { id, nome, usuario, role }
let currentProfile = null;   // igual a currentUser (mantido por compatibilidade com o resto do código)
let currentView = null;
let profilesCache = [];
let menuOpcoes = {};
let reclamacoesIndustriaTipos = [];
let reclamacoesIndustriaTiposPorId = new Map();
let notificacoesFallbackTimer = null;
let gestaoRealtimeStop = null;
let gestaoRefreshInFlight = false;
let gestaoRealtimePending = false;
let gestaoSafeRenderTimer = null;
let gestaoAutomaticRetryTimer = null;

function markGestaoLocalChange(){
  gestaoRealtimeStop?.markLocalChange?.(8000);
}
function gestaoInteractionActive(){
  const active = document.activeElement;
  const root = document.getElementById('view-root');
  const editingField = !!(active && root?.contains(active) && active.matches?.('input, textarea, select, [contenteditable="true"]'));
  const floatingControl = !!document.querySelector('.dd-panel-float, .msel-panel-float, .cal-dd-float, .color-picker-float');
  const modalOpen = document.getElementById('modal-backdrop')?.classList.contains('active') || document.getElementById('lightbox-backdrop')?.classList.contains('active');
  return editingField || floatingControl || modalOpen;
}
function renderGestaoWhenSafe(renderFn){
  const target = typeof renderFn === 'function' ? renderFn : aplicarFiltrosAtual;
  if (typeof target !== 'function') return;
  const requestedView = currentView;
  clearTimeout(gestaoSafeRenderTimer);
  const attempt = ()=>{
    if (requestedView !== currentView) return;
    if (gestaoInteractionActive()){
      gestaoSafeRenderTimer = setTimeout(attempt, 140);
      return;
    }
    gestaoSafeRenderTimer = null;
    target();
  };
  attempt();
}
// O cliente envia e renova o JWT do Supabase Auth automaticamente.
// Nenhum papel ou ID de usuário é aceito por cabeçalho customizado.

function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  document.querySelector('#theme-toggle .knob').textContent = t==='dark' ? '🌙' : '☀️';
  localStorage.setItem('321modular_theme', t);
}
document.getElementById('theme-toggle').addEventListener('click', ()=>{
  const atual = document.documentElement.getAttribute('data-theme');
  applyTheme(atual==='dark' ? 'light' : 'dark');
  // As cores das opções (menu_opcoes) dependem do tema no momento em que são
  // desenhadas — recarrega a aba atual pra recalcular certinho.
  if (currentView) navigateTo(currentView);
});
applyTheme(localStorage.getItem('321modular_theme') || localStorage.getItem('tema-tarefas-app') || 'light');
document.getElementById('login-logo').src = DEFAULT_LOGO;
document.getElementById('side-logo').src = DEFAULT_LOGO;

function toast(msg, isErr=false){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show' + (isErr ? ' err' : '');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=> t.className='', 3000);
}
function flashSaved(el){ el.classList.add('cell-saved'); setTimeout(()=>el.classList.remove('cell-saved'), 900); }
// Usa essa em vez de flashSaved() pra botões que já têm uma cor própria com
// significado (status, prioridade, etc.) — flashSaved() anima o "background"
// até ficar transparente, o que fazia a cor real sumir e voltar (bug).
function flashSavedCor(el){ el.classList.add('cell-saved-cor'); setTimeout(()=>el.classList.remove('cell-saved-cor'), 700); }

// Redimensionamento das colunas das tabelas principais. Salva somente larguras
// em pixels no navegador, separadas por usuário e por aba; nenhum dado da tabela
// ou permissão é persistido aqui.
function ativarRedimensionamentoColunas(table, scope){
  if (!table || table.dataset.columnsResizable==='true' || !currentUser?.id) return;
  const headers = Array.from(table.querySelectorAll('thead tr:first-child > th'));
  if (headers.length < 2) return;
  const storageKey = `gestao_colunas_v1_${currentUser.id}_${scope}`;
  const clamp = (value, min, max)=>Math.min(max, Math.max(min, Math.round(Number(value)||min)));
  // Preserva a largura original, mas amplia o mínimo quando a célula contém
  // controles que não podem ser cortados (datas, seletores, chips e ações).
  const baselineMinimums = headers.map(th=>Math.max(1, Math.ceil(th.getBoundingClientRect().width)));
  const criticalSelector = '.cell-date,.cell-number,.cell-input,.cell-select,.sel-dd-btn,.sel-simple-btn,.msel-btn,.chip,.fill,.icon-btn,.row-actions button';
  function measureContentMinimum(th,index){
    const headerInner = th.querySelector('.th-inner');
    const thStyle = getComputedStyle(th);
    const horizontalPadding = (parseFloat(thStyle.paddingLeft)||0) + (parseFloat(thStyle.paddingRight)||0);
    let required = headerInner ? headerInner.scrollWidth + horizontalPadding : 1;
    Array.from(table.tBodies).forEach(tbody=>{
      Array.from(tbody.rows).forEach(row=>{
        const cell = row.cells[index];
        if (!cell || cell.colSpan>1) return;
        const cellStyle = getComputedStyle(cell);
        const cellPadding = (parseFloat(cellStyle.paddingLeft)||0) + (parseFloat(cellStyle.paddingRight)||0);
        cell.querySelectorAll(criticalSelector).forEach(element=>{
          const rectWidth = element.getBoundingClientRect().width;
          required = Math.max(required, rectWidth, element.scrollWidth + cellPadding);
        });
        if (/\b\d{2}\/\d{2}\/\d{4}\b/.test(cell.textContent||'')){
          required = Math.max(required, cell.scrollWidth);
        }
      });
    });
    return Math.ceil(Math.min(640, required));
  }
  const minimums = headers.map((th,index)=>Math.max(baselineMinimums[index], measureContentMinimum(th,index)));
  const maximums = minimums.map(minimum=>Math.max(640, minimum));
  let widths = minimums.slice();

  try{
    const saved = JSON.parse(localStorage.getItem(storageKey)||'null');
    if (Array.isArray(saved) && saved.length===headers.length){
      widths = saved.map((value,index)=>clamp(value, minimums[index], maximums[index]));
    }
  }catch(_){ /* preferência local inválida: usa a largura atual */ }

  function applyWidths(){
    let total = 0;
    headers.forEach((th,index)=>{
      const width = clamp(widths[index], minimums[index], maximums[index]);
      widths[index] = width;
      th.style.width = `${width}px`;
      th.style.minWidth = `${width}px`;
      th.style.maxWidth = `${width}px`;
      total += width;
    });
    table.style.width = `${Math.max(total, table.parentElement?.clientWidth||0)}px`;
  }
  function saveWidths(){
    try{ localStorage.setItem(storageKey, JSON.stringify(widths)); }catch(_){ /* armazenamento indisponível */ }
  }
  function resizeColumn(index, delta){
    widths[index] = clamp(widths[index] + delta, minimums[index], maximums[index]);
    applyWidths();
  }

  table.dataset.columnsResizable = 'true';
  table.classList.add('resizable-table');
  applyWidths();

  headers.forEach((th,index)=>{
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.className = 'column-resize-handle';
    if (index===headers.length-1) handle.classList.add('is-last');
    handle.setAttribute('aria-label', `Redimensionar coluna ${index+1}`);
    handle.title = 'Arraste para ajustar a largura da coluna';
    th.appendChild(handle);

    handle.addEventListener('pointerdown', event=>{
      if (event.button!==0) return;
      event.preventDefault();
      event.stopPropagation();
      minimums[index] = Math.max(baselineMinimums[index], measureContentMinimum(th,index));
      maximums[index] = Math.max(640, minimums[index]);
      widths[index] = Math.max(widths[index], minimums[index]);
      applyWidths();
      const startX = event.clientX;
      const startWidth = widths[index];
      handle.setPointerCapture?.(event.pointerId);
      document.body.classList.add('column-resizing');

      const onMove = moveEvent=>{
        widths[index] = clamp(startWidth + moveEvent.clientX - startX, minimums[index], maximums[index]);
        applyWidths();
      };
      const onEnd = ()=>{
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onEnd);
        handle.removeEventListener('pointercancel', onEnd);
        document.body.classList.remove('column-resizing');
        saveWidths();
      };
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onEnd);
      handle.addEventListener('pointercancel', onEnd);
    });

    handle.addEventListener('keydown', event=>{
      if (event.key!=='ArrowLeft' && event.key!=='ArrowRight') return;
      event.preventDefault();
      resizeColumn(index, (event.key==='ArrowRight'?1:-1) * (event.shiftKey?20:10));
      saveWidths();
    });
  });

  const tbody = table.tBodies[0];
  if (tbody && window.MutationObserver){
    const observer = new MutationObserver(()=>{
      let changed = false;
      headers.forEach((th,index)=>{
        const nextMinimum = Math.max(baselineMinimums[index], measureContentMinimum(th,index));
        minimums[index] = nextMinimum;
        maximums[index] = Math.max(640, nextMinimum);
        if (widths[index] < nextMinimum){ widths[index] = nextMinimum; changed = true; }
      });
      if (changed){ applyWidths(); saveWidths(); }
    });
    observer.observe(tbody,{childList:true,subtree:true,characterData:true});
  }
}
// Confirmação dentro do app (substitui o confirm() nativo do navegador).
// Uso: if (!(await confirmarAcao('Excluir este item?'))) return;
function confirmarAcao(mensagem, textoBotao='Excluir'){
  return window.SuperAppConfirm.delete(mensagem, { title:'Excluir este item?', confirmLabel:textoBotao });
}

function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function fmtDate(v){ if (!v) return ''; const d = new Date(v + 'T00:00:00'); if (isNaN(d)) return v; return d.toLocaleDateString('pt-BR'); }

// ── Arrastar pra reordenar (checklist real e modelos) ──────────────────────
// ligarArrasteItem: chame pra CADA item, uma vez só (novo ou existente) —
// nunca religue um item já ligado. ligarArrasteContainer: chame uma vez por
// lista, cuida do "soltar" e chama aoReordenar(idsNaOrdemNova).
let __itemArrastando = null;
function ligarArrasteItem(item){
  item.setAttribute('draggable', 'true');
  item.classList.add('arrastavel');
  item.addEventListener('dragstart', ()=>{ __itemArrastando = item; item.classList.add('arrastando'); });
  item.addEventListener('dragend', ()=>{ item.classList.remove('arrastando'); __itemArrastando = null; });
  item.addEventListener('dragover', (e)=>{
    e.preventDefault();
    if (!__itemArrastando || __itemArrastando===item || __itemArrastando.parentElement!==item.parentElement) return;
    const rect = item.getBoundingClientRect();
    const depois = (e.clientY - rect.top) > rect.height/2;
    item.parentElement.insertBefore(__itemArrastando, depois ? item.nextSibling : item);
  });
}
function ligarArrasteContainer(containerEl, seletorItem, aoReordenar){
  containerEl.addEventListener('dragover', (e)=>e.preventDefault());
  containerEl.addEventListener('drop', (e)=>{
    e.preventDefault();
    const ids = Array.from(containerEl.querySelectorAll(seletorItem)).map(el=>el.dataset.id);
    aoReordenar(ids);
  });
}
async function persistirOrdem(tabela, ids){
  const resultados = await Promise.all(ids.map((id, idx) =>
    sb.from(tabela).update({ ordem: idx }).eq('id', id).select('id,ordem').maybeSingle()
  ));
  const falha = resultados.find(r => r.error || !r.data);
  if (falha) {
    toast('Erro ao salvar a ordem: ' + (falha?.error?.message || 'gravação não confirmada'), true);
    return false;
  }
  return true;
}

function monthLabel(iso){ if (!iso) return 'Sem mês'; const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('pt-BR', { month:'short', year:'numeric' }); }
function monthLabelCurto(iso){ if (!iso) return ''; const d = new Date(iso + 'T00:00:00'); return d.toLocaleDateString('pt-BR', { month:'short' }).replace('.',''); }
function monthKey(iso){
  if (iso === null || iso === undefined || iso === '') return null;
  const text = String(iso).trim();
  const direto = text.match(/^(\d{4})-(\d{1,2})(?:-|T|$)/);
  if (direto) return direto[1]+'-'+String(Number(direto[2])).padStart(2,'0');
  const d = new Date(text);
  if (Number.isNaN(d.getTime())) return null;
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
}
function dashboardMonthKey(row, kind){
  if (!row) return null;
  const fields = kind === 'projetos'
    ? ['mes_ref','data_inicio','data_conclusao_real','created_at']
    : kind === 'vendas_expansao'
      ? ['mes_ref','data_venda','created_at']
      : kind === 'chamados_sac'
        ? ['mes_ref','data_abertura','created_at']
        : ['mes_ref','created_at'];
  const value = fields.map(field => row[field]).find(v => v !== null && v !== undefined && String(v).trim() !== '');
  return monthKey(value);
}
function dashboardCompletionMonthKey(row){
  if (!row) return null;
  const value = ['data_conclusao_real','mes_ref','data_inicio','created_at']
    .map(field => row[field])
    .find(v => v !== null && v !== undefined && String(v).trim() !== '');
  return monthKey(value);
}
function dashboardMonthKeyForField(row, field){
  if (!row) return null;
  return monthKey(row.mes_ref ?? row[field] ?? row.created_at);
}

document.getElementById('login-form').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = document.getElementById('login-usuario').value.trim();
  const password = document.getElementById('login-token').value;
  const btn = document.getElementById('login-btn');
  const errBox = document.getElementById('login-error');
  errBox.textContent = '';
  btn.disabled = true; btn.textContent = 'Entrando...';

  try {
    await window.SuperAppAuth.signIn(email, password);
  } catch (error) {
    btn.disabled = false; btn.textContent = 'Entrar';
    errBox.textContent = 'Falha no login: e-mail ou senha inválidos.';
    return;
  }

  let iniciou = false;
  try {
    iniciou = await bootAfterLogin();
    if (iniciou){
      document.getElementById('login-screen')?.classList.add('login-screen-hidden');
      window.SuperAppAuth.releaseAppGuard?.();
    } else {
      await window.SuperAppAuth.signOut();
    }
  } catch (error) {
    console.error('Falha ao inicializar o app Gestão:', error);
    errBox.textContent = 'Falha ao abrir o app. Retorne ao SuperApp e tente novamente.';
    try { await window.SuperAppAuth.signOut(); } catch (_) {}
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
});
document.getElementById('login-token-toggle').addEventListener('click', ()=>{
  const input = document.getElementById('login-token');
  const button = document.getElementById('login-token-toggle');
  const mostrar = input.type === 'password';
  input.type = mostrar ? 'text' : 'password';
  button.textContent = mostrar ? 'Ocultar' : 'Mostrar';
  button.setAttribute('aria-pressed', String(mostrar));
});

document.getElementById('logout-btn').addEventListener('click', () => {
  location.href = window.SuperAppAuth.getPortalUrl();
});
document.getElementById('btn-atualizar').addEventListener('click', atualizarManualmente);

// Menu sanduíche (celular): abre/fecha o menu lateral como uma gaveta.
function fecharMenuLateral(){
  document.getElementById('aside').classList.remove('aside-open');
  document.getElementById('aside-backdrop').classList.remove('active');
}
function abrirMenuLateral(){
  document.getElementById('aside').classList.add('aside-open');
  document.getElementById('aside-backdrop').classList.add('active');
}
document.getElementById('hamburger-btn').addEventListener('click', ()=>{
  const aberto = document.getElementById('aside').classList.contains('aside-open');
  aberto ? fecharMenuLateral() : abrirMenuLateral();
});
document.getElementById('aside-backdrop').addEventListener('click', fecharMenuLateral);
document.getElementById('nav-tabs').addEventListener('click', (e)=>{
  if (e.target.closest('.tab-btn')) fecharMenuLateral();
});

async function bootAfterLogin(){
  const session = await window.SuperAppAuth.getSession();
  if (!session) return false;

  const entitlements = await window.SuperAppAuth.getEntitlements();
  if (!entitlements.some(item => item.app_code === 'gestao')){
    document.getElementById('login-error').textContent = 'Esta conta não possui permissão para usar o app Gestão.';
    return false;
  }

  const centralProfile = await window.SuperAppAuth.getProfile();

  const perfil = centralProfile && {
    id: centralProfile.user_id,
    nome: centralProfile.display_name,
    usuario: centralProfile.login_identifier,
    role: centralProfile.role_code || ''
  };
  if (!perfil || !perfil.id){
    document.getElementById('login-error').textContent = 'Conta autenticada sem perfil ativo no SuperApp.';
    return false;
  }
  if (!PAPEIS.includes(perfil.role)){
    document.getElementById('login-error').textContent = 'A role ativa não é válida para o app Gestão.';
    return false;
  }

  currentUser = { id: perfil.id, nome: perfil.nome, usuario: perfil.usuario, role: perfil.role };
  currentProfile = currentUser;

  document.getElementById('app-shell').classList.add('active');
  document.getElementById('side-user-name').textContent = currentProfile.nome;
  const roleLabel = centralProfile?.role_name || centralProfile?.role_code || ROTULO_PAPEL[currentProfile.role] || currentProfile.role;
  const scopeLabel = centralProfile?.franchise_name ? `Franquia · ${centralProfile.franchise_name}` : centralProfile?.unit_name ? `Matriz · ${centralProfile.unit_name}` : 'Matriz · acesso global';
  document.getElementById('side-user-role').textContent = `${roleLabel} · ${scopeLabel}`;

  await loadMenuOpcoes();
  await loadReclamacoesIndustriaTipos();
  await loadConfigVisual();
  await loadPermissoesAbas();
  buildNav();
  atualizarBolinhaNotificacoes();
  if (notificacoesFallbackTimer) clearInterval(notificacoesFallbackTimer);
  // Contingência; o fluxo principal passa a ser acionado pelo Realtime.
  notificacoesFallbackTimer = setInterval(()=>{ if (!document.hidden) atualizarBolinhaNotificacoes(); }, 300000);
  const abasPermitidas = abasPermitidasPara(currentProfile.role).map(([key])=>key);
  const preferida = ['UEng','UInd'].includes(currentProfile.role) ? 'minhas-tarefas' : 'dashboard';
  const firstView = abasPermitidas.includes(preferida) ? preferida : (abasPermitidas[0] || 'minhas-tarefas');
  await navigateTo(firstView);
  setupGestaoRealtime();
  return true;
}

// Atualização manual preserva a aba e a posição de rolagem. A sessão JWT é
// renovada automaticamente pelo cliente do Supabase Auth.
async function atualizarManualmente(options){
  const automatico = options?.automatico === true;
  if (automatico && gestaoInteractionActive()){
    gestaoRealtimePending = true;
    clearTimeout(gestaoAutomaticRetryTimer);
    gestaoAutomaticRetryTimer = setTimeout(()=>atualizarManualmente({ automatico: true }), 180);
    return;
  }
  if (gestaoRefreshInFlight){ if (automatico) gestaoRealtimePending = true; return; }
  if (automatico){ gestaoRealtimePending = false; clearTimeout(gestaoAutomaticRetryTimer); gestaoAutomaticRetryTimer = null; }
  gestaoRefreshInFlight = true;
  const btn = document.getElementById('btn-atualizar');
  if (!automatico && btn){ btn.disabled = true; btn.textContent = 'Atualizando…'; }
  try{
    const viewRoot = document.getElementById('view-root');
    const tableWrap = viewRoot.querySelector('.table-wrap');
    const scrollTop = tableWrap ? tableWrap.scrollTop : 0;
    await navigateTo(currentView, { silencioso: true });
    const novoWrap = document.getElementById('view-root').querySelector('.table-wrap');
    if (novoWrap) novoWrap.scrollTop = scrollTop;
    await atualizarBolinhaNotificacoes();
    if (!automatico) toast('Dados atualizados.');
  } finally {
    gestaoRefreshInFlight = false;
    if (!automatico && btn){ btn.disabled = false; btn.textContent = '⟳ Atualizar'; }
    if (gestaoRealtimePending){ gestaoRealtimePending = false; setTimeout(()=>atualizarManualmente({ automatico: true }), 0); }
  }
}

function setupGestaoRealtime(){
  gestaoRealtimeStop?.();
  gestaoRealtimeStop = window.SuperAppRealtimeSync?.subscribe({
    client: sb,
    userId: currentUser?.id,
    appCode: 'gestao',
    debounceMs: 250,
    shouldDefer: gestaoInteractionActive,
    onChange: ()=>atualizarManualmente({ automatico: true })
  }) || null;
}


async function loadMenuOpcoes(){
  const { data, error } = await sb.from('menu_opcoes').select('*').eq('ativo', true).order('ordem');
  if (error){ console.error(error); return; }
  menuOpcoes = {};
  (data||[]).forEach(o=>{ (menuOpcoes[o.grupo] = menuOpcoes[o.grupo] || []).push(o); });
}
async function loadReclamacoesIndustriaTipos(){
  const { data, error } = await sb.from('reclamacoes_industria_tipos').select('*').eq('ativo', true)
    .order('ordem_classe').order('ordem_subclasse').order('classe').order('subclasse');
  if (error){ console.error(error); return; }
  reclamacoesIndustriaTipos = data || [];
  reclamacoesIndustriaTiposPorId = new Map(reclamacoesIndustriaTipos.map(t=>[t.id,t]));
}
function tipoProblemaPorId(id){ return id ? reclamacoesIndustriaTiposPorId.get(id) || null : null; }
function rotuloTipoProblema(id){
  const t = tipoProblemaPorId(id);
  return t ? `${t.classe} — ${t.subclasse}` : '';
}
function corTipoProblema(id){ const t=tipoProblemaPorId(id); return t ? corDaClasseProblema(t.classe) : 'var(--text-faint)'; }
function opcoesTipoProblemaUnificadas(classeSemSubclasse=''){
  const opcoes = [{value:'', label:classeSemSubclasse ? `${classeSemSubclasse} · Sem definir` : 'Sem definir', dot:'var(--text-faint)'}];
  let ultimaClasse = null;
  reclamacoesIndustriaTipos.forEach(t=>{
    if (t.classe !== ultimaClasse){
      opcoes.push({header:true, label:t.classe, dot:corMenuParaTema(corDaClasseProblema(t.classe))});
      ultimaClasse = t.classe;
    }
    opcoes.push({value:t.id, label:`${t.classe} · ${t.subclasse}`, menuLabel:t.subclasse, dot:corMenuParaTema(corDaClasseProblema(t.classe))});
  });
  return opcoes;
}
function opcoesDe(grupo){
  // "Sem definir" e um sentinela visual para NULL, nao uma opcao de negocio.
  // O banco permanece como fonte unica das opcoes reais dos menus.
  return (menuOpcoes[grupo] || []).filter(o=>!ehSemDefinir(o.valor));
}
const SEM_DEFINIR = 'Sem definir';
function ehSemDefinir(valor){
  return valor === null || valor === undefined || String(valor).trim().toLocaleLowerCase('pt-BR') === 'sem definir';
}
function opcoesComSemDefinir(opcoes){
  return [{ value:'', label:SEM_DEFINIR, dot:'var(--text-faint)' }, ...(opcoes||[]).filter(o=>!ehSemDefinir(o.value))];
}
function corDaClasseProblema(classe){ const t=reclamacoesIndustriaTipos.find(x=>x.classe===classe); return t ? t.cor : '#628852'; }
function corDaOpcao(grupo, valor){ const o = opcoesDe(grupo).find(x=>x.valor===valor); return o ? o.cor : '#7f9a72'; }

// ── Cor definida no admin ("Opções dos Menus") vale pro modo claro. No modo
// escuro o app escurece o mesmo tom automaticamente (sem precisar cadastrar
// uma segunda cor) e dá um pouco mais de saturação (senão fica esmaecida
// contra o fundo escuro), e o texto vira escuro no modo claro / branco no escuro.
function temaEscuro(){ return document.documentElement.getAttribute('data-theme') === 'dark'; }
function hexParaHsl(hex){
  const n = parseInt(hex.slice(1), 16);
  let r = ((n>>16)&255)/255, g = ((n>>8)&255)/255, b = (n&255)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if (max===min){ h = s = 0; }
  else {
    const d = max-min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    if (max===r) h = (g-b)/d + (g<b?6:0);
    else if (max===g) h = (b-r)/d + 2;
    else h = (r-g)/d + 4;
    h /= 6;
  }
  return [h*360, s*100, l*100];
}
function hslParaHex(h, s, l){
  h/=360; s/=100; l/=100;
  let r,g,b;
  if (s===0){ r=g=b=l; }
  else {
    const hue2rgb = (p,q,t)=>{ if (t<0) t+=1; if (t>1) t-=1; if (t<1/6) return p+(q-p)*6*t; if (t<1/2) return q; if (t<2/3) return p+(q-p)*(2/3-t)*6; return p; };
    const q = l < 0.5 ? l*(1+s) : l+s-l*s;
    const p = 2*l-q;
    r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
  }
  const toHex = v => Math.round(Math.max(0,Math.min(1,v))*255).toString(16).padStart(2,'0');
  return '#'+toHex(r)+toHex(g)+toHex(b);
}
function escurecerHex(hex, fatorLuz, fatorSaturacao){
  const m = /^#[0-9a-f]{6}$/i.exec(hex);
  if (!m) return hex;
  let [h,s,l] = hexParaHsl(hex);
  l = Math.max(8, l * (1-fatorLuz));
  s = Math.min(100, s * (1+fatorSaturacao));
  return hslParaHex(h, s, l);
}
let configVisual = { reduzir_luminosidade_pct: 32, ajustar_saturacao_pct: 25 };
async function loadConfigVisual(){
  const { data, error } = await sb.from('config_visual').select('*').eq('id', 1).single();
  if (!error && data) configVisual = data;
}
function corMenuParaTema(hexOriginal){
  if (!/^#[0-9a-f]{6}$/i.test(hexOriginal)) return hexOriginal; // não é hex (ex: var(--text-faint)) — mantém como está
  return temaEscuro() ? escurecerHex(hexOriginal, configVisual.reduzir_luminosidade_pct/100, configVisual.ajustar_saturacao_pct/100) : hexOriginal;
}
function textoParaCorDeMenu(hexOriginal){
  if (!/^#[0-9a-f]{6}$/i.test(hexOriginal)) return 'var(--text)';
  return temaEscuro() ? '#fff' : 'var(--c-ink)';
}

// Conversões de cor usadas pelo seletor visual customizado (quadrado de
// saturação/valor + barra de matiz + campos R/G/B), pra não depender do
// seletor nativo do navegador/SO.
function hexParaRgb(hex){
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex||'').trim());
  if (!m) return { r:0, g:0, b:0 };
  const n = parseInt(m[1], 16);
  return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
}
function rgbParaHex(r,g,b){
  const c = (n)=> Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,'0');
  return ('#'+c(r)+c(g)+c(b)).toUpperCase();
}
function rgbParaHsv(r,g,b){
  r/=255; g/=255; b/=255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b), d = max-min;
  let h = 0;
  if (d !== 0){
    if (max===r) h = 60*(((g-b)/d)%6);
    else if (max===g) h = 60*((b-r)/d+2);
    else h = 60*((r-g)/d+4);
  }
  if (h<0) h += 360;
  const s = max===0 ? 0 : d/max;
  return { h, s, v:max };
}
function hsvParaRgb(h,s,v){
  const c = v*s, x = c*(1-Math.abs((h/60)%2-1)), m = v-c;
  let r=0,g=0,b=0;
  if (h<60){ r=c; g=x; } else if (h<120){ r=x; g=c; } else if (h<180){ g=c; b=x; }
  else if (h<240){ g=x; b=c; } else if (h<300){ r=x; b=c; } else { r=c; b=x; }
  return { r:(r+m)*255, g:(g+m)*255, b:(b+m)*255 };
}

async function loadProfilesCache(){
  const { data, error } = await sb.rpc('listar_usuarios');
  if (error){
    console.error('Falha ao carregar usuários aptos para responsáveis', error);
    profilesCache = [];
    toast('Não foi possível carregar os usuários responsáveis.', true);
    return false;
  }
  profilesCache = data || [];
  return true;
}

// Ordem e rótulos fixos de todas as abas que existem no sistema — quais
// papéis enxergam cada uma é configurável na tela "Usuários" e vem do banco
// (tabela permissoes_abas). Isso aqui é só a lista mestre e o "de fábrica".
const ABAS_DISPONIVEIS = [
  ['dashboard','Dashboard'],
  ['minhas-tarefas','Minhas Tarefas'],
  ['projetos','Projetos'],
  ['chamados','Chamados SAC'],
  ['sac-industria','Problemas SAC ↔ Indústria'],
  ['pedidos-agendamentos-sac-industria','Pedidos/Agendamentos SAC ↔ Indústria'],
  ['vendas','Vendas / Expansão'],
  ['programacao-carregamento','Programação Carregamento'],
  ['opcoes-menu','Opções dos Menus'],
  ['usuarios','Usuários'],
  ['pendencias-leitura','Pendências de Leitura'],
  ['auditoria','Log de Auditoria'],
];

// Agrupamento visual do menu lateral — cada sub-array vira um "bloco"
// separado por uma linha horizontal. Abas sem permissão simplesmente somem
// da lista; se isso esvaziar um bloco inteiro, nenhuma linha sobra no lugar.
const NAV_GRUPOS = [
  ['dashboard'],
  ['minhas-tarefas','projetos','chamados','sac-industria','pedidos-agendamentos-sac-industria'],
  ['vendas','programacao-carregamento'],
  ['opcoes-menu','usuarios','pendencias-leitura','auditoria'],
];

// Cargos do sistema. "engenharia" cobre o time de Engenharia (e SAC, no caso
// do usuário), "industria" cobre o time de Indústria (programação de
// carregamento e as reclamações que o SAC registra pra Indústria resolver).
const PAPEIS = ['ADM','GEng','UEng','GInd','UInd'];
const ROTULO_PAPEL = {
  ADM: 'Administrador',
  GEng: 'Gestor Engenharia',
  UEng: 'Usuário Engenharia e SAC',
  GInd: 'Gestor Indústria',
  UInd: 'Usuário Indústria',
};
const NAV_ITEMS_PADRAO = {
  ADM:                    ['dashboard','minhas-tarefas','chamados','projetos','vendas','programacao-carregamento','sac-industria','pedidos-agendamentos-sac-industria','opcoes-menu','usuarios','pendencias-leitura','auditoria'],
  GEng:      ['dashboard','minhas-tarefas','chamados','projetos','vendas','sac-industria','pedidos-agendamentos-sac-industria','auditoria'],
  UEng: ['minhas-tarefas','chamados','sac-industria','pedidos-agendamentos-sac-industria'],
  GInd:       ['dashboard','minhas-tarefas','programacao-carregamento','sac-industria','pedidos-agendamentos-sac-industria','auditoria'],
  UInd:      ['minhas-tarefas','programacao-carregamento','pedidos-agendamentos-sac-industria'],
};

// Categorias de sub-permissão configuráveis por aba. Abas "simples" (sem
// lista de registros) só têm a categoria "acesso"; abas com uma tabela de
// registros ganham 5 categorias, exibidas como checkboxes numa linha
// expansível dentro da tela de permissões (Usuários > Permissões de abas).
const SUBPERMISSOES_ABA = {
  dashboard: [
    {key:'sac',      label:'Ver sub-aba SAC'},
    {key:'vendas',   label:'Ver sub-aba Vendas'},
    {key:'projetos', label:'Ver sub-aba Projetos'},
    {key:'sacind',   label:'Ver sub-aba Problemas SAC ↔ Indústria'},
    {key:'anual',    label:'Ver sub-aba Resumo anual (tabela)'},
  ],
  'minhas-tarefas': [],
  'opcoes-menu':  [],
  'pendencias-leitura': [],
  auditoria:      [],
  chamados: [
    {key:'ver_proprio', label:'Visualizar chamados designados ao próprio usuário'},
    {key:'ver_outros',  label:'Visualizar chamados designados a outros usuários'},
    {key:'criar',       label:'Permissão para cadastrar novo chamado'},
    {key:'editar',      label:'Permissão para editar chamados'},
    {key:'excluir',     label:'Permissão para excluir chamados'},
  ],
  projetos: [
    {key:'ver_proprio', label:'Visualizar projetos designados ao próprio usuário'},
    {key:'ver_outros',  label:'Visualizar projetos designados a outros usuários'},
    {key:'criar',       label:'Permissão para cadastrar novo projeto'},
    {key:'editar',      label:'Permissão para editar projetos'},
    {key:'excluir',     label:'Permissão para excluir projetos'},
  ],
  vendas: [
    {key:'ver_proprio', label:'Visualizar vendas cadastradas pelo próprio usuário'},
    {key:'ver_outros',  label:'Visualizar vendas cadastradas por outros usuários'},
    {key:'criar',       label:'Permissão para cadastrar nova venda'},
    {key:'editar',      label:'Permissão para editar vendas'},
    {key:'excluir',     label:'Permissão para excluir vendas'},
  ],
  'programacao-carregamento': [
    {key:'ver_proprio', label:'Visualizar carregamentos agendados pelo próprio usuário'},
    {key:'ver_outros',  label:'Visualizar carregamentos agendados por outros usuários'},
    {key:'criar',       label:'Permissão para agendar novo carregamento'},
    {key:'editar',      label:'Permissão para editar ou mover carregamentos'},
    {key:'excluir',     label:'Permissão para excluir carregamentos'},
  ],
  'sac-industria': [
    {key:'ver_proprio', label:'Visualizar reclamações cadastradas pelo próprio usuário'},
    {key:'ver_outros',  label:'Visualizar reclamações cadastradas por outros usuários'},
    {key:'criar',       label:'Permissão para cadastrar nova reclamação'},
    {key:'editar',      label:'Permissão para editar reclamações'},
    {key:'excluir',     label:'Permissão para excluir reclamações'},
  ],
  'pedidos-agendamentos-sac-industria': [
    {key:'ver_proprio', label:'Visualizar pedidos/agendamentos cadastrados pelo próprio usuário'},
    {key:'ver_outros',  label:'Visualizar pedidos/agendamentos cadastrados por outros usuários'},
    {key:'criar',       label:'Permissão para cadastrar novo pedido/agendamento'},
    {key:'editar',      label:'Permissão para editar pedidos/agendamentos'},
    {key:'excluir',     label:'Permissão para excluir pedidos/agendamentos'},
  ],  usuarios: [
    {key:'ver_proprio', label:'Visualizar somente o próprio cadastro'},
    {key:'ver_outros',  label:'Visualizar o cadastro de todos os usuários'},
    {key:'editar',      label:'Permissão para editar permissões de abas'},
    {key:'excluir',     label:'Permissão para excluir usuários'},
  ],
};
// "acesso" é o interruptor mestre — SEMPRE existe pra toda aba, mesmo as que
// têm subcategorias detalhadas — e é o que decide se a aba aparece no menu
// lateral. As subcategorias específicas (ver_proprio, criar, editar...)
// controlam o que dá pra fazer *depois* de já ter acesso, e ficam dentro do
// menu que expande. Isso resolve o problema de dar acesso a uma aba sem
// precisar mexer em nenhuma subcategoria.
function subcategoriasDetalhadasDe(aba){ return SUBPERMISSOES_ABA[aba] || []; }
function chavesPermissaoDe(aba){ return ['acesso', ...subcategoriasDetalhadasDe(aba).map(s=>s.key)]; }

// Padrão de fábrica: só entra "tudo habilitado" se a aba estiver na lista
// padrão do papel (NAV_ITEMS_PADRAO) — do contrário, tudo desabilitado.
function permissoesPadraoDe(role, aba){
  const habilitado = (NAV_ITEMS_PADRAO[role]||[]).includes(aba);
  const flags = {};
  chavesPermissaoDe(aba).forEach(k=>{ flags[k] = habilitado; });
  return flags;
}

let permissoesAbas = null; // preenchido por loadPermissoesAbas(); mapa[role][aba] = { chave: true/false, ... }

async function loadPermissoesAbas(){
  const { data, error } = await sb.from('permissoes_abas').select('*');
  if (error || !data || !data.length){ permissoesAbas = null; return; }
  const mapa = {};
  PAPEIS.forEach(r=>{ mapa[r] = {}; });
  data.forEach(row=>{
    if (!mapa[row.role]) return;
    if (row.permissoes && typeof row.permissoes === 'object' && Object.keys(row.permissoes).length){
      mapa[row.role][row.aba] = row.permissoes;
      return;
    }
    // Compatibilidade com o formato antigo (colunas "nivel"/"permitido" de
    // uma versão anterior desta tela) — converte pro novo formato de flags.
    const nivel = row.nivel || (row.permitido ? 'editar_tudo' : 'nenhum');
    const cheio = nivel === 'editar_tudo' || nivel === 'ver_tudo';
    const proprioSó = nivel === 'ver_proprio';
    const flags = {};
    chavesPermissaoDe(row.aba).forEach(k=>{
      if (k==='acesso') flags[k] = nivel !== 'nenhum';
      else if (k==='ver_outros') flags[k] = cheio;
      else if (k==='ver_proprio') flags[k] = cheio || proprioSó;
      else flags[k] = nivel === 'editar_tudo' || proprioSó; // criar/editar/excluir
    });
    mapa[row.role][row.aba] = flags;
  });
  permissoesAbas = mapa;
}

// Flags de permissão do papel informado (ou do usuário logado, se omitido)
// pra uma aba específica — objeto { chave: true/false, ... }.
function permissoesPara(aba, role){
  role = role || (currentProfile && currentProfile.role);
  if (permissoesAbas && permissoesAbas[role] && permissoesAbas[role][aba]){
    return permissoesAbas[role][aba];
  }
  return permissoesPadraoDe(role, aba);
}
function permissoesAtuais(aba){ return permissoesPara(aba); }
// true pra admin e pra qualquer papel de gestor (Engenharia ou Indústria).
function ehGestorOuAdmin(role){
  role = role || (currentProfile && currentProfile.role) || '';
  return ['ADM','GEng','GInd'].includes(role);
}
function abaTemAlgumAcesso(perm){ return !!(perm && perm.acesso); }

function abasPermitidasPara(role){
  return ABAS_DISPONIVEIS.filter(([key])=> abaTemAlgumAcesso(permissoesPara(key, role)));
}

function buildNav(){
  const nav = document.getElementById('nav-tabs');
  nav.innerHTML = '';
  const items = abasPermitidasPara(currentProfile.role);
  const porChave = new Map(items);
  let algumGrupoRenderizado = false;
  NAV_GRUPOS.forEach(grupoChaves=>{
    const doGrupo = grupoChaves.filter(k=>porChave.has(k));
    if (!doGrupo.length) return;
    if (algumGrupoRenderizado){
      const divisor = document.createElement('div');
      divisor.className = 'nav-divider';
      nav.appendChild(divisor);
    }
    doGrupo.forEach(key=>{
      const b = document.createElement('button');
      b.className = 'tab-btn'; b.dataset.view = key;
      b.innerHTML = `${escapeHtml(porChave.get(key))}<span class="nav-dot nav-dot-menu" data-nav-dot="${key}"></span>`;
      b.addEventListener('click', ()=> navigateTo(key));
      nav.appendChild(b);
    });
    algumGrupoRenderizado = true;
  });
}
function setActiveTab(key){ document.querySelectorAll('.tab-btn[data-view]').forEach(b=>b.classList.toggle('active', b.dataset.view === key)); }

let currentSilentRefresh = null;
// Preenchida por viewTabela() com a função aplicarFiltrosOrdenacao() daquela
// tela — assim, qualquer edição de campo (select, data, percentual, texto...)
// consegue reordenar/refiltrar a linha na hora, sem precisar recarregar a
// tela inteira. Fica null quando a tela atual não é uma tabela editável.
let aplicarFiltrosAtual = null;
let __viewToken = 0;
async function navigateTo(key, opts){
  const silencioso = !!(opts && opts.silencioso);
  if (silencioso && key === currentView && currentSilentRefresh){
    await currentSilentRefresh();
    return;
  }
  const meuToken = ++__viewToken;
  currentSilentRefresh = null;
  aplicarFiltrosAtual = null;
  currentView = key;
  setActiveTab(key);
  const root = document.getElementById('view-root');
  root.innerHTML = '<div class="section-note">Carregando…</div>';
  try{
    if (key==='dashboard') await viewDashboard();
    else if (key==='minhas-tarefas') await viewMinhasTarefas();
    else if (key==='chamados') await viewTabela('chamados_sac');
    else if (key==='projetos') await viewTabela('projetos');
    else if (key==='vendas') await viewTabela('vendas_expansao');
    else if (key==='programacao-carregamento') await viewProgramacaoCarregamento();
    else if (key==='sac-industria') await viewTabela('reclamacoes_industria');
    else if (key==='pedidos-agendamentos-sac-industria') await viewTabela('pedidos_agendamentos_industria');
    else if (key==='opcoes-menu') await viewOpcoesMenu();
    else if (key==='usuarios') await viewUsuarios();
    else if (key==='pendencias-leitura') await viewPendenciasLeitura();
    else if (key==='auditoria') await viewAuditoria();
  }catch(err){
    console.error(err);
    if (meuToken === __viewToken){
      root.innerHTML = '<div class="section-note view-error csp-inline-002"></div>';
      root.querySelector('.view-error').textContent = `Erro ao carregar: ${err?.message || 'erro inesperado'}`;
    }
  }
  if (meuToken !== __viewToken) return; // uma navegação mais nova já rolou nesse meio-tempo — não mexe mais na tela
  root.classList.remove('view-anim');
  void root.offsetWidth; // força reflow pra reiniciar a animação a cada troca de aba
  root.classList.add('view-anim');
  atualizarBolinhaNotificacoes();
}

async function saveField(table, id, field, value){
  markGestaoLocalChange();
  const { data, error } = await sb.from(table)
    .update({ [field]: value })
    .eq('id', id)
    .select('id,' + field)
    .maybeSingle();
  if (error || !data) {
    toast('Erro ao salvar: ' + (error?.message || 'gravação não confirmada'), true);
    return false;
  }
  return true;
}

// Franquia é uma fonte canônica no menu_opcoes. Sempre que o rótulo muda,
// grava também o ID correspondente para não deixar label e vínculo divergentes.
async function saveFranquiaField(table, id, value){
  markGestaoLocalChange();
  const opcao = opcoesDe('chamados_franquia').find(o=>o.valor===value);
  const payload = { franquia: value || null, franquia_id: opcao?.franquia_id || null };
  const { data, error } = await sb.from(table)
    .update(payload)
    .eq('id', id)
    .select('id,franquia,franquia_id')
    .maybeSingle();
  if (error || !data){
    toast('Erro ao salvar a franquia: ' + (error?.message || 'gravação não confirmada'), true);
    return null;
  }
  return data;
}
async function saveTipoProblemaState(table, id, field, tipoId, classe){
  markGestaoLocalChange();
  // A classe pode ser gravada sem uma subclasse. O update é confirmado com
  // select() para não deixar a tela afirmar que salvou quando a API recusou
  // ou quando a coluna nova ainda não foi reconhecida pelo PostgREST.
  const idEsperado = tipoId || null;
  const classeEsperada = classe ? String(classe).trim() : null;
  const payload = { [field]: idEsperado, tipo_problema_classe: classeEsperada };
  const { data, error } = await sb.from(table)
    .update(payload)
    .eq('id', id)
    .select(`id,${field},tipo_problema_classe`)
    .maybeSingle();
  if (error){
    console.error('Falha ao salvar tipo de problema', { table, id, payload, error });
    toast('Erro ao salvar o tipo de problema: ' + error.message, true);
    return false;
  }
  if (!data){
    console.error('Nenhum registro foi atualizado para o tipo de problema', { table, id, payload });
    toast('Não foi possível confirmar a gravação do tipo de problema.', true);
    return false;
  }
  const idGravado = data[field] || null;
  const classeGravada = data.tipo_problema_classe ? String(data.tipo_problema_classe).trim() : null;
  if (String(idGravado || '') !== String(idEsperado || '') || classeGravada !== classeEsperada){
    console.error('O Supabase devolveu um tipo de problema diferente do enviado', { esperado:{id:idEsperado,classe:classeEsperada}, gravado:{id:idGravado,classe:classeGravada} });
    toast('A gravação do tipo de problema não foi confirmada. Tente novamente.', true);
    return false;
  }
  return true;
}
const TABLE_CONFIG = {
  chamados_sac: {
    title: 'Chamados SAC', sub: 'Registro e acompanhamento dos chamados de atendimento.',
    aba: 'chamados',
    respTable: 'chamados_sac_responsaveis', respFk: 'chamado_id', detalhavel: true,
    notificacoes: true, notifEventosTable:'chamados_sac_eventos', notifLidosTable:'chamados_sac_eventos_lidos', notifFk:'chamado_id',
    notifCampoAliases: { tempo_resolucao_dias:'data_resolucao' },
    fields: [
      {key:'numero_chamado', label:'Nº', edit:'text', w:70, readonly:true},
      {key:'motivo', label:'Motivo', edit:'select', group:'chamados_motivo'},
      {key:'franquia', label:'Franquia', edit:'select', group:'chamados_franquia'},
      {key:'descricao', label:'Descrição', edit:'textarea', w:220},
      {key:'data_abertura', label:'Abertura', edit:'date'},
      {key:'data_resolucao', label:'Resolução', edit:'date'},
      {key:'nota_nps', label:'NPS', edit:'number', min:0, max:10, w:64},
      {key:'reincidente', label:'Reincidente', edit:'select', group:'chamados_reincidente', boolMap:true},
      {key:'responsaveis', label:'Responsáveis', edit:'multiselect'},
      {key:'status', label:'Status', edit:'select', group:'chamados_status'},
    ],
  },
  projetos: {
    title: 'Projetos', sub: 'Projetos de engenharia em andamento e planejados.',
    aba: 'projetos',
    respTable: 'projetos_responsaveis', respFk: 'projeto_id', detalhavel: true,
    notificacoes: true, notifEventosTable:'projetos_eventos', notifLidosTable:'projetos_eventos_lidos', notifFk:'projeto_id',
    fields: [
      {key:'projeto', label:'Projeto', edit:'text', w:220},
      {key:'status', label:'Status', edit:'select', group:'projetos_status'},
      {key:'categoria', label:'Categoria', edit:'select', group:'projetos_categoria'},
      {key:'prioridade', label:'Prioridade', edit:'select', group:'projetos_prioridade'},
      {key:'nivel_esforco', label:'Esforço', edit:'select', group:'projetos_nivel_esforco'},
      {key:'responsaveis', label:'Responsáveis', edit:'multiselect'},
      {key:'data_inicio', label:'Início', edit:'date'},
      {key:'previsao_conclusao', label:'Previsão', edit:'date'},
      {key:'data_conclusao_real', label:'Concl. Real', edit:'date'},
      {key:'percentual_conclusao', label:'% Concl.', edit:'percent'},
    ],
  },
  pedidos_agendamentos_industria: {
    title: 'Pedidos/Agendamentos SAC ↔ Indústria', sub: 'Pedidos e agendamentos cadastrados pelo SAC para acompanhamento da Indústria.',
    aba: 'pedidos-agendamentos-sac-industria',
    respTable: 'pedidos_agendamentos_industria_responsaveis', respFk: 'pedido_agendamento_id', detalhavel: true,
    notificacoes: true, notifEventosTable:'pedidos_agendamentos_industria_eventos', notifLidosTable:'pedidos_agendamentos_industria_eventos_lidos', notifFk:'pedido_agendamento_id',
    fields: [
      {key:'numero_registro', label:'Nº', edit:'text', w:70, readonly:true},
      {key:'franquia', label:'Franquia', edit:'select', group:'chamados_franquia'},
      {key:'tipo', label:'Tipo', edit:'select', group:'sacind_pedidos_tipo'},
      {key:'descricao', label:'Descrição', edit:'textarea', w:220},
      {key:'data_abertura', label:'Abertura', edit:'date'},
      {key:'data_resolucao', label:'Resolução', edit:'date'},
      {key:'responsaveis', label:'Responsáveis', edit:'multiselect'},
      {key:'status', label:'Status', edit:'select', group:'sacind_status'},
    ],
  },
  reclamacoes_industria: {
    title: 'Problemas SAC ↔ Indústria', sub: 'Reclamações de franqueados registradas pelo SAC para a Indústria resolver.',
    aba: 'sac-industria',
    respTable: 'reclamacoes_industria_responsaveis', respFk: 'reclamacao_id', detalhavel: true,
    notificacoes: true, notifEventosTable:'reclamacoes_industria_eventos', notifLidosTable:'reclamacoes_industria_eventos_lidos', notifFk:'reclamacao_id',
    notifCampoAliases: { motivo:'tipo_problema_id', tipo_problema_classe:'tipo_problema_id' },
    fields: [
      {key:'numero_reclamacao', label:'Nº', edit:'text', w:70, readonly:true},
      {key:'franquia', label:'Franquia', edit:'select', group:'chamados_franquia'},
      {key:'tipo_problema_id', label:'Tipo de problema', edit:'problem-type'},
      {key:'descricao', label:'Descrição', edit:'textarea', w:220},
      {key:'data_abertura', label:'Abertura', edit:'date'},
      {key:'data_resolucao', label:'Resolução', edit:'date'},
      {key:'responsaveis', label:'Responsáveis', edit:'multiselect'},
      {key:'status', label:'Status', edit:'select', group:'sacind_status'},
    ],
  },
  vendas_expansao: {
    title: 'Vendas / Expansão', sub: 'Vendas de franquias e metragem.',
    aba: 'vendas',
    fields: [
      {key:'numero_venda', label:'Nº Venda', edit:'text', w:70, readonly:true},
      {key:'data_venda', label:'Data', edit:'date'},
      {key:'loja', label:'Loja', edit:'select', group:'vendas_loja'},
      {key:'metragem_m2', label:'Metragem (m²)', edit:'number', step:0.01},
      {key:'observacoes', label:'Observações', edit:'text', w:220},
    ],
  },
  agendamentos_carregamento: {
    title: 'Programação Carregamento', sub: 'Carregamentos agendados por franquia.',
    aba: 'programacao-carregamento',
    fields: [
      {key:'data', label:'Data', edit:'date'},
      {key:'hora', label:'Hora', edit:'text', w:70},
      {key:'franquia', label:'Franquia', edit:'select', group:'chamados_franquia'},
      {key:'observacoes', label:'Observações', edit:'textarea', w:220},
      {key:'status', label:'Status', edit:'select', group:'carregamento_status'},
    ],
  },
};

// Flags de permissão do usuário logado pra uma TABELA (usa o mapeamento
// tabela -> aba do TABLE_CONFIG). Ex.: permissoesTabela('projetos').
// Traduz cada evento para um lugar realmente visível na interface. Isso mantém
// a bolinha, os badges e a tela de pendências contando exatamente as mesmas coisas.
function classificarEventoNotificacao(cfg, evento){
  if (!cfg || !evento) return null;
  if (evento.tipo === 'novo') return { tipo:'novo' };
  if (evento.item_id || evento.campo === 'descricao_detalhada') return { tipo:'detalhes' };
  const campo = (cfg.notifCampoAliases && cfg.notifCampoAliases[evento.campo]) || evento.campo;
  if (campo && cfg.fields.some(field=>field.key === campo)) return { tipo:'campo', campo };
  return null;
}

function adicionarEventoNotificacao(mapa, cfg, evento){
  const destino = classificarEventoNotificacao(cfg, evento);
  const chave = evento && evento[cfg.notifFk];
  if (!destino || !chave) return false;
  const reg = mapa[chave] || (mapa[chave] = { novo:[], campos:{}, detalhes:[] });
  if (destino.tipo === 'novo') reg.novo.push(evento.id);
  else if (destino.tipo === 'detalhes') reg.detalhes.push(evento.id);
  else (reg.campos[destino.campo] = reg.campos[destino.campo] || []).push(evento.id);
  return true;
}

function permissoesTabela(tableName){
  const aba = (TABLE_CONFIG[tableName]||{}).aba;
  return aba ? permissoesAtuais(aba) : {};
}
// Um registro é "do próprio usuário" se ele criou (criado_por) ou está entre
// os responsáveis/atribuídos dele. Usado pela categoria "ver_proprio".
function registroEhDoProprio(row){
  if (!row) return false;
  if (row.criado_por && row.criado_por === currentUser.id) return true;
  if (Array.isArray(row.__resp_ids) && row.__resp_ids.includes(currentUser.id)) return true;
  return false;
}
// Um registro fica visível se a pessoa pode ver "outros" (todo mundo) ou se
// pode ver "só o próprio" e o registro é dela.
function registroVisivel(perm, row){
  return !!(perm && perm.ver_outros) || !!(perm && perm.ver_proprio && registroEhDoProprio(row));
}

// ── Notificações individuais (por usuário) ─────────────────────────────
let __avisoNotificacoes = false;
let __notificacoesRefreshId = 0;
function reportarFalhaNotificacoes(context, errors){
  console.error('[Notificações] '+context, errors);
  if (!__avisoNotificacoes){
    __avisoNotificacoes = true;
    toast('O sistema de notificações está indisponível. Tente atualizar a tela.', true);
  }
}

// Marca um ou vários eventos como lidos de uma vez pra QUEM ESTÁ LOGADO
// agora (não afeta outras pessoas) e some com o(s) selo(s), com uma
// pequena animação de saída. Aceita string única ou array de ids — usar
// array é o que evita a mesma célula "acumular" selos quando o campo foi
// editado mais de uma vez: todas as edições daquele campo são marcadas
// como lidas juntas, de uma vez só.
async function marcarNotifLida(tabelaLidos, eventoIds, badgeEls){
  const ids = (Array.isArray(eventoIds) ? eventoIds : [eventoIds]).filter(Boolean);
  if (!ids.length) return true;
  const linhas = ids.map(id=>({ evento_id: id, usuario_id: currentUser.id }));
  const { error } = await sb.from(tabelaLidos).upsert(linhas, { onConflict:'evento_id,usuario_id' });
  if (error){ toast('Erro: '+error.message, true); return false; }
  (badgeEls||[]).forEach(badge=>{
    badge.classList.add('notif-saindo');
    setTimeout(()=>badge.remove(), 170);
  });
  atualizarBolinhaNotificacoes();
  return true;
}

// Recalcula se sobrou alguma notificação não lida (em qualquer lugar — a
// tabela ou o modal de Detalhes) e liga/desliga a bolinha laranja do menu
// lateral. Chamada depois de qualquer "lido", ao clicar em "Atualizar", ao
// entrar no sistema, e por um intervalo leve só pra essa contagem (não
// recarrega dado nenhum da tela, é uma consulta bem pequena).
// Descobre se sobra alguma notificação não lida (pra ESTE usuário) dentro
// de um conjunto de registros já filtrado por visibilidade/responsabilidade.
async function contarNaoLidos(tableName, idsVisiveis){
  if (!idsVisiveis.size) return false;
  const cfg = TABLE_CONFIG[tableName];
  const eventosResult = await sb.from(cfg.notifEventosTable)
    .select(`id, criado_por, tipo, campo, item_id, ${cfg.notifFk}`)
    .in(cfg.notifFk, Array.from(idsVisiveis));
  if (eventosResult.error){ reportarFalhaNotificacoes(`Erro ao contar ${cfg.title}`, eventosResult.error); return false; }
  const relevantes = (eventosResult.data||[]).filter(e=>
    e.criado_por !== currentUser.id && classificarEventoNotificacao(cfg, e)
  );
  if (!relevantes.length) return false;
  const lidosResult = await sb.from(cfg.notifLidosTable).select('evento_id').eq('usuario_id', currentUser.id);
  if (lidosResult.error){ reportarFalhaNotificacoes(`Erro ao contar leituras de ${cfg.title}`, lidosResult.error); return false; }
  const lidosSet = new Set((lidosResult.data||[]).map(l=>l.evento_id));
  return relevantes.some(e=>!lidosSet.has(e.id));
}
async function atualizarBolinhaNotificacoes(){
  const refreshId = ++__notificacoesRefreshId;
  try{
    for (const tableName of Object.keys(TABLE_CONFIG)){
      if (refreshId !== __notificacoesRefreshId) return;
      const cfg = TABLE_CONFIG[tableName];
      if (!cfg.notificacoes) continue;
      const dot = document.querySelector(`.nav-dot[data-nav-dot="${cfg.aba}"]`);
      if (!dot) continue;
      const perm = permissoesTabela(tableName);
      if (!perm.ver_proprio && !perm.ver_outros){ dot.style.display = 'none'; continue; }
      // O autor fica no evento; algumas tabelas legadas não têm criado_por.
      const { data: registros, error: registrosError } = await sb.from(tableName).select('id');
      if (refreshId !== __notificacoesRefreshId) return;
      if (registrosError){
        reportarFalhaNotificacoes('Erro ao contar registros de '+cfg.title, registrosError);
        dot.style.display = 'none';
        continue;
      }
      if (cfg.respTable && (registros||[]).length){
        const ids = registros.map(r=>r.id);
        const { data: resp, error: respError } = await sb.from(cfg.respTable).select(cfg.respFk+', profile_id').in(cfg.respFk, ids);
        if (refreshId !== __notificacoesRefreshId) return;
        if (respError){
          reportarFalhaNotificacoes('Erro ao carregar responsáveis de '+cfg.title, respError);
          dot.style.display = 'none';
          continue;
        }
        (registros||[]).forEach(r=>{
          r.__resp_ids = (resp||[]).filter(item=>item[cfg.respFk]===r.id).map(item=>item.profile_id);
        });
      }
      const idsVisiveis = new Set((registros||[]).filter(r=>registroVisivel(perm, r)).map(r=>r.id));
      const temNaoLidos = await contarNaoLidos(tableName, idsVisiveis);
      if (refreshId !== __notificacoesRefreshId) return;
      dot.style.display = temNaoLidos ? 'inline-block' : 'none';
    }
    // "Minhas Tarefas" é um recorte de "Projetos" (só o que é
    // responsabilidade da própria pessoa) — usa os mesmos eventos de
    // projetos, mas com uma bolinha própria, calculada à parte.
    const dotMinhas = document.querySelector('.nav-dot[data-nav-dot="minhas-tarefas"]');
    if (dotMinhas){
      const { data: meusProjetos } = await sb.from('projetos').select('id, projetos_responsaveis!inner(profile_id)').eq('projetos_responsaveis.profile_id', currentUser.id);
      if (refreshId !== __notificacoesRefreshId) return;
      const idsMeus = new Set((meusProjetos||[]).map(r=>r.id));
      const temNaoLidosMinhas = await contarNaoLidos('projetos', idsMeus);
      if (refreshId !== __notificacoesRefreshId) return;
      dotMinhas.style.display = temNaoLidosMinhas ? 'inline-block' : 'none';
    }
  }catch(e){ /* a bolinha nunca deve travar o resto do app */ }
}

function renderTipoProblemaBadge(id, classeSemSubclasse=''){
  const t = tipoProblemaPorId(id);
  if (t) return celulaColorida(corDaClasseProblema(t.classe), `${escapeHtml(t.classe)} · ${escapeHtml(t.subclasse)}`);
  if (classeSemSubclasse) return celulaColorida(corDaClasseProblema(classeSemSubclasse), `${escapeHtml(classeSemSubclasse)} · Sem definir`);
  return celulaColorida('var(--text-faint)', '—');
}
function renderTipoProblemaCell(table, row, field){
  const id = 'tp_'+(++__ddSeq)+'_'+row.id;
  const atual = tipoProblemaPorId(row[field.key]);
  let tipoAtual = row[field.key] || '';
  let classeAtual = atual?.classe || row.tipo_problema_classe || row.__tipo_classe || '';
  const opcoes = opcoesTipoProblemaUnificadas(!tipoAtual ? classeAtual : '');
  const html = `<div class="tipo-problema-cell tipo-problema-unico" id="${id}">${buildSimplePicker(tipoAtual, opcoes, async (novoId, btn)=>{
    const novoTipo = tipoProblemaPorId(novoId);
    const novaClasse = novoTipo?.classe || '';
    const ok = await saveTipoProblemaState(table, row.id, field.key, novoId || null, novaClasse);
    if (!ok) return false;
    tipoAtual = novoId || '';
    classeAtual = novaClasse;
    row[field.key] = tipoAtual || null;
    row.tipo_problema_classe = classeAtual || null;
    row.__tipo_classe = classeAtual;
    if (btn){
      btn.disabled = false;
      btn.textContent = novoTipo ? `${novoTipo.classe} · ${novoTipo.subclasse}` : 'Sem definir';
    }
    flashSavedCor(btn);
    renderGestaoWhenSafe();
  }, {placeholder:classeAtual && !tipoAtual ? `${classeAtual} · Sem definir` : 'Sem definir'})}</div>`;
  queueMicrotask(()=>{
    const root = document.getElementById(id); if (!root) return;
    const btn = root.querySelector('.sel-simple-btn');
    if (!btn) return;
    const t = tipoProblemaPorId(tipoAtual);
    const cor = t ? corDaClasseProblema(t.classe) : (classeAtual ? corDaClasseProblema(classeAtual) : 'var(--text-faint)');
    btn.style.background = corMenuParaTema(cor);
    btn.style.color = textoParaCorDeMenu(cor);
  });
  return html;
}
function renderSelectCell(table, row, field){
  return buildSelDropdown({
    grupo: field.group,
    valorAtual: field.boolMap ? row[field.key] : row[field.key],
    boolMap: field.boolMap,
    permitirVazio: true,
    validar: (field.key==='status' && (table==='projetos'||table==='chamados_sac')) ? validarStatusConclusao(table, row.id) : undefined,
    onSelect: async (v, btn)=>{
      if (field.key==='franquia'){
        const salvo = await saveFranquiaField(table, row.id, v);
        if (!salvo) return false;
        row.franquia = salvo.franquia;
        row.franquia_id = salvo.franquia_id;
        flashSavedCor(btn);
        renderGestaoWhenSafe();
        return true;
      }
      const ok = await saveField(table, row.id, field.key, v);
      if (ok){
        row[field.key] = v;
        flashSavedCor(btn);
        renderGestaoWhenSafe();
        return true;
      }
      return false;
    },
  });
}

function registerAutoSave(id, table, row, key, transform, evt){
  queueMicrotask(()=>{
    const el = document.getElementById(id);
    if (!el) return;
    const eventName = evt || (el.tagName==='INPUT' && el.type!=='text' ? 'change' : 'blur');
    let saving = false;
    let queued = false;
    let latestRawValue = el.value;

    async function persistLatest(){
      if (saving){ queued = true; return; }
      saving = true;
      let savedAny = false;
      try{
        do{
          queued = false;
          const rawValue = latestRawValue;
          const novoValor = transform(rawValue);
          const ok = await saveField(table, row.id, key, novoValor);
          if (ok){ row[key] = novoValor; savedAny = true; }
        }while(queued);
      }finally{
        saving = false;
      }
      if (savedAny){
        if (el.isConnected) flashSaved(el);
        renderGestaoWhenSafe();
      }
    }

    el.addEventListener(eventName, ()=>{
      latestRawValue = el.value;
      queued = true;
      void persistLatest();
    });
  });
  return '';
}

// ── Painel flutuante compartilhado ──────────────────────────────────────
// Usado por todos os menus de escolha (status/categoria, calendário,
// atribuir responsáveis, filtro por coluna). Em vez de ficar preso dentro
// da tabela (que tem scroll e corta o que passa da borda), o painel é
// colocado direto no <body> com posição fixa, calculada a partir do botão
// que abriu — e vira pra cima sozinho se não couber embaixo. Só um painel
// fica aberto por vez, e um único listener cuida de fechar ao clicar fora,
// rolar a página ou redimensionar a janela (sem acumular listeners).
let __floatEl = null;
let __floatCleanup = null;
function fecharFlutuante(){
  if (__floatCleanup) __floatCleanup();
  if (__floatEl) __floatEl.remove();
  __floatEl = null; __floatCleanup = null;
}
function abrirFlutuante(trigger, classe, montar){
  const jaEraEsse = __floatEl && __floatEl.dataset.trigger === trigger.__floatId;
  fecharFlutuante();
  if (jaEraEsse) return; // clicar de novo no mesmo botão só fecha
  if (!trigger.__floatId) trigger.__floatId = 'trg_' + Math.random().toString(36).slice(2);
  const el = document.createElement('div');
  el.className = classe;
  el.dataset.trigger = trigger.__floatId;
  document.body.appendChild(el);
  __floatEl = el;
  function posicionar(){
    const r = trigger.getBoundingClientRect();
    const ph = el.offsetHeight, pw = el.offsetWidth;
    let top = r.bottom + 5;
    if (top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 5);
    let left = r.left;
    if (left + pw > window.innerWidth - 8) left = Math.max(8, window.innerWidth - pw - 8);
    el.style.top = top + 'px';
    el.style.left = left + 'px';
  }
  montar(el, fecharFlutuante);
  posicionar();
  const onScroll = (e)=>{ if (el.contains(e.target)) return; fecharFlutuante(); };
  const onResize = ()=>posicionar();
  const onDocClick = (e)=>{ if (!el.contains(e.target) && e.target !== trigger && !trigger.contains(e.target)) fecharFlutuante(); };
  document.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onResize);
  setTimeout(()=>document.addEventListener('click', onDocClick), 0);
  __floatCleanup = ()=>{
    document.removeEventListener('scroll', onScroll, true);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('click', onDocClick);
  };
}

// Seletor de cor visual — substitui o color-picker nativo do navegador/SO
// por um quadrado de saturação/valor + barra de matiz + campos R/G/B, no
// mesmo estilo do resto do app. Só chama `aoSalvar(hex)` quando a pessoa
// clica em "Salvar"; fechar ou "Cancelar" descarta a alteração.
function abrirSeletorDeCor(trigger, corAtual, aoSalvar){
  let { r, g, b } = hexParaRgb(corAtual || '#7f9a72');
  let hsv = rgbParaHsv(r, g, b);
  let h = hsv.h, s = hsv.s, v = hsv.v;

  abrirFlutuante(trigger, 'color-picker-float', (painel, fechar)=>{
    painel.innerHTML = `
      <div class="cp-sv-square" id="cp-sv">
        <div class="cp-sv-white"></div>
        <div class="cp-sv-black"></div>
        <div class="cp-sv-thumb" id="cp-sv-thumb"></div>
      </div>
      <div class="cp-hue-row">
        <div class="cp-preview" id="cp-preview"></div>
        <div class="cp-hue-slider" id="cp-hue"><div class="cp-hue-thumb" id="cp-hue-thumb"></div></div>
      </div>
      <div class="cp-rgb-row">
        <div class="cp-rgb-field"><input type="text" inputmode="numeric" maxlength="3" id="cp-r" class="cp-rgb-input" /><label>R</label></div>
        <div class="cp-rgb-field"><input type="text" inputmode="numeric" maxlength="3" id="cp-g" class="cp-rgb-input" /><label>G</label></div>
        <div class="cp-rgb-field"><input type="text" inputmode="numeric" maxlength="3" id="cp-b" class="cp-rgb-input" /><label>B</label></div>
      </div>
      <div class="cp-actions">
        <button type="button" class="btn" data-acao="cancelar">Cancelar</button>
        <button type="button" class="btn btn-primary csp-inline-003" data-acao="salvar">Salvar</button>
      </div>
    `;
    const svEl = painel.querySelector('#cp-sv');
    const svThumb = painel.querySelector('#cp-sv-thumb');
    const hueEl = painel.querySelector('#cp-hue');
    const hueThumb = painel.querySelector('#cp-hue-thumb');
    const preview = painel.querySelector('#cp-preview');
    const rInp = painel.querySelector('#cp-r');
    const gInp = painel.querySelector('#cp-g');
    const bInp = painel.querySelector('#cp-b');

    function atualizarVisual(){
      svEl.style.background = `hsl(${h}, 100%, 50%)`;
      svThumb.style.left = (s*svEl.clientWidth)+'px';
      svThumb.style.top = ((1-v)*svEl.clientHeight)+'px';
      hueThumb.style.left = (h/360*hueEl.clientWidth)+'px';
      const rgb = hsvParaRgb(h,s,v);
      r = rgb.r; g = rgb.g; b = rgb.b;
      preview.style.background = rgbParaHex(r,g,b);
      rInp.value = Math.round(r);
      gInp.value = Math.round(g);
      bInp.value = Math.round(b);
    }
    function atualizarDeRgb(){
      const novo = rgbParaHsv(r,g,b);
      h = novo.h; s = novo.s; v = novo.v;
      atualizarVisual();
    }
    function svDeEvento(e){
      const rect = svEl.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      s = Math.max(0, Math.min(1, (cx-rect.left)/rect.width));
      v = Math.max(0, Math.min(1, 1-(cy-rect.top)/rect.height));
      atualizarVisual();
    }
    function hueDeEvento(e){
      const rect = hueEl.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      h = Math.max(0, Math.min(360, (cx-rect.left)/rect.width*360));
      atualizarVisual();
    }
    function ligarArraste(el, handler){
      let arrastando = false;
      const onMove = (e)=>{ if (arrastando){ handler(e); e.preventDefault(); } };
      const onUp = ()=>{
        arrastando = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
      };
      el.addEventListener('mousedown', (e)=>{ arrastando=true; handler(e); document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp); });
      el.addEventListener('touchstart', (e)=>{ arrastando=true; handler(e); document.addEventListener('touchmove', onMove, {passive:false}); document.addEventListener('touchend', onUp); }, {passive:true});
    }
    ligarArraste(svEl, svDeEvento);
    ligarArraste(hueEl, hueDeEvento);

    [[rInp,'r'],[gInp,'g'],[bInp,'b']].forEach(([inp, canal])=>{
      inp.addEventListener('change', ()=>{
        let n = parseInt(inp.value, 10);
        if (isNaN(n)) n = 0;
        n = Math.max(0, Math.min(255, n));
        if (canal==='r') r=n; else if (canal==='g') g=n; else b=n;
        atualizarDeRgb();
      });
    });

    atualizarVisual();

    painel.querySelector('[data-acao="cancelar"]').addEventListener('click', fechar);
    painel.querySelector('[data-acao="salvar"]').addEventListener('click', ()=>{
      const hexFinal = rgbParaHex(r,g,b);
      fechar();
      aoSalvar(hexFinal);
    });
  });
}

// Relógio de ponteiro — mostrador circular de 24h com marcas a cada 30
// minutos. Arrasta (ou clica direto num ponto) pra girar o ponteiro; ele
// sempre encaixa no meia-hora mais próxima. `aoSalvar(valor)` só é chamado
// ao clicar em "Definir".
function abrirRelogioPicker(trigger, valorAtual, aoSalvar){
  const partes = String(valorAtual||'').split(':');
  let h = parseInt(partes[0], 10); if (isNaN(h) || h<0 || h>23) h = 12;
  let m = parseInt(partes[1], 10); m = (!isNaN(m) && m>=30) ? 30 : 0;

  abrirFlutuante(trigger, 'clock-picker-float', (painel, fechar)=>{
    const tam = 228, centro = tam/2, raio = 100;
    let marcasHtml = '';
    for (let i=0;i<48;i++){
      const angDeg = i*7.5;
      const rad = (angDeg-90)*Math.PI/180;
      const ehHora = i%2===0;
      const rMarca = raio - (ehHora?8:5.5);
      const x = centro + rMarca*Math.cos(rad), y = centro + rMarca*Math.sin(rad);
      const largura = ehHora?3:2, altura = ehHora?12:7;
      marcasHtml += `<div class="clock-tick${ehHora?' clock-tick-hora':''}" data-csp-style="left:${x}px;top:${y}px;width:${largura}px;height:${altura}px;transform:translate(-50%,-50%) rotate(${angDeg}deg);"></div>`;
    }
    let numsHtml = '';
    [0,6,12,18].forEach(hCard=>{
      const angDeg = (hCard*2)*7.5;
      const rad = (angDeg-90)*Math.PI/180;
      const rNum = raio - 24;
      const x = centro + rNum*Math.cos(rad), y = centro + rNum*Math.sin(rad);
      numsHtml += `<div class="clock-num" data-num-hora="${hCard}" data-csp-style="left:${x}px;top:${y}px;">${pad2(hCard)}</div>`;
    });
    painel.innerHTML = `
      <div class="clock-readout" id="clock-readout">--:--</div>
      <div class="clock-face" id="clock-face" data-csp-style="width:${tam}px;height:${tam}px;">
        ${marcasHtml}
        ${numsHtml}
        <div class="clock-hand" id="clock-hand"><div class="clock-hand-tip"></div></div>
        <div class="clock-center-dot"></div>
      </div>
      <div class="cp-actions">
        <button type="button" class="btn" data-acao="cancelar">Cancelar</button>
        <button type="button" class="btn btn-primary csp-inline-003" data-acao="salvar">Definir</button>
      </div>
    `;
    const face = painel.querySelector('#clock-face');
    const hand = painel.querySelector('#clock-hand');
    const readout = painel.querySelector('#clock-readout');
    const numEls = painel.querySelectorAll('[data-num-hora]');

    function aplicarPasso(passo){
      passo = ((passo%48)+48)%48;
      h = Math.floor(passo/2);
      m = (passo%2)*30;
      hand.style.transform = `translate(-50%,-100%) rotate(${passo*7.5}deg)`;
      readout.textContent = pad2(h)+':'+pad2(m);
      numEls.forEach(el=>{ el.classList.toggle('clock-num-destaque', m===0 && Number(el.dataset.numHora)===h); });
    }
    aplicarPasso(h*2 + (m>=30?1:0));

    function passoDeEvento(e){
      const rect = face.getBoundingClientRect();
      const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
      const px = e.touches ? e.touches[0].clientX : e.clientX;
      const py = e.touches ? e.touches[0].clientY : e.clientY;
      let ang = Math.atan2(py-cy, px-cx) * 180/Math.PI + 90;
      if (ang < 0) ang += 360;
      aplicarPasso(Math.round(ang/7.5));
    }
    function ligarArraste(el, handler){
      let arrastando = false;
      const onMove = (e)=>{ if (arrastando){ handler(e); e.preventDefault(); } };
      const onUp = ()=>{
        arrastando = false;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onUp);
      };
      el.addEventListener('mousedown', (e)=>{ arrastando=true; handler(e); document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp); });
      el.addEventListener('touchstart', (e)=>{ arrastando=true; handler(e); document.addEventListener('touchmove', onMove, {passive:false}); document.addEventListener('touchend', onUp); }, {passive:true});
    }
    ligarArraste(face, passoDeEvento);

    painel.querySelector('[data-acao="cancelar"]').addEventListener('click', fechar);
    painel.querySelector('[data-acao="salvar"]').addEventListener('click', ()=>{
      const valor = pad2(h)+':'+pad2(m);
      fechar();
      aoSalvar(valor);
    });
  });
}

// Monta o par <input de hora> + <botão de relógio>, já com a máscara 24h
// ligada no input e o relógio de ponteiro ligado no botão. `onCommit` (se
// informado) é chamado toda vez que o valor muda — tanto digitando quanto
// escolhendo no relógio — pra quem chamar poder salvar no banco.
function ligarCampoHoraComRelogio(inputEl, botaoEl, onCommit){
  ligarCampoHora(inputEl);
  if (onCommit) inputEl.addEventListener('blur', ()=> onCommit(inputEl.value));
  botaoEl.addEventListener('click', (e)=>{
    e.preventDefault();
    abrirRelogioPicker(botaoEl, inputEl.value, (novoValor)=>{
      inputEl.value = novoValor;
      if (onCommit) onCommit(novoValor);
    });
  });
}


// Calendário customizado — substitui o <input type="date"> nativo (cujo menu
// é controlado pelo navegador/SO e não dá pra estilizar nem animar).
function buildCalendarField(valorISO, onChange){
  const wrapId = 'calw_' + (++__ddSeq);
  const html = `<button type="button" class="cell-date csp-inline-004" id="${wrapId}">${valorISO ? fmtDate(valorISO) : 'Selecionar…'}</button>`;
  queueMicrotask(()=>{
    const btn = document.getElementById(wrapId);
    if (!btn) return;
    let selecionado = valorISO || null;
    const base = selecionado ? selecionado.split('-').map(Number) : [new Date().getFullYear(), new Date().getMonth()+1];
    let ano = base[0], mes = base[1];

    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      abrirFlutuante(btn, 'cal-dd', (painelEl, fechar)=>{
        function montarPainel(){
          const primeiroDia = new Date(ano, mes-1, 1);
          const nomeMes = primeiroDia.toLocaleDateString('pt-BR', { month:'long', year:'numeric' });
          const diaSemanaInicio = primeiroDia.getDay();
          const totalDias = new Date(ano, mes, 0).getDate();
          const totalDiasMesAnterior = new Date(ano, mes-1, 0).getDate();
          const hojeISO = new Date().toISOString().slice(0,10);
          let celulas = '';
          for (let i=0;i<diaSemanaInicio;i++){
            celulas += `<div class="cal-day cal-muted">${totalDiasMesAnterior - diaSemanaInicio + 1 + i}</div>`;
          }
          for (let d=1; d<=totalDias; d++){
            const iso = `${ano}-${String(mes).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const cls = ['cal-day'];
            if (iso===hojeISO) cls.push('cal-today');
            if (iso===selecionado) cls.push('cal-selected');
            celulas += `<div class="${cls.join(' ')}" data-iso="${iso}">${d}</div>`;
          }
          const restante = (7 - ((diaSemanaInicio+totalDias)%7))%7;
          for (let d=1; d<=restante; d++){ celulas += `<div class="cal-day cal-muted">${d}</div>`; }

          painelEl.innerHTML = `
            <div class="cal-head">
              <button type="button" data-nav="-1">‹</button>
              <div class="cal-title">${nomeMes}</div>
              <button type="button" data-nav="1">›</button>
            </div>
            <div class="cal-grid">
              ${['D','S','T','Q','Q','S','S'].map(d=>`<div class="cal-dow">${d}</div>`).join('')}
              ${celulas}
            </div>
            <div class="cal-foot">
              <button type="button" data-acao="hoje">Hoje</button>
              <button type="button" data-acao="limpar">Limpar</button>
            </div>`;
          painelEl.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click', (e)=>{
            e.stopPropagation();
            mes += parseInt(b.dataset.nav); if (mes<1){mes=12;ano--;} if (mes>12){mes=1;ano++;}
            montarPainel();
          }));
          painelEl.querySelectorAll('.cal-day[data-iso]').forEach(c=>c.addEventListener('click', async ()=>{
            selecionado = c.dataset.iso; fechar(); btn.textContent = fmtDate(selecionado);
            if (await onChange(selecionado)) flashSaved(btn);
          }));
          painelEl.querySelector('[data-acao="hoje"]').addEventListener('click', async (e)=>{
            e.stopPropagation();
            selecionado = hojeISO; fechar(); btn.textContent = fmtDate(selecionado);
            if (await onChange(selecionado)) flashSaved(btn);
          });
          painelEl.querySelector('[data-acao="limpar"]').addEventListener('click', async (e)=>{
            e.stopPropagation();
            selecionado = null; fechar(); btn.textContent = 'Selecionar…';
            if (await onChange(null)) flashSaved(btn);
          });
        }
        montarPainel();
      });
    });
  });
  return html;
}

const progressBarsAnimated = new Set();
function progressBarEntryClass(key){
  if(progressBarsAnimated.has(key)) return '';
  progressBarsAnimated.add(key);
  return ' progress-bar-enter';
}

function renderCell(table, row, field){
  const id = 'f_'+field.key+'_'+row.id;
  const w = field.w ? `style="min-width:${field.w}px"` : '';
  if (field.edit==='problem-type') return renderTipoProblemaCell(table, row, field);
  if (field.edit==='select') return renderSelectCell(table, row, field);
  if (field.edit==='multiselect') return renderMultiSelectCell(table, row, field);
  if (field.edit==='percent'){
    const pct = Math.round((row[field.key]||0)*100);
    const barId = id+'_bar';
    const enterClass = progressBarEntryClass(barId);
    const out = `<div class="project-progress">
      <div class="project-progress-input">
        <input type="number" class="cell-number csp-inline-006" id="${id}" value="${pct}" min="0" max="100" step="5" />
        <span class="csp-inline-007">%</span>
      </div>
      <div class="progress-bar project-progress-bar" aria-hidden="true"><div class="${enterClass.trim()}" id="${barId}" data-csp-style="width:${pct}%"></div></div>
    </div>`;
    queueMicrotask(()=>{
      const inp = document.getElementById(id);
      const bar = document.getElementById(barId);
      if (!inp || !bar) return;
      // Atualiza a barrinha na hora (com a animação já definida no CSS),
      // sem esperar salvar no banco — só pra dar retorno visual imediato.
      inp.addEventListener('input', ()=>{
        let v = parseFloat(inp.value);
        if (isNaN(v)) v = 0;
        v = Math.max(0, Math.min(100, v));
        bar.style.width = v + '%';
      });
    });
    registerAutoSave(id, table, row, field.key, v=>parseFloat(v)/100);
    return out;
  }
  if (field.edit==='date'){
    return buildCalendarField(row[field.key], async (novoValor)=>{
      const ok = await saveField(table, row.id, field.key, novoValor);
      if (ok){
        row[field.key] = novoValor;
        renderGestaoWhenSafe();
      }
      return ok;
    });
  }
  if (field.edit==='number'){
    const out = `<input type="number" class="cell-number" id="${id}" ${w} value="${row[field.key] ?? ''}" ${field.min!==undefined?`min="${field.min}"`:''} ${field.max!==undefined?`max="${field.max}"`:''} ${field.step!==undefined?`step="${field.step}"`:''} />`;
    registerAutoSave(id, table, row, field.key, v=>v===''?null:parseFloat(v));
    return out;
  }
  if (field.edit==='textarea'){
    const out = `<textarea class="cell-input" id="${id}" ${w} rows="1">${escapeHtml(row[field.key]||'')}</textarea>`;
    registerAutoSave(id, table, row, field.key, v=>v||null, 'blur');
    return out;
  }
  const out = `<input type="text" class="cell-input" id="${id}" ${w} value="${escapeHtml(row[field.key]||'')}" />`;
  registerAutoSave(id, table, row, field.key, v=>v||null, 'blur');
  return out;
}

function renderMultiSelectCell(table, row, field){
  const cfg = TABLE_CONFIG[table];
  const btnId = 'mselbtn_' + (++__ddSeq);

  function labelHtml(){
    const selectedIds = row.__resp_ids || [];
    const nomes = profilesCache.filter(p=>selectedIds.includes(p.id)).map(p=>p.nome);
    return nomes.length ? nomes.map(n=>`<span class="chip">${escapeHtml(n)}</span>`).join('') : '<span class="csp-inline-009">Atribuir…</span>';
  }

  const html = `<button type="button" class="msel-btn" id="${btnId}">${labelHtml()}</button>`;

  queueMicrotask(()=>{
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      abrirFlutuante(btn, 'msel-panel-float', (painel)=>{
        painel.innerHTML = profilesCache.map(p=>`<label><input type="checkbox" value="${p.id}" ${(row.__resp_ids||[]).includes(p.id)?'checked':''}> ${escapeHtml(p.nome)}</label>`).join('') || '<div class="csp-inline-010">Nenhum usuário cadastrado.</div>';
        painel.querySelectorAll('input[type=checkbox]').forEach(cb=>{
          cb.addEventListener('change', async ()=>{
            markGestaoLocalChange();
            const profileId = cb.value;
            if (cb.checked){
              const { error } = await sb.from(cfg.respTable).insert({ [cfg.respFk]: row.id, profile_id: profileId });
              if (error) return toast('Erro: '+error.message, true);
              row.__resp_ids.push(profileId);
            } else {
              const { error } = await sb.from(cfg.respTable).delete().eq(cfg.respFk, row.id).eq('profile_id', profileId);
              if (error) return toast('Erro: '+error.message, true);
              row.__resp_ids = row.__resp_ids.filter(x=>x!==profileId);
            }
            btn.innerHTML = labelHtml();
            toast('Responsáveis atualizados.');
          });
        });
      });
    });
  });
  return html;
}

function celulaColorida(cor, textoHtml){
  return `<div class="fill" data-csp-style="background-color:${corMenuParaTema(cor)};color:${textoParaCorDeMenu(cor)}">${textoHtml}</div>`;
}

function statusBadgeGeneric(grupo, valor){
  if (ehSemDefinir(valor)) return celulaColorida('var(--text-faint)', SEM_DEFINIR);
  const cor = corDaOpcao(grupo, valor);
  return celulaColorida(cor, escapeHtml(valor));
}

let __ddSeq = 0;
// Constrói um seletor customizado (substitui <select> nativo): preenche a
// célula com a cor da opção e abre um menu com animação. permitirVazio=true
// mostra uma opção "— Sem definir —" no topo (útil pra prioridade, etc).
function buildSelDropdown({ grupo, valorAtual, onSelect, permitirVazio, boolMap, validar }){
  const id = 'dd_' + (++__ddSeq);
  const opts = opcoesDe(grupo);
  const valorNulo = !boolMap && ehSemDefinir(valorAtual);
  let valorExibido = boolMap ? (valorAtual ? 'Sim' : (valorAtual===false ? 'Nao' : '')) : (valorNulo ? '' : (valorAtual || ''));
  const corBase = valorExibido ? corDaOpcao(grupo, valorExibido) : 'var(--text-faint)';
  const rotulo = valorExibido || (permitirVazio ? SEM_DEFINIR : '—');
  const opcoesRenderizadas = permitirVazio
    ? [{ valor:'', cor:'var(--text-faint)' }, ...opts]
    : opts.map(o=>({ valor:o.valor, cor:o.cor }));
  const html = `<button type="button" class="sel-dd-btn" id="${id}" data-csp-style="background-color:${corMenuParaTema(corBase)};color:${textoParaCorDeMenu(corBase)}">${escapeHtml(rotulo)}</button>`;
  queueMicrotask(()=>{
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      abrirFlutuante(btn, 'dd-panel-float', (painel, fechar)=>{
        painel.innerHTML = opcoesRenderizadas.map(o=>{
          const semDefinir = o.valor === '';
          const label = semDefinir ? SEM_DEFINIR : o.valor;
          const dot = semDefinir ? 'var(--text-faint)' : corMenuParaTema(o.cor);
          return `<div class="dd-opt${o.valor===valorExibido?' dd-opt-sel':''}" data-v="${escapeHtml(String(o.valor))}"><span class="dd-dot" data-csp-style="background:${dot}"></span>${escapeHtml(label)}</div>`;
        }).join('');
        painel.querySelectorAll('.dd-opt').forEach(opt=>{
          opt.addEventListener('click', async ()=>{
            fechar();
            const rotuloEscolhido = opt.dataset.v || '';
            if (validar){
              const motivoBloqueio = await validar(rotuloEscolhido);
              if (motivoBloqueio){ toast(motivoBloqueio, true); return; }
            }
            valorExibido = rotuloEscolhido;
            const novaCorBase = rotuloEscolhido ? corDaOpcao(grupo, rotuloEscolhido) : 'var(--text-faint)';
            btn.textContent = rotuloEscolhido || (permitirVazio ? SEM_DEFINIR : '—');
            btn.style.background = corMenuParaTema(novaCorBase);
            btn.style.color = textoParaCorDeMenu(novaCorBase);
            let v = rotuloEscolhido === '' ? null : rotuloEscolhido;
            if (boolMap) v = rotuloEscolhido === '' ? null : (rotuloEscolhido === 'Sim');
            await onSelect(v, btn);
          });
        });
      });
    });
  });
  return html;
}
// Seletor genérico com painel flutuante — troca o <select> nativo (cujo
// menu de opções é controlado pelo navegador/SO e não dá pra estilizar) por
// um botão com painel próprio, no mesmo componente visual (.dd-panel-float)
// usado pelos outros seletores do app. `opcoes`: [{value, label, dot?}].
// Se `dataAttr` for passado, o valor escolhido também vira um atributo
// data-* no botão (dá pra estilizar por CSS, ex.: cor por papel de usuário).
function buildSimplePicker(valorAtual, opcoes, aoSelecionar, { classeExtra='', dataAttr=null, placeholder='—' } = {}){
  const id = 'sp_' + (++__ddSeq);
  const rotuloDe = (v)=> (opcoes.find(o=>String(o.value)===String(v))||{}).label ?? placeholder;
  const attrExtra = dataAttr ? ` data-${dataAttr}="${escapeHtml(String(valorAtual))}"` : '';
  const html = `<button type="button" class="sel-simple-btn${classeExtra?(' '+classeExtra):''}" id="${id}"${attrExtra}>${escapeHtml(rotuloDe(valorAtual))}</button>`;
  queueMicrotask(()=>{
    const btn = document.getElementById(id);
    if (!btn) return;
    let atual = valorAtual;
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      abrirFlutuante(btn, 'dd-panel-float', (painel, fechar)=>{
painel.innerHTML = opcoes.map(o=>o.header ? `<div class="dd-group-label"${o.dot?` data-csp-style="border-left-color:${o.dot}"`:''}>${o.dot?`<span class="dd-dot" data-csp-style="background:${o.dot}"></span>`:''}<span class="dd-group-kicker">Classe</span><span>${escapeHtml(o.label)}</span></div>` : `<div class="dd-opt${String(o.value)===String(atual)?' dd-opt-sel':''}" data-v="${escapeHtml(String(o.value))}">${o.dot?`<span class="dd-dot" data-csp-style="background:${o.dot}"></span>`:''}${escapeHtml(o.menuLabel || o.label)}</div>`).join('');
        painel.querySelectorAll('.dd-opt').forEach(opt=>{
          opt.addEventListener('click', async ()=>{
            fechar();
            const valorAnterior = atual;
            const novoValor = opt.dataset.v;
            atual = novoValor;
            btn.textContent = rotuloDe(novoValor);
            if (dataAttr) btn.setAttribute('data-'+dataAttr, novoValor);
            const resultado = await aoSelecionar(novoValor, btn);
            // Se o callback rejeitar a gravação, restaura também o estado
            // interno do picker, e não apenas o texto visível.
            if (resultado === false){
              atual = valorAnterior;
              btn.textContent = rotuloDe(valorAnterior);
              if (dataAttr) btn.setAttribute('data-'+dataAttr, valorAnterior);
            }
          });
        });
      });
    });
  });
  return html;
}

// Seletor de papel do usuário — mesma faixa colorida do "role-stamp".
const ROLE_OPCOES_PICKER = [
  { value:'UEng', label:'Usuário Engenharia e SAC', dot:'var(--text-faint)' },
  { value:'GEng', label:'Gestor Engenharia', dot:'var(--accent-2)' },
  { value:'UInd', label:'Usuário Indústria', dot:'var(--accent-4)' },
  { value:'GInd', label:'Gestor Indústria', dot:'var(--accent-3)' },
  { value:'ADM', label:'Administrador', dot:'var(--accent)' },
];
function buildRolePicker(valorAtual, aoSelecionar){
  return buildSimplePicker(valorAtual, ROLE_OPCOES_PICKER, aoSelecionar, { classeExtra:'role-picker', dataAttr:'role' });
}


// Nomes de status considerados "conclusão" (bloqueados se houver checklist
// pendente). Comparação sem acento/maiúsculas pra pegar variações do texto.
const STATUS_CONCLUSAO = ['concluido','fechado'];
function normalizarTexto(s){ return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
async function checklistBloqueiaConclusao(tabela, id){
  const checklistTable = tabela==='projetos' ? 'projetos_checklist' : 'chamados_checklist';
  const fk = tabela==='projetos' ? 'projeto_id' : 'chamado_id';
  const { data: itens, error } = await sb.from(checklistTable).select('concluido').eq(fk, id);
  if (error || !itens || !itens.length) return false; // sem checklist = sem bloqueio
  return itens.some(it => !it.concluido);
}
// Usado como "validar" do buildSelDropdown nos campos de status de
// Projetos/Chamados: se o checklist existir e não estiver 100%, bloqueia
// mudar pra um status de conclusão.
function validarStatusConclusao(tabela, rowId){
  return async (novoValor)=>{
    if (!STATUS_CONCLUSAO.includes(normalizarTexto(novoValor))) return null;
    const bloqueado = await checklistBloqueiaConclusao(tabela, rowId);
    if (bloqueado) return 'Não dá pra concluir: ainda tem item(ns) pendente(s) no checklist.';
    return null;
  };
}

async function viewTabela(tableName){
  const cfg = TABLE_CONFIG[tableName];
  document.getElementById('page-title').textContent = cfg.title;
  document.getElementById('page-sub').textContent = cfg.sub;
  const perm = permissoesTabela(tableName);
  const podeCriar = !!perm.criar;
  const podeEditarAlgo = !!perm.editar;
  const podeExcluirAlgo = !!perm.excluir;
  const mostraColunaAcoes = podeExcluirAlgo;

  await loadProfilesCache();

  const { data, error } = await sb.from(tableName).select('*').order('created_at', { ascending:false });
  if (error) throw error;

  if (cfg.respTable){
    const ids = data.map(r=>r.id);
    if (ids.length){
      const { data: resp } = await sb.from(cfg.respTable).select('*').in(cfg.respFk, ids);
      data.forEach(r=>{ r.__resp_ids = (resp||[]).filter(x=>x[cfg.respFk]===r.id).map(x=>x.profile_id); });
    } else { data.forEach(r=>{ r.__resp_ids = []; }); }
  }
  // Remove da lista local qualquer registro que a pessoa não tem permissão
  // de ver (categoria "ver_proprio"/"ver_outros"). O array é filtrado "in
  // place" (splice) porque o resto da função (criar linha, refresh
  // silencioso etc.) segura essa mesma referência e faz unshift/push nela.
  for (let i = data.length - 1; i >= 0; i--){ if (!registroVisivel(perm, data[i])) data.splice(i, 1); }

  // Notificações individuais (por usuário): "Novo" quando o registro
  // inteiro é novo, "Alterado" grudado no campo específico que mudou, e um
  // pontinho no botão "detalhes" quando tem algo não lido lá dentro
  // (checklist/imagens) — tudo isso some só quando ESTA pessoa clica em
  // "lido" (não afeta os outros usuários, e nunca notifica quem fez a
  // própria mudança). Cada campo guarda uma LISTA de ids de evento (não só
  // um) — se o mesmo campo foi editado várias vezes, um único clique em
  // "lido" marca todas aquelas edições como lidas de uma vez, em vez do
  // selo "reaparecer" a cada refresh por causa de uma edição mais antiga
  // que ficou pra trás sem ser marcada.
  let eventosPorRegistro = {}; // eventosPorRegistro[registro.id] = { novo:[ids], campos:{chave:[ids]}, detalhes:[ids] }
  async function carregarNotificacoes(){
    const mapa = {};
    if (!cfg.notificacoes || !data.length) return mapa;
    const ids = data.map(r=>r.id);
    const [eventosResult, lidosResult] = await Promise.all([
      sb.from(cfg.notifEventosTable).select('*').in(cfg.notifFk, ids),
      sb.from(cfg.notifLidosTable).select('evento_id').eq('usuario_id', currentUser.id),
    ]);
    if (eventosResult.error || lidosResult.error){
      reportarFalhaNotificacoes(`Erro ao carregar ${cfg.title}`, [eventosResult.error, lidosResult.error]);
      return mapa;
    }
    const eventos = eventosResult.data || [];
    const lidos = lidosResult.data || [];
    const lidosSet = new Set(lidos.map(l=>l.evento_id));
    eventos.forEach(ev=>{
      if (ev.criado_por === currentUser.id) return;
      if (lidosSet.has(ev.id)) return;
      adicionarEventoNotificacao(mapa, cfg, ev);
    });
    return mapa;
  }  if (cfg.notificacoes) eventosPorRegistro = await carregarNotificacoes();
  // Todos os ids de evento não lidos da tabela inteira (linha "Novo", campos
  // editados e o que tiver pendente no Detalhes) — usado pelo botão
  // "Marcar tudo como lido" da barra de ferramentas.
  function todosOsEventosDaTabela(){
    const ids = [];
    Object.values(eventosPorRegistro).forEach(reg=>{
      ids.push(...reg.novo, ...reg.detalhes);
      Object.values(reg.campos).forEach(arr=>ids.push(...arr));
    });
    return ids;
  }
  function atualizarBotaoMarcarTudoTabela(){
    const btnTudo = document.getElementById('btn-marcar-tudo-lido-tabela');
    if (!btnTudo) return;
    const total = todosOsEventosDaTabela().length;
    if (!total){ btnTudo.style.display = 'none'; return; }
    btnTudo.style.display = '';
    btnTudo.textContent = `✓ Marcar tudo como lido (${total})`;
  }

  const chaveEstado = `tabela_estado_${tableName}_${currentUser.id}`;
  const state = { busca:'', colFiltros:{}, sortRules:[], somenteNaoVistos:false }; // colFiltros[key] = Set de valores a mostrar (ausente = sem filtro)

  function salvarEstado(){
    const colFiltrosSerializado = {};
    Object.entries(state.colFiltros).forEach(([k,set])=>{ colFiltrosSerializado[k] = Array.from(set); });
    localStorage.setItem(chaveEstado, JSON.stringify({ busca: state.busca, colFiltros: colFiltrosSerializado, sortRules: state.sortRules, somenteNaoVistos: state.somenteNaoVistos }));
  }
  function carregarEstado(){
    try{
      const raw = localStorage.getItem(chaveEstado);
      if (!raw) return;
      const obj = JSON.parse(raw);
      state.busca = obj.busca || '';
      state.sortRules = obj.sortRules || [];
      state.somenteNaoVistos = !!obj.somenteNaoVistos;
      state.colFiltros = {};
      Object.entries(obj.colFiltros || {}).forEach(([k,arr])=>{ state.colFiltros[k] = new Set(arr); });
    if (tableName==='reclamacoes_industria' && state.colFiltros.tipo_problema_id){
      state.colFiltros.tipo_problema_id = new Set(Array.from(state.colFiltros.tipo_problema_id).map(v=>tipoProblemaPorId(v)?rotuloTipoProblema(v):v));
    }
    }catch(e){ /* estado salvo inválido — ignora e começa limpo */ }
  }
  carregarEstado();

  // Um registro "tem algo não visto" se sobrar qualquer notificação
  // pendente nele — linha nova, campo alterado ou coisa no Detalhes.
  function temNaoVisto(r){
    if (!cfg.notificacoes) return false;
    const reg = eventosPorRegistro[r.id];
    return !!(reg && (reg.novo.length || reg.detalhes.length || Object.keys(reg.campos).length));
  }

  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="toolbar">
      <input type="text" id="filter-text" placeholder="Buscar em tudo..." class="csp-inline-011" />
      <button class="btn" id="btn-limpar-filtros" type="button">Limpar filtros e ordenação</button>
      <div class="spacer"></div>
      ${cfg.notificacoes ? `<label class="filtro-nao-vistos"><input type="checkbox" id="chk-nao-vistos" ${state.somenteNaoVistos?'checked':''} /> Mostrar apenas não vistos</label>` : ''}
      ${cfg.notificacoes ? `<button class="btn" id="btn-marcar-tudo-lido-tabela" data-csp-style="width:auto;display:${todosOsEventosDaTabela().length?'':'none'}">✓ Marcar tudo como lido (${todosOsEventosDaTabela().length})</button>` : ''}
      ${podeCriar ? `<button class="btn btn-primary csp-inline-003" id="btn-new">+ Novo</button>` : ''}
    </div>
    <div class="section-note csp-inline-012">Clique no nome de uma coluna pra ordenar. Segure <b>Shift</b> pra ordenar por várias colunas ao mesmo tempo (a ordem do clique define a prioridade). Clique no ▾ pra filtrar valores específicos daquela coluna. Suas escolhas ficam salvas até você mesmo limpar.</div>
    <div class="table-wrap tabela-principal"><table>
      <thead>
        <tr>${cfg.notificacoes?'<th></th>':''}${cfg.detalhavel?'<th></th>':''}${cfg.fields.map(f=>`<th><div class="th-inner">
          <button type="button" class="th-sort" data-key="${f.key}">${f.label}<span class="sort-arrow" data-arrow="${f.key}"></span></button>
          <button type="button" class="th-filtro" data-key="${f.key}" title="Filtrar esta coluna">▾</button>
        </div></th>`).join('')}${mostraColunaAcoes?'<th></th>':''}</tr>
      </thead>
      <tbody id="tbody"></tbody>
    </table></div>
  `;

  function valorExibivel(r, f){
    if (f.edit==='multiselect') return (profilesCache.filter(p=>(r.__resp_ids||[]).includes(p.id)).map(p=>p.nome).join(', '));
    if (f.boolMap) return r[f.key] ? 'Sim' : 'Nao';
    if (f.edit==='problem-type') return rotuloTipoProblema(r[f.key]) || (r.tipo_problema_classe ? (r.tipo_problema_classe + ' — Sem definir') : 'Sem definir');
    if (f.edit==='select' && ehSemDefinir(r[f.key])) return SEM_DEFINIR;
    return r[f.key] ?? '';
  }

  function atualizarIndicadoresOrdenacao(){
    document.querySelectorAll('.sort-arrow').forEach(a=>a.textContent='');
    state.sortRules.forEach((rule, i)=>{
      const arrow = document.querySelector(`.sort-arrow[data-arrow="${rule.key}"]`);
      if (arrow) arrow.textContent = ` ${rule.dir===1?'▲':'▼'}${state.sortRules.length>1 ? (i+1) : ''}`;
    });
  }
  function atualizarIndicadoresFiltro(){
    document.querySelectorAll('.th-filtro').forEach(btn=>{
      btn.classList.toggle('ativo', !!state.colFiltros[btn.dataset.key]);
    });
  }

  function aplicarFiltrosOrdenacao(){
    let rows = data.slice();
    if (state.somenteNaoVistos){
      rows = rows.filter(temNaoVisto);
    }
    if (state.busca){
      rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(state.busca));
    }
    Object.entries(state.colFiltros).forEach(([key, valoresPermitidos])=>{
      const f = cfg.fields.find(x=>x.key===key);
      rows = rows.filter(r => valoresPermitidos.has(String(valorExibivel(r, f))));
    });
    if (state.sortRules.length){
      const regras = state.sortRules.map(rule => ({ f: cfg.fields.find(x=>x.key===rule.key), dir: rule.dir }));
      rows.sort((a,b)=>{
        for (const { f, dir } of regras){
          let va = valorExibivel(a, f), vb = valorExibivel(b, f);
          if (typeof va === 'number' || typeof vb === 'number'){ va = Number(va)||0; vb = Number(vb)||0; }
          else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase(); }
          if (va < vb) return -1*dir;
          if (va > vb) return 1*dir;
        }
        return 0;
      });
    }
    render(rows);
  }

  function render(rows){
    const tbody = document.getElementById('tbody');
    if (!rows.length){
    const avisoVazio = currentProfile?.role === 'UEng'
      ? 'Nenhum registro atribuído a você. Um Gestor pode definir você em Responsáveis.'
      : 'Nenhum registro encontrado.';
    tbody.innerHTML = `<tr class="empty-row"><td colspan="${cfg.fields.length+1+(cfg.detalhavel?1:0)+(cfg.notificacoes?1:0)}">${avisoVazio}</td></tr>`;
    return;
  }
    tbody.innerHTML = rows.map(r=>{
      const reg = cfg.notificacoes ? eventosPorRegistro[r.id] : null;
      const cells = cfg.fields.map(f=>{
        const editavel = podeEditarAlgo && !f.readonly && registroVisivel(perm, r);
        const content = editavel ? renderCell(tableName, r, f)
          : (f.edit==='problem-type' ? renderTipoProblemaBadge(r[f.key], r.tipo_problema_classe)
             : f.edit==='select' ? statusBadgeGeneric(f.group, f.boolMap ? (r[f.key]?'Sim':'Nao') : r[f.key])
             : f.edit==='multiselect' ? (profilesCache.filter(p=>(r.__resp_ids||[]).includes(p.id)).map(p=>p.nome).join(', ') || '—')
             : f.edit==='date' ? fmtDate(r[f.key])
             : escapeHtml(r[f.key] ?? '—'));
        const cls = (f.edit==='select' || f.edit==='problem-type') ? ' class="cell-colored"' : '';
        const idsCampo = reg && reg.campos[f.key];
        // O selo fica dentro de um "wrap" de bloco — remover ESSE elemento
        // (em vez de só o <span> por dentro) some com o espaço reservado
        // também, e a linha volta sozinha pro tamanho normal.
        const badgeCampo = (idsCampo && idsCampo.length) ? `<div class="notif-badge-wrap" data-evento-badge-group="${idsCampo.join(',')}"><span class="notif-badge notif-badge-editado">Alterado <button type="button" class="notif-lido-btn" data-evento-ids="${idsCampo.join(',')}">lido</button></span></div>` : '';
        return `<td${cls}>${badgeCampo}${content}</td>`;
      }).join('');
      const idsLinhaInteira = reg ? [...reg.novo, ...reg.detalhes, ...Object.values(reg.campos).flat()] : [];
      const temNovo = idsLinhaInteira.length > 0;
      const notifCell = cfg.notificacoes ? `<td class="notif-cell">${temNovo ? `<span class="notif-badge notif-badge-novo" data-evento-badge-group="${idsLinhaInteira.join(',')}">🆕 Novo <button type="button" class="notif-lido-btn" data-evento-ids="${idsLinhaInteira.join(',')}" title="Marca a linha inteira como lida, inclusive o Detalhes">lido</button></span>` : ''}</td>` : '';
      const temDetalhesNovo = reg && reg.detalhes.length;
      const detalhesCell = cfg.detalhavel ? `<td class="row-actions"><button class="icon-btn" data-action="open-details" data-table="${escapeHtml(tableName)}" data-record-id="${escapeHtml(r.id)}" title="${temDetalhesNovo?'Tem alteração não lida no Detalhes':''}">detalhes${temDetalhesNovo?'<span class="nav-dot csp-inline-013"></span>':''}</button></td>` : '';
      const podeExcluirRow = podeExcluirAlgo && registroVisivel(perm, r);
      const actions = mostraColunaAcoes ? `<td class="row-actions">${podeExcluirRow ? `<button class="icon-btn" data-action="delete-row" data-table="${escapeHtml(tableName)}" data-record-id="${escapeHtml(r.id)}">excluir</button>` : ''}</td>` : '';
      return `<tr>${notifCell}${detalhesCell}${cells}${actions}</tr>`;
    }).join('');

    if (cfg.notificacoes){
      tbody.querySelectorAll('.notif-lido-btn').forEach(btn=>{
        btn.addEventListener('click', async (e)=>{
          e.stopPropagation();
          btn.disabled = true;
          const eventoIds = (btn.dataset.eventoIds||'').split(',').filter(Boolean);
          const ok = await marcarNotifLida(cfg.notifLidosTable, eventoIds, []);
          if (!ok){ btn.disabled = false; return; }
          // Some do estado em memória também, sem precisar recarregar a tabela inteira.
          Object.values(eventosPorRegistro).forEach(reg=>{
            reg.novo = reg.novo.filter(id=>!eventoIds.includes(id));
            reg.detalhes = reg.detalhes.filter(id=>!eventoIds.includes(id));
            Object.keys(reg.campos).forEach(k=>{
              reg.campos[k] = reg.campos[k].filter(id=>!eventoIds.includes(id));
              if (!reg.campos[k].length) delete reg.campos[k];
            });
          });
          atualizarBotaoMarcarTudoTabela();
          // Reconstrói as linhas: garante que o pontinho do "detalhes" também
          // suma (ele não anima junto, já que não é um selo comum) e que a
          // linha se ajuste certinho de tamanho.
          aplicarFiltrosOrdenacao();
        });
      });
    }
  }

  aplicarFiltrosAtual = aplicarFiltrosOrdenacao;
  aplicarFiltrosOrdenacao();
  ativarRedimensionamentoColunas(root.querySelector('.tabela-principal table'), tableName);
  atualizarIndicadoresOrdenacao();
  atualizarIndicadoresFiltro();

  const filterTextEl = document.getElementById('filter-text');
  filterTextEl.value = state.busca;
  filterTextEl.addEventListener('input', (e)=>{
    state.busca = e.target.value.toLowerCase();
    salvarEstado();
    aplicarFiltrosOrdenacao();
  });

  if (cfg.notificacoes){
    document.getElementById('chk-nao-vistos').addEventListener('change', (e)=>{
      state.somenteNaoVistos = e.target.checked;
      salvarEstado();
      aplicarFiltrosOrdenacao();
    });
  }

  document.getElementById('btn-limpar-filtros').addEventListener('click', ()=>{
    state.busca = ''; state.colFiltros = {}; state.sortRules = []; state.somenteNaoVistos = false;
    filterTextEl.value = '';
    if (cfg.notificacoes) document.getElementById('chk-nao-vistos').checked = false;
    localStorage.removeItem(chaveEstado);
    atualizarIndicadoresOrdenacao();
    atualizarIndicadoresFiltro();
    aplicarFiltrosOrdenacao();
    toast('Filtros e ordenação removidos.');
  });

  if (cfg.notificacoes){
    const btnTudoTabela = document.getElementById('btn-marcar-tudo-lido-tabela');
    if (btnTudoTabela){
      btnTudoTabela.addEventListener('click', async ()=>{
        btnTudoTabela.disabled = true;
        const eventoIds = todosOsEventosDaTabela();
        const ok = await marcarNotifLida(cfg.notifLidosTable, eventoIds, []);
        if (!ok){ btnTudoTabela.disabled = false; return; }
        Object.values(eventosPorRegistro).forEach(reg=>{ reg.novo = []; reg.detalhes = []; reg.campos = {}; });
        btnTudoTabela.style.display = 'none';
        btnTudoTabela.disabled = false;
        // Re-renderiza a tabela inteira: o pontinho do botão "detalhes" não
        // tem uma classe própria pra animar/remover (só os selos de "Novo"/
        // "Alterado" têm), então só some de verdade recriando as linhas.
        aplicarFiltrosOrdenacao();
        toast('Tudo marcado como lido.');
      });
    }
  }

  document.querySelectorAll('.th-sort').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const key = btn.dataset.key;
      const existente = state.sortRules.find(r=>r.key===key);
      if (e.shiftKey){
        // Adiciona/alterna esta coluna como mais uma regra de ordenação, sem mexer nas outras
        if (existente) existente.dir *= -1;
        else state.sortRules.push({ key, dir:1 });
      } else {
        // Clique normal: essa coluna passa a ser a única regra (ou inverte se já era a única)
        if (state.sortRules.length===1 && existente) existente.dir *= -1;
        else state.sortRules = [{ key, dir:1 }];
      }
      atualizarIndicadoresOrdenacao();
      salvarEstado();
      aplicarFiltrosOrdenacao();
    });
  });

  document.querySelectorAll('.th-filtro').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const key = btn.dataset.key;
      const f = cfg.fields.find(x=>x.key===key);
      const valoresDisponiveis = Array.from(new Set(data.map(r=>String(valorExibivel(r, f))))).sort();
      abrirFlutuante(btn, 'msel-panel-float', (painel)=>{
        const marcados = state.colFiltros[key] || new Set(valoresDisponiveis);
        function montarLista(filtroTexto){
          const itens = valoresDisponiveis
            .map(v=>({ v, rotulo: f.edit==='date' ? (fmtDate(v) || '(vazio)') : (v || '(vazio)') }))
            .filter(({rotulo})=>!filtroTexto || rotulo.toLowerCase().includes(filtroTexto));
          return itens.map(({v,rotulo})=>{
            const tipoFiltro = f.edit==='problem-type' ? reclamacoesIndustriaTipos.find(t=>rotuloTipoProblema(t.id)===v) : null;
            const classeFiltroProblema = tipoFiltro?.classe || (f.edit==='problem-type' && v.endsWith(' — Sem definir') ? v.slice(0, -' — Sem definir'.length) : '');
            const dot = f.edit==='problem-type' && classeFiltroProblema ? `<span class="dd-dot" data-csp-style="background:${corMenuParaTema(corDaClasseProblema(classeFiltroProblema))};flex-shrink:0;"></span>` : (f.edit==='select' && v ? `<span class="dd-dot" data-csp-style="background:${corMenuParaTema(corDaOpcao(f.group, v))};flex-shrink:0;"></span>` : '');
            return `<label><input type="checkbox" value="${escapeHtml(v)}" ${marcados.has(v)?'checked':''}> ${dot}${escapeHtml(rotulo)}</label>`;
          }).join('') || '<div class="csp-inline-014">Nenhum valor encontrado.</div>';
        }
        painel.innerHTML = `
          <input type="text" class="cell-input csp-inline-015" id="busca-valores" placeholder="Buscar valor…" />
          <div class="csp-inline-016">
            <button type="button" class="link-btn" data-acao="todos">Marcar todos</button>
            <button type="button" class="link-btn" data-acao="nenhum">Desmarcar todos</button>
          </div>
          <div class="filtro-lista">${montarLista('')}</div>
        `;
        function religarCheckboxes(){
          painel.querySelectorAll('.filtro-lista input[type=checkbox]').forEach(cb=>{
            cb.addEventListener('change', ()=>{
              if (!state.colFiltros[key]) state.colFiltros[key] = new Set(valoresDisponiveis);
              if (cb.checked) state.colFiltros[key].add(cb.value); else state.colFiltros[key].delete(cb.value);
              if (state.colFiltros[key].size === valoresDisponiveis.length) delete state.colFiltros[key];
              atualizarIndicadoresFiltro();
              salvarEstado();
              aplicarFiltrosOrdenacao();
            });
          });
        }
        religarCheckboxes();
        painel.querySelector('[data-acao="todos"]').addEventListener('click', ()=>{
          delete state.colFiltros[key];
          painel.querySelectorAll('.filtro-lista input[type=checkbox]').forEach(cb=>cb.checked=true);
          atualizarIndicadoresFiltro(); salvarEstado(); aplicarFiltrosOrdenacao();
        });
        painel.querySelector('[data-acao="nenhum"]').addEventListener('click', ()=>{
          state.colFiltros[key] = new Set();
          painel.querySelectorAll('.filtro-lista input[type=checkbox]').forEach(cb=>cb.checked=false);
          atualizarIndicadoresFiltro(); salvarEstado(); aplicarFiltrosOrdenacao();
        });
        painel.querySelector('#busca-valores').addEventListener('input', (e)=>{
          painel.querySelector('.filtro-lista').innerHTML = montarLista(e.target.value.toLowerCase());
          religarCheckboxes();
        });
      });
    });
  });

  if (podeCriar){
    document.getElementById('btn-new').addEventListener('click', async ()=>{
      markGestaoLocalChange();
      const defaults = {};
      cfg.fields.forEach(f=>{
        if (f.edit==='percent') defaults[f.key]=0;
        if (f.edit==='text' && !f.readonly) defaults[f.key]='Novo — clique para editar';
      });
      const tabelasComFranquiaObrigatoria = ['chamados_sac','reclamacoes_industria','pedidos_agendamentos_industria'];
      if (tabelasComFranquiaObrigatoria.includes(tableName)){
        // Estado operacional inicial. A franquia pode ser definida depois
        // pelo responsÃƒÂ¡vel, sem transformar Ã¢â‚¬Å“InternoÃ¢â‚¬Â em dado de negÃƒÂ³cio.
        defaults.franquia = null;
        defaults.franquia_id = null;
      }
      if (tableName==='chamados_sac'){
        defaults.status = opcoesDe('chamados_status').find(o=>o.ativo !== false)?.valor || 'Aberto';
      }
      if (tableName==='projetos'){
        defaults.status = null;
      }
      if (['vendas_expansao','reclamacoes_industria','pedidos_agendamentos_industria'].includes(tableName)){
        defaults.criado_por = currentUser.id;
      }
      if (['chamados_sac','vendas_expansao','reclamacoes_industria','pedidos_agendamentos_industria'].includes(tableName)){
        // Mantém compatibilidade com bases que ainda não têm default no id.
        defaults.id = crypto.randomUUID();
      }
      let novoId = null;
      let novaLinha = null;
      if (tableName==='chamados_sac'){
        // Gera o id no navegador em vez de pedir pro banco "devolver" a linha
        // recém-criada: pra papel "usuario", a política de leitura só libera
        // depois que ele vira responsável (próximo passo), então pedir a
        // linha de volta na mesma hora do INSERT falharia por RLS.
        novoId = crypto.randomUUID();
        defaults.id = novoId;
        const { error } = await sb.from(tableName).insert(defaults);
        if (error) return toast('Erro ao criar: '+error.message, true);
        // Quem cria já entra como responsável, senão não conseguiria ver o
        // que acabou de criar (regra de RLS pra papel "usuario").
        await sb.from('chamados_sac_responsaveis').insert({ chamado_id: novoId, profile_id: currentUser.id });
        const { data: linhaCriada, error: errBusca } = await sb.from(tableName).select('*').eq('id', novoId).single();
        if (!errBusca) novaLinha = linhaCriada;
      } else {
        // Pede a linha de volta já com os valores calculados pelo banco
        // (número sequencial, timestamps, etc.) num único round-trip.
        const { data: linhaCriada, error } = await sb.from(tableName).insert(defaults).select().single();
        if (error) return toast('Erro ao criar: '+error.message, true);
        novaLinha = linhaCriada;
      }
      if (novaLinha && tableName==='projetos'){
        const { error: respError } = await sb.from('projetos_responsaveis').insert({ projeto_id: novaLinha.id, profile_id: currentUser.id });
        if (respError) return toast('Registro criado, mas não foi possível definir o responsável: '+respError.message, true);
      }
      if (novaLinha){
        // Insere só na tela atual (sem recarregar tudo) e já reordena/filtra
        // igual às demais linhas — é por isso que ela "se ajusta sozinha"
        // conforme você for preenchendo os campos.
        novaLinha.__resp_ids = ['chamados_sac','projetos'].includes(tableName) ? [currentUser.id] : [];
        data.unshift(novaLinha);
        aplicarFiltrosOrdenacao();
        toast('Registro criado — preencha os campos na linha; ela se ajusta sozinha pela ordenação e pelos filtros.');
      } else {
        toast('Registro criado — edite os campos na linha.');
        navigateTo(currentView);
      }
    });
  }

  // Atualização silenciosa (chamada pelo poller a cada alguns segundos):
  // só refaz a consulta e atualiza as linhas, sem recriar cabeçalho/filtros.
  currentSilentRefresh = async ()=>{
    const { data: novosDados, error: err2 } = await sb.from(tableName).select('*').order('created_at', { ascending:false });
    if (err2) return;
    data.length = 0; data.push(...novosDados);
    if (cfg.respTable){
      const ids = data.map(r=>r.id);
      if (ids.length){
        const { data: resp } = await sb.from(cfg.respTable).select('*').in(cfg.respFk, ids);
        data.forEach(r=>{ r.__resp_ids = (resp||[]).filter(x=>x[cfg.respFk]===r.id).map(x=>x.profile_id); });
      } else { data.forEach(r=>{ r.__resp_ids = []; }); }
    }
    for (let i = data.length - 1; i >= 0; i--){ if (!registroVisivel(perm, data[i])) data.splice(i, 1); }
    if (cfg.notificacoes) eventosPorRegistro = await carregarNotificacoes();
    await loadProfilesCache();
    renderGestaoWhenSafe(aplicarFiltrosOrdenacao);
    if (cfg.notificacoes) atualizarBotaoMarcarTudoTabela();
  };
}

window.deleteRow = async function(tableName, id){
  if (!(await confirmarAcao('Tem certeza que deseja excluir este registro? Essa ação fica registrada no log de auditoria.'))) return;
  markGestaoLocalChange();
  const { error } = await sb.from(tableName).delete().eq('id', id);
  if (error) return toast('Erro ao excluir: '+error.message, true);
  toast('Registro excluído.');
  navigateTo(currentView);
};

// ── Programação Carregamento (calendário) ──────────────────────────────────
const MESES_CAL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DIAS_SEMANA_CAL = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
function pad2(n){ return String(n).padStart(2,'0'); }
// Campo "Hora" com máscara fixa "00:00": o ":" nunca se move, cada dígito
// digitado substitui o "0" da posição atual e o cursor avança sozinho
// (pulando o ":"). Backspace zera a posição e volta o cursor. Enquanto o
// campo estiver vazio, o placeholder "00:00" continua visível — só vira
// valor de verdade quando a pessoa digita o primeiro dígito.
function normalizarHora24(v){
  const digitos = String(v||'').replace(/\D/g,'').slice(0,4);
  if (!digitos) return '';
  let h, m;
  if (digitos.length <= 2){ h = digitos; m = '00'; }
  else { h = digitos.slice(0, digitos.length-2); m = digitos.slice(-2); }
  const hh = Math.min(23, parseInt(h,10)||0);
  const mm = Math.min(59, parseInt(m,10)||0);
  return pad2(hh) + ':' + pad2(mm);
}
function ligarCampoHora(el){
  const SLOTS = [0,1,3,4]; // índices editáveis em "HH:MM" (2 é o ":")
  let slotAtual = 0; // rastreado à parte — reler do DOM depois de trocar
                      // el.value é ambíguo (o navegador reposiciona o
                      // cursor pro fim do valor sozinho) e foi a causa do bug
  function valido(v){ return /^\d{2}:\d{2}$/.test(v); }
  function proximoSlot(idx){ const i = SLOTS.indexOf(idx); return SLOTS[Math.min(i+1, SLOTS.length-1)]; }
  function slotAnterior(idx){ const i = SLOTS.indexOf(idx); return SLOTS[Math.max(i-1, 0)]; }
  function slotMaisProximoDoClique(pos){
    if (pos<=1) return 0;
    if (pos===2) return 1;
    if (pos===3) return 3;
    return 4;
  }
  function selecionar(idx){ slotAtual = idx; try{ el.setSelectionRange(idx, idx+1); }catch(e){} }

  el.addEventListener('focus', ()=>{
    if (valido(el.value)) requestAnimationFrame(()=>selecionar(0));
    else slotAtual = 0;
  });
  el.addEventListener('click', ()=>{
    setTimeout(()=>{
      if (!valido(el.value)) return;
      selecionar(slotMaisProximoDoClique(el.selectionStart));
    }, 0);
  });
  el.addEventListener('keydown', (e)=>{
    if (e.ctrlKey || e.metaKey || e.altKey || e.key==='Tab') return;
    if (e.key==='ArrowLeft'){ e.preventDefault(); if (valido(el.value)) selecionar(slotAnterior(slotAtual)); return; }
    if (e.key==='ArrowRight'){ e.preventDefault(); if (valido(el.value)) selecionar(proximoSlot(slotAtual)); return; }
    if (/^[0-9]$/.test(e.key)){
      e.preventDefault();
      if (!valido(el.value)){ el.value = '00:00'; slotAtual = 0; }
      const chars = el.value.split('');
      const idx = slotAtual;
      // trava dígitos que tornariam a hora/minuto inválidos (ex.: só deixa
      // "2_" virar 20-23, nunca 2_ maior que isso)
      if (idx===0 && e.key>'2') return;
      if (idx===1 && chars[0]==='2' && e.key>'3') return;
      if (idx===3 && e.key>'5') return;
      chars[idx] = e.key;
      el.value = chars.join('');
      selecionar(proximoSlot(idx));
      return;
    }
    if (e.key==='Backspace' || e.key==='Delete'){
      e.preventDefault();
      if (!valido(el.value)){ el.value = ''; slotAtual = 0; return; }
      const chars = el.value.split('');
      const idx = e.key==='Backspace' ? slotAnterior(slotAtual) : slotAtual;
      chars[idx] = '0';
      el.value = chars.join('');
      selecionar(idx);
      return;
    }
    if (e.key.length===1) e.preventDefault(); // bloqueia letras/símbolos
  });
  el.addEventListener('blur', ()=>{
    if (el.value && !valido(el.value)) el.value = normalizarHora24(el.value) || '';
  });
}
function isoLocal(y,m,d){ return `${y}-${pad2(m+1)}-${pad2(d)}`; }

async function viewProgramacaoCarregamento(){
  document.getElementById('page-title').textContent = 'Programação Carregamento';
  document.getElementById('page-sub').textContent = 'Calendário de carregamentos agendados, cada um designado a uma franquia.';

  const perm = permissoesTabela('agendamentos_carregamento');
  const podeCriar = !!perm.criar;
  const podeEditarAlgo = !!perm.editar;
  const podeExcluirAlgo = !!perm.excluir;

  const [{ data, error }, { data: feriadosData, error: errFer }] = await Promise.all([
    sb.from('agendamentos_carregamento').select('*').order('data').order('hora'),
    sb.from('feriados').select('*'),
  ]);
  if (error) throw error;
  if (errFer) console.error(errFer);
  const dados = data.filter(r=>registroVisivel(perm, r));
  const feriadosMap = {};
  (feriadosData||[]).forEach(f=>{ feriadosMap[f.data] = f.descricao || 'Feriado'; });

  function ehFimDeSemana(d){ const dia = d.getDay(); return dia===0 || dia===6; }
  function infoEspecialDia(iso, d){
    if (feriadosMap[iso] !== undefined) return { tipo:'feriado', texto: feriadosMap[iso] };
    if (ehFimDeSemana(d)) return { tipo:'fds', texto:'Fim de semana' };
    return null;
  }

  // Campo "Hora" sempre no formato 24h "00:00" — a máscara/normalização e o
  // relógio de ponteiro estão em funções globais (ligarCampoHora,
  // normalizarHora24, ligarCampoHoraComRelogio), reaproveitadas em vários
  // pontos do app.

  const hoje = new Date();
  const state = { ano: hoje.getFullYear(), mes: hoje.getMonth(), visao:'mes', franquia:'', status:'', capacidade:3 };
  const opcoesFranquia = opcoesDe('chamados_franquia').map(o=>o.valor);
  const opcoesStatus = opcoesDe('carregamento_status').map(o=>o.valor);

  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="section-note">Clique em um dia pra ver, editar ou agendar carregamentos. Dias em vermelho são feriados ou fins de semana — o app avisa antes de confirmar um agendamento neles.</div>
    <div class="pcarg-toolbar">
      <button type="button" class="pcarg-nav-btn" id="pcarg-prev" title="Mês anterior">‹</button>
      <div class="pcarg-titulo" id="pcarg-titulo"></div>
      <button type="button" class="pcarg-nav-btn" id="pcarg-next" title="Próximo mês">›</button>
      <button type="button" class="btn csp-inline-003" id="pcarg-btn-hoje">Hoje</button>
      <div class="dash-subtabs" aria-label="Visão do calendário"><button type="button" class="dash-subtab active" data-pcarg-visao="mes">Mês</button><button type="button" class="dash-subtab" data-pcarg-visao="semana">Semana</button></div>
      <span id="pcarg-filtro-franquia"></span>
      <span id="pcarg-filtro-status"></span>
      <label class="pcarg-capacidade-input" for="pcarg-capacidade">Capacidade/dia <input id="pcarg-capacidade" class="cell-number" type="number" min="1" step="1" value="${state.capacidade}" inputmode="numeric" /></label>
      <div class="spacer"></div>
    </div>
    <div class="pcarg-grid" id="pcarg-grid"></div>
  `;

  function renderGrid(){
    document.getElementById('pcarg-titulo').textContent = state.visao==='mes' ? `${MESES_CAL[state.mes]} ${state.ano}` : `Semana de ${String(state.inicioSemana?.getDate()||hoje.getDate()).padStart(2,'0')}/${String((state.inicioSemana?.getMonth()??hoje.getMonth())+1).padStart(2,'0')}`;
    const dadosFiltrados = dados.filter(r=>(!state.franquia || r.franquia===state.franquia) && (!state.status || r.status===state.status));
    const primeiroDoMes = new Date(state.ano, state.mes, 1);
    const inicioGrid = state.visao==='semana' ? new Date(state.inicioSemana) : new Date(state.ano, state.mes, 1 - primeiroDoMes.getDay());
    const hojeStr = isoLocal(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    let html = DIAS_SEMANA_CAL.map(d=>`<div class="pcarg-cabecalho">${d}</div>`).join('');
    for (let i=0;i<(state.visao==='semana'?7:42);i++){
      const d = new Date(inicioGrid); d.setDate(inicioGrid.getDate()+i);
      const iso = isoLocal(d.getFullYear(), d.getMonth(), d.getDate());
      const foraMes = state.visao==='mes' && d.getMonth() !== state.mes;
      const especial = infoEspecialDia(iso, d);
      const totalDoDia = dados.filter(r=>r.data===iso);
      const doDia = dadosFiltrados.filter(r=>r.data===iso).sort((a,b)=>String(a.hora||'').localeCompare(String(b.hora||'')));
      const max = 3;
      const chips = doDia.slice(0,max).map(r=>{
        const cor = corDaOpcao('chamados_franquia', r.franquia) || '#7f9a72';
        return `<div class="pcarg-chip" data-csp-style="background:${corMenuParaTema(cor)};color:${textoParaCorDeMenu(cor)}" title="${escapeHtml(r.franquia||'')}${r.status?' — '+escapeHtml(r.status):''}">${r.status?`<span class="pcarg-chip-status" data-csp-style="background:${corMenuParaTema(corDaOpcao('carregamento_status', r.status))}"></span>`:''}<span class="pcarg-chip-texto">${r.hora?escapeHtml(r.hora)+' · ':''}${escapeHtml(ehSemDefinir(r.franquia) ? SEM_DEFINIR : r.franquia)}</span></div>`;
      }).join('');
      const mais = doDia.length>max ? `<div class="pcarg-chip-mais">+${doDia.length-max} mais</div>` : '';
      const sobrecarga = !especial && totalDoDia.length > state.capacidade;
      html += `<div class="pcarg-dia${foraMes?' fora-mes':''}${iso===hojeStr?' hoje':''}${especial?' pcarg-especial':''}${sobrecarga?' sobrecarregado':''}" data-dia="${iso}" ${especial?`title="${escapeHtml(especial.texto)}"`:''}>
        <div class="pcarg-dia-num">${d.getDate()}${especial?`<span class="pcarg-dia-tag">${especial.tipo==='feriado'?'feriado':'fim de semana'}</span>`:''}${especial?'':`<span class="pcarg-capacidade">${totalDoDia.length}/${state.capacidade}${sobrecarga?' · sobrecarga':''}</span>`}</div>
        <div class="pcarg-agendamentos">${chips}${mais}</div>
        ${(podeCriar||podeEditarAlgo)?'<div class="pcarg-dia-add">+ ver / agendar</div>':''}
      </div>`;
    }
    const grid = document.getElementById('pcarg-grid');
    grid.className = state.visao==='semana' ? 'pcarg-week' : 'pcarg-grid';
    grid.innerHTML = html;
    grid.querySelectorAll('.pcarg-dia').forEach(el=>{
      el.addEventListener('click', ()=> abrirDiaCarregamento(el.dataset.dia));
    });
  }

  function abrirDiaCarregamento(iso){
    const modal = document.getElementById('modal-content');
    modal.classList.add('modal-wide');
    const [ano, mes, dia] = iso.split('-');
    const dObj = new Date(iso+'T00:00:00');
    const especial = infoEspecialDia(iso, dObj);

    function montarLista(){
      const doDia = dados.filter(r=>r.data===iso).sort((a,b)=>String(a.hora||'').localeCompare(String(b.hora||'')));
      if (!doDia.length) return `<div class="section-note">Nenhum carregamento agendado neste dia.</div>`;
      return doDia.map(r=>{
        const cor = corDaOpcao('chamados_franquia', r.franquia) || '#7f9a72';
        return `<div class="pcarg-agend-item" data-id="${r.id}">
          <div class="pcarg-agend-cor" data-csp-style="background:${corMenuParaTema(cor)}"></div>
          <div class="csp-inline-017">
            ${podeEditarAlgo ? `
              <div class="csp-inline-018">
                <div data-franquia-wrap class="csp-inline-019"></div>
                <div class="hora-field-wrap"><input type="text" inputmode="numeric" class="cell-input pcarg-hora-input" data-hora value="${escapeHtml(r.hora||'')}" placeholder="00:00" maxlength="5" required /><button type="button" class="hora-clock-btn" data-hora-clock title="Escolher hora no relógio">🕐</button></div>
                <div data-status-wrap class="csp-inline-020"></div>
                <div class="csp-inline-021">Mover pra<span data-mover-wrap></span></div>
              </div>
              <textarea class="cell-input" data-obs rows="2" placeholder="Observações">${escapeHtml(r.observacoes||'')}</textarea>
            ` : `
              <div class="csp-inline-022">${escapeHtml(ehSemDefinir(r.franquia) ? SEM_DEFINIR : r.franquia)}${r.hora?' · '+escapeHtml(r.hora):''}</div>
              ${r.observacoes ? `<div class="csp-inline-023">${escapeHtml(r.observacoes)}</div>` : ''}
              ${r.status ? `<div>${statusBadgeGeneric('carregamento_status', r.status)}</div>` : ''}
            `}
          </div>
          ${podeExcluirAlgo?`<button type="button" class="icon-btn" data-del="${r.id}">excluir</button>`:''}
        </div>`;
      }).join('');
    }

    modal.innerHTML = `
      <div class="modal-fixed-head">
        <h3 class="csp-inline-024">Carregamentos — ${dia}/${mes}/${ano}</h3>
        ${especial ? `<div class="section-note csp-inline-025">⚠ Este dia é ${especial.tipo==='feriado' ? `um feriado (${escapeHtml(especial.texto)})` : 'fim de semana'}.</div>` : ''}
      </div>
      <div class="modal-scroll-body">
        <div id="pcarg-dia-lista">${montarLista()}</div>
        ${podeCriar ? `
        <h3 class="csp-inline-026">+ Agendar carregamento</h3>
        <div class="field"><label>Franquia</label><div id="novo-franquia-wrap"></div></div>
        <div class="field"><label>Hora</label><div class="hora-field-wrap"><input type="text" inputmode="numeric" class="cell-input pcarg-hora-input" id="novo-hora" placeholder="00:00" maxlength="5" required /><button type="button" class="hora-clock-btn" id="novo-hora-clock" title="Escolher hora no relógio">🕐</button></div></div>
        <div class="field"><label>Observações</label><textarea class="cell-input" id="novo-obs" rows="2"></textarea></div>
        ` : ''}
        ${podeEditarAlgo ? `
        <h3 class="csp-inline-026">Feriado</h3>
        <div class="field csp-inline-027">
          <input type="checkbox" id="feriado-check" ${especial && especial.tipo==='feriado' ? 'checked' : ''} class="csp-inline-028" />
          <label for="feriado-check" class="csp-inline-029">Marcar este dia como feriado</label>
        </div>
        <input type="text" class="cell-input csp-inline-030" id="feriado-desc" placeholder="Descrição do feriado (opcional)" value="${escapeHtml(especial && especial.tipo==='feriado' ? especial.texto : '')}" />
        <button class="btn csp-inline-031" id="btn-salvar-feriado" type="button">Salvar feriado</button>
        ` : ''}
      </div>
      <div class="modal-fixed-foot">
        ${podeCriar ? `<button class="btn btn-primary csp-inline-032" id="btn-agendar">Agendar</button>` : ''}
        <button class="btn btn-ghost" data-action="close-modal">Fechar</button>
      </div>
    `;
    document.getElementById('modal-backdrop').classList.add('active');

    function ligarItens(){
      modal.querySelectorAll('[data-del]').forEach(btn=>{
        btn.addEventListener('click', async ()=>{
          if (!(await confirmarAcao('Excluir este agendamento?'))) return;
          const { error: errDel } = await sb.from('agendamentos_carregamento').delete().eq('id', btn.dataset.del);
          if (errDel) return toast('Erro: '+errDel.message, true);
          const idx = dados.findIndex(x=>x.id===btn.dataset.del);
          if (idx>-1) dados.splice(idx,1);
          toast('Agendamento excluído.');
          document.getElementById('pcarg-dia-lista').innerHTML = montarLista();
          ligarItens();
          renderGrid();
        });
      });

      if (podeEditarAlgo){
        modal.querySelectorAll('.pcarg-agend-item').forEach(itemEl=>{
          const id = itemEl.dataset.id;
          const registro = dados.find(x=>x.id===id);
          if (!registro) return;

          const franquiaWrap = itemEl.querySelector('[data-franquia-wrap]');
          if (franquiaWrap){
            franquiaWrap.innerHTML = buildSimplePicker(ehSemDefinir(registro.franquia) ? '' : registro.franquia, opcoesComSemDefinir(opcoesDe('chamados_franquia').map(o=>({value:o.valor, label:o.valor, dot:corMenuParaTema(o.cor)}))), async (v)=>{
              const opcaoFranquia = opcoesDe('chamados_franquia').find(o=>o.valor===v);
              const { error: errUp } = await sb.from('agendamentos_carregamento').update({ franquia: v, franquia_id: opcaoFranquia?.franquia_id || null }).eq('id', id);
              if (errUp) return toast('Erro: '+errUp.message, true);
              registro.franquia = v;
              registro.franquia_id = opcaoFranquia?.franquia_id || null;
              toast('Franquia atualizada.');
              renderGrid();
            }, { placeholder:'Franquia' });
          }
          const statusWrap = itemEl.querySelector('[data-status-wrap]');
          if (statusWrap){
            statusWrap.innerHTML = buildSelDropdown({
              grupo:'carregamento_status', valorAtual: registro.status, permitirVazio:true,
              onSelect: async (v)=>{
                const { error: errUp } = await sb.from('agendamentos_carregamento').update({ status: v }).eq('id', id);
                if (errUp) return toast('Erro: '+errUp.message, true);
                registro.status = v;
                toast('Status atualizado.');
              },
            });
          }
          const horaInput = itemEl.querySelector('[data-hora]');
          const horaClockBtn = itemEl.querySelector('[data-hora-clock]');
          if (horaInput && horaClockBtn){
            ligarCampoHoraComRelogio(horaInput, horaClockBtn, async (novoValor)=>{
              const v = novoValor.trim();
              if (!v){ toast('A hora é obrigatória.', true); horaInput.value = registro.hora || ''; return; }
              if (v === (registro.hora||null)) return;
              const { error: errUp } = await sb.from('agendamentos_carregamento').update({ hora: v }).eq('id', id);
              if (errUp) return toast('Erro: '+errUp.message, true);
              registro.hora = v;
              flashSaved(horaInput);
              renderGrid();
            });
          }
          const obsInput = itemEl.querySelector('[data-obs]');
          if (obsInput) obsInput.addEventListener('blur', async ()=>{
            const v = obsInput.value.trim() || null;
            if (v === (registro.observacoes||null)) return;
            const { error: errUp } = await sb.from('agendamentos_carregamento').update({ observacoes: v }).eq('id', id);
            if (errUp) return toast('Erro: '+errUp.message, true);
            registro.observacoes = v;
            flashSaved(obsInput);
          });
          const moverWrap = itemEl.querySelector('[data-mover-wrap]');
          if (moverWrap){
            moverWrap.innerHTML = buildCalendarField(registro.data, async (novaData)=>{
              if (!novaData || novaData === registro.data) return false;
              const novaDataObj = new Date(novaData+'T00:00:00');
              const especialNovo = infoEspecialDia(novaData, novaDataObj);
              if (especialNovo){
                const dataFmt = novaData.split('-').reverse().join('/');
                const msg = especialNovo.tipo==='feriado'
                  ? `O dia ${dataFmt} é feriado (${especialNovo.texto}). Confirma mover o carregamento pra essa data?`
                  : `O dia ${dataFmt} é fim de semana. Confirma mover o carregamento pra essa data?`;
                if (!(await confirmarAcao(msg, 'Mover mesmo assim'))){
                  document.getElementById('pcarg-dia-lista').innerHTML = montarLista();
                  ligarItens();
                  return false;
                }
              } else if (!(await confirmarAcao(`Confirma mover este carregamento pro dia ${novaData.split('-').reverse().join('/')}?`, 'Mover'))){
                document.getElementById('pcarg-dia-lista').innerHTML = montarLista();
                ligarItens();
                return false;
              }
              const { error: errUp } = await sb.from('agendamentos_carregamento').update({ data: novaData }).eq('id', id);
              if (errUp){
                toast('Erro: '+errUp.message, true);
                document.getElementById('pcarg-dia-lista').innerHTML = montarLista();
                ligarItens();
                return false;
              }
              registro.data = novaData;
              toast('Carregamento movido de data.');
              document.getElementById('pcarg-dia-lista').innerHTML = montarLista();
              ligarItens();
              renderGrid();
              return true;
            });
          }
        });
      }
    }
    ligarItens();

    if (podeCriar){
      let franquiaEscolhida = '';
  let franquiaEscolhidaId = null;
      document.getElementById('novo-franquia-wrap').innerHTML = buildSimplePicker('', opcoesDe('chamados_franquia').map(o=>({value:o.valor, label:o.valor, dot:corMenuParaTema(o.cor)})), (v)=>{ franquiaEscolhida = v; franquiaEscolhidaId = opcoesDe('chamados_franquia').find(o=>o.valor===v)?.franquia_id || null; }, { placeholder:'Selecione a franquia' });
      ligarCampoHoraComRelogio(document.getElementById('novo-hora'), document.getElementById('novo-hora-clock'));
      document.getElementById('btn-agendar').addEventListener('click', async ()=>{
        if (!franquiaEscolhida) return toast('Escolha a franquia.', true);
        const horaValor = normalizarHora24(document.getElementById('novo-hora').value);
        if (!horaValor) return toast('A hora é obrigatória.', true);
        if (especial){
          const msg = especial.tipo==='feriado'
            ? `Esse dia é feriado (${especial.texto}). Confirma o agendamento mesmo assim?`
            : `Esse dia é fim de semana. Confirma o agendamento mesmo assim?`;
          if (!(await confirmarAcao(msg, 'Agendar mesmo assim'))) return;
        }
        const registro = { data: iso, hora: horaValor, franquia: franquiaEscolhida, franquia_id: franquiaEscolhidaId, observacoes: document.getElementById('novo-obs').value.trim()||null, criado_por: currentUser.id };
        const { data: novo, error: errIns } = await sb.from('agendamentos_carregamento').insert(registro).select().single();
        if (errIns) return toast('Erro ao agendar: '+errIns.message, true);
        dados.push(novo);
        toast('Carregamento agendado.');
        document.getElementById('pcarg-dia-lista').innerHTML = montarLista();
        ligarItens();
        renderGrid();
        document.getElementById('novo-hora').value = '';
        document.getElementById('novo-obs').value = '';
      });
    }

    if (podeEditarAlgo){
      document.getElementById('btn-salvar-feriado').addEventListener('click', async ()=>{
        const marcado = document.getElementById('feriado-check').checked;
        const desc = document.getElementById('feriado-desc').value.trim();
        if (marcado){
          const { error: errFerUp } = await sb.from('feriados').upsert({ data: iso, descricao: desc || 'Feriado' }, { onConflict:'data' });
          if (errFerUp) return toast('Erro ao salvar feriado: '+errFerUp.message, true);
          feriadosMap[iso] = desc || 'Feriado';
          toast('Feriado salvo.');
        } else {
          const { error: errFerDel } = await sb.from('feriados').delete().eq('data', iso);
          if (errFerDel) return toast('Erro ao remover feriado: '+errFerDel.message, true);
          delete feriadosMap[iso];
          toast('Feriado removido.');
        }
        renderGrid();
        closeModal();
      });
    }
  }

  document.getElementById('pcarg-filtro-franquia').innerHTML = buildSimplePicker('', [{value:'',label:'Todas as franquias'}, ...opcoesFranquia.map(v=>({value:v,label:v,dot:corMenuParaTema(corDaOpcao('chamados_franquia', v)||'#7f9a72')}))], v=>{ state.franquia=v; renderGrid(); }, { classeExtra:'dash-period-picker' });
  document.getElementById('pcarg-filtro-status').innerHTML = buildSimplePicker('', [{value:'',label:'Todos os status'}, ...opcoesStatus.map(v=>({value:v,label:v,dot:corMenuParaTema(corDaOpcao('carregamento_status', v)||'#7f9a72')}))], v=>{ state.status=v; renderGrid(); }, { classeExtra:'dash-period-picker' });
  renderGrid();
  function semanaDe(data){ const d=new Date(data); d.setHours(0,0,0,0); d.setDate(d.getDate()-d.getDay()); return d; }
  state.inicioSemana = semanaDe(hoje);
  document.getElementById('pcarg-prev').addEventListener('click', ()=>{ if(state.visao==='semana') state.inicioSemana.setDate(state.inicioSemana.getDate()-7); else { state.mes--; if (state.mes<0){ state.mes=11; state.ano--; } } renderGrid(); });
  document.getElementById('pcarg-next').addEventListener('click', ()=>{ if(state.visao==='semana') state.inicioSemana.setDate(state.inicioSemana.getDate()+7); else { state.mes++; if (state.mes>11){ state.mes=0; state.ano++; } } renderGrid(); });
  document.getElementById('pcarg-btn-hoje').addEventListener('click', ()=>{ state.ano = hoje.getFullYear(); state.mes = hoje.getMonth(); state.inicioSemana=semanaDe(hoje); renderGrid(); });
  document.querySelectorAll('[data-pcarg-visao]').forEach(btn=>btn.addEventListener('click', ()=>{ state.visao=btn.dataset.pcargVisao; document.querySelectorAll('[data-pcarg-visao]').forEach(b=>b.classList.toggle('active', b===btn)); renderGrid(); }));
  document.getElementById('pcarg-capacidade').addEventListener('input', e=>{ state.capacidade=Math.max(1, parseInt(e.target.value,10)||1); renderGrid(); });
}

const CAMPOS_MINHAS_TAREFAS = [
  {key:'projeto', label:'Projeto', tipo:'texto'},
  {key:'status', label:'Status', tipo:'select', group:'projetos_status'},
  {key:'prioridade', label:'Prioridade', tipo:'select', group:'projetos_prioridade'},
  {key:'percentual_conclusao', label:'% Concl.', tipo:'percent'},
  {key:'data_inicio', label:'Início', tipo:'date'},
  {key:'previsao_conclusao', label:'Previsão', tipo:'date_readonly'},
];

async function viewMinhasTarefas(){
  document.getElementById('page-title').textContent = 'Minhas Tarefas';
  document.getElementById('page-sub').textContent = 'Projetos atribuídos a você.';

  async function carregar(){
    const { data, error } = await sb.from('projetos').select('*, projetos_responsaveis!inner(profile_id)').eq('projetos_responsaveis.profile_id', currentUser.id).order('created_at',{ascending:false});
    if (error) throw error;
    return data || [];
  }

  // Notificações — "Minhas Tarefas" é um recorte de Projetos, então usa
  // exatamente os mesmos eventos (nada de tabela própria).
  const cfgProjetos = TABLE_CONFIG['projetos'];
  let eventosPorProjeto = {};
  async function carregarNotificacoesMinhasTarefas(){
    const mapa = {};
    if (!dados.length) return mapa;
    const ids = dados.map(r=>r.id);
    const [eventosResult, lidosResult] = await Promise.all([
      sb.from(cfgProjetos.notifEventosTable).select('*').in(cfgProjetos.notifFk, ids),
      sb.from(cfgProjetos.notifLidosTable).select('evento_id').eq('usuario_id', currentUser.id),
    ]);
    if (eventosResult.error || lidosResult.error){
      reportarFalhaNotificacoes('Erro ao carregar Minhas Tarefas', [eventosResult.error, lidosResult.error]);
      return mapa;
    }
    const lidosSet = new Set((lidosResult.data||[]).map(l=>l.evento_id));
    (eventosResult.data||[]).forEach(ev=>{
      if (ev.criado_por === currentUser.id || lidosSet.has(ev.id)) return;
      adicionarEventoNotificacao(mapa, cfgProjetos, ev);
    });
    return mapa;
  }
  function badgeCampoMT(registroId, campoKey){
    const reg = eventosPorProjeto[registroId];
    const ids = reg && reg.campos[campoKey];
    if (!ids || !ids.length) return '';
    return `<div class="notif-badge-wrap" data-evento-badge-group="${ids.join(',')}"><span class="notif-badge notif-badge-editado">Alterado <button type="button" class="notif-lido-btn" data-evento-ids="${ids.join(',')}">lido</button></span></div>`;
  }
  function todosOsEventosMinhasTarefas(){
    const ids = [];
    Object.values(eventosPorProjeto).forEach(reg=>{
      ids.push(...reg.novo, ...reg.detalhes);
      Object.values(reg.campos).forEach(arr=>ids.push(...arr));
    });
    return ids;
  }
  function atualizarBotaoMarcarTudoMT(){
    const btn = document.getElementById('btn-marcar-tudo-lido-mt');
    if (!btn) return;
    const total = todosOsEventosMinhasTarefas().length;
    if (!total){ btn.style.display = 'none'; return; }
    btn.style.display = '';
    btn.textContent = `✓ Marcar tudo como lido (${total})`;
  }

  function valorExibivel(r, campo){
    if (campo.tipo==='percent') return Math.round((r[campo.key]||0)*100);
    return r[campo.key] ?? '';
  }

  const chaveEstado = `tabela_estado_minhas-tarefas_${currentUser.id}`;
  const state = { busca:'', colFiltros:{}, sortRules:[], somenteNaoVistos:false };
  function salvarEstado(){
    const colFiltrosSerializado = {};
    Object.entries(state.colFiltros).forEach(([k,set])=>{ colFiltrosSerializado[k] = Array.from(set); });
    localStorage.setItem(chaveEstado, JSON.stringify({ busca: state.busca, colFiltros: colFiltrosSerializado, sortRules: state.sortRules, somenteNaoVistos: state.somenteNaoVistos }));
  }
  function carregarEstado(){
    try{
      const raw = localStorage.getItem(chaveEstado);
      if (!raw) return;
      const obj = JSON.parse(raw);
      state.busca = obj.busca || '';
      state.sortRules = obj.sortRules || [];
      state.somenteNaoVistos = !!obj.somenteNaoVistos;
      state.colFiltros = {};
      Object.entries(obj.colFiltros || {}).forEach(([k,arr])=>{ state.colFiltros[k] = new Set(arr); });
    }catch(e){}
  }
  carregarEstado();

  function temNaoVisto(r){
    const reg = eventosPorProjeto[r.id];
    return !!(reg && (reg.novo.length || reg.detalhes.length || Object.keys(reg.campos).length));
  }

  let dados = [];

  function montarLinhas(rows){
    const tbody = document.getElementById('tbody');
    if (!tbody) return;
    if (!rows.length){ tbody.innerHTML = `<tr class="empty-row"><td colspan="${CAMPOS_MINHAS_TAREFAS.length}">Nenhum projeto encontrado.</td></tr>`; return; }
    tbody.innerHTML = rows.map(r=>{
      const reg = eventosPorProjeto[r.id];
      const idsRegistro = reg ? [...reg.novo, ...reg.detalhes, ...Object.values(reg.campos).flat()] : [];
      const badgeNovo = idsRegistro.length ? `<div class="notif-badge-wrap" data-evento-badge-group="${idsRegistro.join(',')}"><span class="notif-badge notif-badge-novo">🆕 Novo <button type="button" class="notif-lido-btn" data-evento-ids="${idsRegistro.join(',')}" title="Marca a linha inteira como lida, inclusive o Detalhes">lido</button></span></div>` : '';
      const temDetalhes = reg && reg.detalhes.length;
      return `<tr data-id="${r.id}">
        <td>${badgeNovo}<button type="button" class="link-btn csp-inline-033" data-action="open-details" data-table="projetos" data-record-id="${escapeHtml(r.id)}" title="${temDetalhes?'Tem alteração não lida no Detalhes':''}">${escapeHtml(r.projeto||'')}${temDetalhes?'<span class="nav-dot csp-inline-013"></span>':''}</button></td>
        <td class="cell-colored" data-cell="status"></td>
        <td class="cell-colored" data-cell="prioridade"></td>
        <td data-cell="pct"></td>
        <td data-cell="inicio"></td>
        <td>${badgeCampoMT(r.id,'previsao_conclusao')}${fmtDate(r.previsao_conclusao)}</td>
      </tr>`;
    }).join('');

    rows.forEach(r=>{
      const tr = document.querySelector(`tr[data-id="${r.id}"]`);
      if (!tr) return;
      tr.querySelector('[data-cell="status"]').innerHTML = badgeCampoMT(r.id,'status') + buildSelDropdown({
        grupo: 'projetos_status', valorAtual: r.status, permitirVazio: true,
        validar: validarStatusConclusao('projetos', r.id),
        onSelect: async (v, btn)=>{
          const ok = await saveField('projetos', r.id, 'status', v);
          if (ok){ r.status = v; flashSavedCor(btn); toast('Status atualizado.'); aplicarFiltrosOrdenacao(); }
        },
      });
      tr.querySelector('[data-cell="prioridade"]').innerHTML = badgeCampoMT(r.id,'prioridade') + (r.prioridade
        ? celulaColorida(corDaOpcao('projetos_prioridade', r.prioridade), escapeHtml(r.prioridade))
        : celulaColorida('var(--text-faint)', 'Sem definir'));
      const pctCell = tr.querySelector('[data-cell="pct"]');
      const pctId = 'my_pct_'+r.id;
      const pctAtual = Math.max(0, Math.min(100, Math.round((r.percentual_conclusao||0)*100)));
      const pctEnterClass = progressBarEntryClass(pctId+'_bar');
      pctCell.innerHTML = badgeCampoMT(r.id,'percentual_conclusao') + `<div class="my-task-progress">
        <div class="my-task-progress-input"><input type="number" class="cell-number csp-inline-006" id="${pctId}" value="${pctAtual}" min="0" max="100" step="5" /><span>%</span></div>
        <div class="progress-bar my-task-progress-bar" aria-hidden="true"><div class="${pctEnterClass.trim()}" data-csp-style="width:${pctAtual}%"></div></div>
      </div>`;
      pctCell.querySelector('input').addEventListener('input', (e)=>{
        const pct = Math.max(0, Math.min(100, Number(e.target.value)||0));
        const bar = pctCell.querySelector('.my-task-progress-bar > div');
        if (bar) bar.style.width = `${pct}%`;
      });
      pctCell.querySelector('input').addEventListener('change', async (e)=>{
        const novoValor = parseFloat(e.target.value)/100;
        const ok = await saveField('projetos', r.id, 'percentual_conclusao', novoValor);
        if (ok){ r.percentual_conclusao = novoValor; flashSaved(e.target); toast('% de conclusão atualizado.'); aplicarFiltrosOrdenacao(); }
      });
      const inicioCell = tr.querySelector('[data-cell="inicio"]');
      inicioCell.innerHTML = badgeCampoMT(r.id,'data_inicio');
      inicioCell.insertAdjacentHTML('beforeend', buildCalendarField(r.data_inicio, async (novoValor)=>{
        const ok = await saveField('projetos', r.id, 'data_inicio', novoValor);
        if (ok){ r.data_inicio = novoValor; aplicarFiltrosOrdenacao(); }
        return ok;
      }));
    });

    tbody.querySelectorAll('.notif-lido-btn').forEach(btn=>{
      btn.addEventListener('click', async (e)=>{
        e.stopPropagation();
        btn.disabled = true;
        const eventoIds = (btn.dataset.eventoIds||'').split(',').filter(Boolean);
        const ok = await marcarNotifLida(cfgProjetos.notifLidosTable, eventoIds, []);
        if (!ok){ btn.disabled = false; return; }
        Object.values(eventosPorProjeto).forEach(reg=>{
          reg.novo = reg.novo.filter(id=>!eventoIds.includes(id));
          reg.detalhes = reg.detalhes.filter(id=>!eventoIds.includes(id));
          Object.keys(reg.campos).forEach(k=>{
            reg.campos[k] = reg.campos[k].filter(id=>!eventoIds.includes(id));
            if (!reg.campos[k].length) delete reg.campos[k];
          });
        });
        atualizarBotaoMarcarTudoMT();
        aplicarFiltrosOrdenacao();
      });
    });
  }

  function atualizarIndicadoresOrdenacao(){
    document.querySelectorAll('.sort-arrow').forEach(a=>a.textContent='');
    state.sortRules.forEach((rule, i)=>{
      const arrow = document.querySelector(`.sort-arrow[data-arrow="${rule.key}"]`);
      if (arrow) arrow.textContent = ` ${rule.dir===1?'▲':'▼'}${state.sortRules.length>1 ? (i+1) : ''}`;
    });
  }
  function atualizarIndicadoresFiltro(){
    document.querySelectorAll('.th-filtro').forEach(btn=>{
      btn.classList.toggle('ativo', !!state.colFiltros[btn.dataset.key]);
    });
  }

  function aplicarFiltrosOrdenacao(){
    let rows = dados.slice();
    if (state.somenteNaoVistos){
      rows = rows.filter(temNaoVisto);
    }
    if (state.busca){
      rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(state.busca));
    }
    Object.entries(state.colFiltros).forEach(([key, valoresPermitidos])=>{
      const campo = CAMPOS_MINHAS_TAREFAS.find(x=>x.key===key);
      rows = rows.filter(r => valoresPermitidos.has(String(valorExibivel(r, campo))));
    });
    if (state.sortRules.length){
      const regras = state.sortRules.map(rule => ({ campo: CAMPOS_MINHAS_TAREFAS.find(x=>x.key===rule.key), dir: rule.dir }));
      rows.sort((a,b)=>{
        for (const { campo, dir } of regras){
          let va = valorExibivel(a, campo), vb = valorExibivel(b, campo);
          if (typeof va === 'number' || typeof vb === 'number'){ va = Number(va)||0; vb = Number(vb)||0; }
          else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase(); }
          if (va < vb) return -1*dir;
          if (va > vb) return 1*dir;
        }
        return 0;
      });
    }
    montarLinhas(rows);
  }

  function montarCabecalho(){
    return `<tr>${CAMPOS_MINHAS_TAREFAS.map(c=>`<th><div class="th-inner">
      <button type="button" class="th-sort" data-key="${c.key}">${c.label}<span class="sort-arrow" data-arrow="${c.key}"></span></button>
      <button type="button" class="th-filtro" data-key="${c.key}" title="Filtrar esta coluna">▾</button>
    </div></th>`).join('')}</tr>`;
  }

  function ligarCabecalho(){
    document.querySelectorAll('.th-sort').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const key = btn.dataset.key;
        const existente = state.sortRules.find(r=>r.key===key);
        if (e.shiftKey){
          if (existente) existente.dir *= -1;
          else state.sortRules.push({ key, dir:1 });
        } else {
          if (state.sortRules.length===1 && existente) existente.dir *= -1;
          else state.sortRules = [{ key, dir:1 }];
        }
        atualizarIndicadoresOrdenacao();
        salvarEstado();
        aplicarFiltrosOrdenacao();
      });
    });
    document.querySelectorAll('.th-filtro').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        const key = btn.dataset.key;
        const campo = CAMPOS_MINHAS_TAREFAS.find(x=>x.key===key);
        const valoresDisponiveis = Array.from(new Set(dados.map(r=>String(valorExibivel(r, campo))))).sort();
        abrirFlutuante(btn, 'msel-panel-float', (painel)=>{
          const marcados = state.colFiltros[key] || new Set(valoresDisponiveis);
          function montarLista(filtroTexto){
            const itens = valoresDisponiveis
              .map(v=>({ v, rotulo: campo.tipo==='date' || campo.tipo==='date_readonly' ? (fmtDate(v) || '(vazio)') : (v || '(vazio)') }))
              .filter(({rotulo})=>!filtroTexto || rotulo.toLowerCase().includes(filtroTexto));
            return itens.map(({v,rotulo})=>{
              const dot = (campo.tipo==='select' && v) ? `<span class="dd-dot" data-csp-style="background:${corMenuParaTema(corDaOpcao(campo.group, v))};flex-shrink:0;"></span>` : '';
              return `<label><input type="checkbox" value="${escapeHtml(v)}" ${marcados.has(v)?'checked':''}> ${dot}${escapeHtml(rotulo)}</label>`;
            }).join('') || '<div class="csp-inline-014">Nenhum valor encontrado.</div>';
          }
          painel.innerHTML = `
            <input type="text" class="cell-input csp-inline-015" id="busca-valores" placeholder="Buscar valor…" />
            <div class="csp-inline-016">
              <button type="button" class="link-btn" data-acao="todos">Marcar todos</button>
              <button type="button" class="link-btn" data-acao="nenhum">Desmarcar todos</button>
            </div>
            <div class="filtro-lista">${montarLista('')}</div>
          `;
          function religarCheckboxes(){
            painel.querySelectorAll('.filtro-lista input[type=checkbox]').forEach(cb=>{
              cb.addEventListener('change', ()=>{
                if (!state.colFiltros[key]) state.colFiltros[key] = new Set(valoresDisponiveis);
                if (cb.checked) state.colFiltros[key].add(cb.value); else state.colFiltros[key].delete(cb.value);
                if (state.colFiltros[key].size === valoresDisponiveis.length) delete state.colFiltros[key];
                atualizarIndicadoresFiltro(); salvarEstado(); aplicarFiltrosOrdenacao();
              });
            });
          }
          religarCheckboxes();
          painel.querySelector('[data-acao="todos"]').addEventListener('click', ()=>{
            delete state.colFiltros[key];
            painel.querySelectorAll('.filtro-lista input[type=checkbox]').forEach(cb=>cb.checked=true);
            atualizarIndicadoresFiltro(); salvarEstado(); aplicarFiltrosOrdenacao();
          });
          painel.querySelector('[data-acao="nenhum"]').addEventListener('click', ()=>{
            state.colFiltros[key] = new Set();
            painel.querySelectorAll('.filtro-lista input[type=checkbox]').forEach(cb=>cb.checked=false);
            atualizarIndicadoresFiltro(); salvarEstado(); aplicarFiltrosOrdenacao();
          });
          painel.querySelector('#busca-valores').addEventListener('input', (e)=>{
            painel.querySelector('.filtro-lista').innerHTML = montarLista(e.target.value.toLowerCase());
            religarCheckboxes();
          });
        });
      });
    });
  }

  dados = await carregar();
  eventosPorProjeto = await carregarNotificacoesMinhasTarefas();
  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="toolbar">
      <input type="text" id="filter-text" placeholder="Buscar em tudo..." class="csp-inline-011" />
      <button class="btn" id="btn-limpar-filtros" type="button">Limpar filtros e ordenação</button>
      <div class="spacer"></div>
      <label class="filtro-nao-vistos"><input type="checkbox" id="chk-nao-vistos" ${state.somenteNaoVistos?'checked':''} /> Mostrar apenas não vistos</label>
      <button class="btn" id="btn-marcar-tudo-lido-mt" data-csp-style="width:auto;display:${todosOsEventosMinhasTarefas().length?'':'none'}">✓ Marcar tudo como lido (${todosOsEventosMinhasTarefas().length})</button>
    </div>
    <div class="section-note csp-inline-012">Clique no nome de uma coluna pra ordenar. Segure <b>Shift</b> pra ordenar por várias colunas ao mesmo tempo. Clique no ▾ pra filtrar valores específicos daquela coluna — suas escolhas ficam salvas até você limpar.</div>
    <div class="table-wrap tabela-principal"><table>
      <thead id="thead-mt">${montarCabecalho()}</thead>
      <tbody id="tbody"></tbody>
    </table></div>
  `;
  ligarCabecalho();
  aplicarFiltrosAtual = aplicarFiltrosOrdenacao;
  aplicarFiltrosOrdenacao();
  ativarRedimensionamentoColunas(root.querySelector('.tabela-principal table'), 'minhas-tarefas');
  atualizarIndicadoresOrdenacao();
  atualizarIndicadoresFiltro();

  document.getElementById('btn-marcar-tudo-lido-mt').addEventListener('click', async (e)=>{
    const btn = e.currentTarget;
    btn.disabled = true;
    const eventoIds = todosOsEventosMinhasTarefas();
    const ok = await marcarNotifLida(cfgProjetos.notifLidosTable, eventoIds, []);
    if (!ok){ btn.disabled = false; return; }
    Object.values(eventosPorProjeto).forEach(reg=>{ reg.novo = []; reg.detalhes = []; reg.campos = {}; });
    btn.style.display = 'none';
    btn.disabled = false;
    aplicarFiltrosOrdenacao();
    toast('Tudo marcado como lido.');
  });

  const filterTextEl = document.getElementById('filter-text');
  filterTextEl.value = state.busca;
  filterTextEl.addEventListener('input', (e)=>{
    state.busca = e.target.value.toLowerCase();
    salvarEstado();
    aplicarFiltrosOrdenacao();
  });
  document.getElementById('chk-nao-vistos').addEventListener('change', (e)=>{
    state.somenteNaoVistos = e.target.checked;
    salvarEstado();
    aplicarFiltrosOrdenacao();
  });
  document.getElementById('btn-limpar-filtros').addEventListener('click', ()=>{
    state.busca = ''; state.colFiltros = {}; state.sortRules = []; state.somenteNaoVistos = false;
    filterTextEl.value = '';
    document.getElementById('chk-nao-vistos').checked = false;
    localStorage.removeItem(chaveEstado);
    atualizarIndicadoresOrdenacao();
    atualizarIndicadoresFiltro();
    aplicarFiltrosOrdenacao();
    toast('Filtros e ordenação removidos.');
  });

  currentSilentRefresh = async ()=>{
    const novosDados = await carregar();
    dados.length = 0; dados.push(...novosDados);
    eventosPorProjeto = await carregarNotificacoesMinhasTarefas();
    atualizarBotaoMarcarTudoMT();
    renderGestaoWhenSafe(aplicarFiltrosOrdenacao);
  };
}

const GRUPOS_MENU = [
  ['chamados_motivo','Chamados — Motivo'],
  ['chamados_status','Chamados — Status'],
  ['chamados_reincidente','Chamados — Reincidente'],
  ['chamados_franquia','Chamados — Franquia'],
  ['projetos_categoria','Projetos — Categoria'],
  ['projetos_prioridade','Projetos — Prioridade'],
  ['projetos_nivel_esforco','Projetos — Nível de Esforço'],
  ['projetos_status','Projetos — Status'],
  ['vendas_loja','Vendas — Loja'],
  ['sacind_tipos','Problemas SAC — Tipos de problema'],
  ['sacind_pedidos_tipo','Pedidos/Agendamentos SAC — Tipo'],
  ['sacind_status','Problemas SAC ↔ Indústria — Status'],
  ['carregamento_status','Programação Carregamento — Status'],
];

async function viewOpcoesMenu(){
  document.getElementById('page-title').textContent = 'Opções dos Menus';
  document.getElementById('page-sub').textContent = 'Adicione, renomeie ou defina a cor de cada opção dos menus suspensos do sistema.';
  const [{ data, error }, { data: tiposData, error: tiposError }] = await Promise.all([
    sb.from('menu_opcoes').select('*').order('grupo').order('ordem'),
    sb.from('reclamacoes_industria_tipos').select('*').order('ordem_classe').order('ordem_subclasse').order('classe').order('subclasse'),
  ]);
  if (error) throw error;
  if (tiposError) throw tiposError;
  const tipos = tiposData || [];
  const gruposTipos = new Set(['sacind_tipos']);
  const classesAtuais = ()=>Array.from(new Set(tipos.map(t=>t.classe))).sort((a,b)=>a.localeCompare(b,'pt-BR'));
  const corClasse = classe => tipos.find(t=>t.classe===classe)?.cor || '#628852';
  const proximoNomeTemporario = (base, existentes)=>{ let n=1, nome=base; while(existentes.has(nome.toLocaleLowerCase('pt-BR'))){ n+=1; nome=`${base} ${n}`; } return nome; };
  const proximaClasseTemporaria = ()=>proximoNomeTemporario('Nova classe', new Set(tipos.map(t=>String(t.classe).toLocaleLowerCase('pt-BR'))));
  const proximaSubclasseTemporaria = classe=>proximoNomeTemporario('Nova subclasse', new Set(tipos.filter(t=>t.classe===classe).map(t=>String(t.subclasse).toLocaleLowerCase('pt-BR'))));
  const recarregarTipos = async ()=>{ await loadReclamacoesIndustriaTipos(); const {data:n}=await sb.from('reclamacoes_industria_tipos').select('*').order('ordem_classe').order('ordem_subclasse').order('classe').order('subclasse'); tipos.length=0; tipos.push(...(n||[])); };
  const root = document.getElementById('view-root');
  let grupoAtual = GRUPOS_MENU[0][0];
  let classeDestinoNovaSubclasse = '';
  root.innerHTML = `
    <div class="toolbar">
      ${currentProfile.role==='ADM' ? `<button class="btn" id="btn-abrir-config-visual" type="button">Ajuste de cor no modo escuro</button>` : ''}
      ${ehGestorOuAdmin() ? `<button class="btn" id="btn-abrir-modelos-checklist" type="button">Modelos de checklist</button>` : ''}
    </div>
    <div class="toolbar">
      <span id="grupo-filter-wrap" class="csp-inline-034">${buildSimplePicker(grupoAtual, GRUPOS_MENU.map(([g,l])=>({value:g,label:l})), (v)=>{ grupoAtual=v; render(grupoAtual); })}</span>
      <div class="spacer"></div>
      <span id="nova-subclasse-classe-wrap" class="csp-inline-035"></span>
      <button class="btn csp-inline-036" id="btn-new-classe">+ Nova classe</button><button class="btn btn-primary csp-inline-003" id="btn-new-opcao">+ Nova subclasse</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr id="opcoes-head"><th>Valor (texto do menu)</th><th>Cor</th><th>Ordem</th><th>Ativo</th><th></th></tr></thead>
      <tbody id="tbody"></tbody>
    </table></div>`;
  if (currentProfile.role==='ADM') document.getElementById('btn-abrir-config-visual').addEventListener('click', abrirConfigVisualPopup);
  if (ehGestorOuAdmin()) document.getElementById('btn-abrir-modelos-checklist').addEventListener('click', abrirModelosChecklistPopup);

  async function atualizarGrupoTipo(id, patch, modo, classeAntiga){
  const campo = Object.keys(patch)[0];
  const campoDaClasse = modo==='classe' || (modo==='unificado' && ['classe','cor','ordem_classe'].includes(campo));
  const alvos = campoDaClasse ? tipos.filter(t=>t.classe===classeAntiga) : tipos.filter(t=>t.id===id);
  for (const alvo of alvos){
    const {error:err}=await sb.from('reclamacoes_industria_tipos').update(patch).eq('id',alvo.id);
    if(err) return err;
  }
  await recarregarTipos();
  return null;
}
function instalarLinhaTipo(tr, row, modo){
  const id=tr.dataset.id;
  tr.querySelectorAll('[data-f]').forEach(inp=>{
    const evt=inp.type==='checkbox'?'change':(inp.type==='number'?'change':'blur');
    inp.addEventListener(evt, async ()=>{
      let v=inp.type==='checkbox'?inp.checked:(inp.type==='number'?parseInt(inp.value||0,10):inp.value.trim());
      let f=inp.dataset.f;
      if(f==='cor'){ if(v&&v[0]!=='#')v='#'+v; if(!/^#[0-9a-f]{6}$/i.test(v)){toast('Cor inválida. Use #RRGGBB.',true);return;} v=v.toUpperCase(); inp.value=v; }
      if(f==='valor') f='classe';
      const campoDaClasse = modo==='classe' || (modo==='unificado' && ['classe','cor','ordem_classe'].includes(f));
      const err=await atualizarGrupoTipo(id,{[f]:v},modo,campoDaClasse?row.classe:null);
      if(err) return toast('Erro ao salvar: '+err.message,true);
      flashSaved(inp); render(grupoAtual);
    });
  });
  const sw=tr.querySelector('[data-cor-btn]');
  if(sw) sw.addEventListener('click',()=>abrirSeletorDeCor(sw,row.cor,async novo=>{
    const campoDaClasse = modo==='classe' || modo==='unificado';
    const err=await atualizarGrupoTipo(id,{cor:novo},modo,campoDaClasse?row.classe:null);
    if(err)return toast('Erro ao salvar: '+err.message,true);
    render(grupoAtual); toast('Cor salva.');
  }));
  const del=tr.querySelector('[data-action="del"]');
  if(del) del.addEventListener('click',async()=>{
    const msg=modo==='classe'?'Excluir esta classe e todas as suas subclasses?':'Excluir esta subclasse? Registros que a utilizam ficarão sem tipo de problema.';
    if(!(await confirmarAcao(msg)))return;
    const alvos=modo==='classe'?tipos.filter(t=>t.classe===row.classe):[row];
    for(const alvo of alvos){const {error:err}=await sb.from('reclamacoes_industria_tipos').delete().eq('id',alvo.id);if(err)return toast('Erro ao excluir: '+err.message,true);}
    await recarregarTipos(); render(grupoAtual); toast('Opção excluída.');
  });
  const classeWrap=tr.querySelector('[data-classe-wrap]');
  if(classeWrap){
    classeWrap.innerHTML=buildSimplePicker(row.classe,classesAtuais().map(c=>({value:c,label:c,dot:corMenuParaTema(corClasse(c))})),async novo=>{
      const err=await atualizarGrupoTipo(row.id,{classe:novo},'unificado',row.classe);
      if(err)return toast('Erro ao alterar classe: '+err.message,true);
      render(grupoAtual);
    },{placeholder:'Classe'});
  }
}
  function renderTiposGrupo(grupo){
    const modo=grupo==='sacind_tipos'?'unificado':'subclasse';
    const head=document.getElementById('opcoes-head');
    const tbody=document.getElementById('tbody');
    if(modo==='unificado'){
      head.innerHTML='<th>Classe</th><th>Subclasse</th><th>Cor herdada</th><th>Ordem classe</th><th>Ordem subclasse</th><th>Ativo</th><th></th>';
      const classes=Array.from(new Set(tipos.map(t=>t.classe))).sort((a,b)=>{
        const ao=Number(tipos.find(t=>t.classe===a)?.ordem_classe)||0;
        const bo=Number(tipos.find(t=>t.classe===b)?.ordem_classe)||0;
        return ao-bo || a.localeCompare(b,'pt-BR');
      });
      const partes=[];
      classes.forEach(classe=>{
        const grupoRows=tipos.filter(t=>t.classe===classe).sort((a,b)=>Number(a.ordem_subclasse||0)-Number(b.ordem_subclasse||0)||a.subclasse.localeCompare(b.subclasse,'pt-BR'));
        const primeiro=grupoRows[0];
        if(!primeiro)return;
        const cor=corClasse(classe);
        partes.push(`<tr class="tipo-classe-header" data-classe-id="${primeiro.id}">
          <td colspan="2"><input class="cell-input csp-inline-037" data-class-f="classe" value="${escapeHtml(classe)}" /></td>
          <td><div class="csp-inline-038"><button type="button" class="cor-swatch" data-class-cor data-csp-style="background:${cor}" title="Escolher cor da classe"></button><input class="cell-input csp-inline-039" data-class-f="cor" value="${escapeHtml(cor)}" maxlength="7" /></div></td>
          <td><input type="number" class="cell-number csp-inline-006" data-class-f="ordem_classe" value="${Number(primeiro.ordem_classe)||0}" /></td>
          <td></td>
          <td><input type="checkbox" data-class-f="ativo" ${grupoRows.some(t=>t.ativo)?'checked':''} /></td>
          <td><button class="icon-btn" data-class-del="${primeiro.id}">excluir classe</button></td>
        </tr>`);
        partes.push(grupoRows.map(r=>`<tr data-id="${r.id}">
          <td><span class="csp-inline-040"><span class="dd-dot" data-csp-style="background:${cor}"></span>${escapeHtml(classe)}</span></td>
          <td><input class="cell-input csp-inline-041" data-f="subclasse" value="${escapeHtml(r.subclasse)}" /></td>
          <td><span class="csp-inline-042"><span class="dd-dot" data-csp-style="background:${cor}"></span>herdada da classe</span></td>
          <td><span class="csp-inline-043">${Number(r.ordem_classe)||0}</span></td>
          <td><input type="number" class="cell-number csp-inline-006" data-f="ordem_subclasse" value="${Number(r.ordem_subclasse)||0}" /></td>
          <td><input type="checkbox" data-f="ativo" ${r.ativo?'checked':''} /></td>
          <td><button class="icon-btn" data-action="del">excluir</button></td>
        </tr>`).join(''));
      });
      tbody.innerHTML=partes.join('')||'<tr class="empty-row"><td colspan="7">Nenhuma classe ou subclasse cadastrada.</td></tr>';
      tbody.querySelectorAll('tr[data-id]').forEach(tr=>instalarLinhaTipo(tr,tipos.find(r=>r.id===tr.dataset.id),'subclasse'));
      tbody.querySelectorAll('tr.tipo-classe-header').forEach(tr=>{
        const primeiro=tipos.find(r=>r.id===tr.dataset.classeId);
        if(!primeiro)return;
        const classeAntiga=primeiro.classe;
        tr.querySelectorAll('[data-class-f]').forEach(inp=>{
          const evt=inp.type==='checkbox'?'change':(inp.type==='number'?'change':'blur');
          inp.addEventListener(evt,async()=>{
            let v=inp.type==='checkbox'?inp.checked:(inp.type==='number'?parseInt(inp.value||0,10):inp.value.trim());
            const f=inp.dataset.classF;
            if(f==='cor'){
              if(v&&v[0]!=='#')v='#'+v;
              if(!/^#[0-9a-f]{6}$/i.test(v)){toast('Cor inválida. Use #RRGGBB.',true);inp.value=corClasse(classeAntiga);return;}
              v=v.toUpperCase(); inp.value=v;
            }
            const err=await atualizarGrupoTipo(primeiro.id,{[f]:v},'classe',classeAntiga);
            if(err)return toast('Erro ao salvar: '+err.message,true);
            flashSaved(inp); render(grupoAtual);
          });
        });
        const sw=tr.querySelector('[data-class-cor]');
        if(sw)sw.addEventListener('click',()=>abrirSeletorDeCor(sw,corClasse(classeAntiga),async novo=>{
          const err=await atualizarGrupoTipo(primeiro.id,{cor:novo},'classe',classeAntiga);
          if(err)return toast('Erro ao salvar: '+err.message,true);
          render(grupoAtual); toast('Cor da classe salva.');
        }));
        const del=tr.querySelector('[data-class-del]');
        if(del)del.addEventListener('click',async()=>{
          if(!(await confirmarAcao('Excluir esta classe e todas as suas subclasses?')))return;
          for(const alvo of tipos.filter(t=>t.classe===classeAntiga)){
            const {error:err}=await sb.from('reclamacoes_industria_tipos').delete().eq('id',alvo.id);
            if(err)return toast('Erro ao excluir: '+err.message,true);
          }
          await recarregarTipos(); render(grupoAtual); toast('Classe excluída.');
        });
      });
      return;
    }
    if(modo==='classe'){
      head.innerHTML='<th>Classe</th><th>Cor</th><th>Ordem</th><th>Ativo</th><th></th>';
      const rows=classesAtuais().map(classe=>{const grupoRows=tipos.filter(t=>t.classe===classe);const primeiro=grupoRows[0];return {id:primeiro.id,classe,cor:primeiro.cor,ordem_classe:Math.min(...grupoRows.map(t=>Number(t.ordem_classe)||0)),ativo:grupoRows.some(t=>t.ativo)};});
      tbody.innerHTML=rows.map(r=>`<tr data-id="${r.id}"><td><input class="cell-input csp-inline-044" data-f="valor" value="${escapeHtml(r.classe)}" /></td><td><div class="csp-inline-038"><button type="button" class="cor-swatch" data-cor-btn data-csp-style="background:${r.cor}" title="Escolher cor"></button><input class="cell-input csp-inline-039" data-f="cor" value="${escapeHtml(r.cor)}" maxlength="7" /></div></td><td><input type="number" class="cell-number csp-inline-006" data-f="ordem_classe" value="${r.ordem_classe}" /></td><td><input type="checkbox" data-f="ativo" ${r.ativo?'checked':''} /></td><td><button class="icon-btn" data-action="del">excluir</button></td></tr>`).join('')||'<tr class="empty-row"><td colspan="5">Nenhuma classe cadastrada.</td></tr>';
      tbody.querySelectorAll('tr[data-id]').forEach(tr=>instalarLinhaTipo(tr,rows.find(r=>r.id===tr.dataset.id),'classe'));
    }else{
      head.innerHTML='<th>Classe</th><th>Subclasse</th><th>Ordem</th><th>Ativo</th><th></th>';
      tbody.innerHTML=tipos.map(r=>`<tr data-id="${r.id}"><td data-classe-wrap class="csp-inline-045"></td><td><input class="cell-input csp-inline-041" data-f="subclasse" value="${escapeHtml(r.subclasse)}" /></td><td><input type="number" class="cell-number csp-inline-006" data-f="ordem_subclasse" value="${r.ordem_subclasse}" /></td><td><input type="checkbox" data-f="ativo" ${r.ativo?'checked':''} /></td><td><button class="icon-btn" data-action="del">excluir</button></td></tr>`).join('')||'<tr class="empty-row"><td colspan="5">Nenhuma subclasse cadastrada.</td></tr>';
      tbody.querySelectorAll('tr[data-id]').forEach(tr=>instalarLinhaTipo(tr,tipos.find(r=>r.id===tr.dataset.id),'subclasse'));
    }
  }
  function render(grupo){
    const btnClasse=document.getElementById('btn-new-classe');
    const btnSub=document.getElementById('btn-new-opcao');
    if(btnClasse)btnClasse.style.display=grupo==='sacind_tipos'?'':'none';
    if(btnSub)btnSub.textContent=grupo==='sacind_tipos'?'+ Nova subclasse':'+ Nova opção';
    const destinoWrap=document.getElementById('nova-subclasse-classe-wrap');
    if(destinoWrap){
      const classes=classesAtuais();
      const mostrar=grupo==='sacind_tipos' && classes.length;
      destinoWrap.style.display=mostrar?'inline-flex':'none';
      if(mostrar){
        if(!classes.includes(classeDestinoNovaSubclasse)) classeDestinoNovaSubclasse=classes[0];
        destinoWrap.innerHTML=`<span class="csp-inline-046">Adicionar em</span>${buildSimplePicker(classeDestinoNovaSubclasse, classes.map(c=>({value:c,label:c,dot:corMenuParaTema(corClasse(c))})), v=>{classeDestinoNovaSubclasse=v;}, {placeholder:'Classe'})}`;
      }else destinoWrap.innerHTML='';
    }
    if(gruposTipos.has(grupo)){ renderTiposGrupo(grupo); return; }
    const rows=data.filter(o=>o.grupo===grupo); const tbody=document.getElementById('tbody');
    document.getElementById('opcoes-head').innerHTML='<th>Valor (texto do menu)</th><th>Cor</th><th>Ordem</th><th>Ativo</th><th></th>';
    if(!rows.length){tbody.innerHTML='<tr class="empty-row"><td colspan="5">Nenhuma opção neste grupo ainda.</td></tr>';return;}
    tbody.innerHTML=rows.map(o=>`<tr data-id="${o.id}"><td><input type="text" class="cell-input csp-inline-044" data-f="valor" value="${escapeHtml(o.valor)}" /></td><td><div class="csp-inline-038"><button type="button" class="cor-swatch" data-cor-btn data-csp-style="background:${o.cor}" title="Escolher cor"></button><input type="text" class="cell-input cor-hex csp-inline-039" data-f-hex="cor" value="${escapeHtml(o.cor)}" maxlength="7" /></div></td><td><input type="number" class="cell-number csp-inline-006" data-f="ordem" value="${o.ordem}" /></td><td><input type="checkbox" data-f="ativo" ${o.ativo?'checked':''} /></td><td><button class="icon-btn" data-action="del">excluir</button></td></tr>`).join('');
    tbody.querySelectorAll('tr[data-id]').forEach(tr=>{
      const id=tr.dataset.id, linha=data.find(o=>o.id===id);
      tr.querySelectorAll('[data-f]').forEach(inp=>{const evt=inp.type==='checkbox'?'change':(inp.type==='number'?'change':'blur');inp.addEventListener(evt,async()=>{const f=inp.dataset.f,v=inp.type==='checkbox'?inp.checked:(inp.type==='number'?parseInt(inp.value||0):inp.value);const {error:err}=await sb.from('menu_opcoes').update({[f]:v}).eq('id',id);if(err)return toast('Erro: '+err.message,true);if(linha)linha[f]=v;flashSaved(inp);await loadMenuOpcoes();});});
      const hex=tr.querySelector('.cor-hex'), sw=tr.querySelector('[data-cor-btn]');
      if(hex)hex.addEventListener('blur',async()=>{let v=hex.value.trim();if(v&&v[0]!=='#')v='#'+v;if(!/^#[0-9a-f]{6}$/i.test(v)){toast('Cor inválida — use #RRGGBB.',true);hex.value=linha?.cor||'';return;}v=v.toUpperCase();hex.value=v;if(sw)sw.style.background=v;const {error:err}=await sb.from('menu_opcoes').update({cor:v}).eq('id',id);if(err)return toast('Erro: '+err.message,true);if(linha)linha.cor=v;flashSaved(hex);await loadMenuOpcoes();});
      if(sw)sw.addEventListener('click',()=>abrirSeletorDeCor(sw,linha?.cor||o.cor,async novo=>{const {error:err}=await sb.from('menu_opcoes').update({cor:novo}).eq('id',id);if(err)return toast('Erro: '+err.message,true);await loadMenuOpcoes();render(grupoAtual);toast('Cor salva.');}));
      tr.querySelector('[data-action="del"]').addEventListener('click',async()=>{if(!(await confirmarAcao('Excluir esta opção? Registros que já usam esse valor mantêm o texto, só some do menu suspenso.')))return;const {error:err}=await sb.from('menu_opcoes').delete().eq('id',id);if(err)return toast('Erro: '+err.message,true);const i=data.findIndex(o=>o.id===id);if(i>=0)data.splice(i,1);await loadMenuOpcoes();render(grupoAtual);toast('Opção excluída.');});
    });
  }
  render(grupoAtual);
  document.getElementById('btn-new-classe').addEventListener('click',async()=>{
    if(grupoAtual!=='sacind_tipos')return;
    const ordem=tipos.reduce((m,t)=>Math.max(m,Number(t.ordem_classe)||0),0)+10;
    const {data:nova,error:err}=await sb.from('reclamacoes_industria_tipos').insert({classe:proximaClasseTemporaria(),subclasse:'Nova subclasse',ordem_classe:ordem,ordem_subclasse:10,cor:'#628852',ativo:true}).select().single();
    if(err)return toast('Erro ao criar classe: '+err.message,true);
    tipos.push(nova); classeDestinoNovaSubclasse=nova.classe; await recarregarTipos(); render(grupoAtual); toast('Classe criada.');
  });
  document.getElementById('btn-new-opcao').addEventListener('click',async()=>{
    if(gruposTipos.has(grupoAtual)){
      const classe=classeDestinoNovaSubclasse || classesAtuais()[0]; if(!classe)return toast('Cadastre uma classe primeiro.',true);
      const ordem=tipos.filter(t=>t.classe===classe).reduce((m,t)=>Math.max(m,Number(t.ordem_subclasse)||0),0)+10;
      const {data:nova,error:err}=await sb.from('reclamacoes_industria_tipos').insert({classe,subclasse:proximaSubclasseTemporaria(classe),ordem_classe:tipos.find(t=>t.classe===classe)?.ordem_classe||10,ordem_subclasse:ordem,cor:corClasse(classe),ativo:true}).select().single();
      if(err)return toast('Erro ao criar subclasse: '+err.message,true);
      tipos.push(nova); await recarregarTipos(); render(grupoAtual); toast('Subclasse criada.');
      return;
    }
    const {data:nova,error:err}=await sb.from('menu_opcoes').insert({grupo:grupoAtual,valor:'Nova opção',cor:'#628852',ordem:99}).select().single();
    if(err)return toast('Erro: '+err.message,true); data.push(nova); await loadMenuOpcoes(); render(grupoAtual); toast('Opção criada — edite o texto e a cor.');
  });
  currentSilentRefresh=async()=>{
    const [{data:novosDados,error:err1},{data:novosTipos,error:err2}]=await Promise.all([sb.from('menu_opcoes').select('*').order('grupo').order('ordem'),sb.from('reclamacoes_industria_tipos').select('*').order('ordem_classe').order('ordem_subclasse').order('classe').order('subclasse')]);
    if(err1||err2)return; data.length=0;data.push(...(novosDados||[]));tipos.length=0;tipos.push(...(novosTipos||[]));await loadReclamacoesIndustriaTipos();render(grupoAtual);
  };
}
function abrirConfigVisualPopup(){
  const modal = document.getElementById('modal-content');
  modal.classList.remove('modal-wide');
  modal.innerHTML = `
    <h3>Ajuste de cor no modo escuro</h3>
    <div class="section-note csp-inline-047">A cor que você define em cada opção vale pro modo claro. No modo escuro, o app escurece (ou clareia) e ajusta a saturação automaticamente com base nestes dois números — não precisa cadastrar uma segunda cor.</div>
    <div class="field"><label>Reduzir luminosidade (%)</label>
      <input type="number" id="cfg-luminosidade" class="cell-input csp-inline-048" value="${configVisual.reduzir_luminosidade_pct}" step="1" />
      <div class="section-note csp-inline-049">Positivo = mais escuro no modo escuro. Negativo = mais claro.</div>
    </div>
    <div class="field"><label>Ajustar saturação (%)</label>
      <input type="number" id="cfg-saturacao" class="cell-input csp-inline-048" value="${configVisual.ajustar_saturacao_pct}" step="1" />
      <div class="section-note csp-inline-049">Positivo = mais saturado (vívido). Negativo = mais dessaturado (acinzentado).</div>
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" data-action="close-modal">Fechar</button>
      <button class="btn btn-primary csp-inline-032" id="btn-salvar-config-visual">Salvar</button>
    </div>
  `;
  document.getElementById('modal-backdrop').classList.add('active');
  document.getElementById('btn-salvar-config-visual').addEventListener('click', async ()=>{
    const luminosidade = parseFloat(document.getElementById('cfg-luminosidade').value) || 0;
    const saturacao = parseFloat(document.getElementById('cfg-saturacao').value) || 0;
    const { error } = await sb.from('config_visual').update({ reduzir_luminosidade_pct: luminosidade, ajustar_saturacao_pct: saturacao }).eq('id', 1);
    if (error) return toast('Erro ao salvar: '+error.message, true);
    configVisual = { reduzir_luminosidade_pct: luminosidade, ajustar_saturacao_pct: saturacao };
    toast('Configuração salva.');
    closeModal();
    if (temaEscuro()) navigateTo(currentView);
  });
}

function abrirModelosChecklistPopup(){
  const modal = document.getElementById('modal-content');
  modal.classList.add('modal-wide');
  modal.innerHTML = `
    <div class="modal-fixed-head">
      <h3 class="csp-inline-024">Modelos de checklist</h3>
      <div class="csp-inline-050">Monte um checklist padrão pra cada Categoria (Projetos) ou Motivo (SAC). Ele aparece como sugestão pra aplicar na tela de detalhes de itens novos daquele tipo.</div>
    </div>
    <div class="modal-scroll-body">
      <div class="toolbar csp-inline-051">
        <select id="tpl-tabela">
          <option value="projetos">Projetos — por Categoria</option>
          <option value="chamados_sac">SAC — por Motivo</option>
        </select>
        <select id="tpl-tipo"></select>
      </div>
      <div id="tpl-grupos"></div>
      <div class="csp-inline-052">
        <input type="text" class="cell-input csp-inline-053" id="tpl-novo-grupo-nome" placeholder="Nome do novo checklist..." />
        <button class="btn btn-primary csp-inline-032" id="tpl-btn-add-grupo">+ Novo checklist</button>
      </div>
    </div>
    <div class="modal-fixed-foot"><button class="btn btn-ghost" data-action="close-modal">Fechar</button></div>
  `;
  document.getElementById('modal-backdrop').classList.add('active');

  const TPL_TIPO_GRUPO = { projetos: 'projetos_categoria', chamados_sac: 'chamados_motivo' };
  const tplTabelaSel = document.getElementById('tpl-tabela');
  const tplTipoSel = document.getElementById('tpl-tipo');
  let tplGrupos = [], tplItens = [];

  function popularTiposTemplate(){
    const opcoes = opcoesDe(TPL_TIPO_GRUPO[tplTabelaSel.value]);
    tplTipoSel.innerHTML = opcoes.length
      ? opcoes.map(o=>`<option value="${escapeHtml(o.valor)}">${escapeHtml(o.valor)}</option>`).join('')
      : '<option value="">(nenhuma opção cadastrada nesse grupo)</option>';
  }

  function tplItensDoGrupo(gid){ return tplItens.filter(i=>i.template_grupo_id===gid); }
  function montarTplItensHtml(itens){
    if (!itens.length) return '<div class="section-note csp-inline-054">Nenhum item ainda.</div>';
    return itens.map(it=>`<div class="checklist-item" data-id="${it.id}"><span class="arraste-handle" title="Arraste pra reordenar">⠿</span><span>${escapeHtml(it.texto)}</span><button type="button" class="icon-btn csp-inline-055" data-tpl-del-item="${it.id}">excluir</button></div>`).join('');
  }
  function montarTplGrupoHtml(g){
    return `<div class="checklist-grupo" data-tpl-grupo="${g.id}">
      <div class="checklist-grupo-head">
        <input type="text" class="cell-input tpl-grupo-nome csp-inline-056" value="${escapeHtml(g.nome)}" />
        <button type="button" class="icon-btn csp-inline-055" data-tpl-del-grupo="${g.id}">excluir checklist</button>
      </div>
      <div class="checklist-itens">${montarTplItensHtml(tplItensDoGrupo(g.id))}</div>
      <div class="csp-inline-057">
        <input type="text" class="cell-input csp-inline-053" data-tpl-novo-item="${g.id}" placeholder="Novo item..." />
        <button type="button" class="btn csp-inline-032" data-tpl-add-item="${g.id}">+ Item</button>
      </div>
    </div>`;
  }
  function ligarTplItem(itemEl){
    itemEl.querySelector('[data-tpl-del-item]').addEventListener('click', async ()=>{
      if (!(await confirmarAcao('Excluir este item do modelo?'))) return;
      const itemId = itemEl.dataset.id;
      const { error } = await sb.from('templates_checklist_itens').delete().eq('id', itemId);
      if (error) return toast('Erro: '+error.message, true);
      tplItens = tplItens.filter(i=>i.id!==itemId);
      itemEl.remove();
    });
    ligarArrasteItem(itemEl);
  }
  // Liga UM grupo de template só (evita o mesmo bug de duplicação do
  // checklist real: nunca religamos um grupo já ligado).
  function ligarUmTplGrupo(grupoEl){
    const gid = grupoEl.dataset.tplGrupo;
    grupoEl.querySelectorAll('.checklist-item').forEach(ligarTplItem);
    ligarArrasteContainer(grupoEl.querySelector('.checklist-itens'), '.checklist-item', (ids)=>persistirOrdem('templates_checklist_itens', ids));
    const nomeInput = grupoEl.querySelector('.tpl-grupo-nome');
    nomeInput.addEventListener('blur', async ()=>{
      const novoNome = nomeInput.value.trim() || 'Checklist';
      const { error } = await sb.from('templates_checklist_grupos').update({ nome: novoNome }).eq('id', gid);
      if (error) return toast('Erro: '+error.message, true);
      flashSaved(nomeInput);
    });
    grupoEl.querySelector('[data-tpl-del-grupo]').addEventListener('click', async ()=>{
      if (!(await confirmarAcao('Excluir este checklist do modelo (e todos os itens dele)?'))) return;
      const { error } = await sb.from('templates_checklist_grupos').delete().eq('id', gid);
      if (error) return toast('Erro: '+error.message, true);
      tplGrupos = tplGrupos.filter(g=>g.id!==gid);
      grupoEl.remove();
    });
    const inpNovo = grupoEl.querySelector(`[data-tpl-novo-item="${gid}"]`);
    const btnAdd = grupoEl.querySelector(`[data-tpl-add-item="${gid}"]`);
    btnAdd.addEventListener('click', async ()=>{
      const texto = inpNovo.value.trim();
      if (!texto) return;
      const { data: novo, error } = await sb.from('templates_checklist_itens').insert({ template_grupo_id: gid, texto, ordem: tplItensDoGrupo(gid).length }).select().single();
      if (error) return toast('Erro: '+error.message, true);
      inpNovo.value = '';
      tplItens.push(novo);
      const itensDiv = grupoEl.querySelector('.checklist-itens');
      if (itensDiv.querySelector('.section-note')) itensDiv.innerHTML = '';
      itensDiv.insertAdjacentHTML('beforeend', montarTplItensHtml([novo]));
      ligarTplItem(itensDiv.querySelector(`.checklist-item[data-id="${novo.id}"]`));
    });
    inpNovo.addEventListener('keydown', (e)=>{ if (e.key==='Enter') btnAdd.click(); });
  }

  async function carregarTemplates(){
    const tabela = tplTabelaSel.value, tipoValor = tplTipoSel.value;
    const container = document.getElementById('tpl-grupos');
    if (!tipoValor){ container.innerHTML = '<div class="section-note">Cadastre uma opção nesse grupo primeiro (em "Opções dos Menus").</div>'; tplGrupos=[]; tplItens=[]; return; }
    const { data: grupos } = await sb.from('templates_checklist_grupos').select('*').eq('tabela', tabela).eq('tipo_valor', tipoValor).order('ordem');
    tplGrupos = grupos || [];
    const idsGrupos = tplGrupos.map(g=>g.id);
    tplItens = [];
    if (idsGrupos.length){
      const { data: itens } = await sb.from('templates_checklist_itens').select('*').in('template_grupo_id', idsGrupos).order('ordem');
      tplItens = itens || [];
    }
    container.innerHTML = tplGrupos.length ? tplGrupos.map(montarTplGrupoHtml).join('') : '<div class="section-note">Nenhum checklist neste modelo ainda.</div>';
    document.querySelectorAll('[data-tpl-grupo]').forEach(ligarUmTplGrupo);
  }

  popularTiposTemplate();
  tplTabelaSel.addEventListener('change', ()=>{ popularTiposTemplate(); carregarTemplates(); });
  tplTipoSel.addEventListener('change', carregarTemplates);

  document.getElementById('tpl-btn-add-grupo').addEventListener('click', async ()=>{
    const tabela = tplTabelaSel.value, tipoValor = tplTipoSel.value;
    if (!tipoValor) return toast('Cadastre uma opção nesse grupo primeiro.', true);
    const inp = document.getElementById('tpl-novo-grupo-nome');
    const nome = inp.value.trim() || 'Checklist';
    const { data: novo, error } = await sb.from('templates_checklist_grupos').insert({ tabela, tipo_valor: tipoValor, nome, ordem: tplGrupos.length }).select().single();
    if (error) return toast('Erro: '+error.message, true);
    inp.value = '';
    tplGrupos.push(novo);
    const container = document.getElementById('tpl-grupos');
    if (container.querySelector('.section-note')) container.innerHTML = '';
    container.insertAdjacentHTML('beforeend', montarTplGrupoHtml(novo));
    ligarUmTplGrupo(document.querySelector(`[data-tpl-grupo="${novo.id}"]`));
  });
  document.getElementById('tpl-novo-grupo-nome').addEventListener('keydown', (e)=>{ if (e.key==='Enter') document.getElementById('tpl-btn-add-grupo').click(); });

  carregarTemplates();
}

async function viewUsuarios(){
  const meuTokenDaTela = __viewToken;
  document.getElementById('page-title').textContent = 'Usuários';
  document.getElementById('page-sub').textContent = 'Usuários ativos com permissão de acesso ao app Gestão.';
  const { data, error } = await sb.rpc('listar_usuarios');
  if (error) throw error;
  if (meuTokenDaTela !== __viewToken) return;

  const perm = permissoesAtuais('usuarios');
  const podeEditarPermissoes = !!perm.editar;
  const podeExcluirUsuario = !!perm.excluir;
  const dadosVisiveis = (data||[]).filter(p => perm.ver_outros || (perm.ver_proprio && p.id===currentUser.id));
  const root = document.getElementById('view-root');

  root.innerHTML = `
    ${(!perm.ver_outros && perm.ver_proprio) ? `<div class="section-note">Sua permissão nesta aba mostra apenas o seu cadastro.</div>` : ''}
    <div class="section-note">A role é vinculada automaticamente ao cadastro central do SuperApp. Novas contas e alterações de role são administradas na Landing page.</div>
    <div class="table-wrap csp-inline-058"><table>
      <thead><tr><th>Nome</th><th>E-mail</th><th>Papel</th><th>Status</th><th></th></tr></thead>
      <tbody id="tbody"></tbody>
    </table></div>
  `;

  document.getElementById('tbody').innerHTML = dadosVisiveis.map(p=>`
    <tr data-uid="${escapeHtml(p.id)}">
      <td>${escapeHtml(p.nome)}</td>
      <td>${escapeHtml(p.usuario)}</td>
      <td><span class="role-stamp role-${escapeHtml(p.role)}">${escapeHtml(ROTULO_PAPEL[p.role]||p.role)}</span></td>
      <td>${p.ativo ? 'Ativo' : 'Inativo'}</td>
      <td class="row-actions">
        ${(podeExcluirUsuario && p.id!==currentUser.id && p.ativo) ? `<button type="button" class="icon-btn" data-action="desativar">desativar</button>` : ''}
      </td>
    </tr>
  `).join('');

  if (podeExcluirUsuario){
    document.querySelectorAll('#tbody [data-action="desativar"]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const uid = btn.closest('tr').dataset.uid;
        if (!(await confirmarAcao('Desativar este usuário? A conta perderá acesso ao aplicativo.'))) return;
        const { error } = await sb.rpc('excluir_usuario', { p_user_id: uid });
        if (error) return toast('Erro: '+error.message, true);
        toast('Usuário desativado.');
        navigateTo('usuarios');
      });
    });
  }

  if (podeEditarPermissoes){
    try{
      await montarPainelPermissoes(meuTokenDaTela);
    }catch(err){
      console.error('Erro ao montar painel de permissões:', err);
    }
  }
}

async function montarPainelPermissoes(meuTokenDaTela){
  const { data: permData, error: permErr } = await sb.from('permissoes_abas').select('*');
  if (permErr){ console.error(permErr); return; }
  if (meuTokenDaTela !== __viewToken) return; // a pessoa já saiu dessa tela antes disso terminar de carregar
  const atual = {}; // atual[role][aba] = { chave: true/false, ... }
  PAPEIS.forEach(r=>{ atual[r] = {}; ABAS_DISPONIVEIS.forEach(([key])=>{ atual[r][key] = permissoesPadraoDe(r, key); }); });
  (permData||[]).forEach(row=>{
    if (!atual[row.role]) return;
    if (row.permissoes && typeof row.permissoes === 'object' && Object.keys(row.permissoes).length){
      atual[row.role][row.aba] = row.permissoes;
    } else {
      const nivel = row.nivel || (row.permitido ? 'editar_tudo' : 'nenhum');
      const cheio = nivel === 'editar_tudo' || nivel === 'ver_tudo';
      const proprioSo = nivel === 'ver_proprio';
      const flags = {};
      chavesPermissaoDe(row.aba).forEach(k=>{
        if (k==='acesso') flags[k] = nivel !== 'nenhum';
        else if (k==='ver_outros') flags[k] = cheio;
        else if (k==='ver_proprio') flags[k] = cheio || proprioSo;
        else flags[k] = nivel === 'editar_tudo' || proprioSo;
      });
      atual[row.role][row.aba] = flags;
    }
  });

  const root = document.getElementById('view-root');
  const painel = document.createElement('div');
  painel.id = 'painel-permissoes';
  painel.innerHTML = `
    <h3 class="csp-inline-059">Permissões de abas por papel</h3>
    <div class="section-note">A coluna "acesso" na linha principal decide se a aba aparece no menu lateral daquele papel. Abas com mais detalhes têm uma seta ▸ pra expandir e configurar o que a pessoa pode ver/criar/editar/excluir dentro delas. O papel <b>ADM</b> sempre mantém controle total sobre "Usuários", pra ninguém ficar trancado fora desta tela.</div>
    <div class="table-wrap csp-inline-058"><table>
      <thead><tr><th>Aba / Permissão</th>${PAPEIS.map(r=>`<th class="csp-inline-060">${escapeHtml(ROTULO_PAPEL[r])}</th>`).join('')}</tr></thead>
      <tbody>
        ${ABAS_DISPONIVEIS.map(([key,label])=>{
          const subs = subcategoriasDetalhadasDe(key);
          function celula(r, chave){
            const travado = (r==='ADM' && key==='usuarios');
            const marcado = travado ? true : !!atual[r][key][chave];
            return `<td class="csp-inline-060"><input type="checkbox" class="perm-check" data-role="${r}" data-aba="${key}" data-chave="${chave}" ${marcado?'checked':''} ${travado?'disabled':''} /></td>`;
          }
          const acessoCells = PAPEIS.map(r=>celula(r,'acesso')).join('');
          if (!subs.length){
            return `<tr data-aba="${key}"><td>${escapeHtml(label)}</td>${acessoCells}</tr>`;
          }
          function celulaAnimada(conteudoHtml, centralizado){
            return `<td><div class="perm-sub-inner${centralizado?' centralizado':''}">${conteudoHtml}</div></td>`;
          }
          const linhaPrincipal = `<tr class="perm-aba-row" data-aba="${key}">
            <td><button type="button" class="perm-toggle" data-toggle-aba="${key}"><span class="chev">▸</span>${escapeHtml(label)}</button></td>
            ${acessoCells}
          </tr>`;
          const subLinhas = subs.map(s=>`
            <tr class="perm-sub-row" data-aba="${key}">
              ${celulaAnimada(escapeHtml(s.label))}
              ${PAPEIS.map(r=>{
                const travado = (r==='ADM' && key==='usuarios');
                const marcado = travado ? true : !!atual[r][key][s.key];
                return celulaAnimada(`<input type="checkbox" class="perm-check" data-role="${r}" data-aba="${key}" data-chave="${s.key}" ${marcado?'checked':''} ${travado?'disabled':''} />`, true);
              }).join('')}
            </tr>
          `).join('');
          return linhaPrincipal + subLinhas;
        }).join('')}
      </tbody>
    </table></div>
    <button class="btn btn-primary csp-inline-003" id="btn-salvar-permissoes">Salvar permissões</button>
  `;
  root.appendChild(painel);

  painel.querySelectorAll('.perm-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const aba = btn.dataset.toggleAba;
      const aberto = btn.classList.toggle('aberto');
      painel.querySelectorAll(`.perm-sub-row[data-aba="${aba}"]`).forEach(tr=>{ tr.classList.toggle('aberto', aberto); });
    });
  });

  document.getElementById('btn-salvar-permissoes').addEventListener('click', async ()=>{
    const porCombo = {}; // porCombo['role|aba'] = { chave: true/false, ... }
    painel.querySelectorAll('.perm-check').forEach(cb=>{
      const { role, aba, chave } = cb.dataset;
      const combo = role+'|'+aba;
      if (!porCombo[combo]) porCombo[combo] = {};
      porCombo[combo][chave] = (role==='ADM' && aba==='usuarios') ? true : cb.checked;
    });
    const linhas = [];
    ABAS_DISPONIVEIS.forEach(([key])=>{
      PAPEIS.forEach(r=>{
        const permissoes = porCombo[r+'|'+key] || permissoesPadraoDe(r, key);
        linhas.push({ role:r, aba:key, permissoes, permitido: abaTemAlgumAcesso(permissoes) });
      });
    });
    const { error } = await sb.from('permissoes_abas').upsert(linhas, { onConflict:'role,aba' });
    if (error) return toast('Erro ao salvar permissões: '+error.message, true);
    await loadPermissoesAbas();
    buildNav();
    toast('Permissões salvas.');
  });
}

const CAMPOS_AUDITORIA = [
  {key:'created_at', label:'Quando'},
  {key:'user_nome', label:'Usuário'},
  {key:'tabela', label:'Tabela'},
  {key:'acao', label:'Ação'},
];

// Painel admin: por usuário, quantas notificações (em cada aba com esse
// sistema) ainda estão sem "lido". Busca tudo de uma vez (por tabela, não
// por usuário) pra não fazer uma consulta pra cada pessoa.
async function viewPendenciasLeitura(){
  document.getElementById('page-title').textContent = 'Pendências de Leitura';
  document.getElementById('page-sub').textContent = 'O que cada usuário ainda não marcou como "lido", por aba.';

  const tabelasNotif = Object.keys(TABLE_CONFIG).filter(t=>TABLE_CONFIG[t].notificacoes);
  const [{ data: usuarios, error: errUsuarios }, ...resultados] = await Promise.all([
    sb.rpc('listar_usuarios'),
    ...tabelasNotif.map(t=>{
      const cfg = TABLE_CONFIG[t];
      return Promise.all([
        sb.from(cfg.notifEventosTable).select('id, criado_por, tipo, campo, item_id'),
        sb.from(cfg.notifLidosTable).select('evento_id, usuario_id'),
      ]);
    }),
  ]);
  if (errUsuarios) throw errUsuarios;
  const errosNotificacoes = resultados.flat().map(r=>r?.error).filter(Boolean);
  if (errosNotificacoes.length) reportarFalhaNotificacoes('Erro ao carregar Pendências de Leitura', errosNotificacoes);

  const porTabela = {};
  tabelasNotif.forEach((t, i)=>{
    const [{ data: eventos }, { data: lidos }] = resultados[i];
    const lidosPorEvento = new Map();
    (lidos||[]).forEach(l=>{
      if (!lidosPorEvento.has(l.evento_id)) lidosPorEvento.set(l.evento_id, new Set());
      lidosPorEvento.get(l.evento_id).add(l.usuario_id);
    });
    porTabela[t] = { eventos: eventos||[], lidosPorEvento };
  });

  function podeVerAba(role, aba){
    const perm = permissoesPara(aba, role);
    return !!(perm.acesso && (perm.ver_proprio || perm.ver_outros));
  }

  // null = a pessoa não tem acesso a essa aba de jeito nenhum (não conta
  // como pendência — ela nunca vai ser cobrada de ler algo que não pode
  // nem ver). Só conta de verdade quando o papel tem "ver_proprio" ou
  // "ver_outros" naquela aba.
  function pendentesPara(usuario, tabela){
    const cfg = TABLE_CONFIG[tabela];
    if (!podeVerAba(usuario.role, cfg.aba)) return null;
    const { eventos, lidosPorEvento } = porTabela[tabela];
    return eventos.filter(ev=>{
      if (ev.criado_por === usuario.id) return false; // ninguém "deve" ler a própria mudança
      if (!classificarEventoNotificacao(cfg, ev)) return false;
      const lidoPor = lidosPorEvento.get(ev.id);
      return !lidoPor || !lidoPor.has(usuario.id);
    }).length;
  }

  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="section-note">Conta registros novos, campos alterados, checklists e imagens que cada pessoa ainda não marcou como lido — em cada aba que tem esse sistema de notificação. Papéis sem acesso a uma aba nem entram na conta dela (célula em branco).</div>
    <div class="table-wrap"><table>
      <thead><tr><th>Usuário</th>${tabelasNotif.map(t=>`<th class="csp-inline-060">${escapeHtml(TABLE_CONFIG[t].title)}</th>`).join('')}<th class="csp-inline-060">Total</th></tr></thead>
      <tbody>
        ${(usuarios||[]).map(u=>{
          const porT = tabelasNotif.map(t=>pendentesPara(u, t));
          const total = porT.reduce((a,b)=>a+(b||0), 0);
          return `<tr>
            <td>${escapeHtml(u.nome)} <span class="role-stamp role-${u.role} csp-inline-013">${escapeHtml(ROTULO_PAPEL[u.role]||u.role)}</span></td>
            ${porT.map(n=>n===null ? `<td class="csp-inline-061" title="Papel sem acesso a esta aba">·</td>` : `<td data-csp-style="text-align:center;${n?'font-weight:800;color:var(--c-orange);':'color:var(--text-faint);'}">${n||'—'}</td>`).join('')}
            <td data-csp-style="text-align:center;font-weight:800;${total?'color:var(--c-orange);':'color:var(--text-faint);'}">${total||'—'}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table></div>
  `;

  currentSilentRefresh = async ()=>{ await viewPendenciasLeitura(); };
}

async function viewAuditoria(){
  document.getElementById('page-title').textContent = 'Log de Auditoria';
  document.getElementById('page-sub').textContent = 'Histórico de todas as alterações feitas por cada usuário.';
  const { data, error } = await sb.from('audit_log').select('*').order('created_at',{ascending:false}).limit(300);
  if (error) throw error;

  const chaveEstado = `tabela_estado_auditoria_${currentUser.id}`;
  const state = { busca:'', colFiltros:{}, sortRules:[] };
  function salvarEstado(){
    const colFiltrosSerializado = {};
    Object.entries(state.colFiltros).forEach(([k,set])=>{ colFiltrosSerializado[k] = Array.from(set); });
    localStorage.setItem(chaveEstado, JSON.stringify({ busca: state.busca, colFiltros: colFiltrosSerializado, sortRules: state.sortRules }));
  }
  function carregarEstado(){
    try{
      const raw = localStorage.getItem(chaveEstado);
      if (!raw) return;
      const obj = JSON.parse(raw);
      state.busca = obj.busca || '';
      state.sortRules = obj.sortRules || [];
      state.colFiltros = {};
      Object.entries(obj.colFiltros || {}).forEach(([k,arr])=>{ state.colFiltros[k] = new Set(arr); });
    }catch(e){}
  }
  carregarEstado();

  function valorExibivel(r, campo){
    if (campo.key==='created_at') return r.created_at;
    if (campo.key==='user_nome') return r.user_nome || r.user_email || '—';
    return r[campo.key] ?? '';
  }

  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="toolbar">
      <input type="text" id="filter-audit" placeholder="Buscar em tudo..." class="csp-inline-062" />
      <button class="btn" id="btn-limpar-filtros" type="button">Limpar filtros e ordenação</button>
    </div>
    <div class="table-wrap tabela-principal"><table>
      <thead><tr>${CAMPOS_AUDITORIA.map(c=>`<th><div class="th-inner">
        <button type="button" class="th-sort" data-key="${c.key}">${c.label}<span class="sort-arrow" data-arrow="${c.key}"></span></button>
        <button type="button" class="th-filtro" data-key="${c.key}" title="Filtrar esta coluna">▾</button>
      </div></th>`).join('')}<th>Alteração</th></tr></thead>
      <tbody id="tbody"></tbody>
    </table></div>`;

  function render(rows){
    const tbody = document.getElementById('tbody');
    if (!rows.length){ tbody.innerHTML = `<tr class="empty-row"><td colspan="5">Nenhum registro de auditoria.</td></tr>`; return; }
    tbody.innerHTML = rows.map(r=>{
      const cor = r.acao==='INSERT'?'var(--c-moss)':r.acao==='DELETE'?'var(--accent)':'var(--accent-2)';
      return `<tr>
        <td>${new Date(r.created_at).toLocaleString('pt-BR')}</td>
        <td>${escapeHtml(r.user_nome||r.user_email||'—')}</td>
        <td>${escapeHtml(r.tabela)}</td>
        <td><span class="badge" data-csp-style="background-color:${cor}">${r.acao}</span></td>
        <td><button class="icon-btn" data-action="show-diff" data-audit-json="${escapeHtml(JSON.stringify(r))}">ver diferença</button></td>
      </tr>`;
    }).join('');
  }

  function atualizarIndicadoresOrdenacao(){
    document.querySelectorAll('.sort-arrow').forEach(a=>a.textContent='');
    state.sortRules.forEach((rule, i)=>{
      const arrow = document.querySelector(`.sort-arrow[data-arrow="${rule.key}"]`);
      if (arrow) arrow.textContent = ` ${rule.dir===1?'▲':'▼'}${state.sortRules.length>1 ? (i+1) : ''}`;
    });
  }
  function atualizarIndicadoresFiltro(){
    document.querySelectorAll('.th-filtro').forEach(btn=>{
      btn.classList.toggle('ativo', !!state.colFiltros[btn.dataset.key]);
    });
  }
  function aplicarFiltrosOrdenacao(){
    let rows = data.slice();
    if (state.busca){
      rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(state.busca));
    }
    Object.entries(state.colFiltros).forEach(([key, valoresPermitidos])=>{
      const campo = CAMPOS_AUDITORIA.find(x=>x.key===key);
      rows = rows.filter(r => valoresPermitidos.has(String(valorExibivel(r, campo))));
    });
    if (state.sortRules.length){
      const regras = state.sortRules.map(rule => ({ campo: CAMPOS_AUDITORIA.find(x=>x.key===rule.key), dir: rule.dir }));
      rows.sort((a,b)=>{
        for (const { campo, dir } of regras){
          let va = valorExibivel(a, campo), vb = valorExibivel(b, campo);
          if (typeof va === 'number' || typeof vb === 'number'){ va = Number(va)||0; vb = Number(vb)||0; }
          else { va = String(va).toLowerCase(); vb = String(vb).toLowerCase(); }
          if (va < vb) return -1*dir;
          if (va > vb) return 1*dir;
        }
        return 0;
      });
    }
    render(rows);
  }

  aplicarFiltrosOrdenacao();
  ativarRedimensionamentoColunas(root.querySelector('.tabela-principal table'), 'auditoria');
  atualizarIndicadoresOrdenacao();
  atualizarIndicadoresFiltro();

  const filterEl = document.getElementById('filter-audit');
  filterEl.value = state.busca;
  filterEl.addEventListener('input', (e)=>{
    state.busca = e.target.value.toLowerCase();
    salvarEstado();
    aplicarFiltrosOrdenacao();
  });
  document.getElementById('btn-limpar-filtros').addEventListener('click', ()=>{
    state.busca=''; state.colFiltros={}; state.sortRules=[];
    filterEl.value='';
    localStorage.removeItem(chaveEstado);
    atualizarIndicadoresOrdenacao(); atualizarIndicadoresFiltro(); aplicarFiltrosOrdenacao();
    toast('Filtros e ordenação removidos.');
  });
  document.querySelectorAll('.th-sort').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const key = btn.dataset.key;
      const existente = state.sortRules.find(r=>r.key===key);
      if (e.shiftKey){
        if (existente) existente.dir *= -1;
        else state.sortRules.push({ key, dir:1 });
      } else {
        if (state.sortRules.length===1 && existente) existente.dir *= -1;
        else state.sortRules = [{ key, dir:1 }];
      }
      atualizarIndicadoresOrdenacao();
      salvarEstado();
      aplicarFiltrosOrdenacao();
    });
  });
  document.querySelectorAll('.th-filtro').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const key = btn.dataset.key;
      const campo = CAMPOS_AUDITORIA.find(x=>x.key===key);
      const valoresDisponiveis = Array.from(new Set(data.map(r=>String(valorExibivel(r, campo))))).sort();
      abrirFlutuante(btn, 'msel-panel-float', (painel)=>{
        const marcados = state.colFiltros[key] || new Set(valoresDisponiveis);
        function montarLista(filtroTexto){
          const itens = valoresDisponiveis
            .map(v=>({ v, rotulo: campo.key==='created_at' ? (v ? new Date(v).toLocaleString('pt-BR') : '(vazio)') : (v || '(vazio)') }))
            .filter(({rotulo})=>!filtroTexto || rotulo.toLowerCase().includes(filtroTexto));
          return itens.map(({v,rotulo})=>`<label><input type="checkbox" value="${escapeHtml(v)}" ${marcados.has(v)?'checked':''}> ${escapeHtml(rotulo)}</label>`).join('') || '<div class="csp-inline-014">Nenhum valor encontrado.</div>';
        }
        painel.innerHTML = `
          <input type="text" class="cell-input csp-inline-015" id="busca-valores" placeholder="Buscar valor…" />
          <div class="csp-inline-016">
            <button type="button" class="link-btn" data-acao="todos">Marcar todos</button>
            <button type="button" class="link-btn" data-acao="nenhum">Desmarcar todos</button>
          </div>
          <div class="filtro-lista">${montarLista('')}</div>
        `;
        function religarCheckboxes(){
          painel.querySelectorAll('.filtro-lista input[type=checkbox]').forEach(cb=>{
            cb.addEventListener('change', ()=>{
              if (!state.colFiltros[key]) state.colFiltros[key] = new Set(valoresDisponiveis);
              if (cb.checked) state.colFiltros[key].add(cb.value); else state.colFiltros[key].delete(cb.value);
              if (state.colFiltros[key].size === valoresDisponiveis.length) delete state.colFiltros[key];
              atualizarIndicadoresFiltro(); salvarEstado(); aplicarFiltrosOrdenacao();
            });
          });
        }
        religarCheckboxes();
        painel.querySelector('[data-acao="todos"]').addEventListener('click', ()=>{
          delete state.colFiltros[key];
          painel.querySelectorAll('.filtro-lista input[type=checkbox]').forEach(cb=>cb.checked=true);
          atualizarIndicadoresFiltro(); salvarEstado(); aplicarFiltrosOrdenacao();
        });
        painel.querySelector('[data-acao="nenhum"]').addEventListener('click', ()=>{
          state.colFiltros[key] = new Set();
          painel.querySelectorAll('.filtro-lista input[type=checkbox]').forEach(cb=>cb.checked=false);
          atualizarIndicadoresFiltro(); salvarEstado(); aplicarFiltrosOrdenacao();
        });
        painel.querySelector('#busca-valores').addEventListener('input', (e)=>{
          painel.querySelector('.filtro-lista').innerHTML = montarLista(e.target.value.toLowerCase());
          religarCheckboxes();
        });
      });
    });
  });

  currentSilentRefresh = async ()=>{
    const { data: novosDados, error: err2 } = await sb.from('audit_log').select('*').order('created_at',{ascending:false}).limit(300);
    if (err2) return;
    data.length = 0; data.push(...novosDados);
    aplicarFiltrosOrdenacao();
  };
}
window.showDiff = function(rowJson){
  const r = JSON.parse(rowJson);
  const oldData = r.dados_antigos || {}; const newData = r.dados_novos || {};
  const keys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)])).filter(k=>!['created_at','updated_at'].includes(k));
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById('modal-content');
  modal.innerHTML = `<h3>Detalhes — ${escapeHtml(r.tabela)} (${escapeHtml(r.acao)})</h3>
    <div class="table-wrap csp-inline-063"><table>
      <thead><tr><th>Campo</th><th>Antes</th><th>Depois</th></tr></thead>
      <tbody>${keys.map(k=>{
        const ov=oldData[k], nv=newData[k]; const changed = JSON.stringify(ov)!==JSON.stringify(nv);
        return `<tr><td>${escapeHtml(k)}</td>
          <td class="${changed && r.acao!=='INSERT' ? 'diff-old':''}">${ov===undefined?'':escapeHtml(String(ov))}</td>
          <td class="${changed && r.acao!=='DELETE' ? 'diff-new':''}">${nv===undefined?'':escapeHtml(String(nv))}</td></tr>`;
      }).join('')}</tbody>
    </table></div>
    <div class="modal-actions"><button class="btn btn-ghost" data-action="close-modal">Fechar</button></div>`;
  backdrop.classList.add('active');
};
let ultimoAbridorModal = null;
const backdropModal = document.getElementById('modal-backdrop');
const conteudoModal = document.getElementById('modal-content');
const focoModal = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
document.addEventListener('click', (e)=>{
  if (!backdropModal.classList.contains('active')){
    const alvo = e.target.closest('button, [role="button"], a, input, select, textarea');
    if (alvo) ultimoAbridorModal = alvo;
  }
}, true);
function prepararModalAcessivel(){
  const titulo = conteudoModal.querySelector('h3');
  if (titulo){ titulo.id = 'modal-title'; conteudoModal.setAttribute('aria-labelledby', 'modal-title'); }
  if (!conteudoModal.querySelector('.modal-close-top')){
    conteudoModal.insertAdjacentHTML('afterbegin', '<button type="button" class="btn btn-ghost modal-close-top" aria-label="Fechar modal" title="Fechar" data-action="close-modal">× <span aria-hidden="true">Fechar</span></button>');
  }
  backdropModal.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(()=> conteudoModal.querySelector('.modal-close-top')?.focus());
}
window.closeModal = function(){
  backdropModal.classList.remove('active');
  backdropModal.setAttribute('aria-hidden', 'true');
  conteudoModal.classList.remove('modal-wide');
  if (ultimoAbridorModal && document.contains(ultimoAbridorModal)) requestAnimationFrame(()=>ultimoAbridorModal.focus());
};
new MutationObserver(()=>{
  if (backdropModal.classList.contains('active')) prepararModalAcessivel();
}).observe(backdropModal, { attributes:true, attributeFilter:['class'] });
document.addEventListener('keydown', (e)=>{
  if (!backdropModal.classList.contains('active')) return;
  if (e.key==='Escape'){ e.preventDefault(); closeModal(); return; }
  if (e.key !== 'Tab') return;
  const focaveis = [...conteudoModal.querySelectorAll(focoModal)].filter(el=>el.offsetParent !== null);
  if (!focaveis.length){ e.preventDefault(); conteudoModal.focus(); return; }
  const primeiro = focaveis[0], ultimo = focaveis[focaveis.length-1];
  if (e.shiftKey && document.activeElement===primeiro){ e.preventDefault(); ultimo.focus(); }
  else if (!e.shiftKey && document.activeElement===ultimo){ e.preventDefault(); primeiro.focus(); }
});
backdropModal.addEventListener('click', (e)=>{ if (e.target===backdropModal) closeModal(); });

// Lightbox — clique numa imagem do projeto pra ver ampliada
function abrirLightbox(src){
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox-backdrop').classList.add('active');
}
document.getElementById('lightbox-backdrop').addEventListener('click', ()=>{
  document.getElementById('lightbox-backdrop').classList.remove('active');
  document.getElementById('lightbox-img').src = '';
});

// ── Detalhes (descrição, checklists, imagens do Google Drive) ─────────────
// Funciona tanto pra Projetos quanto pra Chamados do SAC.
const IMAGE_HOSTS_PERMITIDOS = new Set(['drive.google.com', 'lh3.googleusercontent.com']);
function validarUrlImagem(valor){
  try{
    const url = new URL((valor||'').trim());
    const hostPermitido = IMAGE_HOSTS_PERMITIDOS.has(url.hostname) || /^[a-z0-9-]+\.supabase\.co$/i.test(url.hostname);
    return url.protocol === 'https:' && hostPermitido ? url.href : null;
  }catch{
    return null;
  }
}
function converterLinkDrive(url){
  const u = validarUrlImagem(url);
  if (!u) return '';
  let m = /\/file\/d\/([^/]+)/.exec(u);
  if (!m) m = /[?&]id=([^&]+)/.exec(u);
  if (m) return `https://drive.google.com/thumbnail?id=${encodeURIComponent(m[1])}&sz=w1000`;
  return u;
}

const DETALHE_CONFIG = {
  projetos: {
    campoTitulo: 'projeto', tituloGenerico: 'Projeto',
    statusGrupo: 'projetos_status', campoPrazo: 'previsao_conclusao',
    respTable: 'projetos_responsaveis', respFk: 'projeto_id',
    checklistGruposTable: 'projetos_checklist_grupos', checklistTable: 'projetos_checklist', checklistFk: 'projeto_id',
    imagensTable: 'projetos_imagens', imagensFk: 'projeto_id',
    campoDescricao: 'descricao_detalhada',
    campoTipoTemplate: 'categoria', rotuloTipoTemplate: 'Categoria',
    notificacoes: true, notifEventosTable:'projetos_eventos', notifLidosTable:'projetos_eventos_lidos', notifFk:'projeto_id',
  },
  chamados_sac: {
    campoTitulo: 'numero_chamado', tituloGenerico: 'Chamado',
    statusGrupo: 'chamados_status', campoPrazo: 'data_resolucao',
    respTable: 'chamados_sac_responsaveis', respFk: 'chamado_id',
    checklistGruposTable: 'chamados_checklist_grupos', checklistTable: 'chamados_checklist', checklistFk: 'chamado_id',
    imagensTable: 'chamados_imagens', imagensFk: 'chamado_id',
    campoDescricao: 'descricao_detalhada',
    campoTipoTemplate: 'motivo', rotuloTipoTemplate: 'Motivo',
    notificacoes: true, notifEventosTable:'chamados_sac_eventos', notifLidosTable:'chamados_sac_eventos_lidos', notifFk:'chamado_id',
  },
  pedidos_agendamentos_industria: {
    campoTitulo: 'numero_registro', tituloGenerico: 'Pedido/Agendamento',
    statusGrupo: 'sacind_status', campoPrazo: 'data_resolucao',
    respTable: 'pedidos_agendamentos_industria_responsaveis', respFk: 'pedido_agendamento_id',
    checklistGruposTable: 'pedidos_agendamentos_industria_checklist_grupos', checklistTable: 'pedidos_agendamentos_industria_checklist', checklistFk: 'pedido_agendamento_id',
    imagensTable: 'pedidos_agendamentos_industria_imagens', imagensFk: 'pedido_agendamento_id',
    campoDescricao: 'descricao_detalhada',
    campoTipoTemplate: 'tipo', rotuloTipoTemplate: 'Tipo',
    notificacoes: true, notifEventosTable:'pedidos_agendamentos_industria_eventos', notifLidosTable:'pedidos_agendamentos_industria_eventos_lidos', notifFk:'pedido_agendamento_id',
  },
  reclamacoes_industria: {
    campoTitulo: 'numero_reclamacao', tituloGenerico: 'Reclamação',
    statusGrupo: 'sacind_status', campoPrazo: 'data_resolucao',
    respTable: 'reclamacoes_industria_responsaveis', respFk: 'reclamacao_id',
    checklistGruposTable: 'reclamacoes_industria_checklist_grupos', checklistTable: 'reclamacoes_industria_checklist', checklistFk: 'reclamacao_id',
    imagensTable: 'reclamacoes_industria_imagens', imagensFk: 'reclamacao_id',
    campoDescricao: 'descricao_detalhada',
    campoTipoTemplate: 'tipo_problema_id', rotuloTipoTemplate: 'Tipo de problema',
    notificacoes: true, notifEventosTable:'reclamacoes_industria_eventos', notifLidosTable:'reclamacoes_industria_eventos_lidos', notifFk:'reclamacao_id',
  },
};

window.abrirDetalhes = async function(tabela, id){
  const cfg = DETALHE_CONFIG[tabela];
  const [{ data: registro, error: errReg }, { data: resp }, { data: grupos }, { data: checklist }, { data: imagens }] = await Promise.all([
    sb.from(tabela).select('*').eq('id', id).single(),
    sb.from(cfg.respTable).select('profile_id').eq(cfg.respFk, id),
    sb.from(cfg.checklistGruposTable).select('*').eq(cfg.checklistFk, id).order('ordem').order('created_at'),
    sb.from(cfg.checklistTable).select('*').eq(cfg.checklistFk, id).order('ordem').order('created_at'),
    sb.from(cfg.imagensTable).select('*').eq(cfg.imagensFk, id).order('ordem').order('created_at'),
  ]);
  if (errReg || !registro) return toast('Não foi possível carregar os detalhes.', true);
  if (!profilesCache.length) await loadProfilesCache();

  // Notificações individuais (descrição, checklists e imagens) — mesma
  // lógica da tabela: só aparece pra quem NÃO fez a mudança, e some quando
  // essa pessoa clica em "lido" (não afeta os outros). Cada item/campo
  // guarda uma LISTA de ids — se mudou mais de uma vez, um clique só em
  // "lido" resolve tudo de uma vez, sem sobrar nada pra "reaparecer" depois.
  let eventosItemMap = {};   // por item_id (checklist, checklist_grupo ou imagem)
  let eventosDescricao = []; // ids de evento da "Descrição da tarefa"
  if (cfg.notificacoes){
    const [eventosDetalheResult, lidosDetalheResult] = await Promise.all([
      sb.from(cfg.notifEventosTable).select('*').eq(cfg.notifFk, id),
      sb.from(cfg.notifLidosTable).select('evento_id').eq('usuario_id', currentUser.id),
    ]);
    if (eventosDetalheResult.error || lidosDetalheResult.error){
      reportarFalhaNotificacoes('Erro ao carregar notificações dos detalhes', [eventosDetalheResult.error, lidosDetalheResult.error]);
    }
    const lidosSet = new Set((lidosDetalheResult.data||[]).map(l=>l.evento_id));
    (eventosDetalheResult.data||[]).forEach(ev=>{
      if (ev.criado_por === currentUser.id) return;
      if (lidosSet.has(ev.id)) return;
      if (ev.tipo === 'edicao' && ev.campo === cfg.campoDescricao){
        eventosDescricao.push(ev.id);
        return;
      }
      if (!ev.item_id) return; // outros campos (status, franquia...) já aparecem na tabela, não aqui
      const atual = eventosItemMap[ev.item_id] || (eventosItemMap[ev.item_id] = { ids:[], tipo: ev.tipo, quando: ev.criado_em });
      atual.ids.push(ev.id);
      if (!atual.quando || ev.criado_em > atual.quando){ atual.tipo = ev.tipo; atual.quando = ev.criado_em; }
    });
  }
  function badgeNotifItem(itemId){
    const ev = eventosItemMap[itemId];
    if (!ev || !ev.ids.length) return '';
    const rotulo = ev.tipo==='checklist_criado' ? 'Novo item' : ev.tipo==='checklist_grupo_criado' ? 'Novo checklist' : ev.tipo==='imagem_adicionada' ? 'Nova' : 'Alterado';
    return `<span class="notif-badge notif-badge-editado" data-evento-badge-group="${ev.ids.join(',')}">${rotulo} <button type="button" class="notif-lido-btn" data-evento-ids="${ev.ids.join(',')}">lido</button></span>`;
  }
  function todosOsEventosNaoLidos(){
    return [...eventosDescricao, ...Object.values(eventosItemMap).flatMap(ev=>ev.ids)];
  }

  const nomesResp = profilesCache.filter(p=>(resp||[]).map(r=>r.profile_id).includes(p.id)).map(p=>p.nome).join(', ') || 'Vazio';
  const corStatus = registro.status ? corDaOpcao(cfg.statusGrupo, registro.status) : 'var(--text-faint)';
  const tituloExibido = registro[cfg.campoTitulo] || cfg.tituloGenerico;

  // Se ainda não tem nenhum checklist e o tipo (categoria/motivo) tem um
  // modelo cadastrado, sugere aplicar.
  let sugestaoTemplates = [];
  if (!(grupos && grupos.length) && registro[cfg.campoTipoTemplate]){
    const { data: tpls } = await sb.from('templates_checklist_grupos').select('*, templates_checklist_itens(*)')
      .eq('tabela', tabela).eq('tipo_valor', registro[cfg.campoTipoTemplate]).order('ordem');
    sugestaoTemplates = tpls || [];
  }

  function itensDoGrupo(grupoId){ return (checklist||[]).filter(it=>it.grupo_id===grupoId); }
  function progressoGrupo(itens){
    if (!itens.length) return 0;
    return Math.round((itens.filter(i=>i.concluido).length / itens.length) * 100);
  }
  function montarItensHtml(itens){
    if (!itens.length) return '<div class="section-note csp-inline-054">Nenhum item ainda.</div>';
    return itens.map(it=>`
      <div class="checklist-item" data-id="${it.id}">
        ${badgeNotifItem(it.id)}
        <span class="arraste-handle" title="Arraste pra reordenar">⠿</span>
        <input type="checkbox" ${it.concluido?'checked':''} />
        <span class="checklist-item-text ${it.concluido?'checklist-done':''}">${escapeHtml(it.texto)}</span>
        <button type="button" class="icon-btn" data-edit="${it.id}" aria-label="Editar item ${escapeHtml(it.texto)}">editar</button>
        <button type="button" class="icon-btn csp-inline-055" data-del="${it.id}">excluir</button>
      </div>`).join('');
  }
  function montarGrupoHtml(g){
    const itens = itensDoGrupo(g.id);
    const pct = progressoGrupo(itens);
    return `<div class="checklist-grupo" data-grupo="${g.id}">
      <div class="checklist-grupo-head">
        <button type="button" class="icon-btn checklist-toggle" data-toggle-grupo="${g.id}" title="Recolher/Expandir checklist" aria-expanded="true"><span class="chev">▾</span></button>
        <input type="text" class="cell-input checklist-grupo-nome csp-inline-056" data-grupo-nome="${g.id}" value="${escapeHtml(g.nome)}" />
        ${badgeNotifItem(g.id)}
        <div class="progress-bar csp-inline-064"><div data-csp-style="width:${pct}%"></div></div>
        <span class="checklist-grupo-pct csp-inline-065">${pct}%</span>
        <button type="button" class="icon-btn checklist-grupo-dup csp-inline-055" data-dup-grupo="${g.id}" title="Duplicar este checklist com todos os itens">⧉ Duplicar</button>
        <button type="button" class="icon-btn" data-del-grupo="${g.id}">excluir checklist</button>
      </div>
      <div class="checklist-corpo-wrap">
        <div class="checklist-corpo-inner">
          <div class="checklist-itens" data-grupo-itens="${g.id}">${montarItensHtml(itens)}</div>
          <div class="csp-inline-057">
            <input type="text" class="cell-input novo-item csp-inline-053" data-grupo-novo="${g.id}" placeholder="Novo item..." />
            <button type="button" class="btn add-item csp-inline-032" data-grupo-add="${g.id}">+ Item</button>
          </div>
        </div>
      </div>
    </div>`;
  }
  function montarImagens(imgs){
    if (!imgs.length) return '<div class="section-note">Nenhuma imagem ainda.</div>';
    return imgs.map(img=>`
      <div class="img-thumb-wrap" data-id="${img.id}">
        ${badgeNotifItem(img.id)}
        <img src="${escapeHtml(converterLinkDrive(img.url))}" alt="Imagem" class="img-thumb" data-action="open-lightbox" />
        <div class="img-erro-msg">Não carregou. O arquivo precisa estar como "Qualquer pessoa com o link" no Drive.</div>
        <button type="button" class="img-thumb-del" data-del-img="${img.id}" title="Remover">×</button>
      </div>`).join('');
  }

  const modal = document.getElementById('modal-content');
  modal.classList.add('modal-wide');
  const totalNaoLidos = todosOsEventosNaoLidos();
  modal.innerHTML = `
    <div class="modal-fixed-head">
      <div class="csp-inline-066">
        <h3 class="csp-inline-024">${escapeHtml(tituloExibido)}</h3>
        ${(cfg.notificacoes && totalNaoLidos.length) ? `<button type="button" class="btn csp-inline-067" id="btn-marcar-tudo-lido">✓ Marcar tudo como lido (${totalNaoLidos.length})</button>` : ''}
      </div>
      <div class="csp-inline-068">
        <div><div class="kpi-label csp-inline-024">Responsável</div><div class="csp-inline-069">${escapeHtml(nomesResp)}</div></div>
        <div><div class="kpi-label csp-inline-024">Status</div><div><span class="badge" data-csp-style="background-color:${corMenuParaTema(corStatus)};color:${textoParaCorDeMenu(corStatus)}">${escapeHtml(registro.status||'Vazio')}</span></div></div>
        <div><div class="kpi-label csp-inline-024">Prazo</div><div class="csp-inline-069">${fmtDate(registro[cfg.campoPrazo]) || 'Vazio'}</div></div>
      </div>
    </div>

    <div class="modal-scroll-body">
      <div class="field"><label>Descrição da tarefa</label>
        ${eventosDescricao.length ? `<div class="notif-badge-wrap" data-evento-badge-group="${eventosDescricao.join(',')}"><span class="notif-badge notif-badge-editado">Alterada <button type="button" class="notif-lido-btn" data-evento-ids="${eventosDescricao.join(',')}">lido</button></span></div>` : ''}
        <textarea class="cell-input csp-inline-048" id="detalhe-descricao" rows="3">${escapeHtml(registro[cfg.campoDescricao]||'')}</textarea>
      </div>

      ${sugestaoTemplates.length ? `<div class="section-note csp-inline-070">
        <span>Existe${sugestaoTemplates.length>1?'m':''} modelo${sugestaoTemplates.length>1?'s':''} de checklist cadastrado${sugestaoTemplates.length>1?'s':''} pra ${cfg.rotuloTipoTemplate.toLowerCase()} "${escapeHtml(registro[cfg.campoTipoTemplate])}": ${sugestaoTemplates.map(t=>escapeHtml(t.nome)).join(', ')}.</span>
        <button class="btn btn-primary csp-inline-032" id="btn-aplicar-template">Aplicar modelo</button>
      </div>` : ''}

      <div class="csp-inline-071">
        <h4 class="csp-inline-072">Checklists</h4>
        <div class="csp-inline-073">
          <input type="text" class="cell-input csp-inline-074" id="novo-grupo-nome" placeholder="Nome do novo checklist..." />
          <button class="btn btn-primary csp-inline-032" id="btn-add-grupo">+ Novo checklist</button>
        </div>
      </div>
      <div id="detalhe-grupos">${(grupos&&grupos.length) ? grupos.map(montarGrupoHtml).join('') : ''}</div>

      <h4 class="csp-inline-075">Imagens (link do Google Drive)</h4>
      <div id="detalhe-imagens" class="csp-inline-076">${montarImagens(imagens||[])}</div>
      <div class="csp-inline-052">
        <input type="text" class="cell-input csp-inline-053" id="nova-imagem-url" placeholder="Cole o link de compartilhamento do Google Drive..." />
        <button class="btn btn-primary csp-inline-032" id="btn-add-imagem">+ Adicionar</button>
      </div>
    </div>

    <div class="modal-fixed-foot"><button class="btn btn-ghost" data-action="close-modal">Fechar</button></div>
  `;
  document.getElementById('modal-backdrop').classList.add('active');

  if (cfg.notificacoes){
    let restantes = totalNaoLidos.length;
    function atualizarContadorTudoLido(qtdMarcada){
      restantes -= qtdMarcada;
      const btnTudo = document.getElementById('btn-marcar-tudo-lido');
      if (!btnTudo) return;
      if (restantes <= 0){ btnTudo.remove(); return; }
      btnTudo.textContent = `✓ Marcar tudo como lido (${restantes})`;
    }
    modal.querySelectorAll('.notif-lido-btn').forEach(btn=>{
      btn.addEventListener('click', async (e)=>{
        e.stopPropagation();
        btn.disabled = true;
        const eventoIds = (btn.dataset.eventoIds||'').split(',').filter(Boolean);
        const badges = Array.from(modal.querySelectorAll(`[data-evento-badge-group="${btn.dataset.eventoIds}"]`));
        const ok = await marcarNotifLida(cfg.notifLidosTable, eventoIds, badges);
        if (!ok){ btn.disabled = false; return; }
        atualizarContadorTudoLido(eventoIds.length);
        // Atualiza a tabela por trás (silenciosamente) pra sumir com o
        // pontinho no botão "detalhes" da linha, sem precisar fechar e
        // reabrir nada.
        if (typeof currentSilentRefresh === 'function' && currentSilentRefresh) currentSilentRefresh();
      });
    });

    const btnTudo = document.getElementById('btn-marcar-tudo-lido');
    if (btnTudo){
      btnTudo.addEventListener('click', async ()=>{
        btnTudo.disabled = true;
        const badges = Array.from(modal.querySelectorAll('[data-evento-badge-group]'));
        const ok = await marcarNotifLida(cfg.notifLidosTable, totalNaoLidos, badges);
        if (!ok){ btnTudo.disabled = false; return; }
        btnTudo.remove();
        if (typeof currentSilentRefresh === 'function' && currentSilentRefresh) currentSilentRefresh();
      });
    }
  }

  function ligarItem(itemEl, grupoId){
    const cb = itemEl.querySelector('input[type=checkbox]');
    cb.addEventListener('change', async ()=>{
      const itemId = itemEl.dataset.id;
      const { error } = await sb.from(cfg.checklistTable).update({ concluido: cb.checked }).eq('id', itemId);
      if (error) return toast('Erro: '+error.message, true);
      itemEl.querySelector('.checklist-item-text')?.classList.toggle('checklist-done', cb.checked);
      const item = (checklist||[]).find(i=>i.id===itemId);
      if (item) item.concluido = cb.checked;
      atualizarProgresso(grupoId);
    });
    itemEl.querySelector('[data-del]').addEventListener('click', async ()=>{
      if (!(await confirmarAcao('Excluir este item?'))) return;
      const itemId = itemEl.dataset.id;
      const { error } = await sb.from(cfg.checklistTable).delete().eq('id', itemId);
      if (error) return toast('Erro: '+error.message, true);
      const idx = (checklist||[]).findIndex(i=>i.id===itemId);
      if (idx>=0) checklist.splice(idx,1);
      const grupoEl = document.querySelector(`.checklist-grupo[data-grupo="${grupoId}"]`);
      itemEl.remove();
      if (grupoEl){
        const itensDiv = grupoEl.querySelector('.checklist-itens');
        if (!itensDiv.querySelector('.checklist-item')) itensDiv.innerHTML = '<div class="section-note csp-inline-054">Nenhum item ainda.</div>';
      }
      atualizarProgresso(grupoId);
    });
    itemEl.querySelector('[data-edit]').addEventListener('click', ()=>{
      const itemId = itemEl.dataset.id;
      const item = (checklist||[]).find(i=>i.id===itemId);
      const texto = itemEl.querySelector('.checklist-item-text');
      if (!item || !texto || itemEl.querySelector('.checklist-item-edit')) return;
      const input = document.createElement('input');
      input.type = 'text'; input.value = item.texto || ''; input.className = 'cell-input checklist-item-edit';
      input.setAttribute('aria-label', 'Editar item do checklist');
      texto.replaceWith(input); input.focus(); input.select();
      let salvando = false;
      const salvar = async ()=>{
        if (salvando) return; salvando = true;
        const novoTexto = input.value.trim();
        if (!novoTexto){ toast('O item não pode ficar vazio.', true); input.focus(); salvando=false; return; }
        if (novoTexto !== item.texto){
          const { error } = await sb.from(cfg.checklistTable).update({ texto: novoTexto }).eq('id', itemId);
          if (error){ toast('Erro: '+error.message, true); salvando=false; return; }
          item.texto = novoTexto; toast('Item atualizado.');
        }
        const novoSpan = document.createElement('span');
        novoSpan.className = 'checklist-item-text' + (item.concluido ? ' checklist-done' : '');
        novoSpan.textContent = item.texto; input.replaceWith(novoSpan);
      };
      input.addEventListener('blur', salvar);
      input.addEventListener('keydown', e=>{ if (e.key==='Enter'){ e.preventDefault(); salvar(); } if (e.key==='Escape'){ input.value=item.texto; input.blur(); } });
    });
    ligarArrasteItem(itemEl);
  }

  // Liga cada grupo UMA vez só: os itens existentes (via ligarItem) e os
  // controles do grupo (adicionar, renomear, excluir). Itens novos, criados
  // depois, são ligados individualmente por ligarItem — nunca chamamos essa
  // função de novo pro mesmo grupo (era isso que duplicava os listeners).
  function ligarGrupo(grupoId){
    const grupoEl = document.querySelector(`.checklist-grupo[data-grupo="${grupoId}"]`);
    if (!grupoEl) return;
    grupoEl.querySelectorAll('.checklist-item').forEach(itemEl=>ligarItem(itemEl, grupoId));
    ligarArrasteContainer(grupoEl.querySelector('.checklist-itens'), '.checklist-item', (ids)=>persistirOrdem(cfg.checklistTable, ids));

    const btnAdd = grupoEl.querySelector('[data-grupo-add]');
    const inpNovo = grupoEl.querySelector('[data-grupo-novo]');
    btnAdd.addEventListener('click', async ()=>{
      const texto = inpNovo.value.trim();
      if (!texto) return;
      const { data: novo, error } = await sb.from(cfg.checklistTable).insert({ [cfg.checklistFk]: id, grupo_id: grupoId, texto, ordem: itensDoGrupo(grupoId).length }).select().single();
      if (error) return toast('Erro: '+error.message, true);
      inpNovo.value = '';
      checklist.push(novo);
      const itensDiv = grupoEl.querySelector('.checklist-itens');
      if (itensDiv.querySelector('.section-note')) itensDiv.innerHTML = '';
      itensDiv.insertAdjacentHTML('beforeend', montarItensHtml([novo]));
      ligarItem(itensDiv.querySelector(`.checklist-item[data-id="${novo.id}"]`), grupoId);
      atualizarProgresso(grupoId);
    });
    inpNovo.addEventListener('keydown', (e)=>{ if (e.key==='Enter') btnAdd.click(); });

    const nomeInput = grupoEl.querySelector('.checklist-grupo-nome');
    nomeInput.addEventListener('blur', async ()=>{
      const novoNome = nomeInput.value.trim() || 'Checklist';
      const { error } = await sb.from(cfg.checklistGruposTable).update({ nome: novoNome }).eq('id', grupoId);
      if (error) return toast('Erro: '+error.message, true);
      flashSaved(nomeInput);
    });

    const btnDelGrupo = grupoEl.querySelector('[data-del-grupo]');
    btnDelGrupo.addEventListener('click', async ()=>{
      if (!(await confirmarAcao('Excluir este checklist inteiro (e todos os itens dele)?'))) return;
      const { error } = await sb.from(cfg.checklistGruposTable).delete().eq('id', grupoId);
      if (error) return toast('Erro: '+error.message, true);
      grupoEl.remove();
      if (!document.querySelector('.checklist-grupo')){
        document.getElementById('detalhe-grupos').innerHTML = '';
      }
    });

    const btnToggle = grupoEl.querySelector('[data-toggle-grupo]');
    btnToggle.addEventListener('click', ()=>{
      const recolhido = grupoEl.classList.toggle('recolhido');
      btnToggle.setAttribute('aria-expanded', recolhido ? 'false' : 'true');
    });

    const btnDup = grupoEl.querySelector('[data-dup-grupo]');
    btnDup.addEventListener('click', async ()=>{
      btnDup.disabled = true;
      try{
        const grupoOriginal = grupos.find(gr=>gr.id===grupoId);
        const nomeCopia = (grupoOriginal ? grupoOriginal.nome : 'Checklist') + ' (cópia)';
        const { data: novoGrupo, error } = await sb.from(cfg.checklistGruposTable).insert({ [cfg.checklistFk]: id, nome: nomeCopia, ordem: (grupos||[]).length }).select().single();
        if (error) return toast('Erro: '+error.message, true);
        grupos.push(novoGrupo);
        const itensOriginais = itensDoGrupo(grupoId);
        if (itensOriginais.length){
          const { data: novosItens, error: errItens } = await sb.from(cfg.checklistTable)
            .insert(itensOriginais.map((it,i)=>({ [cfg.checklistFk]: id, grupo_id: novoGrupo.id, texto: it.texto, concluido: it.concluido, ordem: i })))
            .select();
          if (errItens) return toast('Erro: '+errItens.message, true);
          checklist.push(...(novosItens||[]));
        }
        const container = document.getElementById('detalhe-grupos');
        if (container.querySelector('.section-note')) container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', montarGrupoHtml(novoGrupo));
        ligarGrupo(novoGrupo.id);
        toast('Checklist duplicado.');
      } finally {
        btnDup.disabled = false;
      }
    });
  }
  function atualizarProgresso(grupoId){
    const grupoEl = document.querySelector(`.checklist-grupo[data-grupo="${grupoId}"]`);
    if (!grupoEl) return;
    const pct = progressoGrupo(itensDoGrupo(grupoId));
    grupoEl.querySelector('.progress-bar > div').style.width = pct+'%';
    grupoEl.querySelector('.checklist-grupo-pct').textContent = pct+'%';
  }
  (grupos||[]).forEach(g=>ligarGrupo(g.id));

  document.getElementById('btn-add-grupo').addEventListener('click', async ()=>{
    const inp = document.getElementById('novo-grupo-nome');
    const nome = inp.value.trim() || 'Checklist';
    const { data: novoGrupo, error } = await sb.from(cfg.checklistGruposTable).insert({ [cfg.checklistFk]: id, nome, ordem: (grupos||[]).length }).select().single();
    if (error) return toast('Erro: '+error.message, true);
    inp.value = '';
    grupos.push(novoGrupo);
    const container = document.getElementById('detalhe-grupos');
    if (container.querySelector('.section-note')) container.innerHTML = '';
    container.insertAdjacentHTML('beforeend', montarGrupoHtml(novoGrupo));
    ligarGrupo(novoGrupo.id);
  });
  document.getElementById('novo-grupo-nome').addEventListener('keydown', (e)=>{ if (e.key==='Enter') document.getElementById('btn-add-grupo').click(); });

  const btnAplicarTemplate = document.getElementById('btn-aplicar-template');
  if (btnAplicarTemplate){
    btnAplicarTemplate.addEventListener('click', async ()=>{
      btnAplicarTemplate.disabled = true;
      for (const tpl of sugestaoTemplates){
        const { data: novoGrupo, error } = await sb.from(cfg.checklistGruposTable).insert({ [cfg.checklistFk]: id, nome: tpl.nome, ordem: (grupos||[]).length }).select().single();
        if (error){ toast('Erro: '+error.message, true); continue; }
        grupos.push(novoGrupo);
        const itensTpl = (tpl.templates_checklist_itens||[]).sort((a,b)=>(a.ordem||0)-(b.ordem||0));
        if (itensTpl.length){
          const { data: novosItens, error: errItens } = await sb.from(cfg.checklistTable)
            .insert(itensTpl.map(it=>({ [cfg.checklistFk]: id, grupo_id: novoGrupo.id, texto: it.texto })))
            .select();
          if (!errItens) checklist.push(...(novosItens||[]));
        }
        const container = document.getElementById('detalhe-grupos');
        if (container.querySelector('.section-note')) container.innerHTML = '';
        container.insertAdjacentHTML('beforeend', montarGrupoHtml(novoGrupo));
        ligarGrupo(novoGrupo.id);
      }
      btnAplicarTemplate.closest('.section-note').remove();
      toast('Modelo aplicado.');
    });
  }

  function ligarImagens(){
    document.querySelectorAll('#detalhe-imagens [data-del-img]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        if (!(await confirmarAcao('Remover esta imagem?'))) return;
        const { error } = await sb.from(cfg.imagensTable).delete().eq('id', btn.dataset.delImg);
        if (error) return toast('Erro: '+error.message, true);
        btn.closest('.img-thumb-wrap').remove();
      });
    });
  }
  ligarImagens();

  document.getElementById('detalhe-descricao').addEventListener('blur', async (e)=>{
    const ok = await saveField(tabela, id, cfg.campoDescricao, e.target.value || null);
    if (ok) flashSaved(e.target);
  });

  document.getElementById('btn-add-imagem').addEventListener('click', async ()=>{
    const inp = document.getElementById('nova-imagem-url');
    const url = validarUrlImagem(inp.value);
    if (!url) return toast('Use uma URL HTTPS do Google Drive ou do Storage autorizado.', true);
    const { data: nova, error } = await sb.from(cfg.imagensTable).insert({ [cfg.imagensFk]: id, url }).select().single();
    if (error) return toast('Erro: '+error.message, true);
    inp.value = '';
    const container = document.getElementById('detalhe-imagens');
    if (container.querySelector('.section-note')) container.innerHTML = '';
    container.insertAdjacentHTML('beforeend', montarImagens([nova]));
    ligarImagens();
  });
  document.getElementById('nova-imagem-url').addEventListener('keydown', (e)=>{ if (e.key==='Enter') document.getElementById('btn-add-imagem').click(); });
};

// Calcula marcações "redondas" pro eixo de valores (0, 5, 10, 15... por
// exemplo), em vez de números quebrados, pra ficar fácil de ler a escala.
function calcularTicksEixo(maxVal, qtdAlvo=4){
  if (maxVal <= 0) return [0,1];
  const passoBruto = maxVal / qtdAlvo;
  const magnitude = Math.pow(10, Math.floor(Math.log10(passoBruto)));
  const normalizado = passoBruto / magnitude;
  let passo;
  if (normalizado < 1.5) passo = 1;
  else if (normalizado < 3) passo = 2;
  else if (normalizado < 7) passo = 5;
  else passo = 10;
  passo *= magnitude;
  const ticks = [];
  for (let v=0; v<=maxVal + passo*0.001; v+=passo) ticks.push(Math.round(v*100)/100);
  return ticks;
}
function svgEixoValores(ticks, maxEixo, padL, padR, padT, areaH, w){
  let out = '';
  ticks.forEach(t=>{
    const y = padT + areaH - (t/maxEixo)*areaH;
    out += `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${w-padR}" y2="${y.toFixed(1)}" stroke="currentColor" stroke-opacity="0.12" stroke-width="1"/>`;
    out += `<text x="${(padL-8).toFixed(1)}" y="${(y+3).toFixed(1)}" font-size="9" text-anchor="end" fill="currentColor" opacity="0.6">${t}</text>`;
  });
  return out;
}

function svgBarChart(pairs, color, nomeSerie='Série principal', rotuloEixo='Período'){
  if (!pairs || !pairs.length || pairs.every(p=>!p[1])) return `<div class="section-note">Ainda não há registros neste recorte. Ajuste o período ou registre um novo dado para acompanhar a evolução.</div>`;
  const chartId = `bar_${++__ddSeq}`;
  const w = 640, h = 190, padL = 34, padR = 14, padT = 20, padB = 28;
  const areaW = w - padL - padR, areaH = h - padT - padB;
  const max = Math.max(1, ...pairs.map(p=>p[1]));
  const ticks = calcularTicksEixo(max);
  const maxEixo = Math.max(ticks[ticks.length-1] || max, max);
  const barW = areaW / pairs.length * 0.6;
  const gap = areaW / pairs.length;
  const eixo = svgEixoValores(ticks, maxEixo, padL, padR, padT, areaH, w);
  let bars = '', labels = '';
  pairs.forEach((p,i)=>{
    const bh = (p[1]/maxEixo) * areaH;
    const x = padL + i*gap + (gap-barW)/2;
    const y = padT + areaH - bh;
    bars += `<g class="chart-point" data-chart-point="${i}" data-chart-tooltip="${escapeHtml(nomeSerie)}: ${p[1]}&#10;${escapeHtml(rotuloEixo)}: ${escapeHtml(p[0])}" data-chart-hover="${chartId}" data-chart-point="${i}" data-chart-serie="0"><rect class="chart-bar chart-series-${chartId}-0" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}" rx="4" fill="${color}"/><text class="chart-value" x="${(x+barW/2).toFixed(1)}" y="${(y-6).toFixed(1)}" font-size="11" text-anchor="middle" fill="currentColor">${p[1]}</text></g>`;
    labels += `<text class="chart-axis-label" data-axis-key="${i}" x="${(x+barW/2).toFixed(1)}" y="${h-8}" font-size="10" text-anchor="middle" fill="currentColor" opacity="0.65">${escapeHtmlXml(p[0])}</text>`;
  });
  return `<div data-chart="${chartId}"><div class="csp-inline-077"><button type="button" class="chart-legend-button" data-chart-legend="0" aria-pressed="true" data-action="toggle-chart-series" data-chart-id="${chartId}" data-chart-serie="0" title="Mostrar ou ocultar série"><span data-csp-style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${color};margin-right:5px;"></span>${escapeHtml(nomeSerie)}</button></div><svg viewBox="0 0 ${w} ${h}" class="csp-inline-078">${eixo}${bars}${labels}</svg></div>`;
}
function escapeHtmlXml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

// Gráfico de barras agrupadas — várias séries (lojas/franquias) lado a lado
// em cada mês, com legenda, eixo de valores e o número em cima de cada barra.
function svgGroupedBarChart(labels, series, cores, nomeMedida='Valor', rotuloEixo='Período'){
  if (!series.length || series.every(s=>s.valores.every(v=>!v))) return `<div class="section-note">Sem dados para comparar neste período. Quando houver registros, a comparação por loja aparecerá aqui.</div>`;
  const chartId = `chart_${++__ddSeq}`;
  const w = 720, h = 230, padL = 34, padR = 10, padT = 20, padB = 32;
  const areaW = w - padL - padR, areaH = h - padT - padB;
  const maxVal = Math.max(1, ...series.flatMap(s=>s.valores));
  const ticks = calcularTicksEixo(maxVal);
  const maxEixo = Math.max(ticks[ticks.length-1] || maxVal, maxVal);
  const nGroups = Math.max(1, labels.length);
  const nSeries = Math.max(1, series.length);
  const groupW = areaW / nGroups;
  const barW = Math.max(2, (groupW * 0.82) / nSeries);
  const eixo = svgEixoValores(ticks, maxEixo, padL, padR, padT, areaH, w);
  // Linha vertical separando cada grupo (cada dia/mês) do próximo, pra ficar
  // fácil de ver onde um período termina e o outro começa.
  let separadores = '';
  for (let gi=1; gi<nGroups; gi++){
    const xs = padL + gi*groupW;
    separadores += `<line x1="${xs.toFixed(1)}" y1="${padT}" x2="${xs.toFixed(1)}" y2="${(padT+areaH).toFixed(1)}" stroke="currentColor" stroke-opacity="0.16" stroke-width="1" stroke-dasharray="2,3"/>`;
  }
  let bars = '', textos = '';
  labels.forEach((lab, gi)=>{
    const gx = padL + gi*groupW + groupW*0.09;
    textos += `<text class="chart-axis-label" data-axis-key="${gi}" x="${(padL+gi*groupW+groupW/2).toFixed(1)}" y="${h-8}" font-size="9" text-anchor="middle" fill="currentColor" opacity="0.65">${escapeHtmlXml(lab)}</text>`;
    series.forEach((s, si)=>{
      const val = s.valores[gi] || 0;
      const bh = (val/maxEixo) * areaH;
      const x = gx + si*barW;
      const y = padT + areaH - bh;
      const ponto = `${si}_${gi}`;
      bars += `<g class="chart-point chart-series-${chartId}-${si}" data-chart-point="${ponto}" data-axis="${gi}" data-chart-tooltip="Loja: ${escapeHtml(s.nome)}&#10;${escapeHtml(nomeMedida)}: ${val}&#10;${escapeHtml(rotuloEixo)}: ${escapeHtml(lab)}" data-chart-hover="${chartId}" data-chart-point="${ponto}" data-chart-serie="${si}"><rect class="chart-bar" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(barW*0.86).toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${cores[si % cores.length]}"/>${val > 0 ? `<text class="chart-value" x="${(x+barW*0.43).toFixed(1)}" y="${(y-3).toFixed(1)}" font-size="7.5" text-anchor="middle" fill="currentColor" opacity="0.85">${val}</text>` : ''}</g>`;
    });
  });
  const legenda = series.map((s,si)=>`<button type="button" class="chart-legend-button csp-inline-079" data-chart-legend="${si}" aria-pressed="true" data-action="toggle-chart-series" data-chart-id="${chartId}" data-chart-serie="${si}"><span data-csp-style="width:9px;height:9px;border-radius:2px;background:${cores[si%cores.length]};display:inline-block;flex-shrink:0;"></span>${escapeHtml(s.nome)}</button>`).join('');
  return `<div data-chart="${chartId}"><div class="csp-inline-080">${legenda}</div><svg viewBox="0 0 ${w} ${h}" class="csp-inline-078">${eixo}${separadores}${bars}${textos}</svg></div>`;
}
window.toggleChartSeries = function(chartId, serie, button){
  const ocultar = button.getAttribute('aria-pressed') === 'true';
  document.querySelectorAll(`.chart-series-${chartId}-${serie}`).forEach(el=>el.classList.toggle('chart-series-hidden', ocultar));
  button.setAttribute('aria-pressed', String(!ocultar));
};
window.setChartHover = function(chartId, ponto, serie){
  const chart = document.querySelector(`[data-chart="${chartId}"]`); if (!chart) return;
  chart.querySelectorAll('[data-chart-point], .chart-slice').forEach(el=>el.classList.toggle('chart-dim', el.dataset.chartPoint !== String(ponto)));
  chart.querySelectorAll(`[data-chart-point="${ponto}"], .chart-slice[data-chart-point="${ponto}"]`).forEach(el=>el.classList.add('chart-highlight'));
  const alvo = chart.querySelector(`[data-chart-point="${ponto}"]`);
  chart.querySelectorAll('.chart-axis-label').forEach(el=>el.classList.toggle('chart-axis-highlight', el.dataset.axisKey===(alvo?.dataset.axis || String(ponto))));
  chart.querySelectorAll('[data-chart-legend]').forEach(el=>el.classList.toggle('chart-legend-highlight', el.dataset.chartLegend===String(serie)));
  const info = chart.querySelector('.pie-hover-info');
  if (info && alvo) info.textContent = `${alvo.dataset.chartLabel}: ${alvo.dataset.chartValue} (${alvo.dataset.chartPct}%)`;
};
window.clearChartHover = function(chartId){
  const chart = document.querySelector(`[data-chart="${chartId}"]`); if (!chart) return;
  chart.querySelectorAll('.chart-dim, .chart-highlight, .chart-axis-highlight, .chart-legend-highlight').forEach(el=>el.classList.remove('chart-dim','chart-highlight','chart-axis-highlight','chart-legend-highlight'));
  const info=chart.querySelector('.pie-hover-info'); if (info) info.textContent='';
};
const chartTooltip = document.createElement('div');
chartTooltip.id = 'chart-tooltip';
document.body.appendChild(chartTooltip);
function moverTooltipGrafico(e){ chartTooltip.style.left=e.clientX+'px'; chartTooltip.style.top=e.clientY+'px'; }
document.addEventListener('pointerover', e=>{
  const ponto = e.target.closest?.('[data-chart-tooltip]');
  if (!ponto) return;
  chartTooltip.textContent = ponto.dataset.chartTooltip;
  moverTooltipGrafico(e);
  chartTooltip.classList.add('visible');
});
document.addEventListener('pointermove', e=>{
  if (e.target.closest?.('[data-chart-tooltip]')) moverTooltipGrafico(e);
});
document.addEventListener('pointerout', e=>{
  const ponto=e.target.closest?.('[data-chart-tooltip]');
  if (ponto && !ponto.contains(e.relatedTarget)) chartTooltip.classList.remove('visible');
});
function corSerie(i){ return `hsl(${(i*61)%360},60%,50%)`; }
function animarValoresKpi(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.kpi-value').forEach(el=>{
    if (el.dataset.animado) return;
    const original = el.textContent.trim();
    const numero = parseFloat(original.replace(',', '.'));
    if (!Number.isFinite(numero)) return;
    const sufixo = original.replace(/^[\d.,]+\s*/, '');
    const casas = (original.match(/[.,](\d+)/)||[])[1]?.length || 0;
    const inicio = performance.now(), duracao = 520;
    el.dataset.animado = 'true';
    const atualizar = agora=>{
      const progresso = Math.min(1, (agora-inicio)/duracao);
      const suavizado = 1-Math.pow(1-progresso, 3);
      el.innerHTML = `${(numero*suavizado).toFixed(casas)}${sufixo ? ' <span class="unit">'+escapeHtml(sufixo)+'</span>' : ''}`;
      if (progresso<1) requestAnimationFrame(atualizar);
    };
    requestAnimationFrame(atualizar);
  });
}

// Gráfico de pizza — usado no Dashboard > SAC ↔ Indústria (Motivo/Franquia).
// `pairs`: [[rótulo, valor], ...]; `cores`: uma cor por fatia, na mesma ordem.
function svgPieChart(pairs, cores){
  const total = pairs.reduce((s,p)=>s+p[1], 0);
  if (!total) return `<div class="section-note">Ainda não há ocorrências neste período. Use outro recorte ou registre uma ocorrência para visualizar a distribuição.</div>`;
  const chartId = `pie_${++__ddSeq}`;
  const w = 220, h = 220, cx = w/2, cy = h/2, r = 100;
  let anguloAtual = -Math.PI/2;
  let fatias = '';
  pairs.forEach((p,i)=>{
    const fracao = p[1]/total;
    const anguloFim = anguloAtual + fracao*Math.PI*2;
    if (fracao >= 0.9999){
      fatias += `<g class="chart-slice chart-series-${chartId}-${i}" data-chart-point="${i}" data-chart-label="${escapeHtml(p[0])}" data-chart-value="${p[1]}" data-chart-pct="${Math.round(fracao*100)}" data-chart-tooltip="${escapeHtml(p[0])}: ${p[1]} (${Math.round(fracao*100)}%)" data-chart-hover="${chartId}" data-chart-point="${i}" data-chart-serie="${i}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${cores[i%cores.length]}"/></g>`;
    } else {
      const x1 = cx + r*Math.cos(anguloAtual), y1 = cy + r*Math.sin(anguloAtual);
      const x2 = cx + r*Math.cos(anguloFim), y2 = cy + r*Math.sin(anguloFim);
      const grandeArco = (anguloFim-anguloAtual) > Math.PI ? 1 : 0;
      fatias += `<g class="chart-slice chart-series-${chartId}-${i}" data-chart-point="${i}" data-chart-label="${escapeHtml(p[0])}" data-chart-value="${p[1]}" data-chart-pct="${Math.round(fracao*100)}" data-chart-tooltip="${escapeHtml(p[0])}: ${p[1]} (${Math.round(fracao*100)}%)" data-chart-hover="${chartId}" data-chart-point="${i}" data-chart-serie="${i}"><path d="M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${grandeArco} 1 ${x2.toFixed(2)},${y2.toFixed(2)} Z" fill="${cores[i%cores.length]}" stroke="var(--surface)" stroke-width="1.5"/></g>`;
    }
    anguloAtual = anguloFim;
  });
  const legenda = pairs.map((p,i)=>{
    const pct = Math.round((p[1]/total)*100);
    return `<button type="button" class="chart-legend-button csp-inline-081" data-chart-legend="${i}" aria-pressed="true" data-action="toggle-chart-series" data-chart-id="${chartId}" data-chart-serie="${i}">
      <span data-csp-style="width:10px;height:10px;border-radius:3px;background:${cores[i%cores.length]};display:inline-block;flex-shrink:0;"></span>
      <span class="csp-inline-053">${escapeHtml(p[0])}</span>
      <span class="csp-inline-082">${p[1]}</span>
      <span class="csp-inline-083">${pct}%</span>
    </button>`;
  }).join('');
  return `<div data-chart="${chartId}" class="csp-inline-084">
    <svg viewBox="0 0 ${w} ${h}" class="csp-inline-085">${fatias}</svg>
    <div class="csp-inline-086"><div class="pie-hover-info"></div>${legenda}</div>
  </div>`;
}

// Gráfico agrupado por loja/franquia × mês (uma cor por loja, um grupo de
// barras por mês) — usado no modo Ano do dashboard. As cores vêm de
// "Opções dos Menus" (grupoMenu); se algum valor não tiver cor cadastrada
// lá, cai num tom gerado automaticamente só pra esse caso.
function graficoPorLojaEMes(titulo, lista, campoData, campoAgrupador, mesesAno, grupoMenu){
  const grupos = Array.from(new Set(lista.map(r=>r[campoAgrupador] || '(sem loja)'))).sort();
  if (!grupos.length) return `<div class="chart-card"><div class="chart-title">${titulo}</div><div class="section-note">Sem dados nesse ano.</div></div>`;
  const series = grupos.map(g=>({
    nome: g,
    valores: mesesAno.map(mk=>lista.filter(r=>(r[campoAgrupador]||'(sem loja)')===g && dashboardMonthKeyForField(r,campoData)===mk).length),
  }));
  const labels = mesesAno.map(mk=>monthLabelCurto(mk+'-01'));
  const cores = grupos.map((g,i)=>{
    const opcao = opcoesDe(grupoMenu).find(o=>o.valor===g);
    return opcao ? corMenuParaTema(opcao.cor) : corSerie(i);
  });
  return `<div class="chart-card"><div class="chart-title">${titulo}</div>${svgGroupedBarChart(labels, series, cores, titulo.split(' por ')[0], 'Mês')}</div>`;
}

// Igual ao de cima, mas quebrado por DIA em vez de mês — usado no modo Mês
// do dashboard (SAC).
function graficoPorLojaEDia(titulo, lista, campoData, campoAgrupador, dias, grupoMenu){
  const grupos = Array.from(new Set(lista.map(r=>r[campoAgrupador] || '(sem loja)'))).sort();
  if (!grupos.length) return `<div class="chart-card"><div class="chart-title">${titulo}</div><div class="section-note">Sem dados nesse mês.</div></div>`;
  const series = grupos.map(g=>({
    nome: g,
    valores: dias.map(dia=>lista.filter(r=>(r[campoAgrupador]||'(sem loja)')===g && String(r[campoData]||'').slice(0,10)===dia).length),
  }));
  const labels = dias.map(dia=>String(Number(dia.slice(-2))));
  const cores = grupos.map((g,i)=>{
    const opcao = opcoesDe(grupoMenu).find(o=>o.valor===g);
    return opcao ? corMenuParaTema(opcao.cor) : corSerie(i);
  });
  return `<div class="chart-card"><div class="chart-title">${titulo}</div>${svgGroupedBarChart(labels, series, cores, titulo.split(' por ')[0], 'Dia')}</div>`;
}

const TIPOS_META = {
  sac_chamados: 'Nº de chamados no mês (meta)',
  sac_nps: 'NPS médio no mês (meta)',
  projetos_concluidos: 'Projetos concluídos no mês (meta)',
  vendas_metragem: 'Metragem vendida no mês — m² (meta)',
  vendas_numero: 'Nº de vendas no mês (meta)',
};
const TIPOS_META_MEDIA = new Set(['sac_nps']); // metas onde o valor anual é uma média, não uma soma

async function viewDashboard(){
  document.getElementById('page-title').textContent = 'Dashboard';
  document.getElementById('page-sub').textContent = 'Resumo de chamados, projetos e vendas — por mês ou por ano.';
  const podeDefinirMetas = ehGestorOuAdmin();

  const [chamadosRes, projetosRes, vendasRes, metasRes, sacIndRes] = await Promise.all([
    sb.from('chamados_sac').select('mes_ref, data_abertura, created_at, nota_nps, tempo_resolucao_dias, status, franquia'),
    sb.from('projetos').select('mes_ref, data_inicio, created_at, percentual_conclusao, status, data_conclusao_real'),
    sb.from('vendas_expansao').select('mes_ref, data_venda, created_at, loja, metragem_m2'),
    sb.from('metas').select('*'),
    sb.from('reclamacoes_industria').select('tipo_problema_id, tipo_problema_classe, franquia, data_abertura, created_at'),
  ]);
  if (chamadosRes.error) throw chamadosRes.error;
  if (projetosRes.error) throw projetosRes.error;
  if (vendasRes.error) throw vendasRes.error;
  const metas = metasRes.data || [];
  const reclamacoesIndustria = sacIndRes.data || [];

  const chamados = chamadosRes.data||[], projetos = projetosRes.data||[], vendas = vendasRes.data||[];

  const monthsSet = new Set();
  chamados.forEach(r=>{ const k=dashboardMonthKey(r,'chamados_sac'); if (k) monthsSet.add(k); });
  projetos.forEach(r=>{ const k=dashboardMonthKey(r,'projetos'); if (k) monthsSet.add(k); });
  vendas.forEach(r=>{ const k=dashboardMonthKey(r,'vendas_expansao'); if (k) monthsSet.add(k); });
  const thisMonthKey = new Date().toISOString().slice(0,7);
  monthsSet.add(thisMonthKey);
  const months = Array.from(monthsSet).sort();
  const anoAtual = thisMonthKey.slice(0,4);
  const anosList = Array.from(new Set(months.map(m=>m.slice(0,4)))).sort();
  if (!anosList.includes(anoAtual)) anosList.push(anoAtual);

  function mesesDoAno(ano){ return Array.from({length:12}, (_,i)=>`${ano}-${String(i+1).padStart(2,'0')}`); }
  function diasDoMes(mesKey){
    const [ano, mes] = mesKey.split('-').map(Number);
    const totalDias = new Date(ano, mes, 0).getDate();
    return Array.from({length:totalDias}, (_,i)=>`${mesKey}-${String(i+1).padStart(2,'0')}`);
  }
  function rotuloDia(diaISO){ return String(Number(diaISO.slice(-2))); }

  function metaDe(tipo, mk){
    const row = metas.find(m=>m.tipo===tipo && m.mes_ref && m.mes_ref.slice(0,7)===mk);
    return row ? Number(row.valor_meta) : null;
  }
  function metaAnual(tipo, ano){
    const doAno = metas.filter(m=>m.tipo===tipo && m.mes_ref && m.mes_ref.startsWith(ano));
    if (!doAno.length) return null;
    const soma = doAno.reduce((s,m)=>s+Number(m.valor_meta),0);
    return TIPOS_META_MEDIA.has(tipo) ? soma/doAno.length : soma;
  }
  function metaAtual(tipo, periodo){
    return periodo.tipo==='mes' ? metaDe(tipo, periodo.valor) : metaAnual(tipo, periodo.valor);
  }

  function metaEditorHtml(tipo, periodo){
    // A edicao fica exclusivamente no modal aberto pelo botao Definir Metas.
    return '';
    if (!podeDefinirMetas) return '';
    if (periodo.tipo === 'mes'){
      const atual = metaDe(tipo, periodo.valor);
      return `<div class="meta-editor csp-inline-087">
        <input type="number" step="0.01" class="cell-number meta-input csp-inline-088" data-tipo="${tipo}" data-mes="${periodo.valor}" value="${atual ?? ''}" placeholder="Meta" />
        <span class="csp-inline-089">meta do mês</span>
      </div>`;
    }
    // Modo Ano: como a meta é sempre por mês, deixa escolher qual mês daquele
    // ano quer definir (esses painéis não têm mais o seletor de mês na barra).
    const mesesDoAnoSelecionado = mesesDoAno(periodo.valor);
    const mesPadrao = mesesDoAnoSelecionado.includes(thisMonthKey) ? thisMonthKey : mesesDoAnoSelecionado[0];
    return `<div class="meta-editor csp-inline-090">
      <select class="cell-select meta-mes-select csp-inline-091" data-tipo="${tipo}">
        ${mesesDoAnoSelecionado.map(mk=>`<option value="${mk}" ${mk===mesPadrao?'selected':''}>${monthLabelCurto(mk+'-01')}</option>`).join('')}
      </select>
      <input type="number" step="0.01" class="cell-number meta-input csp-inline-088" data-tipo="${tipo}" data-mes="${mesPadrao}" value="${metaDe(tipo, mesPadrao) ?? ''}" placeholder="Meta" />
      <span class="csp-inline-089">meta do mês</span>
    </div>`;
  }

  function barraMetaLegado(valorAtual, meta, periodo){
    if (meta == null || !meta) return '';
    const pct = Math.min(100, Math.round((valorAtual/meta)*100));
    return `<div class="progress-bar csp-inline-092"><div data-csp-style="width:${pct}%"></div></div><div class="csp-inline-093">${pct}% da meta (${Number(meta.toFixed ? meta.toFixed(1) : meta)})${periodo.tipo==='ano' ? ' — soma/média das metas mensais do ano' : ''}</div>`;
  }

  // Renderiza??o somente leitura: a edi??o continua exclusiva do modal Definir Metas.
  function barraMeta(valorAtual, meta, periodo){
    if (meta == null) return '<div class="dashboard-meta-readonly is-empty">Meta n\u00e3o definida</div>';
    const valorMeta = Number(meta), pct = valorMeta > 0 ? Math.min(100, Math.max(0, Math.round((valorAtual/valorMeta)*100))) : 0;
    const metaLabel = Number.isInteger(valorMeta) ? String(valorMeta) : valorMeta.toLocaleString('pt-BR',{maximumFractionDigits:1});
    return `<div class="progress-bar csp-inline-092"><div data-csp-style="width:${pct}%"></div></div><div class="dashboard-meta-readonly"><strong>Meta: ${metaLabel}</strong><span>${pct}% atingido${periodo.tipo==='ano' ? ' \u00b7 soma/m\u00e9dia das metas mensais do ano' : ''}</span></div>`;
  }

  const permDash = permissoesAtuais('dashboard');
  const DASH_SUBABAS = [
    ['sac','SAC'],
    ['vendas','Vendas'],
    ['projetos','Projetos'],
    ['sacind','Problemas SAC ↔ Indústria'],
    ['anual','Resumo anual (tabela)'],
  ];
  const subabasVisiveis = DASH_SUBABAS.filter(([k])=>!!permDash[k]);
  const abaInicial = (subabasVisiveis[0] || DASH_SUBABAS[0])[0];

  const root = document.getElementById('view-root');
  root.innerHTML = `
    <div class="toolbar">
      <div class="dash-subtabs" id="dash-subtabs">
        ${subabasVisiveis.map(([k,label])=>`<button type="button" class="dash-subtab${k===abaInicial?' active':''}" data-tab="${k}">${label}</button>`).join('')}
      </div>
      <div class="spacer"></div>
      <div class="dash-subtabs" id="periodo-toggle">
        <button type="button" class="dash-subtab active" data-periodo="mes">Mês</button>
        <button type="button" class="dash-subtab" data-periodo="ano">Ano</button>
      </div>
      <span id="mes-select">${buildSimplePicker(thisMonthKey, months.map(m=>({value:m,label:monthLabel(m+'-01')})), (v)=>{ mesSelecionado=v; renderTudo(); }, {classeExtra:'dash-period-picker'})}</span>
      <span id="ano-select">${buildSimplePicker(anoAtual, anosList.map(a=>({value:a,label:a})), (v)=>{ anoSelecionado=v; renderTudo(); }, {classeExtra:'dash-period-picker'})}</span>
      ${podeDefinirMetas ? `<button type="button" class="btn" id="btn-definir-metas">🎯 Definir metas</button>` : ''}
    </div>
    ${subabasVisiveis.length ? '' : `<div class="section-note">Nenhuma sub-aba do Dashboard está liberada pro seu papel. Peça a um admin pra ajustar em Usuários &gt; Permissões de abas por papel.</div>`}
    <div id="dash-painel-sac" class="dash-painel" data-csp-style="display:${abaInicial==='sac'?'':'none'}"></div>
    <div id="dash-painel-vendas" class="dash-painel" data-csp-style="display:${abaInicial==='vendas'?'':'none'}"></div>
    <div id="dash-painel-projetos" class="dash-painel" data-csp-style="display:${abaInicial==='projetos'?'':'none'}"></div>
    <div id="dash-painel-sacind" class="dash-painel" data-csp-style="display:${abaInicial==='sacind'?'':'none'}"></div>
    <div id="dash-painel-anual" class="dash-painel" data-csp-style="display:${abaInicial==='anual'?'':'none'}"></div>
  `;

  if (podeDefinirMetas){
    document.getElementById('btn-definir-metas').addEventListener('click', abrirDefinirMetasPopup);
  }

  const linhasAnual = anosList.map(ano=>{
    const chAno = chamados.filter(r=>(dashboardMonthKey(r,'chamados_sac')||'').startsWith(ano));
    const prAno = projetos.filter(r=>(dashboardMonthKey(r,'projetos')||'').startsWith(ano));
    const veAno = vendas.filter(r=>(dashboardMonthKey(r,'vendas_expansao')||'').startsWith(ano));
    const npsAno = chAno.map(r=>r.nota_nps).filter(v=>v!=null);
    const avgNps = npsAno.length ? (npsAno.reduce((a,b)=>a+b,0)/npsAno.length).toFixed(1) : '—';
    const concluidos = prAno.filter(r=>normalizarTexto(r.status)==='concluido').length;
    const metragem = veAno.reduce((s,r)=>s+(r.metragem_m2||0),0);
    return `<tr><td>${ano}</td><td>${chAno.length}</td><td>${avgNps}</td><td>${prAno.length}</td><td>${concluidos}</td><td>${veAno.length}</td><td>${metragem.toFixed(1)} m²</td></tr>`;
  }).join('');
  document.getElementById('dash-painel-anual').innerHTML = `<div class="chart-card"><div class="chart-title">Resumo anual</div><div class="table-wrap"><table>
      <thead><tr><th>Ano</th><th>Chamados</th><th>NPS médio</th><th>Projetos</th><th>Concluídos</th><th>Vendas</th><th>Metragem</th></tr></thead>
      <tbody>${linhasAnual || '<tr class="empty-row"><td colspan="7">Sem dados ainda.</td></tr>'}</tbody>
    </table></div></div>`;

  function filtrarPorPeriodo(lista, tipo, periodo){
    return lista.filter(r=>{
      const k = dashboardMonthKey(r, tipo);
      if (!k) return false;
      return periodo.tipo==='mes' ? k===periodo.valor : k.startsWith(periodo.valor);
    });
  }
  function mesesParaGrafico(periodo){
    return periodo.tipo==='mes' ? months.slice(-12) : mesesDoAno(periodo.valor);
  }
  function rotuloMes(k, periodo){
    return periodo.tipo==='ano' ? monthLabelCurto(k+'-01') : monthLabel(k+'-01');
  }
  function periodoAnterior(periodo){
    if (periodo.tipo==='ano') return { tipo:'ano', valor:String(Number(periodo.valor)-1) };
    const [ano, mes] = periodo.valor.split('-').map(Number);
    const data = new Date(ano, mes-2, 1);
    return { tipo:'mes', valor:`${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,'0')}` };
  }
  function insightKpi(valor, anterior, meta){
    let tendencia = '<span class="kpi-trend flat">• sem base anterior</span>';
    if (anterior != null){
      const variacao = anterior === 0 ? (valor===0 ? 0 : 100) : ((valor-anterior)/Math.abs(anterior))*100;
      const classe = variacao > .05 ? 'up' : variacao < -.05 ? 'down' : 'flat';
      const seta = classe==='up' ? '↗' : classe==='down' ? '↘' : '→';
      tendencia = `<span class="kpi-trend ${classe}">${seta} ${variacao>=0?'+':''}${Math.round(variacao)}% vs. período anterior</span>`;
    }
    const status = meta == null || !meta ? '' : `<span class="kpi-meta-status ${valor>=meta?'atingida':'atencao'}">${valor>=meta?'Meta atingida':'Faltam '+Number((meta-valor).toFixed ? (meta-valor).toFixed(1) : meta-valor)+' para a meta'}</span>`;
    return `<div class="kpi-insight">${tendencia}${status}</div>`;
  }

  function renderSac(periodo){
    const chamadosPeriodo = chamados.filter(r=>{
      const k = dashboardMonthKey(r,'chamados_sac');
      return periodo.tipo==='mes' ? k===periodo.valor : (k||'').startsWith(periodo.valor);
    });
    const npsVals = chamadosPeriodo.map(r=>r.nota_nps).filter(v=>v!=null);
    const tempoVals = chamadosPeriodo.map(r=>r.tempo_resolucao_dias).filter(v=>v!=null);
    const avg = arr => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length) : null;
    const chamadosAnterior = filtrarPorPeriodo(chamados, 'chamados_sac', periodoAnterior(periodo));
    const npsAnterior = avg(chamadosAnterior.map(r=>r.nota_nps).filter(v=>v!=null));
    const tempoAnterior = avg(chamadosAnterior.map(r=>r.tempo_resolucao_dias).filter(v=>v!=null));
    const metaChamados = metaAtual('sac_chamados', periodo), metaNps = metaAtual('sac_nps', periodo);
    let graficosSac;
    if (periodo.tipo === 'ano'){
      const porMes = mesesParaGrafico(periodo).map(k=>[rotuloMes(k, periodo), chamados.filter(r=>dashboardMonthKey(r,'chamados_sac')===k).length]);
      graficosSac = `<div class="chart-card"><div class="chart-title">Nº de chamados por mês</div><div>${svgBarChart(porMes, 'var(--accent-2)', 'Nº de chamados', 'Mês')}</div></div>
        ${graficoPorLojaEMes('Nº de chamados por mês por loja', chamadosPeriodo, 'data_abertura', 'franquia', mesesParaGrafico(periodo), 'chamados_franquia')}`;
    } else {
      const dias = diasDoMes(periodo.valor);
      const porDia = dias.map(d=>[rotuloDia(d), chamados.filter(r=>String(r.data_abertura||'').slice(0,10)===d).length]);
      graficosSac = `<div class="chart-card"><div class="chart-title">Nº de chamados por dia</div><div>${svgBarChart(porDia, 'var(--accent-2)', 'Nº de chamados', 'Dia')}</div></div>
        ${graficoPorLojaEDia('Nº de chamados por dia por loja', chamadosPeriodo, 'data_abertura', 'franquia', dias, 'chamados_franquia')}`;
    }
    document.getElementById('dash-painel-sac').innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-label">Nº Chamados ${periodo.tipo==='mes'?'no mês':'no ano'}</div><div class="kpi-value">${chamadosPeriodo.length}</div>${insightKpi(chamadosPeriodo.length, chamadosAnterior.length, metaChamados)}${barraMeta(chamadosPeriodo.length, metaChamados, periodo)}${metaEditorHtml('sac_chamados', periodo)}</div>
        <div class="kpi-card"><div class="kpi-label">NPS médio</div><div class="kpi-value">${avg(npsVals)!=null ? avg(npsVals).toFixed(1) : '—'}</div>${insightKpi(avg(npsVals)||0, npsAnterior, metaNps)}${barraMeta(avg(npsVals)||0, metaNps, periodo)}${metaEditorHtml('sac_nps', periodo)}</div>
        <div class="kpi-card"><div class="kpi-label">Tempo médio resolução</div><div class="kpi-value">${avg(tempoVals)!=null ? avg(tempoVals).toFixed(1) : '—'} <span class="unit">dias</span></div>${insightKpi(avg(tempoVals)||0, tempoAnterior, null)}</div>
      </div>
      ${graficosSac}
    `;
    document.querySelectorAll('#dash-painel-sac .meta-input').forEach(bindMetaInput);
    document.querySelectorAll('#dash-painel-sac .meta-mes-select').forEach(bindMetaMesSelect);
  }

  function renderVendas(periodo){
    const vendasPeriodo = vendas.filter(r=>{
      const k = dashboardMonthKey(r,'vendas_expansao');
      return periodo.tipo==='mes' ? k===periodo.valor : (k||'').startsWith(periodo.valor);
    });
    const metragemTotal = vendasPeriodo.reduce((s,r)=>s+(r.metragem_m2||0),0);
    const vendasAnterior = filtrarPorPeriodo(vendas, 'vendas_expansao', periodoAnterior(periodo));
    const metragemAnterior = vendasAnterior.reduce((s,r)=>s+(r.metragem_m2||0),0);
    const metaMetragem = metaAtual('vendas_metragem', periodo);
    const metaNumero = metaAtual('vendas_numero', periodo);
    const porMesNumero = mesesParaGrafico(periodo).map(k=>{
      const qtd = vendas.filter(r=>dashboardMonthKey(r,'vendas_expansao')===k).length;
      return [rotuloMes(k, periodo), qtd];
    });
    const porMesMetragem = mesesParaGrafico(periodo).map(k=>{
      const total = vendas.filter(r=>dashboardMonthKey(r,'vendas_expansao')===k).reduce((s,r)=>s+(r.metragem_m2||0),0);
      return [rotuloMes(k, periodo), Math.round(total)];
    });
    const porLoja = {};
    vendasPeriodo.forEach(r=>{ const l = r.loja || '(sem loja)'; porLoja[l] = (porLoja[l]||0) + 1; });
    const porLojaArr = Object.entries(porLoja).sort((a,b)=>b[1]-a[1]);
    document.getElementById('dash-painel-vendas').innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-label">Nº vendas ${periodo.tipo==='mes'?'no mês':'no ano'}</div><div class="kpi-value">${vendasPeriodo.length}</div>${insightKpi(vendasPeriodo.length, vendasAnterior.length, metaNumero)}${barraMeta(vendasPeriodo.length, metaNumero, periodo)}${metaEditorHtml('vendas_numero', periodo)}</div>
        <div class="kpi-card"><div class="kpi-label">Metragem vendida</div><div class="kpi-value">${metragemTotal.toFixed(1)} <span class="unit">m²</span></div>${insightKpi(metragemTotal, metragemAnterior, metaMetragem)}${barraMeta(metragemTotal, metaMetragem, periodo)}${metaEditorHtml('vendas_metragem', periodo)}</div>
      </div>
      <div class="chart-card"><div class="chart-title">Vendas por loja — nº de vendas ${periodo.tipo==='mes'?'no mês':'no ano'}</div><div>${porLojaArr.length ? svgBarChart(porLojaArr, 'var(--accent-2)', 'Vendas') : '<div class="section-note">Ainda não há vendas neste período. Registre uma venda ou altere o recorte para visualizar o gráfico.</div>'}</div></div>
      ${periodo.tipo==='ano' ? `<div class="chart-card"><div class="chart-title">Nº de vendas por mês</div><div>${svgBarChart(porMesNumero, 'var(--accent)', 'Vendas')}</div></div>` : ''}
      ${periodo.tipo==='ano' ? `<div class="chart-card"><div class="chart-title">Metragem vendida por mês (m²)</div><div>${svgBarChart(porMesMetragem, 'var(--c-moss)', 'Metragem')}</div></div>` : ''}
      ${periodo.tipo==='ano' ? graficoPorLojaEMes('Nº de vendas por mês por loja', vendasPeriodo, 'data_venda', 'loja', mesesParaGrafico(periodo), 'vendas_loja') : ''}    `;
    document.querySelectorAll('#dash-painel-vendas .meta-input').forEach(bindMetaInput);
    document.querySelectorAll('#dash-painel-vendas .meta-mes-select').forEach(bindMetaMesSelect);
  }

  function renderProjetos(periodo){
    const projetosPeriodo = projetos.filter(r=>{
      const k = dashboardMonthKey(r,'projetos');
      return periodo.tipo==='mes' ? k===periodo.valor : (k||'').startsWith(periodo.valor);
    });
    const pctVals = projetosPeriodo.map(r=>r.percentual_conclusao).filter(v=>v!=null);
    const concluido = r=>normalizarTexto(r.status)==='concluido' || !!r.data_conclusao_real;
    const concluidosPeriodo = projetos.filter(r=>concluido(r) && (periodo.tipo==='mes' ? dashboardCompletionMonthKey(r)===periodo.valor : (dashboardCompletionMonthKey(r)||'').startsWith(periodo.valor))).length;
    const avg = arr => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length) : null;
    const periodoAnt = periodoAnterior(periodo);
    const projetosAnterior = projetos.filter(r=>{
      const k=dashboardMonthKey(r,'projetos');
      return periodoAnt.tipo==='mes' ? k===periodoAnt.valor : (k||'').startsWith(periodoAnt.valor);
    });
    const concluidosAnterior = projetos.filter(r=>concluido(r) && (periodoAnt.tipo==='mes' ? dashboardCompletionMonthKey(r)===periodoAnt.valor : (dashboardCompletionMonthKey(r)||'').startsWith(periodoAnt.valor))).length;
    const pctAnterior = avg(projetosAnterior.map(r=>r.percentual_conclusao).filter(v=>v!=null));
    const metaConcluidos = metaAtual('projetos_concluidos', periodo);
    let graficosProjetos;
    if (periodo.tipo === 'ano'){
      const porMesConcluidos = mesesParaGrafico(periodo).map(k=>{
        const qtd = projetos.filter(r=>dashboardCompletionMonthKey(r)===k && concluido(r)).length;
        return [rotuloMes(k, periodo), qtd];
      });
      const porMesPct = mesesParaGrafico(periodo).map(k=>{
        const vals = projetos.filter(r=>dashboardMonthKey(r,'projetos')===k).map(r=>r.percentual_conclusao).filter(v=>v!=null);
        const a = vals.length ? Math.round((vals.reduce((x,y)=>x+y,0)/vals.length)*100) : 0;
        return [rotuloMes(k, periodo), a];
      });
      graficosProjetos = `<div class="chart-card"><div class="chart-title">Projetos concluídos por mês</div><div>${svgBarChart(porMesConcluidos, 'var(--c-moss)', 'Concluídos')}</div></div>
        <div class="chart-card"><div class="chart-title">% de conclusão média por mês</div><div>${svgBarChart(porMesPct, 'var(--accent-2)', 'Conclusão média')}</div></div>`;
    } else {
      const dias = diasDoMes(periodo.valor);
      const porDiaConcluidos = dias.map(d=>[rotuloDia(d), projetos.filter(r=>concluido(r) && String(r.data_conclusao_real||'').slice(0,10)===d).length]);
      graficosProjetos = `<div class="chart-card"><div class="chart-title">Projetos concluídos por dia</div><div>${svgBarChart(porDiaConcluidos, 'var(--c-moss)', 'Concluídos')}</div></div>`;
    }
    document.getElementById('dash-painel-projetos').innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-label">Concluídos ${periodo.tipo==='mes'?'no mês':'no ano'}</div><div class="kpi-value">${concluidosPeriodo}</div>${insightKpi(concluidosPeriodo, concluidosAnterior, metaConcluidos)}${barraMeta(concluidosPeriodo, metaConcluidos, periodo)}${metaEditorHtml('projetos_concluidos', periodo)}</div>
        <div class="kpi-card"><div class="kpi-label">% conclusão média</div><div class="kpi-value">${avg(pctVals)!=null ? Math.round(avg(pctVals)*100)+'%' : '—'}</div>${insightKpi((avg(pctVals)||0)*100, pctAnterior==null?null:pctAnterior*100, null)}</div>
      </div>
      ${graficosProjetos}
    `;
    document.querySelectorAll('#dash-painel-projetos .meta-input').forEach(bindMetaInput);
    document.querySelectorAll('#dash-painel-projetos .meta-mes-select').forEach(bindMetaMesSelect);
  }

  function bindMetaInput(inp){
    inp.addEventListener('change', async ()=>{
      const tipo = inp.dataset.tipo, mk = inp.dataset.mes;
      const valor = inp.value === '' ? null : parseFloat(inp.value);
      if (valor == null){
        await sb.from('metas').delete().eq('tipo', tipo).eq('mes_ref', mk+'-01');
      } else {
        const { error } = await sb.from('metas').upsert({ tipo, mes_ref: mk+'-01', valor_meta: valor }, { onConflict:'tipo,mes_ref' });
        if (error) return toast('Erro ao salvar meta: '+error.message, true);
      }
      const idx = metas.findIndex(m=>m.tipo===tipo && m.mes_ref && m.mes_ref.slice(0,7)===mk);
      if (idx>=0) metas[idx].valor_meta = valor; else if (valor!=null) metas.push({tipo, mes_ref:mk+'-01', valor_meta:valor});
      flashSaved(inp);
      toast('Meta salva.');
      renderTudo();
    });
  }
  function bindMetaMesSelect(sel){
    sel.addEventListener('change', ()=>{
      const tipo = sel.dataset.tipo, mk = sel.value;
      const inp = sel.parentElement.querySelector('.meta-input');
      inp.dataset.mes = mk;
      inp.value = metaDe(tipo, mk) ?? '';
    });
  }

  // Painel único pra definir todas as metas (SAC, Vendas, Projetos) de
  // qualquer mês/ano, sem precisar trocar de aba e caçar o campo certo.
  // Reaproveita exatamente a mesma lógica de salvar de bindMetaInput — só
  // muda onde o campo aparece na tela.
  function abrirDefinirMetasPopup(){
    if (!podeDefinirMetas) return;
    const modal = document.getElementById('modal-content');
    modal.classList.add('modal-wide');
    let tipoEsc = Object.keys(TIPOS_META)[0];
    let anoEsc = anoAtual;

    function montar(){
      modal.innerHTML = `
        <div class="modal-fixed-head">
          <h3 class="csp-inline-024">🎯 Definir metas</h3>
          <div class="csp-inline-050">Escolha o indicador e o ano — defina a meta de cada mês numa lista só.</div>
          <div class="toolbar csp-inline-095">
            <span id="metas-tipo-picker"></span>
            <span id="metas-ano-picker"></span>
          </div>
        </div>
        <div class="modal-scroll-body" id="metas-lista"></div>
        <div class="modal-fixed-foot"><button class="btn btn-ghost" data-action="close-modal">Fechar</button></div>
      `;
      document.getElementById('metas-tipo-picker').innerHTML = buildSimplePicker(tipoEsc, Object.keys(TIPOS_META).map(t=>({value:t,label:TIPOS_META[t]})), (v)=>{
        tipoEsc = v;
        renderLista();
      }, { classeExtra:'dash-period-picker', });
      document.getElementById('metas-ano-picker').innerHTML = buildSimplePicker(anoEsc, anosList.map(a=>({value:a,label:a})), (v)=>{
        anoEsc = v;
        renderLista();
      }, { classeExtra:'dash-period-picker' });
      renderLista();
    }

    function renderLista(){
      const lista = document.getElementById('metas-lista');
      const meses = mesesDoAno(anoEsc);
      lista.innerHTML = meses.map(mk=>{
        const atual = metaDe(tipoEsc, mk);
        return `<div class="csp-inline-096">
          <div class="csp-inline-097">${monthLabelCurto(mk+'-01')} de ${anoEsc}</div>
          <input type="number" step="0.01" class="cell-number meta-modal-input csp-inline-064" data-mes="${mk}" value="${atual ?? ''}" placeholder="Sem meta" />
        </div>`;
      }).join('');
      lista.querySelectorAll('.meta-modal-input').forEach(inp=>{
        inp.addEventListener('change', async ()=>{
          const tipo = tipoEsc, mk = inp.dataset.mes;
          const valor = inp.value === '' ? null : parseFloat(inp.value);
          if (valor == null){
            await sb.from('metas').delete().eq('tipo', tipo).eq('mes_ref', mk+'-01');
          } else {
            const { error } = await sb.from('metas').upsert({ tipo, mes_ref: mk+'-01', valor_meta: valor }, { onConflict:'tipo,mes_ref' });
            if (error) return toast('Erro ao salvar meta: '+error.message, true);
          }
          const idx = metas.findIndex(m=>m.tipo===tipo && m.mes_ref && m.mes_ref.slice(0,7)===mk);
          if (idx>=0) metas[idx].valor_meta = valor; else if (valor!=null) metas.push({tipo, mes_ref:mk+'-01', valor_meta:valor});
          flashSaved(inp);
          toast('Meta salva.');
          renderTudo();
        });
      });
    }

    montar();
    document.getElementById('modal-backdrop').classList.add('active');
  }

  // Cada aba (SAC, Vendas, Projetos) lembra sozinha se está em modo Mês ou
  // Ano. O mês/ano escolhidos no seletor são compartilhados entre as abas
  // que estiverem naquele modo.
  // Painel "SAC ↔ Indústria": período próprio (mês / ano / todo o período),
  // independente do toggle mês/ano compartilhado pelas outras abas — por
  // isso tem seu próprio estado e sua própria barrinha de controles.
  let sacIndPeriodo = { tipo:'mes', mes: thisMonthKey, ano: anoAtual };
  const sacIndFiltrosPizza = { classe:new Set(), subclasse:new Set(), franquia:new Set() };
  let sacIndClasseSelecionada = '';
  function reclamacoesDoPeriodo(){
    if (sacIndPeriodo.tipo === 'todo') return reclamacoesIndustria;
    return reclamacoesIndustria.filter(r=>{
      const k = monthKey(r.data_abertura || r.created_at);
      if (!k) return false;
      return sacIndPeriodo.tipo==='mes' ? k===sacIndPeriodo.mes : k.startsWith(sacIndPeriodo.ano);
    });
  }
  function contagemPorTipo(lista, classeFiltro){
    const contagem = {}, cores = {};
    lista.forEach(r=>{
      const t = tipoProblemaPorId(r.tipo_problema_id);
      const classe = t?.classe || r.tipo_problema_classe || '';
      if (classeFiltro && classe!==classeFiltro) return;
      const label = classeFiltro ? (t?.subclasse || 'Sem definir') : (classe || '(sem classificação)');
      contagem[label] = (contagem[label]||0)+1;
      if (!cores[label]) cores[label] = classe ? corMenuParaTema(corDaClasseProblema(classe)) : corSerie(Object.keys(cores).length);
    });
    const pares = Object.entries(contagem).sort((a,b)=>b[1]-a[1]);
    return { pares, cores:pares.map(([v])=>cores[v] || corSerie(0)) };
  }
  function contagemPorCampo(lista, campo, grupoMenu){
    const contagem = {};
    lista.forEach(r=>{ const v = r[campo] || '(sem informação)'; contagem[v] = (contagem[v]||0)+1; });
    const pares = Object.entries(contagem).sort((a,b)=>b[1]-a[1]);
    const cores = pares.map(([v],i)=>{
      const opcao = opcoesDe(grupoMenu).find(o=>o.valor===v);
      return opcao ? corMenuParaTema(opcao.cor) : corSerie(i);
    });
    return { pares, cores };
  }
  function renderSacInd(){
    const painel = document.getElementById('dash-painel-sacind');
    if (!painel) return;
    const lista = reclamacoesDoPeriodo();
    const classe = contagemPorTipo(lista);
    const nomesClasses = new Set(classe.pares.map(p=>p[0]));
    if (!nomesClasses.has(sacIndClasseSelecionada) || sacIndClasseSelecionada==='(sem classificação)'){
      sacIndClasseSelecionada = classe.pares.find(p=>p[0]!=='(sem classificação)')?.[0] || '';
    }
    const subclasse = contagemPorTipo(lista, sacIndClasseSelecionada || null);
    const franquia = contagemPorCampo(lista, 'franquia', 'chamados_franquia');
    function graficoPizzaFiltravel(chave, dados){
      const ocultos = sacIndFiltrosPizza[chave];
      const visiveis = dados.pares.map((p,i)=>({par:p,cor:dados.cores[i]})).filter(x=>!ocultos.has(x.par[0]));
      return { pares:visiveis.map(x=>x.par), cores:visiveis.map(x=>x.cor) };
    }
    const classeVisivel = graficoPizzaFiltravel('classe', classe);
    const subclasseVisivel = graficoPizzaFiltravel('subclasse', subclasse);
    const franquiaVisivel = graficoPizzaFiltravel('franquia', franquia);
    function cabecalhoPizza(chave, titulo, dados){
      const ocultos = sacIndFiltrosPizza[chave].size;
      return `<div class="csp-inline-098"><div class="chart-title csp-inline-029">${titulo}</div><button type="button" class="sel-simple-btn dash-period-picker csp-inline-099" data-pie-filter="${chave}">Filtrar${ocultos?` (${ocultos} oculto${ocultos>1?'s':''})`:''}</button></div>`;
    }
    painel.innerHTML = `
      <div class="toolbar csp-inline-047">
        <div class="dash-subtabs" id="sacind-periodo-toggle">
          <button type="button" class="dash-subtab${sacIndPeriodo.tipo==='mes'?' active':''}" data-sacind-periodo="mes">Mês</button>
          <button type="button" class="dash-subtab${sacIndPeriodo.tipo==='ano'?' active':''}" data-sacind-periodo="ano">Ano</button>
          <button type="button" class="dash-subtab${sacIndPeriodo.tipo==='todo'?' active':''}" data-sacind-periodo="todo">Todo o período</button>
        </div>
        <div class="spacer"></div>
        <span id="sacind-mes-select" data-csp-style="display:${sacIndPeriodo.tipo==='mes'?'':'none'}">${buildSimplePicker(sacIndPeriodo.mes, months.map(m=>({value:m,label:monthLabel(m+'-01')})), (v)=>{ sacIndPeriodo.mes=v; renderSacInd(); }, {classeExtra:'dash-period-picker'})}</span>
        <span id="sacind-ano-select" data-csp-style="display:${sacIndPeriodo.tipo==='ano'?'':'none'}">${buildSimplePicker(sacIndPeriodo.ano, anosList.map(a=>({value:a,label:a})), (v)=>{ sacIndPeriodo.ano=v; renderSacInd(); }, {classeExtra:'dash-period-picker'})}</span>
      </div>
      <div class="kpi-grid"><div class="kpi-card"><div class="kpi-label">Comunicações ${sacIndPeriodo.tipo==='todo'?'no período':sacIndPeriodo.tipo==='mes'?'no mês':'no ano'}</div><div class="kpi-value">${lista.length}</div></div></div>
      <div class="kpi-grid csp-inline-100">
        <div class="chart-card"><div data-pie-kind="classe">${cabecalhoPizza('classe', 'Por tipo de problema', classe)}${svgPieChart(classeVisivel.pares, classeVisivel.cores)}</div></div>
        <div class="chart-card"><div data-pie-kind="subclasse">${cabecalhoPizza('subclasse', sacIndClasseSelecionada ? `Subclasses — ${escapeHtml(sacIndClasseSelecionada)}` : 'Subclasses', subclasse)}${svgPieChart(subclasseVisivel.pares, subclasseVisivel.cores)}</div></div>
        <div class="chart-card"><div data-pie-kind="franquia">${cabecalhoPizza('franquia', 'Por franquia', franquia)}${svgPieChart(franquiaVisivel.pares, franquiaVisivel.cores)}</div></div>
      </div>`;
    painel.querySelectorAll('[data-sacind-periodo]').forEach(btn=>btn.addEventListener('click', ()=>{ sacIndPeriodo.tipo=btn.dataset.sacindPeriodo; renderSacInd(); }));
    painel.querySelectorAll('[data-pie-filter]').forEach(btn=>btn.addEventListener('click', e=>{
      e.preventDefault(); e.stopPropagation();
      const chave=btn.dataset.pieFilter;
      const dados=chave==='subclasse'?classe:chave==='classe'?classe:franquia;
      const filtroChave=chave==='subclasse'?'classe':chave;
      abrirFlutuante(btn,'msel-panel-float',painelFiltro=>{
        painelFiltro.innerHTML=dados.pares.map((p,i)=>{
          const marcado = chave==='subclasse' ? sacIndClasseSelecionada===p[0] : !sacIndFiltrosPizza[filtroChave].has(p[0]);
          return `<label><input type="checkbox" value="${escapeHtml(p[0])}" ${marcado?'checked':''}><span data-csp-style="width:9px;height:9px;border-radius:2px;background:${dados.cores[i]};display:inline-block;"></span>${escapeHtml(p[0])}</label>`;
        }).join('')||'<div class="csp-inline-010">Sem informações para filtrar.</div>';
        painelFiltro.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.addEventListener('change',()=>{
          if(chave==='subclasse'){
            sacIndClasseSelecionada = cb.checked && cb.value!=='(sem classificação)' ? cb.value : '';
            sacIndFiltrosPizza.subclasse.clear();
          }else if(cb.checked) sacIndFiltrosPizza[filtroChave].delete(cb.value);
          else sacIndFiltrosPizza[filtroChave].add(cb.value);
          fecharFlutuante(); renderSacInd();
        }));
      });
    }));
    painel.querySelectorAll('[data-pie-kind="classe"] .chart-slice').forEach(el=>el.addEventListener('click',e=>{
      e.preventDefault(); e.stopPropagation();
      const par=classeVisivel.pares[Number(el.dataset.chartPoint)];
      if(par && par[0]!=='(sem classificação)'){ sacIndClasseSelecionada=par[0]; sacIndFiltrosPizza.subclasse.clear(); renderSacInd(); }
    }));
    painel.querySelectorAll('[data-pie-kind="classe"] .chart-legend-button').forEach((el,i)=>{
      const par=classeVisivel.pares[i];
      el.dataset.classeSelecao=par?.[0]||'';
      el.addEventListener('click',e=>{
        e.preventDefault(); e.stopPropagation();
        const valor=el.dataset.classeSelecao;
        if(valor && valor!=='(sem classificação)'){ sacIndClasseSelecionada=valor; sacIndFiltrosPizza.subclasse.clear(); renderSacInd(); }
      });
    });
  }  let mesSelecionado = thisMonthKey;
  let anoSelecionado = anoAtual;
  let periodoTipoPorAba = { sac:'mes', vendas:'mes', projetos:'mes' };
  let abaAtiva = abaInicial;
  function periodoPara(aba){
    return periodoTipoPorAba[aba]==='ano' ? { tipo:'ano', valor: anoSelecionado } : { tipo:'mes', valor: mesSelecionado };
  }
  function renderTudo(){
    renderSac(periodoPara('sac'));
    renderVendas(periodoPara('vendas'));
    renderProjetos(periodoPara('projetos'));
    renderSacInd();
    requestAnimationFrame(animarValoresKpi);
  }
  renderTudo();

  function atualizarControlesPeriodo(){
    const mostrarToggle = abaAtiva !== 'anual' && abaAtiva !== 'sacind';
    document.getElementById('periodo-toggle').style.display = mostrarToggle ? '' : 'none';
    const tipoAtivo = periodoTipoPorAba[abaAtiva] || 'mes';
    document.querySelectorAll('#periodo-toggle .dash-subtab').forEach(b=>b.classList.toggle('active', b.dataset.periodo===tipoAtivo));
    document.getElementById('mes-select').style.display = (mostrarToggle && tipoAtivo==='mes') ? '' : 'none';
    document.getElementById('ano-select').style.display = mostrarToggle ? '' : 'none';
  }
  atualizarControlesPeriodo();

  document.querySelectorAll('#periodo-toggle .dash-subtab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      periodoTipoPorAba[abaAtiva] = btn.dataset.periodo;
      atualizarControlesPeriodo();
      renderTudo();
      // (mesmo motivo do fix na troca de aba SAC/Vendas/Projetos: renderTudo()
      // já redesenha tudo com os dados que já estão em memória — buscar de
      // novo aqui só causava a piscadinha.)
    });
  });

  document.querySelectorAll('#dash-subtabs .dash-subtab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('#dash-subtabs .dash-subtab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      abaAtiva = btn.dataset.tab;
      ['sac','vendas','projetos','anual','sacind'].forEach(t=>{
        document.getElementById('dash-painel-'+t).style.display = (t===abaAtiva) ? '' : 'none';
      });
      atualizarControlesPeriodo();
      // Trocar de sub-aba só alterna qual painel já renderizado fica visível —
      // os dados de SAC/Vendas/Projetos já foram carregados no início do
      // Dashboard, então não há por que buscar tudo de novo aqui. Foi essa
      // busca+redesenho que causava a "piscadinha" a cada clique na aba.
    });
  });

  // Atualização silenciosa: refaz só a busca dos números e redesenha os
  // painéis (sem recriar a barra de abas/período), então não pisca a tela.
  currentSilentRefresh = async ()=>{
    const [novoChamados, novoProjetos, novoVendas, novasMetas, novoSacInd] = await Promise.all([
      sb.from('chamados_sac').select('mes_ref, data_abertura, created_at, nota_nps, tempo_resolucao_dias, status, franquia'),
      sb.from('projetos').select('mes_ref, data_inicio, created_at, percentual_conclusao, status, data_conclusao_real'),
      sb.from('vendas_expansao').select('mes_ref, data_venda, created_at, loja, metragem_m2'),
      sb.from('metas').select('*'),
      sb.from('reclamacoes_industria').select('tipo_problema_id, tipo_problema_classe, franquia, data_abertura, created_at'),
    ]);
    if (novoChamados.error || novoProjetos.error || novoVendas.error) return;
    chamados.length = 0; chamados.push(...(novoChamados.data||[]));
    projetos.length = 0; projetos.push(...(novoProjetos.data||[]));
    vendas.length = 0; vendas.push(...(novoVendas.data||[]));
    metas.length = 0; metas.push(...(novasMetas.data||[]));
    reclamacoesIndustria.length = 0; reclamacoesIndustria.push(...(novoSacInd.data||[]));
    renderTudo();
  };
}


// Ações delegadas para evitar handlers inline e permitir CSP sem unsafe-inline.
document.addEventListener('click', (event) => {
  const element = event.target.closest?.('[data-action]');
  if (!element) return;
  const action = element.dataset.action;
  if (action === 'close-modal') {
    event.preventDefault();
    window.closeModal?.();
  } else if (action === 'open-details') {
    event.preventDefault();
    window.abrirDetalhes?.(element.dataset.table || '', element.dataset.recordId || '');
  } else if (action === 'delete-row') {
    event.preventDefault();
    window.deleteRow?.(element.dataset.table || '', element.dataset.recordId || '');
  } else if (action === 'show-diff') {
    event.preventDefault();
    window.showDiff?.(element.dataset.auditJson || '{}');
  } else if (action === 'open-lightbox') {
    event.preventDefault();
    abrirLightbox(element.currentSrc || element.src || '');
  } else if (action === 'toggle-chart-series') {
    event.preventDefault();
    window.toggleChartSeries?.(element.dataset.chartId || '', Number(element.dataset.chartSerie || 0), element);
  }
});

document.addEventListener('pointerover', (event) => {
  const element = event.target.closest?.('[data-chart-hover]');
  if (!element || (event.relatedTarget && element.contains(event.relatedTarget))) return;
  window.setChartHover?.(element.dataset.chartHover || '', element.dataset.chartPoint || '', Number(element.dataset.chartSerie || 0));
});

document.addEventListener('pointerout', (event) => {
  const element = event.target.closest?.('[data-chart-hover]');
  if (!element || (event.relatedTarget && element.contains(event.relatedTarget))) return;
  window.clearChartHover?.(element.dataset.chartHover || '');
});

document.addEventListener('error', (event) => {
  const image = event.target.closest?.('img.img-thumb');
  if (image) image.parentElement?.classList.add('img-erro');
}, true);
// Estilos dinâmicos controlados: os templates carregam data-csp-style e
// somente propriedades/valores permitidos são aplicados via CSSOM.
const CSP_DYNAMIC_STYLE_PROPERTIES = new Set([
  'left', 'top', 'width', 'height', 'transform', 'background', 'background-color',
  'color', 'border-left-color', 'display', 'text-align', 'font-weight'
]);
const CSP_DYNAMIC_COLOR_PROPERTIES = new Set(['background', 'background-color', 'color', 'border-left-color']);
const CSP_DYNAMIC_COLOR_PATTERN = /^(?:#[0-9a-f]{3,8}|var\(--[a-z0-9_-]+\)|(?:rgb|rgba|hsl|hsla)\([^)]*\)|[a-z]+)$/i;
function cspDynamicValueAllowed(property, value){
  const clean = String(value || '').trim();
  if (property === 'display') return /^(?:none|block|inline|inline-block|flex|inline-flex|grid|inline-grid|table|table-row|table-cell)?$/.test(clean);
  if (property === 'text-align') return /^(?:left|right|center|justify|start|end)$/.test(clean);
  if (property === 'font-weight') return /^(?:normal|bold|bolder|lighter|[1-9]00)$/.test(clean);
  if (CSP_DYNAMIC_COLOR_PROPERTIES.has(property)) return CSP_DYNAMIC_COLOR_PATTERN.test(clean);
  if (property === 'transform') return /^(?:translate\([^)]*\)\s*)?(?:rotate\([^)]*\))?$/.test(clean);
  if (['left', 'top', 'width', 'height'].includes(property)) return /^(?:auto|-?\d+(?:\.\d+)?(?:px|%|em|rem|vh|vw)?)$/.test(clean);
  return false;
}
function applyCspDynamicStyles(root=document){
  const nodes = [];
  if (root?.nodeType === 1 && root.hasAttribute?.('data-csp-style')) nodes.push(root);
  root?.querySelectorAll?.('[data-csp-style]').forEach(node => nodes.push(node));
  nodes.forEach(node => {
    const specification = node.getAttribute('data-csp-style') || '';
    specification.split(';').forEach(part => {
      const separator = part.indexOf(':');
      if (separator < 1) return;
      const property = part.slice(0, separator).trim().toLowerCase();
      const value = part.slice(separator + 1).trim();
      if (!CSP_DYNAMIC_STYLE_PROPERTIES.has(property) || !cspDynamicValueAllowed(property, value)) return;
      node.style.setProperty(property, value);
    });
  });
}
const cspDynamicStyleObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
    if (node.nodeType === 1) applyCspDynamicStyles(node);
  }));
});
if (document.body){
  applyCspDynamicStyles(document);
  cspDynamicStyleObserver.observe(document.body, { childList:true, subtree:true });
}window.addEventListener('superapp:authorized', () => {
  document.getElementById('login-screen')?.classList.add('login-screen-hidden');
  bootAfterLogin().catch(error => {
    console.error('Falha ao inicializar o app Gestão:', error);
    document.getElementById('page-title').textContent = 'Erro ao carregar';
    document.getElementById('page-sub').textContent = 'Não foi possível concluir a inicialização segura do módulo.';
    document.getElementById('view-root').innerHTML = '<div class="section-note">Retorne ao SuperApp e tente abrir o módulo novamente.</div>';
  }).finally(() => window.SuperAppAuth.releaseAppGuard?.());
}, { once: true });
