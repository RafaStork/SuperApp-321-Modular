
// ═══════════════════════════════════════════════════
// TOAST + CONFIRMAÇÃO (substituem alert()/confirm() nativos do navegador)
// ═══════════════════════════════════════════════════
function toast(msg, isErr=false){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.className='show'+(isErr?' err':'');
  clearTimeout(window.__toastTimer);
  window.__toastTimer=setTimeout(()=>{ t.className=''; }, 3200);
}

// Uso: if(!(await confirmarAcao('Excluir este item?'))) return;
// Com { requerTexto:'EXCLUIR' } exige que a pessoa digite a palavra antes de liberar o botão.
function confirmarAcao(mensagem, opts={}){
  const { textoBotao='Excluir', destrutivo=true, requerTexto=null, titulo=null, somenteOk=false } = opts;
  return window.SuperAppConfirm.open({
    title: titulo || (somenteOk ? 'Aviso' : destrutivo ? 'Excluir este item?' : 'Confirmar ação'),
    message: mensagem,
    confirmLabel: somenteOk ? 'OK' : textoBotao,
    destructive: destrutivo && !somenteOk,
    requireText: requerTexto,
    onlyOk: somenteOk
  });
}
// Aviso simples (substitui alert() nativo) — mesma caixa, só com botão OK.
function avisar(mensagem, titulo){ return confirmarAcao(mensagem, { somenteOk:true, titulo }); }
