
// Define o tema (claro/escuro) o quanto antes, antes do CSS pintar a tela,
// pra evitar um "flash" da cor errada ao carregar a página.
(function(){ try{ var t=localStorage.getItem('321modular_theme') || localStorage.getItem('321fin_theme'); document.documentElement.setAttribute('data-theme', t==='dark'?'dark':'light'); }catch(e){ document.documentElement.setAttribute('data-theme','light'); } })();
