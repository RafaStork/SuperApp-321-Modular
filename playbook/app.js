function goTo(id){
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a=>a.classList.remove('active'));
  const section=document.getElementById(id);
  if(section) section.classList.add('active');
  const link=document.querySelector('nav a[data-target="' + id + '"]');
  if(link) link.classList.add('active');

  const subnav=document.getElementById('subnav-comercial');
  const navParent=document.getElementById('navp-comercial');
  const isComercial=(id==='comercial' || id.indexOf('comercial-')===0);
  if(isComercial){
    subnav.classList.add('open');
    navParent.classList.add('expanded');
    if(id==='comercial') document.querySelector('a[data-target="comercial"]').classList.add('active');
  }else{
    subnav.classList.remove('open');
    navParent.classList.remove('expanded');
  }
  window.scrollTo(0,0);
}
document.querySelectorAll('nav a[data-target]').forEach(a=>{
  if(a.classList.contains('nav-parent-link')) return;
  a.addEventListener('click', ()=>{
    goTo(a.dataset.target);
    fecharMenuPlaybook();
  });
});
const comercialLink=document.querySelector('#navp-comercial > .nav-parent-link');
if(comercialLink){
  comercialLink.addEventListener('click',(event)=>{
    event.preventDefault();
    const subnav=document.getElementById('subnav-comercial');
    const navParent=document.getElementById('navp-comercial');
    const wasOpen=subnav.classList.contains('open');
    goTo('comercial');
    if(wasOpen){
      subnav.classList.remove('open');
      navParent.classList.remove('expanded');
    }
  });
}
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  const knob=document.getElementById('themeKnob'); if(knob) knob.textContent = t==='dark' ? '🌙' : '☀️';
  try{ localStorage.setItem('321modular_theme', t); }catch(e){}
}
(function initTheme(){
  const atual = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(atual);
})();
document.getElementById('themeToggle').addEventListener('click', ()=>{
  const atual = document.documentElement.getAttribute('data-theme');
  applyTheme(atual==='dark' ? 'light' : 'dark');
});function fecharMenuPlaybook(){
  document.getElementById('playbook-sidebar').classList.remove('aside-open');
  document.getElementById('playbook-aside-backdrop').classList.remove('active');
}
function abrirMenuPlaybook(){
  document.getElementById('playbook-sidebar').classList.add('aside-open');
  document.getElementById('playbook-aside-backdrop').classList.add('active');
}
document.getElementById('playbook-menu-toggle').addEventListener('click',()=>{
  const aberto=document.getElementById('playbook-sidebar').classList.contains('aside-open');
  aberto ? fecharMenuPlaybook() : abrirMenuPlaybook();
});
document.getElementById('playbook-aside-backdrop').addEventListener('click',fecharMenuPlaybook);
async function carregarSessaoPlaybook(){
  try{
    const session = await window.SuperAppAuth.getSession();
    if (!session) return;
    const profile = await window.SuperAppAuth.getProfile();
    const label = profile?.display_name || session.user.email || 'Usuário';
    const nameEl = document.getElementById('side-user-name');
    if(nameEl) nameEl.textContent = label;
    const roleLabel = profile?.role_name || profile?.role_code || 'Acesso operacional';
    const scopeLabel = profile?.franchise_name ? `Franquia · ${profile.franchise_name}` : profile?.unit_name ? `Matriz · ${profile.unit_name}` : 'Matriz · acesso global';
    const roleEl = document.getElementById('side-user-role');
    if(roleEl) roleEl.textContent = `${roleLabel} · ${scopeLabel}`;
  }catch(e){ console.warn('Sessão do Playbook não carregada', e); }
}
const playbookLogout = document.getElementById('side-logout-playbook');
if(playbookLogout) playbookLogout.addEventListener('click', ()=>{
  location.href = window.SuperAppAuth.getPortalUrl();
});
window.addEventListener('superapp:authorized', () => {
  carregarSessaoPlaybook().finally(() => window.SuperAppAuth.releaseAppGuard?.());
}, {once:true});
// Playbook: navegação delegada para compatibilidade com CSP.
document.addEventListener('click', (event) => {
  const target = event.target.closest?.('[data-pb-go-to]');
  if (!target) return;
  event.preventDefault();
  goTo(target.dataset.pbGoTo);
});