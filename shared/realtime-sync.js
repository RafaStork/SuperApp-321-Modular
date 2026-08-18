(function installSuperAppRealtimeSync(global){
  'use strict';

  function subscribe(options){
    const client=options?.client;
    const userId=String(options?.userId||'');
    const appCode=String(options?.appCode||'');
    const onChange=options?.onChange;
    const debounceMs=Math.max(250,Number(options?.debounceMs)||900);
    if(!client?.channel||!userId||!appCode||typeof onChange!=='function')return()=>{};

    let timer=null,pending=false,running=false,destroyed=false;
    const channelName='app-sync-'+appCode+'-'+userId+'-'+Math.random().toString(36).slice(2,8);

    function schedule(){
      if(destroyed)return;
      if(document.hidden){pending=true;return}
      clearTimeout(timer);
      timer=setTimeout(run,debounceMs);
    }

    async function run(){
      timer=null;
      if(destroyed)return;
      if(document.hidden){pending=true;return}
      if(running){pending=true;return}
      running=true;pending=false;
      try{await onChange()}catch(error){console.error('[realtime-sync:'+appCode+']',error)}
      finally{
        running=false;
        if(pending)schedule();
      }
    }

    function handlePayload(payload){
      const row=payload?.new&&Object.keys(payload.new).length?payload.new:payload?.old;
      if(row?.app_code===appCode)schedule();
    }

    const channel=client.channel(channelName)
      .on('postgres_changes',{
        event:'*',schema:'core',table:'app_realtime_state',filter:'user_id=eq.'+userId
      },handlePayload)
      .subscribe(status=>{
        if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')console.warn('[realtime-sync:'+appCode+'] canal indisponível; o botão Atualizar continua disponível.');
      });

    function onVisibility(){if(!document.hidden&&pending)schedule()}
    document.addEventListener('visibilitychange',onVisibility);

    function destroy(){
      if(destroyed)return;
      destroyed=true;clearTimeout(timer);
      document.removeEventListener('visibilitychange',onVisibility);
      try{client.removeChannel(channel)}catch(_){/* encerramento da página */}
    }
    window.addEventListener('pagehide',destroy,{once:true});
    return destroy;
  }

  global.SuperAppRealtimeSync=Object.freeze({subscribe});
})(window);
