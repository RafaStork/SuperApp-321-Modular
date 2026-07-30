
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
  return new Promise(resolve=>{
    const backdrop=document.getElementById('confirmBackdrop');
    document.getElementById('confirmTitle').textContent = titulo || (somenteOk ? 'ℹ️ Aviso' : (destrutivo ? '⚠️ Confirmar exclusão' : '⚠️ Confirmar ação'));
    document.getElementById('confirmMsg').textContent=mensagem;
    const btnOk=document.getElementById('confirmOkBtn');
    const btnCancel=document.getElementById('confirmCancelBtn');
    const wrap=document.getElementById('confirmTypeWrap');
    const input=document.getElementById('confirmTypeInput');
    btnOk.textContent = somenteOk ? 'OK' : textoBotao;
    btnOk.className='btn '+(destrutivo&&!somenteOk?'brd':'bp');
    btnCancel.style.display = somenteOk ? 'none' : '';
    if(requerTexto){
      wrap.style.display='block';
      document.getElementById('confirmTypeLabel').textContent=`Para confirmar, digite "${requerTexto}" abaixo:`;
      input.value='';
      btnOk.disabled=true;
      input.oninput=()=>{ btnOk.disabled = input.value.trim().toUpperCase() !== requerTexto.toUpperCase(); };
    }else{
      wrap.style.display='none';
      btnOk.disabled=false;
    }
    backdrop.classList.add('open');
    function limpar(v){
      backdrop.classList.remove('open');
      btnCancel.style.display='';
      btnOk.removeEventListener('click',onOk);
      btnCancel.removeEventListener('click',onCancel);
      resolve(v);
    }
    function onOk(){ if(btnOk.disabled) return; limpar(true); }
    function onCancel(){ limpar(false); }
    btnOk.addEventListener('click',onOk);
    btnCancel.addEventListener('click',onCancel);
    if(requerTexto) setTimeout(()=>input.focus(),50);
  });
}
// Aviso simples (substitui alert() nativo) — mesma caixa, só com botão OK.
function avisar(mensagem, titulo){ return confirmarAcao(mensagem, { somenteOk:true, titulo }); }
document.getElementById('confirmBackdrop').addEventListener('click', e=>{
  if(e.target.id==='confirmBackdrop') document.getElementById('confirmCancelBtn').click();
});
