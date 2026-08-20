(function installSuperAppRealtimeSync(global){
  'use strict';

  function subscribe(options){
    const client=options?.client;
    const userId=String(options?.userId||'');
    const appCode=String(options?.appCode||'');
    const onChange=options?.onChange;
    const shouldDefer=typeof options?.shouldDefer==='function'?options.shouldDefer:null;
    const debounceMs=Math.max(250,Number(options?.debounceMs)||900);
    if(!client?.channel||!userId||!appCode||typeof onChange!=='function')return()=>{};

    let timer=null,pending=false,running=false,destroyed=false,latestPayload=null;
    let suppressOwnUntil=0;
    const channelName='app-sync-'+appCode+'-'+userId+'-'+Math.random().toString(36).slice(2,8);

    function interactionActive(){
      if(!shouldDefer)return false;
      try{return shouldDefer()===true}catch(error){console.error('[realtime-sync:'+appCode+':interaction]',error);return false}
    }

    function schedule(delay){
      if(destroyed)return;
      pending=true;
      if(document.hidden||timer)return;
      // O primeiro evento abre uma janela fixa. Eventos seguintes entram no
      // mesmo lote, mas não empurram indefinidamente o momento da atualização.
      timer=setTimeout(run,Math.max(80,Number(delay)||debounceMs));
    }

    async function run(){
      timer=null;
      if(destroyed)return;
      if(document.hidden){pending=true;return}
      if(interactionActive()){
        // Nunca substitui inputs, menus ou modais enquanto o usuário interage.
        // A verificação é somente local (sem consulta ao banco) e retoma assim
        // que a interação termina.
        timer=setTimeout(run,180);
        return;
      }
      if(running){pending=true;return}
      running=true;pending=false;
      const payload=latestPayload;
      try{await onChange(payload)}catch(error){console.error('[realtime-sync:'+appCode+']',error)}
      finally{
        running=false;
        if(pending)schedule(120);
      }
    }

    function handlePayload(payload){
      const row=payload?.new&&Object.keys(payload.new).length?payload.new:payload?.old;
      if(row?.app_code!==appCode)return;
      // Uma gravação confirmada já foi aplicada localmente pelo app. Ignora
      // somente o eco desta aba; outra aba/dispositivo do mesmo usuário não
      // marca a janela local e continua recebendo a sincronização normalmente.
      if(String(row?.changed_by||'')===userId&&Date.now()<suppressOwnUntil)return;
      latestPayload=payload;
      schedule();
    }

    const channel=client.channel(channelName)
      .on('postgres_changes',{
        event:'*',schema:'core',table:'app_realtime_state',filter:'user_id=eq.'+userId
      },handlePayload)
      .subscribe(status=>{
        if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')console.warn('[realtime-sync:'+appCode+'] canal indisponível; o botão Atualizar continua disponível.');
      });

    function onVisibility(){if(!document.hidden&&pending)schedule(120)}
    document.addEventListener('visibilitychange',onVisibility);

    function destroy(){
      if(destroyed)return;
      destroyed=true;clearTimeout(timer);
      document.removeEventListener('visibilitychange',onVisibility);
      try{client.removeChannel(channel)}catch(_){/* encerramento da página */}
    }
    destroy.markLocalChange=function markLocalChange(durationMs){
      suppressOwnUntil=Math.max(suppressOwnUntil,Date.now()+Math.max(1000,Number(durationMs)||8000));
    };
    destroy.flush=function flush(){if(pending)schedule(80)};
    window.addEventListener('pagehide',destroy,{once:true});
    return destroy;
  }

  global.SuperAppRealtimeSync=Object.freeze({subscribe});
})(window);
