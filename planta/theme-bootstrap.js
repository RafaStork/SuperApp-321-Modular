// Aplica o tema salvo ANTES da primeira renderização, pra não piscar
  // claro→escuro ao carregar a página.
  (function(){
    try{
      // Padrão é sempre claro — só ativa escuro se o usuário já escolheu
      // isso explicitamente antes (não segue mais a preferência do sistema).
      if(localStorage.getItem('321modular_theme') === 'dark'){
        document.documentElement.setAttribute('data-theme','dark');
      }
    }catch(e){}
  })();
