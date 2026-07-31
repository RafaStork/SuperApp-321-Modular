const nf=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0}), pf=new Intl.NumberFormat('pt-BR',{style:'percent',minimumFractionDigits:1,maximumFractionDigits:1}), ni=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:0});
const pages=[['project','Meu chalé'],['investment','Investimento'],['operation','Operação'],['overview','Visão geral']];
const capexDefaults={Terreno:[['Terreno',1,180000],['Documentação e projetos',1,22000]],'Chalé modular':[['Módulo 321 Modular',1,245000],['Frete, guindaste e montagem',1,26000]],Infraestrutura:[['Fundação e terraplenagem',1,48000],['Água, esgoto e elétrica',1,42000],['Deck, paisagismo e acesso',1,38000]],'Mobiliário e abertura':[['Móveis e eletrodomésticos',1,42000],['Enxoval, decoração e utensílios',1,14000],['Fotografia, anúncio e capital de giro',1,10000]]};
const opsDefaults={fixos:[['Energia, água e gás',850],['Internet, seguro e IPTU',550],['Jardinagem e manutenção externa',500],['Marketing e software',350]],noite:[['Energia adicional por noite',16],['Gás por noite',7]],reserva:[['Limpeza e lavanderia',190],['Amenities e consumíveis',55]],percent:[['Gestão da propriedade',10],['Plataformas e meios de pagamento',15],['Impostos sobre faturamento',6],['Reserva de manutenção',4]]};
function base(){return {exampleVersion:3,simpleInvestment:602410,name:'Chalé Aurora — Estudo Base',client:'Cliente investidor',city:'Destino turístico de serra',model:'A-45 Premium',units:1,area:45,deck:18,guests:4,bedrooms:1,bathrooms:1,start:4,horizon:10,discount:12,inflation:4.5,adrGrowth:5,costGrowth:4.5,appreciation:4,residual:70,capex:{Terreno:[['Terreno',1,135000],['Documentação, projetos e licenças',1,18000]],'Chalé modular':[['Módulo 321 Modular',1,229000],['Frete, guindaste e montagem',1,23000]],Infraestrutura:[['Fundação e terraplenagem',1,36000],['Água, esgoto, elétrica e internet',1,34000],['Deck, paisagismo e acesso',1,32000]],'Mobiliário e abertura':[['Móveis e eletrodomésticos',1,36000],['Enxoval, decoração e utensílios',1,12000],['Fotografia, anúncio e capital de giro',1,8000]]},contingency:7,revenue:{adr:850,occ:50,blocked:1,stay:2.8,clean:210,other:250,cancel:1.5,seasonAdr:[.82,.84,.9,.96,1.02,1.12,1.28,1.2,1.05,.98,.94,1.18],seasonOcc:[.76,.78,.84,.92,1,1.1,1.25,1.18,1.05,.96,.9,1.16]},ops:{profile:'managed',monthlyCost:5500,fixos:[['Energia, água e gás',780],['Internet, seguro e IPTU',420],['Jardinagem e manutenção externa',400],['Marketing e software',300]],noite:[['Energia adicional por noite',18],['Gás por noite',8]],reserva:[['Limpeza e lavanderia',210],['Amenities e consumíveis',50]],percent:[['Gestão da propriedade',10],['Plataforma — taxa única profissional',16],['Impostos sobre faturamento',6],['Reserva de manutenção',4]]},finance:{enabled:true,entry:50,rate:13.5,term:120,grace:0,system:'PRICE',fees:6500,capitalized:false},scenario:'base',scenarios:{conservative:{occ:-10,adr:-5,capex:0,delay:1,cost:1},base:{occ:0,adr:0,capex:0,delay:0,cost:0},optimistic:{occ:15,adr:8,capex:0,delay:0,cost:-3}}}}
function clone(v){return JSON.parse(JSON.stringify(v))}function mergeState(target,source){if(!source||typeof source!=='object')return target;for(const k of Object.keys(source)){if(Array.isArray(source[k]))target[k]=source[k];else if(source[k]&&typeof source[k]==='object'){if(!target[k]||typeof target[k]!=='object')target[k]={};mergeState(target[k],source[k])}else target[k]=source[k]}return target}let studies=[],active='',data,currentUserId='',page='overview',charts={};
function initializeSimulation(userId){currentUserId=String(userId||'');if(!currentUserId)throw new Error('Usuário autenticado sem identificador.');data=base();active=crypto.randomUUID();studies=[{id:active,data}];normalizeScenarios(data)}
function migrateDefaults(d){return d}
function normalizeScenarios(d){if(!d.scenarios)return;let c=d.scenarios.conservative||{};c.capex=0;let o=d.scenarios.optimistic||{};o.capex=0;d.scenarios.conservative=c;d.scenarios.optimistic=o}
function save(){let s=studies.find(x=>x.id===active);if(s)s.data=data;let status=document.getElementById('saveStatus');if(status){status.textContent='Atualizado nesta sessão';setTimeout(()=>status.textContent='Dados temporários · não são salvos',1400)}}function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function escapeAttr(value){return escapeHtml(value)}
function num(v){let n=Number(v);return Number.isFinite(n)?n:0} function money(v){return nf.format(num(v))}function pct(v){return pf.format(num(v)/100)}function sum(a){return a.reduce((x,y)=>x+num(y),0)}function toast(t){let e=document.getElementById('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function capexTotal(d=data){let units=Math.max(1,num(d.units));return num(d.simpleInvestment)>0?num(d.simpleInvestment)*units:sum(Object.values(d.capex).flat().map(x=>num(x[1])*num(x[2])))*(1+num(d.contingency)/100)}function financing(d=data){let total=capexTotal(d), f=d.finance;if(!f.enabled||f.enabled==='false')return {loan:0,equity:total,payments:[]};let loan=total*(1-num(f.entry)/100)+num(f.fees), r=Math.pow(1+num(f.rate)/100,1/12)-1,n=Math.max(1,num(f.term)), bal=loan, pay=[];for(let i=0;i<n;i++){let interest=bal*r, amort=0,payment=0;if(i<num(f.grace)){payment=f.capitalized?0:interest;if(f.capitalized)bal+=interest}else if(f.system==='SAC'){amort=loan/(n-num(f.grace));payment=interest+amort;bal-=amort}else{payment=r?bal*r/(1-Math.pow(1+r,-(n-i))):bal/(n-i);amort=payment-interest;bal-=amort}pay.push({payment,interest,amort:Math.max(0,amort),balance:Math.max(0,bal)})}return {loan,equity:total+num(f.fees)-loan,payments:pay}}
function projection(d=data,scenario=d.scenario){let sc=d.scenarios[scenario], start=Math.max(0,num(d.start)+num(sc.delay)), fin=financing(d), months=num(d.horizon)*12, out=[], annual=[];for(let m=0;m<months;m++){let y=Math.floor(m/12),mi=m%12,days=new Date(2027,mi+1,0).getDate(),open=m>=start, factor=Math.pow(1+num(d.adrGrowth)/100,y), cfac=Math.pow(1+(num(d.costGrowth)+num(sc.cost))/100,y), occ=Math.min(1,Math.max(0,(num(d.revenue.occ)+num(sc.occ))*num(d.revenue.seasonOcc[mi])/100)), adr=num(d.revenue.adr)*(1+num(sc.adr)/100)*num(d.revenue.seasonAdr[mi])*factor,nights=open?Math.max(0,days-num(d.revenue.blocked))*occ*num(d.units):0,res=nights/Math.max(.1,num(d.revenue.stay)), gross=nights*adr+res*num(d.revenue.clean)+num(d.revenue.other), cancel=gross*num(d.revenue.cancel)/100, rev=gross-cancel, fixed=sum(d.ops.fixos.map(x=>x[1]))*cfac;let variable=nights*sum(d.ops.noite.map(x=>x[1]))*cfac+res*sum(d.ops.reserva.map(x=>x[1]))*cfac;variable+=rev*sum(d.ops.percent.map(x=>x[1]))/100;let calculatedOpex=fixed+variable, opex=num(d.ops.monthlyCost)>0?num(d.ops.monthlyCost)*Math.max(1,num(d.units))*cfac:calculatedOpex, debt=fin.payments[m]?.payment||0, noi=rev-opex, flow=noi-debt;out.push({m,year:y,month:mi,rev,opex,noi,debt,flow,nights,adr,occ,bal:fin.payments[m]?.balance||0})}for(let y=0;y<num(d.horizon);y++){let a=out.filter(x=>x.year===y);annual.push({year:y+1,rev:sum(a.map(x=>x.rev)),noi:sum(a.map(x=>x.noi)),flow:sum(a.map(x=>x.flow))})}return {out,annual,fin}}
function irr(fs){let lo=-.999,hi=10;let f=r=>sum(fs.map((v,i)=>v/Math.pow(1+r,i)));if(f(lo)*f(hi)>0)return null;for(let i=0;i<80;i++){let m=(lo+hi)/2;if(f(lo)*f(m)<=0)hi=m;else lo=m}return (lo+hi)/2}function results(d=data,sc=d.scenario){let p=projection(d,sc),total=capexTotal(d),equity=p.fin.equity,start=Math.max(0,num(d.start)+num(d.scenarios[sc].delay)),horizonRows=p.out.slice(start),stable=horizonRows.slice(0,12),noi=sum(stable.map(x=>x.noi)),annualFlow=sum(stable.map(x=>x.flow)),flow=horizonRows.length?sum(horizonRows.map(x=>x.flow))/horizonRows.length:0,cum=-equity,payback=null;for(let x of p.out){let prev=cum;cum+=x.flow;if(!payback&&cum>=0&&x.flow>0)payback=x.m-prev/x.flow}let flows=[-equity,...p.out.map(x=>x.flow)];flows[flows.length-1]+=total*num(d.residual)/100*Math.pow(1+num(d.appreciation)/100,num(d.horizon));let r=irr(flows),rate=Math.pow(1+num(d.discount)/100,1/12)-1,npv=sum(flows.map((x,i)=>x/Math.pow(1+rate,i))),avg=horizonRows.length?sum(horizonRows.map(x=>x.rev))/horizonRows.length:0,annualRevenue=sum(stable.map(x=>x.rev)),annualOutgo=sum(stable.map(x=>x.opex+x.debt)),horizonOpex=horizonRows.length?sum(horizonRows.map(x=>x.opex))/horizonRows.length:0,horizonCost=horizonRows.length?sum(horizonRows.map(x=>x.opex+x.debt))/horizonRows.length:0,horizonProfit=flow,breakeven=avg?Math.min(100,Math.max(0,num(d.revenue.occ)*annualOutgo/Math.max(1,annualRevenue))):null;return {...p,total,equity,avg,noi,annualFlow,flow,horizonOpex,horizonCost,horizonProfit,horizonMonths:horizonRows.length,payback,npv,irr:r==null?null:Math.pow(1+r,12)-1,cap:noi/Math.max(1,total),coc:annualFlow/Math.max(1,equity),roi:annualFlow/Math.max(1,total),margin:noi/Math.max(1,annualRevenue),breakeven}}function moneyValue(v){let t=String(v??'').trim().replace(/[R$\s]/g,'');if(t.includes(',')&&t.includes('.'))t=t.replace(/\./g,'').replace(',','.');else if(t.includes(','))t=t.replace(',','.');else if(/^\d{1,3}(\.\d{3})+$/.test(t))t=t.replace(/\./g,'');return num(t.replace(/[^\d.-]/g,''))}
function moneyDigits(v){return ni.format(num(v))}
function field(k,label,value,type='number',help=''){let isMoney=type==='money',isNumber=type==='number',inputType=isMoney?'text':type,attrs=isMoney?' data-money="true" inputmode="decimal"':isNumber?' data-spin-step="'+(/rate|discount|inflation|growth|appreciation/.test(k)?'.1':'1')+'"':'';let shown=isMoney?moneyDigits(value):(type==='date'?value:value??'');let input='<input data-key="'+escapeAttr(k)+'" type="'+escapeAttr(inputType)+'"'+attrs+' value="'+escapeAttr(shown)+'">';let control=isMoney?'<div class="money-input"><span class="money-prefix">R$</span>'+input+'</div>':isNumber?'<div class="number-input">'+input+'<span class="number-spin"><button type="button" data-spin="up" aria-label="Aumentar valor">▴</button><button type="button" data-spin="down" aria-label="Diminuir valor">▾</button></span></div>':input;return '<div class="field"><label>'+escapeHtml(label)+'</label>'+control+(help?'<div class="help">'+escapeHtml(help)+'</div>':'')+'</div>'}
function select(k,label,value,opts){return '<div class="field"><label>'+escapeHtml(label)+'</label><select data-key="'+escapeAttr(k)+'">'+opts.map(x=>'<option value="'+escapeAttr(x[0])+'" '+(String(value)===String(x[0])?'selected':'')+'>'+escapeHtml(x[1])+'</option>').join('')+'</select></div>'}function bindFields(root=document){root.querySelectorAll('[data-key]').forEach(el=>{if(el.dataset.money==='true')el.onfocus=()=>{el.value=String(moneyValue(el.value))};el.onchange=()=>{let path=el.dataset.key.split('.'),obj=data;path.slice(0,-1).forEach(k=>obj=obj[k]);obj[path.at(-1)]=el.dataset.money==='true'?moneyValue(el.value):el.type==='number'?num(el.value):el.value;save();render()}});root.querySelectorAll('[data-spin]').forEach(btn=>btn.onclick=()=>{let wrap=btn.parentElement&&btn.parentElement.parentElement,input=wrap&&wrap.querySelector('input');if(!input)return;let step=Number(input.dataset.spinStep)||1,next=num(input.value)+(btn.dataset.spin==='up'?step:-step);if(input.min!==''&&input.min!==undefined)next=Math.max(num(input.min),next);if(input.max!==''&&input.max!==undefined)next=Math.min(num(input.max),next);input.value=String(Math.round(next*1000)/1000);if(input.onchange)input.onchange()})}function renderNav(){document.getElementById('nav').innerHTML=pages.map(x=>'<button class="'+(page===x[0]?'active':'')+'" data-page="'+escapeAttr(x[0])+'">'+x[1]+'</button>').join('');document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{page=b.dataset.page;render()})}
function summary(){let r=results(),hv=document.getElementById('horizonValue'),status=document.getElementById('saveStatus');if(hv)hv.textContent=data.horizon+' anos';if(status)status.textContent='Dados temporários · horizonte de '+data.horizon+' anos';document.getElementById('summary').innerHTML=[['Investimento total',money(r.total),'CAPEX com contingência'],['Receita mensal média',money(r.avg),'média do horizonte'],['Lucro líquido mensal médio',money(r.flow),r.flow>=0?'após custos e dívida':'atenção ao caixa'],['Payback do capital próprio',r.payback?Math.ceil(r.payback/12*10)/10+' anos':'Não atingido','capital próprio']].map((x,i)=>'<div class="metric"><small>'+escapeAttr(x[0])+'</small><strong>'+x[1]+'</strong><span class="'+(i===2&&r.flow<0?'bad':'')+'">'+x[2]+'</span></div>').join('')}function labelInfo(label,tip){return label+'<span class="info" tabindex="0" title="'+tip+'">?</span>'}function scenarioCards(){let names={conservative:'Pessimista',base:'Normal',optimistic:'Otimista'};return '<section class="card scenario-panel"><div class="scenario-heading"><div><h2>Cenários automáticos</h2><h3>Médias mensais dos meses de operação no horizonte selecionado</h3></div><span class="sub">Receita · custos totais · lucro líquido</span></div><div class="scenario-grid">'+Object.keys(data.scenarios).map(s=>{let r=results(data,s);return '<button class="scenario-card '+(data.scenario===s?'active':'')+'" data-scenario="'+s+'"><span class="scenario-name">'+names[s]+'</span><div class="scenario-values"><div><small>Receita mensal média</small><b>'+money(r.avg)+'</b></div><div><small>Custo mensal médio</small><b>'+money(r.horizonCost)+'</b></div><div><small>Lucro líquido médio</small><b>'+money(r.horizonProfit)+'</b></div></div><span>Payback: '+(r.payback?Math.ceil(r.payback/12*10)/10+' anos':'não atingido')+'</span><small>Ocupação '+Math.round(data.revenue.occ+data.scenarios[s].occ)+'% · diária '+money(data.revenue.adr*(1+data.scenarios[s].adr/100))+'</small></button>'}).join('')+'</div><div class="help">O custo mensal médio reúne custos operacionais e parcela do financiamento quando houver. O lucro líquido médio é a receita menos esses custos, calculado sobre o horizonte escolhido.</div></section>'}function overview(){let r=results(),v=viability(r),period=num(data.horizon)>10?'ano':'semestre';return '<div class="grid overview-grid"><section class="card hero-chart"><h2>Fluxo de caixa acumulado</h2><h3>O ponto em que o capital próprio é recuperado · linhas verticais a cada '+period+'</h3><div class="chart"><canvas id="cashChart"></canvas></div></section><section class="card overview-lead"><div class="eyebrow">Cenário '+data.scenario+' · '+data.horizon+' anos</div><h2>'+v.title+'</h2><p class="overview-copy">'+v.text+' A receita média estimada é <b>'+money(r.avg)+'/mês</b>, com lucro líquido médio de <b>'+money(r.flow)+'/mês</b> após custos e dívida.</p><div class="kpis">'+[['Investimento total',money(r.total)],['Receita mensal média',money(r.avg)],['Lucro líquido médio',money(r.flow)],['Payback do capital próprio',r.payback?Math.ceil(r.payback/12*10)/10+' anos':'—']].map(x=>'<div class="kpi"><span class="label">'+escapeAttr(x[0])+'</span><b>'+x[1]+'</b></div>').join('')+'</div></section><section class="card return-card"><h2>Retorno em uma leitura</h2><h3>Indicadores do cenário selecionado</h3><div class="kpis">'+[['Cap rate',pct(r.cap*100),'NOI anual dividido pelo investimento total.'],['Cash-on-cash',pct(r.coc*100),'Fluxo anual sobre o capital próprio.'],['ROI anual',pct(r.roi*100),'Retorno real (após dívida) do Ano 1 sobre o investimento total.'],['Margem NOI',pct(r.margin*100),'Receita que sobra após custos operacionais.'],['VPL',money(r.npv),'Valor presente dos fluxos futuros.'],['TIR anual',r.irr==null?'—':pct(r.irr*100),'Taxa interna de retorno anual.']].map(x=>'<div class="kpi"><span class="label">'+labelInfo(x[0],x[2])+'</span><b>'+x[1]+'</b></div>').join('')+'</div></section>'+scenarioCards()+'</div>'}function project(){return '<div class="grid"><section class="card"><h2>Vamos começar pelo seu chalé</h2><h3>Preencha apenas o que você já sabe</h3><div class="formgrid">'+field('client','Nome do cliente',data.client,'text')+field('city','Cidade / região',data.city,'text')+field('model','Modelo do chalé',data.model,'text')+field('units','Quantidade de chalés',data.units)+'</div><div class="note">O app usa premissas operacionais padrão para preencher automaticamente os detalhes técnicos.</div></section></div>'}function capex(){return '<div class="grid"><section class="card"><h2>Investimento inicial</h2><h3>Itens compartilhados e por unidade</h3>'+Object.entries(data.capex).map(([cat,items])=>'<div class="cat"><div class="cathead"><span>'+escapeAttr(cat)+'</span><b>'+money(sum(items.map(x=>x[1]*x[2])))+'</b></div>'+items.map((x,i)=>'<div class="lineitem"><input value="'+escapeAttr(x[0])+'" data-item="'+escapeAttr(cat)+'|'+i+'|0"><input type="number" value="'+x[1]+'" data-item="'+escapeAttr(cat)+'|'+i+'|1"><input type="text" inputmode="decimal" value="'+money(x[2])+'" data-money="true" data-item="'+escapeAttr(cat)+'|'+i+'|2"><button class="x" data-del="'+escapeAttr(cat)+'|'+i+'">×</button></div>').join('')+'<button class="btn ghost" data-add="'+escapeAttr(cat)+'">+ Adicionar item</button></div>').join('')+'<div class="formgrid">'+field('contingency','Contingência (%)',data.contingency)+'</div><div class="note">Investimento total com contingência: <b>'+money(capexTotal())+'</b> · '+money(capexTotal()/Math.max(1,data.units))+' por unidade.</div></section></div>'}function revenue(){let r=results();return '<div class="grid"><section class="card half"><h2>Receita da hospedagem</h2><h3>Premissas operacionais</h3><div class="formgrid">'+select('ops.profile','Modelo de gestão',data.ops.profile||'managed',[['own','Gestão própria'],['managed','Gestão terceirizada'],['hybrid','Gestão híbrida']])+field('revenue.adr','Diária média — ADR (R$)',data.revenue.adr,'money')+field('revenue.occ','Ocupação média (%)',data.revenue.occ)+field('revenue.blocked','Dias bloqueados/mês',data.revenue.blocked)+field('revenue.stay','Permanência média (noites)',data.revenue.stay)+field('revenue.clean','Taxa de limpeza cobrada',data.revenue.clean,'money')+field('revenue.other','Outras receitas/mês',data.revenue.other,'money')+field('revenue.cancel','Cancelamentos/reembolsos (%)',data.revenue.cancel)+'</div></section><section class="card half"><h2>Prévia estabilizada</h2><h3>Com sazonalidade e ocupação prevista</h3><div class="kpis">'+[['Noites vendidas/mês',Math.round(sum(r.out.slice(data.start,data.start+12).map(x=>x.nights))/12)],['Reservas/mês',(sum(r.out.slice(data.start,data.start+12).map(x=>x.nights))/12/data.revenue.stay).toFixed(1)],['RevPAR',money(r.avg/(30.4*data.units))],['Receita anual',money(sum(r.out.slice(data.start,data.start+12).map(x=>x.rev)))],['Ocupação de equilíbrio',r.breakeven==null?'—':pct(r.breakeven)],['ADR médio',money(sum(r.out.slice(data.start,data.start+12).map(x=>x.adr))/12)]].map(x=>'<div class="kpi"><span class="label">'+escapeAttr(x[0])+'</span><b>'+x[1]+'</b></div>').join('')+'</div></section><section class="card"><h2>Sazonalidade mensal</h2><h3>Multiplicadores de ADR e ocupação</h3><div class="tablewrap"><table class="table"><thead><tr>'+['Mês',...['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']].map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody><tr><td>ADR</td>'+data.revenue.seasonAdr.map((x,i)=>'<td><input type="number" step=".01" value="'+x+'" data-season="adr|'+i+'"></td>').join('')+'</tr><tr><td>Ocupação</td>'+data.revenue.seasonOcc.map((x,i)=>'<td><input type="number" step=".01" value="'+x+'" data-season="occ|'+i+'"></td>').join('')+'</tr></tbody></table></div></section></div>'}
function opex(){return '<div class="grid"><section class="card"><h2>Custos operacionais</h2><h3>Custos detalhados para referência</h3>'+[['fixos','Fixos mensais (R$ / mês)'],['noite','Variáveis por noite (R$)'],['reserva','Variáveis por reserva (R$)'],['percent','Percentuais sobre a receita (%)']].map(([kind,label])=>'<div class="cat"><div class="cathead"><span>'+label+'</span><b>'+(kind==='percent'?pct(sum(data.ops[kind].map(x=>x[1]))):money(sum(data.ops[kind].map(x=>x[1]))))+'</b></div>'+data.ops[kind].map((x,i)=>'<div class="lineitem"><input value="'+escapeAttr(x[0])+'" data-op="'+kind+'|'+i+'|0"><span></span><input type="'+(kind==='percent'?'number':'text')+'" inputmode="decimal" value="'+(kind==='percent'?x[1]:money(x[1]))+'" '+(kind==='percent'?'':'data-money="true" ')+'data-op="'+kind+'|'+i+'|1"><button class="x" data-opdel="'+kind+'|'+i+'">×</button></div>').join('')+'<button class="btn ghost" data-opadd="'+kind+'">+ Adicionar custo</button></div>').join('')+'<div class="note">O valor usado na simulação é o custo operacional médio mensal informado na aba Operação. Estes itens ficam como referência para detalhamento.</div></section></div>'}function finance(){let f=financing(),r=results();return '<div class="grid"><section class="card half"><h2>Financiamento</h2><h3>Impacto no retorno do investidor</h3><div class="formgrid">'+select('finance.enabled','Regime',String(data.finance.enabled),[['true','Financiado'],['false','Sem financiamento']])+field('finance.entry','Entrada (%)',data.finance.entry)+field('finance.rate','Juros nominais anuais (%)',data.finance.rate)+field('finance.term','Prazo (meses)',data.finance.term)+field('finance.grace','Carência (meses)',data.finance.grace)+select('finance.system','Sistema',data.finance.system,[['PRICE','Price'],['SAC','SAC']])+field('finance.fees','Custos bancários / IOF',data.finance.fees,'money')+'</div><div class="note">Capital próprio estimado: <b>'+money(f.equity)+'</b> · Valor financiado: <b>'+money(f.loan)+'</b></div></section><section class="card half"><h2>Saúde da dívida</h2><h3>Primeiros 12 meses de operação</h3><div class="kpis">'+[['Parcela inicial',money(f.payments[0]?.payment)],['Fluxo mensal',money(r.flow)],['DSCR médio',f.payments.length?(r.noi/Math.max(1,sum(f.payments.slice(0,12).map(x=>x.payment)))).toFixed(2)+'x':'—'],['Saldo após 12 meses',money(f.payments[11]?.balance)],['Sistema',data.finance.system],['Prazo',data.finance.term+' meses']].map(x=>'<div class="kpi"><span class="label">'+escapeAttr(x[0])+'</span><b>'+x[1]+'</b></div>').join('')+'</div></section><section class="card"><h2>Tabela de amortização</h2><h3>Parcelas, juros, amortização e saldo devedor</h3><div class="tablewrap"><table class="table"><thead><tr><th>Mês</th><th>Parcela</th><th>Juros</th><th>Amortização</th><th>Saldo</th></tr></thead><tbody>'+f.payments.map((x,i)=>'<tr><td>'+String(i+1).padStart(2,'0')+'</td><td>'+money(x.payment)+'</td><td>'+money(x.interest)+'</td><td>'+money(x.amort)+'</td><td>'+money(x.balance)+'</td></tr>').join('')+'</tbody></table></div></section></div>'}
function scenarios(){let rr=['conservative','base','optimistic'].map(s=>[s,results(data,s)]);return '<div class="grid"><section class="card"><h2>Cenários</h2><h3>Ajustes sobre as premissas do estudo</h3><div class="tablewrap"><table class="table"><thead><tr><th>Cenário</th><th>Ocupação</th><th>ADR</th><th>CAPEX</th><th>Atraso</th><th>OPEX</th><th></th></tr></thead><tbody>'+Object.entries(data.scenarios).map(([s,x])=>'<tr><td><b>'+({conservative:'Conservador',base:'Base',optimistic:'Otimista'}[s])+'</b></td>'+['occ','adr','capex','delay','cost'].map(k=>'<td><input type="number" value="'+x[k]+'" data-sc="'+s+'|'+k+'"> '+(k==='delay'?'meses':'%')+'</td>').join('')+'<td><button class="btn '+(data.scenario===s?'primary':'')+'" data-use="'+s+'">Usar</button></td></tr>').join('')+'</tbody></table></div></section><section class="card half"><h2>Comparativo de retorno</h2><h3>Resultado anual estabilizado</h3><div class="chart"><canvas id="scenarioChart"></canvas></div></section><section class="card half"><h2>Sensibilidade: ADR × ocupação</h2><h3>Fluxo mensal após dívida</h3><div class="tablewrap">'+heatmap()+'</div></section></div>'}
function heatClass(value){let magnitude=Math.min(5,Math.max(1,Math.ceil(Math.abs(num(value))/2600)));return 'heat-'+(num(value)>=0?'positive':'negative')+'-'+magnitude}
function heatmap(){let occ=[40,50,60,70,80],adr=[500,600,700,800,900];return '<table class="table"><thead><tr><th>Ocup. \\ ADR</th>'+adr.map(x=>'<th>'+money(x)+'</th>').join('')+'</tr></thead><tbody>'+occ.map(o=>'<tr><th>'+o+'%</th>'+adr.map(a=>{let c=clone(data);c.revenue.occ=o;c.revenue.adr=a;let v=results(c).flow;return '<td class="'+heatClass(v)+'">'+money(v)+'</td>'}).join('')+'</tr>').join('')+'</tbody></table>'}function report(){let r=results(),p=projection();return '<div class="grid"><section class="card"><h2>Resumo executivo</h2><h3>'+escapeHtml(data.name)+' · '+escapeHtml(data.client)+'</h3><p>O cenário <b>'+data.scenario+'</b> projeta receita estabilizada de <b>'+money(r.avg)+'/mês</b>, NOI anual de <b>'+money(r.noi)+'</b> e retorno do capital próprio em '+(r.payback?'<b>'+Math.ceil(r.payback/12*10)/10+' anos</b>':'<b>prazo não atingido no horizonte</b>')+'.</p><div class="note">'+(r.breakeven>data.revenue.occ?'A ocupação projetada está abaixo do ponto de equilíbrio; revise diária, custos ou estrutura de financiamento.':r.margin<.45?'O OPEX consome parcela relevante da receita; acompanhe custos variáveis e comissões.':'As premissas indicam uma operação com margem operacional positiva. A sazonalidade e a diária são os principais direcionadores do resultado.')+'</div><button class="btn primary no-print" data-print-report>Imprimir / Salvar PDF</button></section><section class="card"><h2>Projeção anual</h2><h3>Receita, NOI e fluxo após dívida</h3><div class="tablewrap"><table class="table"><thead><tr><th>Ano</th><th>Receita</th><th>NOI</th><th>Fluxo após dívida</th></tr></thead><tbody>'+p.annual.map(x=>'<tr><td>'+x.year+'</td><td>'+money(x.rev)+'</td><td>'+money(x.noi)+'</td><td>'+money(x.flow)+'</td></tr>').join('')+'</tbody></table></div></section><section class="card"><h2>Metodologia</h2><p class="sub">Receita = noites vendidas × ADR + limpeza e extras; NOI = receita líquida − custos operacionais; fluxo do investidor = NOI − serviço da dívida. VPL usa taxa de desconto mensal equivalente; TIR é calculada sobre os fluxos mensais e o valor residual. Esta simulação é estimativa gerencial e não representa promessa de rentabilidade ou recomendação financeira, contábil ou tributária.</p></section></div>'}
function viability(r){if(r.flow<0)return {tone:'bad',title:'Atenção ao fluxo de caixa',text:'Com estas premissas, a operação ainda não cobre todos os custos e a parcela do financiamento.'};if(r.breakeven>data.revenue.occ)return {tone:'bad',title:'Margem de segurança reduzida',text:'A ocupação de equilíbrio está próxima ou acima da ocupação esperada.'};if(r.coc<.1)return {tone:'warn',title:'Operação viável com atenção',text:'O fluxo é positivo, mas o retorno sobre o capital próprio ainda é moderado.'};return {tone:'good',title:'Operação saudável',text:'O fluxo projetado cobre os custos, a dívida e mantém margem sobre a ocupação de equilíbrio.'}}
function investment(){let r=results(),f=r.fin,financed=data.finance.enabled!==false&&data.finance.enabled!=='false';return '<div class="grid"><section class="card"><h2>Investimento e forma de pagamento</h2><h3>O valor é multiplicado automaticamente pela quantidade de chalés</h3><div class="formgrid">'+field('simpleInvestment','Valor por chalé (R$)',data.simpleInvestment||capexTotal()/Math.max(1,data.units),'money')+field('units','Quantidade de chalés',data.units,'number')+select('finance.enabled','Método de pagamento',String(data.finance.enabled),[['false','Pagamento à vista'],['true','Financiamento']])+field('finance.entry','Entrada (%)',data.finance.entry,'number','No financiamento, a entrada reduz a parcela e os juros.')+(financed?field('finance.rate','Juros anuais (%)',data.finance.rate)+field('finance.term','Prazo (meses)',data.finance.term)+select('finance.system','Sistema de amortização',data.finance.system,[['PRICE','Price'],['SAC','SAC']]):'')+'</div><div class="kpis"><div class="kpi"><span class="label">Investimento total</span><b>'+money(r.total)+'</b></div><div class="kpi"><span class="label">Capital próprio</span><b>'+money(r.equity)+'</b></div><div class="kpi"><span class="label">Parcela estimada</span><b>'+money(f.payments[0]?.payment||0)+'</b></div></div></section>'+(financed?'<section class="card"><h2>Como fica o financiamento?</h2><h3>Primeiras parcelas e saldo devedor</h3><div class="tablewrap"><table class="table"><thead><tr><th>Mês</th><th>Parcela</th><th>Juros</th><th>Amortização</th><th>Saldo</th></tr></thead><tbody>'+f.payments.slice(0,12).map((x,i)=>'<tr><td>'+String(i+1).padStart(2,'0')+'</td><td>'+money(x.payment)+'</td><td>'+money(x.interest)+'</td><td>'+money(x.amort)+'</td><td>'+money(x.balance)+'</td></tr>').join('')+'</tbody></table></div><div class="note">A tabela completa continua disponível no relatório impresso.</div></section>':'<section class="card"><h2>Pagamento à vista</h2><h3>Sem parcela e sem juros</h3><div class="note">O capital próprio é o investimento total e o fluxo mensal fica livre do serviço da dívida.</div></section>')+'</div>'}function operationSnapshot(d=data,sc=d.scenario){
 let p=projection(d,sc),rows=p.out.filter(x=>x.rev>0||x.nights>0);
 if(!rows.length)rows=p.out;
 let first=rows[0]||{rev:0,opex:0,debt:0,flow:0},last=rows[rows.length-1]||first;
 let totalCost=x=>num(x.opex)+num(x.debt);
 return {
  revenueInitial:num(first.rev),
  revenueFinal:num(last.rev),
  costInitial:totalCost(first),
  costFinal:totalCost(last),
  profitInitial:num(first.flow),
  profitFinal:num(last.flow)
 }
}
function operation(){
 let r=results(),v=viability(r),o=operationSnapshot();
 return '<div class="grid"><section class="card"><h2>Como você imagina a operação?</h2><h3>Informe apenas as três premissas que mais influenciam o resultado</h3><div class="formgrid">'+field('revenue.adr','Diária média (R$)',data.revenue.adr,'money','Valor médio cobrado por noite.')+field('revenue.occ','Ocupação esperada (%)',data.revenue.occ,'number','Percentual médio de noites ocupadas.')+field('ops.monthlyCost','Custo operacional médio mensal (R$)',data.ops.monthlyCost,'money','Inclui energia, gás, limpeza, plataformas, impostos, manutenção e gestão. O valor é por chalé e se multiplica automaticamente pela quantidade comprada.')+'</div><div class="kpis"><div class="kpi"><span class="label">Receita mensal média</span><b>'+money(r.avg)+'/mês</b></div><div class="kpi"><span class="label">Custo mensal médio</span><b>'+money(r.horizonCost)+'/mês</b></div><div class="kpi"><span class="label">Lucro líquido médio</span><b class="'+(r.flow<0?'bad':'good')+'">'+money(r.flow)+'/mês</b></div></div><div class="note">'+v.text+' O lucro líquido médio considera o horizonte de '+data.horizon+' anos e desconta a parcela do financiamento quando houver.</div></section><section class="card operation-evolution"><h2>Evolução mensal estimada</h2><h3>Comparação entre o início da operação e o último mês do horizonte, com crescimento e inflação aplicados</h3><div class="operation-period"><div class="operation-period-title"><span>Início da operação</span><small>Primeiro mês com receita</small></div><div class="kpis operation-kpis"><div class="kpi"><span class="label">Receita mensal inicial</span><b>'+money(o.revenueInitial)+'</b></div><div class="kpi"><span class="label">Custo mensal inicial</span><b>'+money(o.costInitial)+'</b></div><div class="kpi"><span class="label">Lucro líquido mensal inicial</span><b class="'+(o.profitInitial<0?'bad':'good')+'">'+money(o.profitInitial)+'</b></div></div></div><div class="operation-period operation-period-final"><div class="operation-period-title"><span>Final do horizonte</span><small>Valores corrigidos pela inflação</small></div><div class="kpis operation-kpis"><div class="kpi"><span class="label">Receita mensal final (Corrigida pela inflação)</span><b>'+money(o.revenueFinal)+'</b></div><div class="kpi"><span class="label">Custo mensal final (Corrigida pela inflação)</span><b>'+money(o.costFinal)+'</b></div><div class="kpi"><span class="label">Lucro líquido mensal final (Corrigida pela inflação)</span><b class="'+(o.profitFinal<0?'bad':'good')+'">'+money(o.profitFinal)+'</b></div></div></div><div class="help">Os custos incluem a parcela do financiamento enquanto ela existir. Após o término do financiamento, o lucro líquido aumenta automaticamente.</div></section></div>'
}function returnPage(){let r=results(),v=viability(r);return '<div class="return-page"><section class="card return-hero"><div class="return-hero-head"><div><div class="eyebrow">Cenário '+data.scenario+' · horizonte de '+data.horizon+' anos</div><h2>'+v.title+'</h2><p class="overview-copy">'+v.text+'</p></div><div class="return-hero-badge '+v.tone+'">'+(r.flow>=0?'Fluxo positivo':'Revisar premissas')+'</div></div><div class="kpis">'+[['Receita mensal média',money(r.avg)+'/mês'],['Custos mensais médios',money(r.horizonCost)+'/mês'],['Lucro líquido médio',money(r.flow)+'/mês'],['Payback',r.payback?Math.ceil(r.payback/12*10)/10+' anos':'Não atingido']].map(x=>'<div class="kpi"><span class="label">'+escapeAttr(x[0])+'</span><b>'+x[1]+'</b></div>').join('')+'</div></section><div class="return-charts"><section class="card report-chart-card"><h2>Fluxo de caixa acumulado</h2><h3>Recuperação do capital próprio ao longo do horizonte</h3><div class="chart"><canvas id="returnCashChart"></canvas></div></section><section class="card report-chart-card"><h2>Receita, custos e lucro</h2><h3>Média mensal dos primeiros 12 meses de operação</h3><div class="chart"><canvas id="returnMonthlyChart"></canvas></div></section></div><section class="card report-scenario-card"><h2>Comparação dos cenários</h2><h3>Receita, custo total e lucro líquido médio</h3><div class="chart"><canvas id="returnScenarioChart"></canvas></div></section>'+report()+'</div>'}function reportView(){let r=results(),p=projection(),f=r.fin,names={conservative:'Pessimista',base:'Normal',optimistic:'Otimista'},financed=data.finance.enabled!==false&&data.finance.enabled!=='false';return '<div class="report-view"><div class="report-toolbar no-print"><button class="btn" data-report-back>← Voltar para Visão geral</button><button class="btn primary" data-print-report>Salvar PDF</button></div><section class="card report-cover"><div class="eyebrow">321 Modular · Simulador de investimento</div><h2>Relatório de viabilidade</h2><p class="sub">'+escapeHtml(data.name)+' · '+escapeHtml(data.client)+' · '+escapeHtml(data.city)+' · horizonte de '+data.horizon+' anos</p><div class="kpis">'+[['Investimento total',money(r.total)],['Receita mensal média',money(r.avg)],['Custo mensal médio',money(r.horizonCost)],['Lucro líquido médio',money(r.flow)],['Payback',r.payback?Math.ceil(r.payback/12*10)/10+' anos':'Não atingido'],['Cap rate',pct(r.cap*100)]].map(x=>'<div class="kpi"><span class="label">'+escapeAttr(x[0])+'</span><b>'+x[1]+'</b></div>').join('')+'</div></section><div class="report-chart-grid"><section class="card report-chart-card"><h2>Fluxo de caixa acumulado</h2><h3>Linhas a cada '+(num(data.horizon)>10?'ano':'semestre')+'</h3><div class="chart"><canvas id="reportCashChart"></canvas></div></section><section class="card report-chart-card"><h2>Comparação de cenários</h2><h3>Receita, custos totais e lucro líquido médios</h3><div class="chart"><canvas id="reportScenarioChart"></canvas></div></section></div><section class="card report-scenarios"><h2>Cenários automáticos</h2><div class="tablewrap"><table class="table"><thead><tr><th>Cenário</th><th>Receita mensal média</th><th>Custo mensal médio</th><th>Lucro líquido médio</th><th>Payback</th></tr></thead><tbody>'+['conservative','base','optimistic'].map(sc=>{let x=results(data,sc);return '<tr><td><b>'+names[sc]+'</b></td><td>'+money(x.avg)+'</td><td>'+money(x.horizonCost)+'</td><td>'+money(x.flow)+'</td><td>'+(x.payback?Math.ceil(x.payback/12*10)/10+' anos':'Não atingido')+'</td></tr>'}).join('')+'</tbody></table></div></section><section class="card report-annual"><h2>Projeção anual</h2><div class="tablewrap"><table class="table"><thead><tr><th>Ano</th><th>Receita</th><th>NOI</th><th>Financiamento</th><th>Lucro líquido</th></tr></thead><tbody>'+p.annual.map((x,i)=>'<tr><td>'+x.year+'</td><td>'+money(x.rev)+'</td><td>'+money(x.noi)+'</td><td>'+money(sum(p.out.filter(m=>m.year===i).map(m=>m.debt)))+'</td><td>'+money(x.flow)+'</td></tr>').join('')+'</tbody></table></div></section><section class="card report-financing"><div class="report-detail-head"><div><h2>Projeção do financiamento</h2><h3>'+(financed?'Sistema '+data.finance.system+' · '+data.finance.term+' meses':'Pagamento à vista · sem parcelas')+'</h3></div><div class="report-finance-kpi"><span class="label">Parcela inicial</span><b>'+money(f.payments[0]?.payment||0)+'</b></div></div><div class="tablewrap"><table class="table"><thead><tr><th>Mês</th><th>Parcela</th><th>Juros</th><th>Amortização</th><th>Saldo devedor</th></tr></thead><tbody>'+(financed?f.payments.map((x,i)=>'<tr><td>'+String(i+1).padStart(2,'0')+'</td><td>'+money(x.payment)+'</td><td>'+money(x.interest)+'</td><td>'+money(x.amort)+'</td><td>'+money(x.balance)+'</td></tr>').join(''):'<tr><td colspan="5">Este estudo considera pagamento à vista.</td></tr>')+'</tbody></table></div></section><section class="card report-method"><h2>Metodologia</h2><p class="sub">Receita = noites vendidas × diária + limpeza e extras. Custos mensais incluem a operação e, quando aplicável, a parcela do financiamento. Lucro líquido = receita − custos totais. Os indicadores são estimativas gerenciais e não representam promessa de rentabilidade ou recomendação financeira.</p></section></div>'}function generatePdf(){
 let PDF=window.jspdf&&window.jspdf.jsPDF;
 if(!PDF){
  toast('Gerador vetorial indisponível; recarregue a página');
  return
 }
 try{
  let r=results(),p=projection(),f=r.fin,
      names={conservative:'Pessimista',base:'Normal',optimistic:'Otimista'},
      financed=data.finance.enabled!==false&&data.finance.enabled!=='false',
      doc=new PDF({orientation:'portrait',unit:'mm',format:'a4'}),
      W=210,H=297,M=14,contentW=W-M*2,y=16,
      orange=[232,89,12],amber=[249,178,21],blue=[45,93,169],
      green=[43,138,62],ink=[28,31,36],muted=[104,113,125],
      line=[211,216,222],soft=[247,248,249],white=[255,255,255];

  function pdfSafe(v){
   return String(v==null?'':v)
    .replace(/\u00a0/g,' ')
    .replace(/[\u2012\u2013\u2014\u2212]/g,'-')
    .replace(/[\u00b7\u2022]/g,'-')
    .replace(/[\u2018\u2019]/g,"'")
    .replace(/[\u201c\u201d]/g,'"')
    .replace(/\u2026/g,'...')
  }
  function pdfMoney(v){return pdfSafe(money(v))}
  function rgb(c,kind='text'){
   if(kind==='fill')doc.setFillColor(c[0],c[1],c[2]);
   else if(kind==='draw')doc.setDrawColor(c[0],c[1],c[2]);
   else doc.setTextColor(c[0],c[1],c[2])
  }
  function text(t,x,yy,size=9,bold=false,color=ink,align='left'){
   rgb(color);
   doc.setFont('helvetica',bold?'bold':'normal');
   doc.setFontSize(size);
   doc.text(pdfSafe(t),x,yy,{align})
  }
  function topBar(){
   rgb(orange,'fill');
   doc.rect(0,0,W,6,'F')
  }
  function pageTitle(title,subtitle=''){
   topBar();
   text(title,M,y,16,true,ink);
   y+=7;
   if(subtitle){text(subtitle,M,y,8,false,muted);y+=6}
  }
  function newPage(title,subtitle=''){
   doc.addPage();
   y=16;
   pageTitle(title,subtitle)
  }
  function metric(label,value,x,yy,w){
   rgb(soft,'fill');
   rgb(line,'draw');
   doc.setLineWidth(.25);
   doc.roundedRect(x,yy,w,17,2,2,'FD');
   text(label,x+4,yy+6,7,false,muted);
   text(value,x+4,yy+13,10.5,true,ink)
  }
  function axisMoney(v){
   let a=Math.abs(num(v)),sign=num(v)<0?'-':'';
   if(a>=1000000)return sign+'R$ '+(a/1000000).toFixed(a>=10000000?0:1).replace('.',',')+' mi';
   if(a>=1000)return sign+'R$ '+(a/1000).toFixed(a>=100000?0:1).replace('.',',')+' mil';
   return sign+'R$ '+Math.round(a)
  }
  function chartRange(values){
   let min=Math.min(0,...values),max=Math.max(0,...values);
   if(max===min){max=min+1}
   let pad=(max-min)*.08;
   return {min:min-pad,max:max+pad}
  }
  function drawLineChart(title,subtitle,labels,values,top,height){
   text(title,M,top,13,true,ink);
   text(subtitle,M,top+5,7.5,false,muted);
   let boxY=top+10,boxH=height-10;
   rgb(soft,'fill');
   rgb(line,'draw');
   doc.roundedRect(M,boxY,contentW,boxH,2,2,'FD');
   let plotX=M+27,plotY=boxY+10,plotW=contentW-35,plotH=boxH-23;
   let range=chartRange(values),toY=v=>plotY+(range.max-v)/(range.max-range.min)*plotH;
   rgb(line,'draw');
   doc.setLineWidth(.22);
   for(let i=0;i<=5;i++){
    let gy=plotY+(plotH*i/5),gv=range.max-(range.max-range.min)*i/5;
    doc.line(plotX,gy,plotX+plotW,gy);
    text(axisMoney(gv),plotX-3,gy+2,6.5,false,muted,'right')
   }
   let zeroY=toY(0);
   if(zeroY>=plotY&&zeroY<=plotY+plotH){
    rgb(muted,'draw');
    doc.setLineWidth(.4);
    doc.line(plotX,zeroY,plotX+plotW,zeroY)
   }
   let count=Math.max(1,values.length),toX=i=>count===1?plotX+plotW/2:plotX+(i/(count-1))*plotW;
   let labelSkip=Math.max(1,Math.ceil(count/10));
   for(let i=0;i<count;i++){
    if(i%labelSkip===0||i===count-1){
     let px=toX(i);
     rgb(line,'draw');
     doc.setLineWidth(.18);
     doc.line(px,plotY,px,plotY+plotH);
     text(labels[i],px,plotY+plotH+5,6.5,false,muted,'center')
    }
   }
   rgb(orange,'draw');
   doc.setLineWidth(.9);
   for(let i=1;i<count;i++)doc.line(toX(i-1),toY(values[i-1]),toX(i),toY(values[i]));
   for(let i=0;i<count;i++){
    rgb(white,'fill');
    rgb(orange,'draw');
    doc.setLineWidth(.5);
    doc.circle(toX(i),toY(values[i]),1.15,'FD')
   }
   rgb(orange,'fill');
   doc.rect(M+5,boxY+4,7,.9,'F');
   text('Fluxo acumulado',M+14,boxY+5.2,7,false,muted)
  }
  function drawBarChart(title,subtitle,labels,series,top,height){
   text(title,M,top,13,true,ink);
   text(subtitle,M,top+5,7.5,false,muted);
   let boxY=top+10,boxH=height-10;
   rgb(soft,'fill');
   rgb(line,'draw');
   doc.roundedRect(M,boxY,contentW,boxH,2,2,'FD');
   let legendY=boxY+7,legendX=M+8;
   series.forEach((s,i)=>{
    rgb(s.color,'fill');
    doc.rect(legendX,legendY-3,4,3,'F');
    text(s.label,legendX+6,legendY,6.8,false,muted);
    legendX+=39
   });
   let all=series.flatMap(s=>s.values),range=chartRange(all);
   let plotX=M+27,plotY=boxY+15,plotW=contentW-35,plotH=boxH-29,toY=v=>plotY+(range.max-v)/(range.max-range.min)*plotH;
   rgb(line,'draw');
   doc.setLineWidth(.22);
   for(let i=0;i<=4;i++){
    let gy=plotY+(plotH*i/4),gv=range.max-(range.max-range.min)*i/4;
    doc.line(plotX,gy,plotX+plotW,gy);
    text(axisMoney(gv),plotX-3,gy+2,6.5,false,muted,'right')
   }
   let zeroY=toY(0);
   rgb(muted,'draw');
   doc.setLineWidth(.45);
   doc.line(plotX,zeroY,plotX+plotW,zeroY);
   let groupW=plotW/labels.length,barW=Math.min(10,groupW/(series.length+1));
   labels.forEach((label,i)=>{
    let groupCenter=plotX+groupW*(i+.5),startX=groupCenter-(barW*series.length)/2;
    series.forEach((s,j)=>{
     let val=s.values[i],valY=toY(val),barY=Math.min(zeroY,valY),barH=Math.max(.6,Math.abs(zeroY-valY));
     rgb(s.color,'fill');
     doc.rect(startX+j*barW,barY,barW-1,barH,'F')
    });
    text(label,groupCenter,plotY+plotH+6,7,false,muted,'center')
   })
  }
  let currentHeaders=[],currentWidths=[],currentSectionTitle='';
  function tableHeader(labels,widths){
   let x=M;
   labels.forEach((label,i)=>{
    rgb(orange,'fill');
    doc.rect(x,y,widths[i],8,'F');
    rgb(white,'draw');
    doc.setLineWidth(.18);
    doc.rect(x,y,widths[i],8,'S');
    text(label,x+2,y+5.2,6.8,true,white);
    x+=widths[i]
   });
   y+=8
  }
  function tableRow(values,widths,shade){
   if(y+7>282){
    newPage(currentSectionTitle+' - continuação');
    tableHeader(currentHeaders,currentWidths)
   }
   let fill=shade?[243,246,248]:white,x=M;
   values.forEach((value,i)=>{
    rgb(fill,'fill');
    doc.rect(x,y,widths[i],7,'F');
    rgb(line,'draw');
    doc.setLineWidth(.22);
    doc.rect(x,y,widths[i],7,'S');
    text(value,x+2,y+4.7,6.7,false,ink);
    x+=widths[i]
   });
   y+=7
  }

  topBar();
  text('Relatório de viabilidade',M,y,20,true,ink);
  y+=9;
  text(data.name+' - '+data.client,M,y,9,false,muted);
  y+=5;
  text(data.city+' - Horizonte de '+data.horizon+' anos - Cenário '+names[data.scenario],M,y,8,false,muted);
  y+=12;
  let metrics=[
   ['Investimento total',pdfMoney(r.total)],
   ['Receita mensal média',pdfMoney(r.avg)],
   ['Custo mensal médio',pdfMoney(r.horizonCost)],
   ['Lucro líquido médio',pdfMoney(r.flow)],
   ['Payback',r.payback?Math.ceil(r.payback/12*10)/10+' anos':'Não atingido'],
   ['Cap rate',pdfSafe(pct(r.cap*100))]
  ];
  metrics.forEach((m,i)=>metric(m[0],m[1],M+(i%2)*(contentW/2),y+Math.floor(i/2)*21,(contentW/2)-5));
  y+=72;
  rgb(soft,'fill');
  rgb(line,'draw');
  doc.roundedRect(M,y,contentW,30,2,2,'FD');
  text('Resumo da simulação',M+5,y+7,10,true,ink);
  text('Receita, custos e financiamento são projetados mês a mês para o cenário selecionado.',M+5,y+14,8,false,muted);
  text('Os resultados são estimativas gerenciais e não representam promessa de rentabilidade.',M+5,y+21,8,false,muted);

  let periodStep=num(data.horizon)>10?12:6,periodName=periodStep===6?'semestre':'ano',
      periodLabels=[],periodValues=[],cash=-r.equity;
  p.out.forEach((x,i)=>{
   cash+=x.flow;
   if((i+1)%periodStep===0||i===p.out.length-1){
    periodLabels.push(String(Math.ceil((i+1)/periodStep)));
    periodValues.push(cash)
   }
  });
  let scenarioKeys=['conservative','base','optimistic'],scenarioResults=scenarioKeys.map(sc=>results(data,sc));

  newPage('Análise gráfica','Gráficos vetoriais - linhas, eixos, textos e barras permanecem nítidos em qualquer zoom');
  drawLineChart('Fluxo de caixa acumulado','Evolução por '+periodName+' ao longo do horizonte',periodLabels,periodValues,y,105);
  y+=113;
  drawBarChart('Comparação de cenários','Médias mensais de receita, custos e lucro líquido',['Pessimista','Normal','Otimista'],[
   {label:'Receita',color:blue,values:scenarioResults.map(x=>x.avg)},
   {label:'Custos',color:orange,values:scenarioResults.map(x=>x.horizonCost)},
   {label:'Lucro líquido',color:green,values:scenarioResults.map(x=>x.flow)}
  ],y,100);

  newPage('Cenários automáticos');
  currentSectionTitle='Cenários automáticos';
  currentHeaders=['Cenário','Receita média','Custo médio','Lucro líquido','Payback'];
  currentWidths=[36,36,36,36,38];
  tableHeader(currentHeaders,currentWidths);
  scenarioKeys.forEach((sc,i)=>{
   let x=scenarioResults[i];
   tableRow([names[sc],pdfMoney(x.avg),pdfMoney(x.horizonCost),pdfMoney(x.flow),x.payback?Math.ceil(x.payback/12*10)/10+' anos':'Não atingido'],currentWidths,i%2===0)
  });

  y+=8;
  text('Projeção anual',M,y,12,true,ink);
  y+=6;
  currentSectionTitle='Projeção anual';
  currentHeaders=['Ano','Receita','NOI','Financiamento','Lucro líquido'];
  currentWidths=[20,40,40,40,42];
  tableHeader(currentHeaders,currentWidths);
  p.annual.forEach((x,i)=>tableRow([
   x.year,
   pdfMoney(x.rev),
   pdfMoney(x.noi),
   pdfMoney(sum(p.out.filter(m=>m.year===i).map(m=>m.debt))),
   pdfMoney(x.flow)
  ],currentWidths,i%2===0));

  newPage('Projeção do financiamento',financed?'Sistema '+data.finance.system+' - '+data.finance.term+' meses - parcela inicial '+pdfMoney(f.payments[0]?.payment||0):'Pagamento à vista - sem parcelas');
  currentSectionTitle='Projeção do financiamento';
  currentHeaders=['Mês','Parcela','Juros','Amortização','Saldo devedor'];
  currentWidths=[17,40,36,40,49];
  tableHeader(currentHeaders,currentWidths);
  if(financed){
   f.payments.forEach((x,i)=>tableRow([
    String(i+1).padStart(2,'0'),
    pdfMoney(x.payment),
    pdfMoney(x.interest),
    pdfMoney(x.amort),
    pdfMoney(x.balance)
   ],currentWidths,i%2===0))
  }else{
   tableRow(['-','Pagamento à vista','-','-','-'],currentWidths,true)
  }

  let pageCount=doc.internal.getNumberOfPages();
  for(let pageNumber=1;pageNumber<=pageCount;pageNumber++){
   doc.setPage(pageNumber);
   rgb(line,'draw');
   doc.setLineWidth(.2);
   doc.line(M,287,W-M,287);
   text('321 Modular - Simulador de investimento',M,292,6.5,false,muted);
   text(pageNumber+' / '+pageCount,W-M,292,6.5,false,muted,'right')
  }

  doc.save('relatorio-321-modular.pdf');
  toast('PDF vetorial gerado com sucesso')
 }catch(err){
  console.error('Falha ao gerar PDF:',err);
  toast('Não foi possível gerar o PDF; tente novamente')
 }
}function openWelcome(){let m=document.getElementById('modal'),b=document.getElementById('modalBox');b.innerHTML='<p class="eyebrow">321 Modular · Simulador</p><p class="welcome-lead">Descubra se o seu chalé pode gerar um bom retorno.</p><p class="sub">Você não precisa preencher uma planilha. O app vai conduzir a simulação em poucos passos.</p><div class="welcome-steps"><div class="welcome-step"><i>1</i><div><b>Defina o projeto</b><span class="sub">Escolha o modelo, local e investimento.</span></div></div><div class="welcome-step"><i>2</i><div><b>Configure a operação</b><span class="sub">Informe diária, ocupação e nível de gestão.</span></div></div><div class="welcome-step"><i>3</i><div><b>Veja o retorno</b><span class="sub">Receba fluxo, payback e ponto de equilíbrio.</span></div></div></div><div class="actions"><button class="btn primary" id="guidedStart">Começar simulação</button><button class="btn" id="welcomeDemo">Usar exemplo pronto</button></div>';m.classList.add('open');document.getElementById('guidedStart').onclick=()=>{page='project';m.classList.remove('open');render()};document.getElementById('welcomeDemo').onclick=()=>{data=base();save();m.classList.remove('open');render();toast('Exemplo pronto carregado')}}
function render(){try{renderNav();summary();let pageTitle=pages.find(x=>x[0]===page);document.getElementById('title').textContent=pageTitle?pageTitle[1]:'Relatório';let fn={overview,project,investment,operation,report:reportView}[page]||overview;document.getElementById('view').innerHTML=fn();bindFields();bindPage();renderCharts()}catch(err){console.error('Falha ao renderizar o simulador:',err);let v=document.getElementById('view');if(v)v.innerHTML='<section class="card"><h2>Não foi possível abrir esta tela</h2><p>Os dados salvos estavam incompletos ou incompatíveis.</p><button class="btn primary" data-restore-defaults>Restaurar valores de exemplo</button></section>';toast('Corrigindo dados incompatíveis')}}function bindPage(){document.querySelectorAll('[data-print-report]').forEach(e=>e.onclick=()=>window.print());document.querySelectorAll('[data-restore-defaults]').forEach(e=>e.onclick=()=>{data=base();studies=[{id:active,data}];render()});let picker=document.getElementById('horizonPicker'),toggle=document.getElementById('horizonToggle');if(toggle&&picker)toggle.onclick=()=>picker.classList.toggle('open');document.querySelectorAll('[data-horizon-choice]').forEach(e=>e.onclick=()=>{data.horizon=num(e.dataset.horizonChoice);if(picker)picker.classList.remove('open');save();render()});document.querySelectorAll('[data-report-back]').forEach(e=>e.onclick=()=>{page='overview';render()});document.querySelectorAll('[data-money="true"]').forEach(e=>{if(!e.onfocus)e.onfocus=()=>{e.value=String(moneyValue(e.value))}});document.querySelectorAll('[data-item]').forEach(e=>e.onchange=()=>{let[a,i,k]=e.dataset.item.split('|'),x=data.capex[a][i];x[k]=k==='0'?e.value:(e.dataset.money==='true'?moneyValue(e.value):num(e.value));save();render()});document.querySelectorAll('[data-del]').forEach(e=>e.onclick=()=>{let[a,i]=e.dataset.del.split('|');data.capex[a].splice(i,1);save();render()});document.querySelectorAll('[data-add]').forEach(e=>e.onclick=()=>{data.capex[e.dataset.add].push(['Novo item',1,0]);save();render()});document.querySelectorAll('[data-season]').forEach(e=>e.onchange=()=>{let[a,i]=e.dataset.season.split('|');data.revenue['season'+(a==='adr'?'Adr':'Occ')][i]=num(e.value);save();render()});document.querySelectorAll('[data-op]').forEach(e=>e.onchange=()=>{let[a,i,k]=e.dataset.op.split('|');data.ops[a][i][k]=k==='0'?e.value:(e.dataset.money==='true'?moneyValue(e.value):num(e.value));save();render()});document.querySelectorAll('[data-opdel]').forEach(e=>e.onclick=()=>{let[a,i]=e.dataset.opdel.split('|');data.ops[a].splice(i,1);save();render()});document.querySelectorAll('[data-opadd]').forEach(e=>e.onclick=()=>{data.ops[e.dataset.opadd].push(['Novo custo',0]);save();render()});document.querySelectorAll('[data-sc]').forEach(e=>e.onchange=()=>{let[a,k]=e.dataset.sc.split('|');data.scenarios[a][k]=num(e.value);save();render()});document.querySelectorAll('[data-use]').forEach(e=>e.onclick=()=>{data.scenario=e.dataset.use;save();render();toast('Cenário atualizado')});document.querySelectorAll('[data-scenario]').forEach(e=>e.onclick=()=>{data.scenario=e.dataset.scenario;save();render();toast('Cenário '+e.dataset.scenario+' selecionado')})}function chart(id,config){if(charts[id])charts[id].destroy();let e=document.getElementById(id);if(e&&window.Chart)charts[id]=new Chart(e,config)}
const semesterGuidePlugin={id:'semesterGuidePlugin',afterDraw(chart){if(!['cashChart','reportCashChart'].includes(chart.canvas.id))return;let step=num(data.horizon)>10?12:6,x=chart.scales.x,a=chart.chartArea,c=chart.ctx;c.save();c.font='800 10px Montserrat,sans-serif';c.textAlign='center';c.textBaseline='top';for(let i=step-1;i<chart.data.labels.length;i+=step){let px=x.getPixelForValue(i);c.beginPath();c.moveTo(px,a.top);c.lineTo(px,a.bottom);c.strokeStyle='rgba(232,89,12,.72)';c.lineWidth=1.5;c.setLineDash([6,5]);c.stroke();c.setLineDash([]);c.fillStyle='#e8590c';c.fillText(Math.ceil((i+1)/step)+'º',px,a.bottom+9)}c.restore()}};
function renderCharts(){
 if(!window.Chart)return;
 let r=results(),p=projection(),step=num(data.horizon)>10?12:6,periodName=step===6?'semestre':'ano';
 if(page==='overview'){
  let cum=-r.equity,vs=p.out.map(x=>cum+=x.flow);
  chart('cashChart',{
   type:'line',
   plugins:[semesterGuidePlugin],
   data:{labels:p.out.map(x=>'M'+(x.m+1)),datasets:[{label:'Fluxo acumulado',data:vs,borderColor:'#e8590c',borderWidth:2.5,backgroundColor:'rgba(232,89,12,.12)',fill:true,tension:.3,pointRadius:0}]},
   options:{responsive:true,maintainAspectRatio:false,animation:false,layout:{padding:{bottom:24}},plugins:{legend:{display:true,labels:{usePointStyle:true,boxWidth:8,color:'#68717d'}},tooltip:{callbacks:{title:items=>'Mês '+(items[0].dataIndex+1)+' · '+(Math.ceil((items[0].dataIndex+1)/step)+'º '+periodName)}}},scales:{x:{display:true,ticks:{display:false},grid:{display:false},border:{color:'rgba(104,113,125,.38)'}},y:{ticks:{color:'#68717d',callback:v=>nf.format(v)},grid:{color:'rgba(104,113,125,.35)',lineWidth:1.25}}}}
  })
 }
 if(page==='report'){
  let periodLabels=[],periodValues=[],cash=-r.equity;
  p.out.forEach((x,i)=>{
   cash+=x.flow;
   if((i+1)%step===0||i===p.out.length-1){
    periodLabels.push(Math.ceil((i+1)/step)+'º');
    periodValues.push(cash)
   }
  });
  chart('reportCashChart',{
   type:'line',
   data:{labels:periodLabels,datasets:[{label:'Fluxo acumulado',data:periodValues,borderColor:'#e8590c',borderWidth:2.8,backgroundColor:'rgba(232,89,12,.12)',fill:true,tension:.25,pointRadius:2.5,pointBackgroundColor:'#e8590c',pointBorderColor:'#fff',pointBorderWidth:1.5}]},
   options:{responsive:true,maintainAspectRatio:false,devicePixelRatio:2,animation:false,layout:{padding:{top:8,right:8,bottom:4,left:4}},plugins:{legend:{display:true,labels:{usePointStyle:true,boxWidth:8,color:'#68717d',font:{size:10}}},tooltip:{callbacks:{title:items=>periodLabels[items[0].dataIndex]+' '+periodName}}},scales:{x:{ticks:{display:true,color:'#68717d',maxRotation:0,autoSkip:false,font:{size:9}},grid:{color:'rgba(104,113,125,.2)'},border:{color:'rgba(104,113,125,.38)'}},y:{ticks:{color:'#68717d',callback:v=>nf.format(v),font:{size:9}},grid:{color:'rgba(104,113,125,.3)',lineWidth:1.1},beginAtZero:false}}}
  });
  let ss=['conservative','base','optimistic'],sr=ss.map(x=>results(data,x));
  chart('reportScenarioChart',{
   type:'bar',
   data:{labels:['Pessimista','Normal','Otimista'],datasets:[{label:'Receita média',data:sr.map(x=>x.avg),backgroundColor:'#2d5da9',borderRadius:3},{label:'Custos médios',data:sr.map(x=>x.horizonCost),backgroundColor:'#e8590c',borderRadius:3},{label:'Lucro líquido médio',data:sr.map(x=>x.flow),backgroundColor:'#2b8a3e',borderRadius:3}]},
   options:{responsive:true,maintainAspectRatio:false,devicePixelRatio:2,animation:false,plugins:{legend:{display:true,labels:{usePointStyle:true,boxWidth:8,color:'#68717d',font:{size:10}}}},scales:{x:{grid:{display:false},ticks:{color:'#68717d',font:{size:9}}},y:{beginAtZero:true,ticks:{color:'#68717d',callback:v=>nf.format(v),font:{size:9}},grid:{color:'rgba(104,113,125,.25)'}}}}
  })
 }
}
function closeMobileMenu(){document.getElementById('side')?.classList.remove('open');document.getElementById('asideBackdrop')?.classList.remove('active')}
function setupInterface(){
 const side=document.getElementById('side'),backdrop=document.getElementById('asideBackdrop');
 document.getElementById('menuBtn').addEventListener('click',()=>{side.classList.toggle('open');backdrop.classList.toggle('active',side.classList.contains('open'))});
 backdrop.addEventListener('click',closeMobileMenu);
 document.getElementById('themeBtn').addEventListener('click',()=>{let t=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=t;localStorage.setItem('321theme',t);renderCharts()});
 document.getElementById('demoBtn').addEventListener('click',()=>{data=base();studies=[{id:active,data}];render();toast('Valores ilustrativos aplicados')});
 document.getElementById('reportBtn').addEventListener('click',generatePdf);
 document.getElementById('logoutBtn').addEventListener('click',()=>{location.href=window.SuperAppAuth.getPortalUrl()});
}
function openStudies(){let m=document.getElementById('modal'),b=document.getElementById('modalBox');b.replaceChildren();let title=document.createElement('h2');title.textContent='Estudos desta sessão';let copy=document.createElement('p');copy.className='sub';copy.textContent='Os estudos são apagados quando o aplicativo é fechado ou recarregado.';b.append(title,copy);studies.forEach(s=>{let row=document.createElement('p'),button=document.createElement('button');button.className='btn '+(s.id===active?'primary':'');button.textContent=String(s.data?.name||'Estudo sem nome');button.addEventListener('click',()=>{active=s.id;data=s.data;m.classList.remove('open');render()});row.append(button);b.append(row)});let create=document.createElement('button');create.className='btn primary';create.textContent='Novo estudo';create.addEventListener('click',()=>{let d=base();d.name='Nova simulação';active=crypto.randomUUID();data=d;studies.push({id:active,data});m.classList.remove('open');render()});let close=document.createElement('button');close.className='btn';close.textContent='Fechar';close.addEventListener('click',()=>m.classList.remove('open'));b.append(create,document.createTextNode(' '),close);m.classList.add('open')}
async function bootSimulation(event){
 try{
  const session=event?.detail?.session||await window.SuperAppAuth.getSession();
  const profile=await window.SuperAppAuth.getProfile();
  initializeSimulation(profile?.user_id||session?.user?.id);
  document.getElementById('sideUserName').textContent=profile?.display_name||session?.user?.email||'Usuário';
  const role=profile?.role_name||profile?.role_code||'Acesso operacional';
  const scope=profile?.franchise_name?'Franquia · '+profile.franchise_name:profile?.unit_name?'Matriz · '+profile.unit_name:'Matriz · acesso global';
  document.getElementById('sideUserRole').textContent=role+' · '+scope;
  setupInterface();render();
 }catch(error){console.error('Falha ao iniciar a simulação:',error);window.SuperAppAuth?.logAuthFailure?.(error,'simulacao-load')}
 finally{window.SuperAppAuth?.releaseAppGuard?.()}
}
document.documentElement.dataset.theme=localStorage.getItem('321theme')||'light';
window.addEventListener('superapp:authorized',bootSimulation,{once:true});