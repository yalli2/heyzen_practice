/* HeyGen 연습장 × Claude — 앱 로직 */
const KEY = "heygen_practice_v1";
let S = {t:{}, q:{}, c:{}, xp:0, name:""};
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch(e) {}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e) {} }

const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- toast & confetti ---------- */
let toastT;
function toast(msg){ const t=$("#toast"); t.innerHTML=msg; t.classList.add("on"); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("on"),2300); }
function confetti(){
  const c=$("#confetti"), x=c.getContext("2d"); c.width=innerWidth; c.height=innerHeight;
  const cols=["#7c5cff","#ff5ca8","#2ee6b6","#ffc24d","#4db8ff"];
  const P=Array.from({length:160},()=>({x:innerWidth/2,y:innerHeight/3,vx:(Math.random()-.5)*14,vy:Math.random()*-12-3,s:Math.random()*7+4,c:cols[Math.random()*5|0],r:Math.random()*6}));
  let f=0; (function loop(){ x.clearRect(0,0,c.width,c.height);
    P.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.r+=.1;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore();});
    if(++f<130) requestAnimationFrame(loop); else x.clearRect(0,0,c.width,c.height); })();
}

/* ---------- speech (browser TTS) ---------- */
function voicesFor(lang){ const v=speechSynthesis.getVoices(); return v.filter(x=>x.lang && x.lang.toLowerCase().startsWith(lang)); }
function speak(text, opt={}){
  if(!("speechSynthesis" in window)){ toast("이 브라우저는 음성 재생을 지원하지 않아요"); return null; }
  const u=new SpeechSynthesisUtterance(text);
  u.lang=opt.lang||"ko-KR"; u.rate=opt.rate||1; u.pitch=opt.pitch||1;
  const vs=voicesFor(u.lang.slice(0,2)); if(vs.length) u.voice=vs[(opt.voiceIdx||0)%vs.length];
  if(opt.onend) u.onend=opt.onend;
  speechSynthesis.speak(u); return u;
}
if("speechSynthesis" in window) speechSynthesis.getVoices();

/* ---------- XP / progress ---------- */
const LV_XP=[0,150,400,700,1000,1300];
function addXP(n){ S.xp+=n; save(); renderSide(); }
function level(){ let i=0; LV_XP.forEach((v,k)=>{ if(S.xp>=v) i=k; }); return i; }
function doneCount(){ return MISSIONS.filter(m=>S.c[m.id]).length; }
function renderSide(){
  const lv=level(), next=LV_XP[lv+1]||LV_XP[lv], prev=LV_XP[lv];
  $("#lvName").textContent=`Lv.${lv+1} ${LEVELS[lv]}`;
  $("#xpTxt").textContent=`${S.xp} XP`;
  $("#xpBar").style.width = (next===prev?100:Math.min(100,(S.xp-prev)/(next-prev)*100))+"%";
  $("#doneTxt").textContent=`${doneCount()} / ${MISSIONS.length}`;
  const cur=location.hash.slice(1)||"home";
  $("#nav").innerHTML = `
   <a href="#home" class="${cur==='home'?'on':''}"><span class="ic">🏠</span>시작하기</a>
   <h6>미션 15</h6>` + MISSIONS.map((m,i)=>`
   <a href="#${m.id}" class="${cur===m.id?'on':''}"><span class="ic">${m.em}</span>${i+1}. ${esc(m.title.split(":")[0].split("&")[0].trim())}<span class="st">${S.c[m.id]?'✅':taskProgress(m)}</span></a>`).join("") + `
   <h6>도구</h6>
   <a href="#prompts" class="${cur==='prompts'?'on':''}"><span class="ic">📚</span>Claude 프롬프트 모음</a>
   <a href="#cert" class="${cur==='cert'?'on':''}"><span class="ic">🎓</span>배지 & 수료증</a>`;
}
function taskProgress(m){ const d=Object.keys(S.t[m.id]||{}).length; return d? `<small style="color:var(--ink3)">${d}/${m.tasks.length}</small>`:""; }

/* ---------- views ---------- */
function home(){
  const nextM = MISSIONS.find(m=>!S.c[m.id]) || MISSIONS[0];
  return `
  <section class="hero">
    <span class="chip hey">🎥 HeyGen = 얼굴·목소리·영상</span><span class="chip claude">🧠 Claude = 기획·대본·검수</span>
    <h1>HeyGen 연습장 × Claude<br>따라 하면서 배우는 AI 영상 협업</h1>
    <p>15개 미션을 하나씩 클리어하며 HeyGen(헤이젠)의 핵심 기능 — 아바타, 음성, AI Studio, Video Agent, 번역, 인터랙티브 영상, LiveAvatar, HyperFrames, MCP 연결 — 을 시뮬레이터로 직접 만져 보고, 각 단계에서 <b>Claude에게 무엇을 시키면 좋은지</b> 바로 복사해 쓸 수 있는 프롬프트로 익혀요.</p>
    <div class="row"><button class="btn pri" onclick="location.hash='#${nextM.id}'">${doneCount()?'이어서 하기':'미션 1 시작하기'} →</button>
    <button class="btn ghost" onclick="location.hash='#prompts'">📚 프롬프트 모음</button></div>
  </section>

  <h2 class="sec-title"><span class="n">?</span>이 연습장 사용법</h2>
  <div class="grid g4">
    <div class="card"><h3>① 개념 카드</h3><p>기능이 무엇이고 언제 쓰는지 3분 요약</p></div>
    <div class="card"><h3>② 따라하기 실습</h3><p>HeyGen 화면을 본뜬 시뮬레이터에서 체크리스트를 하나씩 완료</p></div>
    <div class="card"><h3>③ Claude 협업</h3><p>복사 한 번, 또는 "Claude에서 열기"로 바로 실전 투입</p></div>
    <div class="card"><h3>④ 퀴즈 & XP</h3><p>퀴즈를 맞히고 미션을 완료해 레벨업·배지·수료증!</p></div>
  </div>

  <h2 class="sec-title"><span class="n">15</span>미션 지도</h2>
  <div class="grid g3">${MISSIONS.map((m,i)=>`
    <div class="card mcard" onclick="location.hash='#${m.id}'">
      ${S.c[m.id]?'<span class="done">✅ 완료</span>':''}
      <div class="em">${m.em}</div><div class="num">MISSION ${i+1} · 약 ${m.min}분</div>
      <h3>${esc(m.title)}</h3><p>${esc(m.sub)}</p></div>`).join("")}
  </div>

  <h2 class="sec-title"><span class="n">🔁</span>Claude × HeyGen 협업 루프</h2>
  <div class="step-flow">
    <div class="sf">🧠 Claude<br>기획·대본</div><div class="sf">🎨 HeyGen<br>브랜드·아바타</div><div class="sf">🤖 HeyGen<br>생성(Agent/Studio)</div>
    <div class="sf">🔍 Claude<br>검수·번역 점검</div><div class="sf">🌍 HeyGen<br>번역·인터랙티브</div><div class="sf">📈 Claude<br>성과 분석</div>
  </div>
  <div class="footer">
    이 사이트는 HeyGen 공식 사이트가 아닌 <b>비공식 학습용 연습장</b>이에요. 화면은 실제 HeyGen을 본뜬 시뮬레이션이며 실제 계정·크레딧을 사용하지 않아요.
    기능·요금 정보는 2026년 11월 공개 자료 기준이고 바뀔 수 있으니 실제 사용 전 <a href="https://www.heygen.com/pricing" target="_blank" rel="noopener">HeyGen 공식 페이지</a>를 확인하세요.
    진행 상황은 이 브라우저에만 저장돼요. <button class="btn sm ghost" onclick="resetAll()">진행 초기화</button>
  </div>`;
}

function claudeLink(text){ return "https://claude.ai/new?q="+encodeURIComponent(text); }
function promptCard(p, mid){
  return `<div class="prompt"><div class="t">🧠 ${esc(p.title)} <span class="tag">${esc(p.tag)}</span>${mid?`<span class="tag" style="background:rgba(124,92,255,.2);color:#cbbcff">${mid}</span>`:""}</div>
  <pre>${esc(p.text)}</pre>${p.why?`<p class="why">💡 ${esc(p.why)}</p>`:""}
  <div class="row"><button class="btn sm claude" data-copy="${esc(p.text)}">📋 복사</button>
  <a class="btn sm ghost" style="text-decoration:none;color:var(--ink)" href="${claudeLink(p.text)}" target="_blank" rel="noopener">Claude에서 열기 ↗</a>
  <span class="note" style="margin:0">[대괄호] 부분을 내 상황으로 바꿔 쓰세요</span></div></div>`;
}

function missionView(m){
  const i=MISSIONS.indexOf(m), prev=MISSIONS[i-1], next=MISSIONS[i+1];
  return `
  <div class="mhead"><div class="em">${m.em}</div><div><div class="chip">MISSION ${i+1} / ${MISSIONS.length} · 약 ${m.min}분 · +${m.tasks.length*10+m.quiz.length*10+50} XP</div>
  <h1>${esc(m.title)}</h1><p>${esc(m.sub)}</p></div></div>

  <h2 class="sec-title"><span class="n">1</span>개념 이해</h2>
  <div class="concept">${m.concept}
   <div class="duo"><div class="who c"><b>🧠 Claude가 할 일</b>${esc(m.claude)}</div><div class="who h"><b>🎥 HeyGen이 할 일</b>${esc(m.hey)}</div></div>
  </div>

  <h2 class="sec-title"><span class="n">2</span>따라하기 실습</h2>
  <div class="labwrap">
    <div class="lab"><div class="studio-top"><span class="dots"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></span> HeyGen 시뮬레이터 — ${esc(m.title.split(":")[0])}</div><div id="labBody"></div></div>
    <div class="tasks"><h4>✅ 체크리스트</h4><div id="taskList"></div>
      <div class="note">실습 화면에서 해당 동작을 하면 자동으로 체크돼요.</div></div>
  </div>

  <h2 class="sec-title"><span class="n">3</span>Claude와 협업하기</h2>
  ${m.prompts.map(p=>promptCard(p)).join("")}

  <h2 class="sec-title"><span class="n">4</span>확인 퀴즈</h2>
  <div class="quiz" id="quiz">${m.quiz.map((q,qi)=>`
    <div class="q" data-qi="${qi}"><b>Q${qi+1}. ${esc(q.q)}</b>
    ${q.o.map((o,oi)=>`<button class="opt" data-oi="${oi}">${String.fromCharCode(65+oi)}. ${esc(o)}</button>`).join("")}
    <div class="explain">${esc(q.e)}</div></div>`).join("")}
  </div>

  <div class="finish" id="finish"></div>
  <div class="pager">
    ${prev?`<button class="btn ghost" onclick="location.hash='#${prev.id}'">← ${prev.em} 이전 미션</button>`:'<span></span>'}
    ${next?`<button class="btn" onclick="location.hash='#${next.id}'">다음 미션 ${next.em} →</button>`:`<button class="btn pri" onclick="location.hash='#cert'">🎓 수료증 받기 →</button>`}
  </div>`;
}

function renderTasks(m){
  const st=S.t[m.id]||{};
  $("#taskList").innerHTML = m.tasks.map((t,i)=>`<div class="task ${st[t.id]?'ok':''}"><span class="ck">${st[t.id]?'✓':''}</span><span><span class="stp">STEP ${i+1}</span>${esc(t.t)}</span></div>`).join("");
  renderFinish(m);
}
function renderFinish(m){
  const st=S.t[m.id]||{}, tdone=m.tasks.every(t=>st[t.id]), q=S.q[m.id]||[], qdone=m.quiz.every((_,i)=>q[i]);
  const f=$("#finish"); if(!f) return;
  if(S.c[m.id]){ f.innerHTML=`<h3 style="margin:0">🎉 미션 완료!</h3><p class="note">멋져요. 다음 미션으로 가 볼까요?</p>`; return; }
  f.innerHTML = `<p style="margin:0 0 10px">실습 ${m.tasks.filter(t=>st[t.id]).length}/${m.tasks.length} · 퀴즈 ${q.filter(Boolean).length}/${m.quiz.length}</p>
   <button class="btn pri" id="completeBtn" ${tdone&&qdone?'':'disabled'}>🏁 미션 완료하기 (+50 XP)</button>
   ${tdone&&qdone?'':'<p class="note">체크리스트와 퀴즈를 모두 끝내면 버튼이 열려요.</p>'}`;
  const b=$("#completeBtn"); if(b) b.onclick=()=>{ S.c[m.id]=true; addXP(50); save(); confetti(); toast(`${m.em} 미션 완료! +50 XP`); renderFinish(m); renderSide(); checkBadges(); };
}
function checkBadges(){ const n=doneCount(); const b=BADGES.find(b=>b.need===n); if(b) setTimeout(()=>toast(`${b.em} 배지 획득: ${b.t}`),1200); }

function makeDone(m){
  return function(id){
    S.t[m.id]=S.t[m.id]||{};
    if(S.t[m.id][id]) return;
    if(!m.tasks.find(t=>t.id===id)) return;
    S.t[m.id][id]=true; addXP(10); save();
    toast(`✅ ${m.tasks.find(t=>t.id===id).t} (+10 XP)`);
    renderTasks(m);
  };
}

function bindQuiz(m){
  $$("#quiz .q").forEach(qel=>{
    const qi=+qel.dataset.qi, q=m.quiz[qi];
    const show=(oi)=>{ $$(".opt",qel).forEach((b,k)=>{ b.classList.toggle("right",k===q.a); if(k===oi&&oi!==q.a) b.classList.add("wrong"); }); $(".explain",qel).style.display="block"; };
    if((S.q[m.id]||[])[qi]) show(q.a);
    $$(".opt",qel).forEach(b=>b.onclick=()=>{
      const oi=+b.dataset.oi;
      if(oi===q.a){ show(oi); S.q[m.id]=S.q[m.id]||[]; if(!S.q[m.id][qi]){ S.q[m.id][qi]=true; addXP(10); save(); toast("정답! +10 XP"); } renderFinish(m); }
      else { b.classList.add("wrong"); $(".explain",qel).style.display="block"; $(".explain",qel).textContent="아쉬워요! 개념 카드를 다시 보고 한 번 더 골라 보세요."; setTimeout(()=>{ $(".explain",qel).textContent=q.e; $(".explain",qel).style.display="none"; b.classList.remove("wrong"); },1500); }
    });
  });
}

function promptsView(){
  const all=[]; MISSIONS.forEach((m,i)=>m.prompts.forEach(p=>all.push({p,m,i})));
  return `<h1>📚 Claude 협업 프롬프트 모음</h1>
  <p class="note" style="font-size:15px">15개 미션의 프롬프트 ${all.length}개를 한곳에. 검색해서 바로 복사하거나 Claude에서 열어 쓰세요.</p>
  <input class="search" id="psearch" placeholder="🔍 검색: 대본, 번역, MCP, 퀴즈, 코드…">
  <div id="plist">${all.map(({p,m,i})=>`<div data-k="${esc((p.title+p.tag+p.text+m.title).toLowerCase())}">${promptCard(p,`M${i+1} ${m.em}`)}</div>`).join("")}</div>`;
}

function certView(){
  return `<h1>🎓 배지 & 수료증</h1>
  <div class="card" style="margin-bottom:14px"><h3>획득한 배지</h3>
  <div class="badges">${BADGES.map(b=>`<div class="badge ${doneCount()>=b.need?'on':''}">${b.em} ${b.t} <small>(${b.need}미션)</small></div>`).join("")}</div></div>
  <div class="card"><h3>수료증</h3>
   <p>미션 ${doneCount()}/${MISSIONS.length} 완료 · ${S.xp} XP · ${LEVELS[level()]}</p>
   ${doneCount()===MISSIONS.length?`<p class="ok-msg">모든 미션을 완료했어요! 정식 수료증을 받을 수 있어요.</p>`:`<p class="note">모든 미션을 완료하면 '정식 수료증', 그 전에는 '진행 확인증'이 발급돼요. (미션 15에서 이름을 입력하면 자동 반영)</p>`}
   <input id="certName" placeholder="이름" value="${esc(S.name||"")}" style="max-width:280px;margin:8px 0">
   <button class="btn pri" id="certBtn">🖼️ PNG로 내려받기</button>
   <canvas id="certCv" width="1600" height="1000" style="width:100%;max-width:800px;display:block;margin-top:14px;border-radius:12px"></canvas>
  </div>`;
}
function drawCert(cv, name){
  const x=cv.getContext("2d"), W=cv.width, H=cv.height, full=doneCount()===MISSIONS.length;
  const g=x.createLinearGradient(0,0,W,H); g.addColorStop(0,"#1b1640"); g.addColorStop(1,"#3a1236"); x.fillStyle=g; x.fillRect(0,0,W,H);
  x.strokeStyle="#ffc24d"; x.lineWidth=6; x.strokeRect(40,40,W-80,H-80); x.strokeStyle="rgba(255,255,255,.25)"; x.lineWidth=2; x.strokeRect(60,60,W-120,H-120);
  x.textAlign="center"; x.fillStyle="#ffc24d"; x.font="bold 34px Pretendard, sans-serif"; x.fillText("HEYGEN × CLAUDE PRACTICE",W/2,170);
  x.fillStyle="#fff"; x.font="900 92px Pretendard, sans-serif"; x.fillText(full?"수 료 증":"진 행 확 인 증",W/2,300);
  x.font="bold 70px Pretendard, sans-serif"; x.fillStyle="#ffd9ec"; x.fillText(name||"이름을 입력하세요",W/2,450);
  x.fillStyle="#dcdcff"; x.font="36px Pretendard, sans-serif";
  x.fillText(full?"위 사람은 HeyGen 연습장 15개 미션을 모두 완료하여":`위 사람은 HeyGen 연습장 미션 ${doneCount()}개를 완료하였으며`,W/2,560);
  x.fillText("Claude와 협업하는 AI 영상 제작 역량을 갖추었음을 증명합니다.",W/2,615);
  x.font="bold 40px Pretendard, sans-serif"; x.fillStyle="#2ee6b6"; x.fillText(`${LEVELS[level()]} · ${S.xp} XP`,W/2,720);
  const d=new Date(); x.fillStyle="#b9bce6"; x.font="32px Pretendard, sans-serif"; x.fillText(`${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`,W/2,820);
  x.font="28px Pretendard, sans-serif"; x.fillText("🎬 HeyGen 연습장 (비공식 학습 사이트)",W/2,880);
}

/* ---------- router ---------- */
function route(){
  const id=location.hash.slice(1)||"home", main=$("#main");
  $("#side").classList.remove("open");
  if("speechSynthesis" in window) speechSynthesis.cancel();
  if(window.__labCleanup){ try{window.__labCleanup();}catch(e){} window.__labCleanup=null; }
  const m=MISSIONS.find(x=>x.id===id);
  if(m){
    main.innerHTML=missionView(m); renderTasks(m); bindQuiz(m);
    try { LABS[m.id]($("#labBody"), makeDone(m), m); } catch(e){ console.error(e); $("#labBody").innerHTML="<p class='bad-msg'>실습을 불러오지 못했어요. 새로고침해 주세요.</p>"; }
  } else if(id==="prompts"){
    main.innerHTML=promptsView();
    $("#psearch").oninput=e=>{ const k=e.target.value.toLowerCase().trim(); $$("#plist>div").forEach(d=>d.style.display=!k||d.dataset.k.includes(k)?"":"none"); };
  } else if(id==="cert"){
    main.innerHTML=certView(); const cv=$("#certCv"); drawCert(cv,S.name);
    $("#certName").oninput=e=>{ S.name=e.target.value; save(); drawCert(cv,S.name); };
    $("#certBtn").onclick=()=>{ drawCert(cv,S.name); const a=document.createElement("a"); a.download="heygen_practice_certificate.png"; a.href=cv.toDataURL("image/png"); a.click(); };
  } else main.innerHTML=home();
  renderSide(); scrollTo(0,0);
}
function resetAll(){ if(confirm("모든 진행 상황(XP·체크·퀴즈)을 지울까요?")){ S={t:{},q:{},c:{},xp:0,name:""}; save(); route(); } }

document.addEventListener("click",e=>{
  const c=e.target.closest("[data-copy]");
  if(c){ const txt=c.dataset.copy; (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast("📋 복사했어요! Claude에 붙여넣으세요")).catch(()=>{ const ta=document.createElement("textarea"); ta.value=txt; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); toast("📋 복사했어요!"); }); }
});
$("#menuBtn").onclick=()=>$("#side").classList.toggle("open");
addEventListener("hashchange",route);
route();
