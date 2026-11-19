/* HeyGen 연습장 — 미션별 시뮬레이터 */
function pills(el, items, onPick, multi){
  el.innerHTML = items.map((t,i)=>`<button class="pill" data-i="${i}">${t}</button>`).join("");
  [...el.children].forEach(b=>b.onclick=()=>{
    if(!multi) [...el.children].forEach(x=>x.classList.remove("on"));
    b.classList.toggle("on", multi ? !b.classList.contains("on") : true);
    onPick(+b.dataset.i, [...el.children].filter(x=>x.classList.contains("on")).map(x=>+x.dataset.i));
  });
}
function avatarSVG(o={}){
  const bg=o.bg||"#2a2d5c", suit=o.suit||"#7c5cff", deco=o.deco||"", mouth=o.mouth||"M88 118 Q100 126 112 118";
  return `<svg class="avatar-svg" viewBox="0 0 200 200" style="${o.style||""}">
   <rect width="200" height="200" rx="18" fill="${bg}"/>${deco}
   <path d="M40 200 Q40 150 100 145 Q160 150 160 200 Z" fill="${suit}"/>
   <path d="M88 147 L100 168 L112 147 Z" fill="#fff" opacity=".9"/>
   <rect x="90" y="128" width="20" height="22" fill="#f1c7a6"/>
   <ellipse cx="100" cy="100" rx="34" ry="40" fill="#f6d2b5"/>
   <path d="M66 92 Q68 56 100 56 Q134 56 134 92 Q128 72 100 70 Q74 72 66 92Z" fill="#3a2a22"/>
   <circle cx="87" cy="98" r="4" fill="#222"/><circle cx="113" cy="98" r="4" fill="#222"/>
   <path id="mouth" d="${mouth}" stroke="#a5523d" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`;
}

const LABS = {

/* ---------- M1 ---------- */
m1(el, done){
  el.innerHTML = `
  <b>STEP 1·2 — 나에게 맞는 요금제 찾기</b>
  <span class="lbl">한 달에 만들 영상 수</span><div class="row" id="q1"></div>
  <span class="lbl">꼭 필요한 기능</span><div class="row" id="q2"></div>
  <span class="lbl">누가 만들어요?</span><div class="row" id="q3"></div>
  <div style="margin-top:12px"><button class="btn pri sm" id="rec" disabled>🔎 추천 요금제 보기</button></div>
  <div id="recOut" style="margin-top:10px"></div>
  <hr style="border-color:var(--line);margin:20px 0">
  <b>STEP 3 — 이 일은 누구 담당? (카드를 누른 뒤 상자를 누르세요)</b>
  <div id="pool" style="margin-top:8px"></div>
  <div class="sortbox"><div class="bin" data-b="c"><h5>🧠 Claude</h5><div></div></div><div class="bin" data-b="h"><h5>🎥 HeyGen</h5><div></div></div></div>
  <p class="note" id="sortMsg">남은 카드: 8</p>`;
  const A={};
  const check=()=>{ if(A.a!=null&&A.b!=null&&A.c!=null){ done("need"); $("#rec",el).disabled=false; } };
  pills($("#q1",el),["1~3편","4~10편","10편 이상"],i=>{A.a=i;check();});
  pills($("#q2",el),["워터마크 있어도 OK","워터마크 제거","4K 화질"],i=>{A.b=i;check();});
  pills($("#q3",el),["혼자","팀(2명 이상)"],i=>{A.c=i;check();});
  $("#rec",el).onclick=()=>{
    let p,why;
    if(A.c===1){p="Business ($149/월 + 좌석)";why="팀 협업·공유 크레딧·SSO가 필요해요.";}
    else if(A.b===2||A.a===2){p="Pro ($49/월, 1,000 크레딧)";why="4K 내보내기나 많은 분량이 필요해요.";}
    else if(A.b===1||A.a===1){p="Creator ($29/월, 600 크레딧)";why="워터마크 없이 꾸준히 만들기 좋아요.";}
    else {p="Free ($0)";why="월 3편·1분 이내 테스트로 먼저 감을 잡아 보세요.";}
    $("#recOut",el).innerHTML=`<div class="card"><h3>👉 추천: ${p}</h3><p>${why} 다만 고급 아바타 엔진·Video Agent·번역은 크레딧을 더 빨리 써요. 실제 가격은 공식 페이지에서 확인!</p></div>`;
    done("plan");
  };
  const items=[["영상 아이디어 20개 브레인스토밍","c"],["립싱크 아바타 영상 렌더링","h"],["대본의 숫자·약어 풀어쓰기","c"],["내 목소리 복제","h"],["번역 용어집(CSV) 만들기","c"],["175개 언어 립싱크 번역","h"],["인터랙티브 퀴즈 문항 출제","c"],["실시간 대화 아바타(LiveAvatar) 구동","h"]].sort(()=>Math.random()-.5);
  let sel=null, left=items.length;
  $("#pool",el).innerHTML=items.map((it,i)=>`<span class="token" data-i="${i}">${it[0]}</span>`).join("");
  $$("#pool .token",el).forEach(t=>t.onclick=()=>{ $$("#pool .token",el).forEach(x=>x.classList.remove("sel")); t.classList.add("sel"); sel=t; });
  $$(".bin",el).forEach(b=>b.onclick=()=>{
    if(!sel) return toast("먼저 카드를 하나 고르세요");
    const it=items[+sel.dataset.i];
    if(it[1]===b.dataset.b){ sel.classList.remove("sel"); sel.classList.add("good"); $("div",b).appendChild(sel); sel.onclick=null; sel=null; left--; $("#sortMsg",el).textContent= left?`남은 카드: ${left}`:"🎉 완벽해요! 글은 Claude, 얼굴·목소리·영상은 HeyGen."; if(!left) done("sort"); }
    else toast(it[1]==="c"?"🤔 글·기획·검수는 누구 일일까요?":"🤔 얼굴·목소리·영상 생성은 누구 일일까요?");
  });
},

/* ---------- M2 ---------- */
m2(el, done){
  el.innerHTML = `
  <span class="lbl">① 회사 홈페이지 URL</span>
  <div class="row"><input id="url" placeholder="예: www.dainedu.net" style="flex:1"><button class="btn pri sm" id="an">✨ 브랜드 분석</button></div>
  <div id="kit" style="display:none">
    <span class="lbl">② 추출된 색상 — 메인 컬러를 고르세요</span><div class="row" id="cols"></div>
    <span class="lbl">③ 글꼴</span><div class="row" id="fonts"></div>
    <span class="lbl">④ 템플릿 미리보기</span>
    <div class="screen" id="pv" style="margin-top:6px"></div>
    <div class="row" style="margin-top:10px"><button class="btn sm" id="shuf">🔀 Shuffle Colors</button><span class="note" id="kitMsg"></span></div>
  </div>`;
  let palette=[], main=null, font="Pretendard", shift=0, domain="";
  const fonts=[["Pretendard","Pretendard, sans-serif"],["둥근 고딕","'Jua', 'Arial Rounded MT Bold', sans-serif"],["명조(세리프)","'Nanum Myeongjo', Georgia, serif"],["손글씨","'Gaegu', 'Comic Sans MS', cursive"]];
  const draw=()=>{
    const c=palette.length?palette:["#7c5cff","#ff5ca8","#2ee6b6","#ffc24d","#1e2040"];
    const p=c[((main??0)+shift)%c.length], s=c[((main??0)+1+shift)%c.length], b=c[((main??0)+3+shift)%c.length];
    const f=fonts.find(x=>x[0]===font)[1];
    $("#pv",el).innerHTML=`<div style="position:absolute;inset:0;background:linear-gradient(135deg,${b},${p})"></div>
     <div style="position:absolute;left:5%;top:8%;background:#fff;color:${p};font-weight:900;padding:4px 10px;border-radius:8px;font-size:14px">${esc(domain||"LOGO")}</div>
     <div style="position:relative;text-align:left;width:88%;font-family:${f}"><div style="font-size:clamp(18px,3vw,34px);font-weight:900;color:#fff;line-height:1.2">스페인어,<br>오늘 시작해요</div>
     <div style="display:inline-block;margin-top:10px;background:${s};color:#111;font-weight:800;padding:6px 14px;border-radius:999px;font-size:14px">무료 체험 신청 →</div></div>
     <div style="position:absolute;right:6%;bottom:0;width:30%">${avatarSVG({bg:"transparent",suit:s})}</div>`;
  };
  $("#an",el).onclick=()=>{
    const u=$("#url",el).value.trim();
    if(!/\w+\.\w+/.test(u)) return toast("URL 형식으로 입력해 주세요 (예: www.example.com)");
    domain=u.replace(/^https?:\/\//,"").replace(/^www\./,"").split("/")[0].split(".")[0].toUpperCase();
    $("#an",el).textContent="⏳ 분석 중…";
    setTimeout(()=>{
      let h=0; for(const ch of u) h=(h*31+ch.charCodeAt(0))>>>0;
      palette=Array.from({length:5},(_,i)=>`hsl(${(h+i*67)%360} ${55+i*7}% ${i===3?22:55}%)`);
      $("#an",el).textContent="✨ 다시 분석"; $("#kit",el).style.display="block";
      $("#cols",el).innerHTML=palette.map((c,i)=>`<button class="pill" data-i="${i}" style="background:${c};width:44px;height:34px"></button>`).join("");
      $$("#cols .pill",el).forEach(b=>b.onclick=()=>{ $$("#cols .pill",el).forEach(x=>x.style.outline=""); b.style.outline="3px solid #fff"; main=+b.dataset.i; shift=0; draw(); done("color"); });
      pills($("#fonts",el),fonts.map(f=>f[0]),i=>{font=fonts[i][0]; draw(); done("font");});
      draw(); done("url"); toast("브랜드 키트가 만들어졌어요!");
    },900);
  };
  $("#url",el).onkeydown=e=>{ if(e.key==="Enter") $("#an",el).click(); };
  el.addEventListener("click",e=>{ if(e.target.id==="shuf"){ shift++; draw(); done("shuffle"); $("#kitMsg",el).textContent=`색 조합 #${shift+1}`; } });
},

/* ---------- M3 ---------- */
m3(el, done){
  const T=["🧍 공개 아바타","📸 포토 아바타","🪞 디지털 트윈","✨ 생성 아바타"];
  const S5=[
   ["내일 아침 '오늘 휴강' 공지를 30분 안에 올려야 해요. 촬영할 시간이 전혀 없어요.",0,"촬영 없이 바로 쓰는 공개 아바타가 가장 빨라요."],
   ["원장인 내가 매주 학부모님께 직접 인사하는 영상을 1년 동안 보낼 거예요. 5분 촬영은 가능해요.",2,"오래, 자주, '나'로 말해야 하면 디지털 트윈!"],
   ["초등반 수업에 '스페인에서 온 고양이 선생님' 캐릭터가 필요해요.",3,"세상에 없는 캐릭터는 텍스트로 만드는 생성 아바타."],
   ["내 얼굴로 짧은 SNS 영상을 만들고 싶은데, 가진 건 프로필 사진뿐이에요.",1,"사진만 있다면 포토 아바타!"],
   ["새 강사님 소개 영상을 강사 본인 얼굴·목소리로 오래 쓸 예정이고, 강사님이 촬영·동의에 협조해요.",2,"본인 동의 + 촬영 가능 → 디지털 트윈."]];
  el.innerHTML = S5.map((s,i)=>`<div class="card" style="margin-bottom:10px"><b>시나리오 ${i+1}</b><p style="margin:4px 0 8px">${s[0]}</p><div class="row" id="sc${i}"></div><p class="note" id="sm${i}"></p></div>`).join("");
  S5.forEach((s,i)=>pills($("#sc"+i,el),T,k=>{
    const m=$("#sm"+i,el);
    if(k===s[1]){ m.innerHTML=`<span class="ok-msg">정답!</span> ${s[2]}`; done("s"+(i+1)); }
    else m.innerHTML=`<span class="bad-msg">다시 생각해 봐요.</span> 촬영 가능 여부, '누가' 말해야 하는지를 보세요.`;
  }));
},

/* ---------- M4 ---------- */
m4(el, done){
  const items=["스마트폰 시네마틱 모드 / 4K 카메라","단순한 배경","자연광 또는 정면 조명","렌즈를 보고 말하기","큰 손동작·입 가리기 피하기","본인 동의(consent) 녹화 준비"];
  el.innerHTML = `
  <div class="grid g2">
   <div><b>📹 촬영 체크리스트</b>${items.map((t,i)=>`<label style="display:flex;gap:8px;align-items:center;margin:7px 0;font-size:14.5px"><input type="checkbox" data-i="${i}" style="width:18px;height:18px"> ${t}</label>`).join("")}</div>
   <div style="text-align:center"><div class="ring" id="ring" style="background:conic-gradient(var(--mint) 0deg,var(--bg) 0deg)"><span style="background:var(--bg2);width:84px;height:84px;border-radius:50%;display:grid;place-items:center" id="score">0점</span></div><p class="note">트윈 품질 예상 점수</p></div>
  </div>
  <hr style="border-color:var(--line);margin:18px 0">
  <div class="grid g2">
   <div id="av">${avatarSVG()}</div>
   <div>
    <b>💄 Edit Look</b><span class="lbl">보정 강도: <span id="lv">0</span></span>
    <input type="range" id="sl" min="0" max="100" value="0" style="padding:0">
    <p class="note">0 = 원본 · 50 = 가벼운 터치업 · 100 = 강한 보정</p>
    <b>👔 Looks 생성 (텍스트 프롬프트)</b>
    <input id="lk" placeholder="예: 교실 칠판 앞, 네이비 정장" style="margin-top:6px">
    <div class="row" style="margin-top:6px"><button class="btn sm pri" id="gen">✨ 룩 생성</button>
    <span class="note" style="margin:0">키워드: 교실·해변·스튜디오·사무실·카페·정장·한복·빨강…</span></div>
    <p class="note" id="lkMsg"></p>
   </div>
  </div>`;
  let look={};
  const render=()=>{ const v=+$("#sl",el).value; $("#av",el).innerHTML=avatarSVG(Object.assign({style:`filter:brightness(${1+v/400}) contrast(${1-v/600}) saturate(${1+v/300}) blur(${v/160}px)`},look)); };
  $$("input[type=checkbox]",el).forEach(c=>c.onchange=()=>{
    const n=$$("input[type=checkbox]:checked",el).length, sc=Math.round(n/6*100);
    $("#score",el).textContent=sc+"점"; $("#ring",el).style.background=`conic-gradient(var(--mint) ${sc*3.6}deg,var(--bg) 0deg)`;
    if(n===6) done("check");
  });
  $("#sl",el).oninput=e=>{ $("#lv",el).textContent=e.target.value; render(); done("slider"); };
  $("#gen",el).onclick=()=>{
    const p=$("#lk",el).value; if(p.trim().length<2) return toast("룩을 설명하는 문장을 입력하세요");
    look={}; const hit=[];
    const map=[["교실",{bg:"#1f4d3a",deco:'<rect x="20" y="20" width="160" height="70" rx="4" fill="#2f6b4f" stroke="#a37b4f" stroke-width="5"/><text x="40" y="60" fill="#fff" font-size="16">¡Hola!</text>'}],
      ["해변",{bg:"#7fd3ff",deco:'<rect y="140" width="200" height="60" fill="#f4d58d"/><circle cx="165" cy="35" r="18" fill="#ffe14d"/>'}],
      ["스튜디오",{bg:"#151515",deco:'<circle cx="100" cy="60" r="70" fill="#333"/>'}],
      ["사무실",{bg:"#c9d6e3",deco:'<rect x="15" y="25" width="50" height="60" fill="#9fb3c8"/><rect x="140" y="25" width="45" height="60" fill="#9fb3c8"/>'}],
      ["카페",{bg:"#8a5a3c",deco:'<circle cx="35" cy="40" r="10" fill="#ffd27a"/><circle cx="165" cy="40" r="10" fill="#ffd27a"/>'}],
      ["정장",{suit:"#1d2b55"}],["한복",{suit:"#e05a7a"}],["빨강",{suit:"#d83a3a"}],["파랑",{suit:"#2f6fdc"}],["초록",{suit:"#2e9e6a"}],["노랑",{suit:"#e9b616"}]];
    map.forEach(([k,v])=>{ if(p.includes(k)){ Object.assign(look,v); hit.push(k);} });
    if(!hit.length){ look={bg:`hsl(${p.length*37%360} 40% 35%)`,suit:`hsl(${p.length*91%360} 60% 50%)`}; }
    render(); $("#lkMsg",el).innerHTML = `✅ 새 룩 생성! ${hit.length?"반영된 키워드: "+hit.join(", "):"(AI가 분위기를 해석했어요)"}`; done("look");
  };
},

/* ---------- M5 ---------- */
m5(el, done){
  const sample="여러분, 스페인 여행에서 메뉴판 앞에서 얼어붙은 적 있나요? [pause] 다인에듀 여행 스페인어 과정이면 8주 만에 주문, 길 묻기, 쇼핑까지 자신 있게 말할 수 있어요. 하루 15분, 원어민 음성으로 따라 하기만 하면 됩니다. 지금 무료 체험 수업을 신청해 보세요!";
  el.innerHTML = `
  <div class="row" style="margin-bottom:8px">
   <button class="btn sm" id="smp">📄 예시 대본 불러오기</button>
   <button class="btn sm" id="pz">⏸ 쉼 넣기</button>
   <select id="mo" style="width:auto"><option value="">🙌 동작 지시 선택…</option><option>밝게 미소 지으며 고개를 살짝 끄덕이기</option><option>오른손을 펴서 화면 오른쪽 가리키기</option><option>양손을 가볍게 모으고 진지한 표정</option><option>카메라 쪽으로 몸을 살짝 기울이기</option></select>
   <button class="btn sm" id="ins">넣기</button>
  </div>
  <textarea id="sc" rows="8" placeholder="여기에 대본을 쓰거나 Claude가 써 준 대본을 붙여넣으세요."></textarea>
  <div class="grid g3" style="margin-top:10px">
   <div class="card"><p>글자 수</p><h3 id="cc">0자</h3></div>
   <div class="card"><p>예상 길이</p><h3 id="dd">0초</h3></div>
   <div class="card"><p>쉼 / 동작</p><h3 id="pm">0 / 0</h3></div>
  </div>
  <div id="warn" class="note" style="margin-top:10px"></div>`;
  const ta=$("#sc",el);
  const ins=s=>{ const a=ta.selectionStart??ta.value.length; ta.value=ta.value.slice(0,a)+s+ta.value.slice(a); ta.focus(); upd(); };
  const upd=()=>{
    const v=ta.value, pz=(v.match(/\[pause\]/g)||[]).length, mo=(v.match(/\(동작:/g)||[]).length;
    const clean=v.replace(/\[pause\]/g,"").replace(/\(동작:[^)]*\)/g,"").replace(/\s+/g," ").trim();
    const sec=Math.round(clean.length/330*60+pz*0.8);
    $("#cc",el).textContent=clean.length+"자"; $("#dd",el).textContent=sec+"초"; $("#dd",el).style.color=sec>60?"var(--red)":"var(--mint)";
    $("#pm",el).textContent=`${pz} / ${mo}`;
    const sents=clean.split(/(?<=[.!?。])\s+/).filter(Boolean), w=[];
    sents.forEach(s=>{ if(s.length>45) w.push(`✂️ 긴 문장(${s.length}자): "${esc(s.slice(0,22))}…" → 둘로 나눠 보세요`); });
    const ab=clean.match(/[A-Z]{2,}\s?[A-Z0-9]*|\d+[%개월주분]?/g); if(ab) w.push(`🔤 숫자·약어 발견: ${esc([...new Set(ab)].slice(0,5).join(", "))} → TTS가 어떻게 읽을지 확인하거나 소리 나는 대로 바꾸세요`);
    $("#warn",el).innerHTML = clean.length? ("<b>🧠 Claude식 점검</b><br>"+(w.length?w.join("<br>"):"좋아요! 말하기 좋은 대본이에요.")):"";
    if(clean.length>=100) done("len"); if(pz) done("pause"); if(mo) done("motion"); if(clean.length>=100&&sec<=60) done("fit");
  };
  $("#smp",el).onclick=()=>{ ta.value=sample; upd(); };
  $("#pz",el).onclick=()=>ins(" [pause] ");
  $("#ins",el).onclick=()=>{ const v=$("#mo",el).value; if(!v) return toast("동작을 먼저 고르세요"); ins(` (동작: ${v}) `); };
  ta.oninput=upd;
},

/* ---------- M6 ---------- */
m6(el, done){
  const L={ "ko-KR":["한국어","안녕하세요! 오늘은 스페인어 인사말을 함께 배워 볼게요."], "es-ES":["Español","¡Hola! Hoy vamos a aprender los saludos en español."], "en-US":["English","Hi there! Today we're learning Spanish greetings together."], "ja-JP":["日本語","こんにちは!今日はスペイン語のあいさつを学びましょう。"] };
  const passage="안녕하세요, 저는 오늘 제 목소리를 기록하고 있습니다. 봄에는 벚꽃이 피고, 여름에는 바다가 반짝이며, 가을에는 단풍이 물들고, 겨울에는 하얀 눈이 내립니다. 정말 멋지지 않나요? 저는 매일 아침 일곱 시에 일어나 커피 한 잔을 마시고, 열다섯 분 동안 스페인어를 공부합니다. 숫자도 읽어 볼게요. 하나, 둘, 셋, 넷, 다섯. 어려운 단어도 천천히 또박또박 말해 봅니다. 고맙습니다, 그라시아스, 땡큐! 마지막으로 크게 웃으며 마무리할게요. 하하, 오늘도 좋은 하루 보내세요!";
  el.innerHTML = `
  <span class="lbl">언어 / 음성</span><div class="row" id="lg"></div>
  <textarea id="tx" rows="3" style="margin-top:8px"></textarea>
  <div class="grid g2" style="margin-top:8px">
   <div><span class="lbl">속도 <b id="rv">1.0</b>x</span><input type="range" id="rt" min="0.6" max="1.6" step="0.1" value="1" style="padding:0"></div>
   <div><span class="lbl">톤(피치) <b id="pv">1.0</b></span><input type="range" id="pt" min="0.5" max="1.6" step="0.1" value="1" style="padding:0"></div>
  </div>
  <div class="row" style="margin-top:8px"><button class="btn pri" id="play">▶ 재생</button><button class="btn ghost sm" id="stop">■ 정지</button></div>
  <hr style="border-color:var(--line);margin:18px 0">
  <b>🎙️ 60초 음성 복제 녹음 리허설</b>
  <p class="note">HeyGen Voice는 약 1분 녹음으로 목소리를 복제해요. 아래 원고를 소리 내어 60초 동안 읽어 보세요.</p>
  <div class="card" style="font-size:15px;line-height:1.9">${passage}</div>
  <label style="display:flex;gap:8px;align-items:center;margin:10px 0;font-size:14px"><input type="checkbox" id="mic" style="width:18px;height:18px"> 실제로 녹음해서 들어 보기 (마이크 권한 필요, 파일은 이 브라우저 밖으로 나가지 않아요)</label>
  <div class="row"><button class="btn mint" id="go">⏺ 60초 시작</button><span id="tm" style="font-weight:800;font-size:20px">60</span></div>
  <div class="progress-gen" style="margin-top:8px"><i id="tb"></i></div><div id="out" style="margin-top:8px"></div>`;
  let lang="ko-KR";
  pills($("#lg",el),Object.values(L).map(v=>v[0]),i=>{ lang=Object.keys(L)[i]; $("#tx",el).value=L[lang][1]; });
  $("#lg .pill",el).classList.add("on"); $("#tx",el).value=L[lang][1];
  $("#rt",el).oninput=e=>$("#rv",el).textContent=(+e.target.value).toFixed(1);
  $("#pt",el).oninput=e=>$("#pv",el).textContent=(+e.target.value).toFixed(1);
  $("#play",el).onclick=()=>{ speechSynthesis.cancel(); const r=+$("#rt",el).value,p=+$("#pt",el).value;
    if(!speak($("#tx",el).value,{lang,rate:r,pitch:p})) return;
    done("play"); if(r!==1||p!==1) done("tune"); if(lang!=="ko-KR") done("lang");
    if(!voicesFor(lang.slice(0,2)).length) toast("이 기기에 해당 언어 음성이 없으면 기본 음성으로 읽어요"); };
  $("#stop",el).onclick=()=>speechSynthesis.cancel();
  let iv, rec, stream;
  const stopAll=()=>{ clearInterval(iv); try{ rec&&rec.state!=="inactive"&&rec.stop(); }catch(e){} stream&&stream.getTracks().forEach(t=>t.stop()); };
  window.__labCleanup=stopAll;
  $("#go",el).onclick=async()=>{
    stopAll(); $("#out",el).innerHTML="";
    if($("#mic",el).checked && navigator.mediaDevices){
      try{ stream=await navigator.mediaDevices.getUserMedia({audio:true}); const ch=[]; rec=new MediaRecorder(stream); rec.ondataavailable=e=>ch.push(e.data);
        rec.onstop=()=>{ const url=URL.createObjectURL(new Blob(ch)); $("#out",el).innerHTML=`<audio controls src="${url}" style="width:100%"></audio><p class="note">들어 보세요. 잡음·끊김 없이 또박또박했나요? 실제 HeyGen에서는 이런 녹음으로 음성을 복제해요.</p>`; stream.getTracks().forEach(t=>t.stop()); };
        rec.start(); }catch(e){ toast("마이크를 쓸 수 없어서 타이머만 진행해요"); }
    }
    let t=60; $("#tm",el).textContent=t; $("#go",el).disabled=true;
    iv=setInterval(()=>{ t--; $("#tm",el).textContent=t; $("#tb",el).style.width=((60-t)/60*100)+"%";
      if(t<=0){ clearInterval(iv); $("#go",el).disabled=false; try{ rec&&rec.state!=="inactive"&&rec.stop(); }catch(e){} done("rec"); toast("🎉 60초 완주! 이 정도면 음성 복제 준비 완료"); } },1000);
  };
},

/* ---------- M7 ---------- */
m7(el, done){
  let scenes=[{t:"¡Hola!",n:"안녕하세요! 오늘은 스페인어 인사 다섯 가지를 배워요.",bg:"#7c5cff"},{t:"Buenos días",n:"아침 인사는 부에노스 디아스!",bg:"#ff8a3d"},{t:"Gracias",n:"고마울 땐 그라시아스라고 말해요.",bg:"#2e9e6a"}];
  let sel=0, cap="s1", playing=false;
  const BG=["#7c5cff","#ff5ca8","#ff8a3d","#2e9e6a","#2f6fdc","#222"];
  el.innerHTML=`
  <div class="screen" id="scr"></div>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" id="pl">▶ 전체 미리보기</button><button class="btn sm" id="add">＋ 장면 추가</button><button class="btn sm" id="dup">⧉ 복제</button><button class="btn sm" id="ml">◀</button><button class="btn sm" id="mr">▶ 이동</button><button class="btn sm ghost" id="del">🗑</button></div>
  <div class="tl" id="tl"></div>
  <div class="grid g2">
   <div><span class="lbl">화면 텍스트 (큰 글씨)</span><input id="et"><span class="lbl">대사 (자막)</span><textarea id="en" rows="2"></textarea></div>
   <div><span class="lbl">배경색</span><div class="row" id="bgs"></div><span class="lbl">자막 스타일</span><div class="row" id="caps"></div></div>
  </div>`;
  const drawScreen=(i,showCap=true)=>{ const s=scenes[i];
    $("#scr",el).innerHTML=`<div style="position:absolute;inset:0;background:linear-gradient(135deg,${s.bg},#111)"></div>
    <div style="position:absolute;left:6%;top:16%;font-size:clamp(22px,4vw,46px);font-weight:900;color:#fff">${esc(s.t)}</div>
    <div style="position:absolute;right:4%;bottom:0;width:34%">${avatarSVG({bg:"transparent",suit:"#fff"})}</div>
    ${showCap?`<div class="cap ${cap}">${esc(s.n)}</div>`:""}`; };
  const drawTL=()=>{
    $("#tl",el).innerHTML=scenes.map((s,i)=>`<div class="scene ${i===sel?'sel':''}" data-i="${i}"><div class="h"><span>장면 ${i+1}</span><span>${Math.max(2,Math.round(s.n.length/5.5))}초</span></div><div style="height:46px;border-radius:7px;margin:5px 0;background:${s.bg};display:grid;place-items:center;font-weight:800;color:#fff">${esc(s.t.slice(0,12))}</div>${esc(s.n.slice(0,26))}…</div>`).join("");
    $$(".scene",el).forEach(d=>d.onclick=()=>{ sel=+d.dataset.i; draw(); });
  };
  const draw=()=>{ drawTL(); $("#et",el).value=scenes[sel].t; $("#en",el).value=scenes[sel].n; drawScreen(sel); };
  pills($("#bgs",el),BG.map(c=>`<span style="display:inline-block;width:18px;height:14px;background:${c};border-radius:4px"></span>`),i=>{ scenes[sel].bg=BG[i]; draw(); });
  pills($("#caps",el),["기본 박스","노란 강조","네온","외곽선 큰 글씨"],i=>{ cap="s"+(i+1); drawScreen(sel); if(i) done("cap"); });
  $("#caps .pill",el).classList.add("on");
  $("#et",el).oninput=e=>{ scenes[sel].t=e.target.value; drawTL(); drawScreen(sel); done("edit"); };
  $("#en",el).oninput=e=>{ scenes[sel].n=e.target.value; drawTL(); drawScreen(sel); done("edit"); };
  $("#add",el).onclick=()=>{ scenes.splice(sel+1,0,{t:"Adiós",n:"헤어질 땐 아디오스! 다음 시간에 만나요.",bg:"#2f6fdc"}); sel++; draw(); done("add"); };
  $("#dup",el).onclick=()=>{ scenes.splice(sel+1,0,Object.assign({},scenes[sel])); sel++; draw(); done("add"); };
  $("#del",el).onclick=()=>{ if(scenes.length<2) return toast("장면은 최소 1개 필요해요"); scenes.splice(sel,1); sel=Math.max(0,sel-1); draw(); };
  const mv=d=>{ const j=sel+d; if(j<0||j>=scenes.length) return; [scenes[sel],scenes[j]]=[scenes[j],scenes[sel]]; sel=j; draw(); done("order"); };
  $("#ml",el).onclick=()=>mv(-1); $("#mr",el).onclick=()=>mv(1);
  let to; window.__labCleanup=()=>clearTimeout(to);
  $("#pl",el).onclick=()=>{ if(playing) return; playing=true; let i=0;
    const step=()=>{ if(i>=scenes.length){ playing=false; draw(); done("preview"); toast("🎬 미리보기 끝! 실제 HeyGen에서는 여기서 '생성'을 눌러요"); return; }
      sel=i; draw(); to=setTimeout(()=>{i++;step();}, Math.max(1800,scenes[i].n.length*90)); };
    step(); };
  draw();
},

/* ---------- M8 ---------- */
m8(el, done){
  const F=[["goal","목적","예: 여행 스페인어 무료 체험 수업 신청 유도"],["aud","대상","예: 해외여행을 앞둔 20~30대 직장인"],["len","길이",["15초","30초","45초","60초"]],["tone","톤",["밝고 경쾌하게","차분하고 신뢰감 있게","유머러스하게","전문적으로"]],["cast","출연자/언어","예: 30대 여성 강사 아바타, 한국어 + 스페인어 인사"],["must","꼭 들어갈 내용","예: 8주 과정, 하루 15분, 무료 체험 링크"]];
  el.innerHTML=`<div class="grid g2">${F.map(f=>`<div><span class="lbl">${f[1]}</span>${Array.isArray(f[2])?`<select data-k="${f[0]}"><option value="">선택…</option>${f[2].map(o=>`<option>${o}</option>`).join("")}</select>`:`<input data-k="${f[0]}" placeholder="${f[2]}">`}</div>`).join("")}</div>
  <span class="lbl">📝 완성된 Video Agent 프롬프트</span><pre id="pr" class="card" style="white-space:pre-wrap;font-size:13.5px;margin:0"></pre>
  <div class="row" style="margin-top:10px"><button class="btn pri sm" id="sb" disabled>🗂️ 스토리보드 받기 (companion mode)</button><button class="btn sm claude" id="cp">📋 프롬프트 복사</button></div>
  <div class="grid g4" id="board" style="margin-top:12px"></div>
  <div id="genBox" style="margin-top:12px"></div>`;
  const V={};
  const upd=()=>{ $$("[data-k]",el).forEach(i=>V[i.dataset.k]=i.value.trim());
    $("#pr",el).textContent=`Create a ${V.len||"[길이]"} video.\n• Goal: ${V.goal||"[목적]"}\n• Audience: ${V.aud||"[대상]"}\n• Tone: ${V.tone||"[톤]"}\n• Presenter & language: ${V.cast||"[출연자/언어]"}\n• Must include: ${V.must||"[꼭 들어갈 내용]"}\n• End with a clear call to action. Add captions and simple motion graphics.`;
    const all=F.every(f=>V[f[0]]); $("#sb",el).disabled=!all; if(all) done("fields"); };
  $$("[data-k]",el).forEach(i=>{ i.oninput=upd; i.onchange=upd; }); upd();
  $("#cp",el).onclick=()=>{ navigator.clipboard&&navigator.clipboard.writeText($("#pr",el).textContent); toast("📋 복사! Claude에 '더 좋게 다듬어 줘'와 함께 붙여 보세요"); };
  const IDEAS=[["🎣","후킹 질문","'"+(V.aud||"시청자")+"'의 고민을 질문으로"],["😵","문제 상황","메뉴판 앞에서 당황하는 장면 B-roll"],["💡","해결책","강사 아바타가 과정을 소개"],["👉","행동 유도","무료 체험 링크 + 자막 강조"],["🎉","대안 오프닝","웃긴 실수 장면으로 시작"],["📊","대안 근거","숫자 그래픽 모션"]];
  let approved=new Set(), alt=0;
  $("#sb",el).onclick=()=>{ approved.clear();
    const draw=()=>{ $("#board",el).innerHTML=[0,1,2,3].map(i=>{ const d=IDEAS[i===0&&alt%2?4:i===2&&alt%2?5:i]; return `<div class="sb ${approved.has(i)?'ok':''}"><div class="frame" style="background:hsl(${i*70+250} 50% 30%)">${d[0]}</div><b>장면 ${i+1}. ${d[1]}</b><p class="note" style="margin:4px 0">${esc(d[2].replace("'시청자'",V.aud?"'"+V.aud+"'":"'시청자'"))}</p><div class="row"><button class="btn sm mint" data-a="${i}">✔ 승인</button><button class="btn sm ghost" data-r="${i}">↻</button></div></div>`; }).join("");
      $$("[data-a]",el).forEach(b=>b.onclick=()=>{ approved.add(+b.dataset.a); draw(); if(approved.size===4){ done("board"); showGen(); } });
      $$("[data-r]",el).forEach(b=>b.onclick=()=>{ alt++; approved.delete(+b.dataset.r); draw(); toast("에이전트가 다른 안을 제안했어요"); }); };
    draw(); toast("스토리보드가 도착했어요. 장면별로 승인하세요!"); };
  let iv; window.__labCleanup=()=>clearInterval(iv);
  const showGen=()=>{ $("#genBox",el).innerHTML=`<button class="btn pri" id="go">🎬 영상 생성</button>`;
    $("#go",el).onclick=()=>{ const st=["대본 작성","아바타 배치","음성 합성","자막·모션그래픽","렌더링"]; let p=0;
      $("#genBox",el).innerHTML=`<div class="progress-gen"><i id="gp"></i></div><p class="note" id="gs"></p>`;
      iv=setInterval(()=>{ p+=4; $("#gp",el).style.width=p+"%"; $("#gs",el).textContent=`⏳ ${st[Math.min(4,Math.floor(p/20))]}… ${p}%`;
        if(p>=100){ clearInterval(iv); $("#genBox",el).innerHTML=`<div class="card"><h3>✅ 영상 완성! (시뮬레이션) · ${esc(V.len)}</h3><p>실제 HeyGen에서는 완성 후 미리보기 → 수정은 AI Studio에서 → 다운로드/공유 링크를 받아요. Video Agent는 일반 아바타 영상보다 크레딧을 더 쓰니, 스토리보드 단계에서 충분히 확인하는 습관이 좋아요.</p></div>`; done("gen"); confetti(); } },120); }; };
},

/* ---------- M9 ---------- */
m9(el, done){
  el.innerHTML=`<span class="lbl">① 원본 자료</span><div class="row" id="src"></div>
  <input id="ref" placeholder="주제나 URL을 적어 보세요" value="스페인어 인사말" style="margin-top:8px">
  <span class="lbl">② 결과 형식</span><div class="row" id="fmt"></div>
  <div id="fmtOut" class="note"></div>
  <hr style="border-color:var(--line);margin:16px 0">
  <b>🎙️ 2인 비디오 팟캐스트 미리듣기</b>
  <div class="grid g2" style="margin-top:8px"><div class="screen" id="pod"></div><div class="chat" id="dlg" style="height:auto;max-height:240px"></div></div>
  <div class="row" style="margin-top:8px"><button class="btn pri" id="pp">▶ 팟캐스트 재생</button><button class="btn ghost sm" id="ps">■ 정지</button></div>`;
  const srcs=["🌐 웹사이트 URL","📄 PDF/문서","🎨 Figma 링크","💭 주제 한 줄"], fmts=["🎙️ 2인 비디오 팟캐스트","🚀 런칭/소개 영상","🧑‍🏫 설명 영상(아바타)"];
  const tip=["URL의 화면·글꼴·색을 살려 영상을 만들어요. Claude에게 '보여 줄 화면 5개'를 먼저 골라 달라고 하세요.","긴 문서는 Claude로 핵심 요약 → 영상화하면 품질이 올라가요.","디자인 파일 그대로의 영상이 나와요. 카피는 Claude가 다듬어 주세요.","주제만 줘도 대본까지 만들어 줘요. 사실 확인은 Claude와 함께!"];
  pills($("#src",el),srcs,i=>{ $("#fmtOut",el).textContent="💡 "+tip[i]; done("src"); });
  pills($("#fmt",el),fmts,i=>{ $("#fmtOut",el).textContent += i===0?" → 아래에서 2인 팟캐스트를 미리 들어 보세요!":" → 형식이 정해졌어요."; done("fmt"); });
  const lines=t=>[["A","안녕하세요! 오늘의 주제는 '"+t+"'예요. 저는 궁금한 게 많은 학습자 민지예요."],["B","저는 오늘 안내를 맡은 후안이에요. 처음 듣는 분도 쉽게 따라오실 수 있어요."],["A","그럼 가장 먼저 꼭 알아야 할 한 가지는 뭔가요?"],["B","핵심은 매일 조금씩 소리 내어 따라 하는 거예요. 예를 들어 '올라!' 하고 밝게 인사해 보세요."],["A","올라! 오, 벌써 말한 기분이에요. 오늘 핵심 정리해 주세요!"],["B","첫째, 짧게. 둘째, 소리 내어. 셋째, 매일! 다음 에피소드에서 만나요."]];
  const stage=w=>{ $("#pod",el).innerHTML=`<div style="position:absolute;inset:0;background:linear-gradient(135deg,#2a1a4a,#4a1a3a)"></div>
    <div style="position:absolute;left:4%;bottom:0;width:42%;transition:.3s;${w==="A"?"transform:scale(1.08)":"opacity:.6"}">${avatarSVG({bg:"transparent",suit:"#ff5ca8"})}</div>
    <div style="position:absolute;right:4%;bottom:0;width:42%;transition:.3s;${w==="B"?"transform:scale(1.08)":"opacity:.6"}">${avatarSVG({bg:"transparent",suit:"#2ee6b6"})}</div>
    <div style="position:absolute;top:6%;left:50%;transform:translateX(-50%);background:#ff3b5c;color:#fff;font-weight:800;padding:3px 10px;border-radius:6px;font-size:12px">● ON AIR ${w?"· CAM "+(w==="A"?1:2):""}</div>`; };
  stage("");
  let stop=false; window.__labCleanup=()=>{ stop=true; };
  $("#pp",el).onclick=()=>{ speechSynthesis.cancel(); stop=false; const L=lines($("#ref",el).value.trim()||"오늘의 주제"); $("#dlg",el).innerHTML=""; done("pod");
    const go=i=>{ if(stop||i>=L.length){ stage(""); return; } const [w,t]=L[i]; stage(w);
      $("#dlg",el).insertAdjacentHTML("beforeend",`<div class="msg ${w==="A"?"u":"a"}"><b>${w==="A"?"민지":"후안"}</b> ${esc(t)}</div>`); $("#dlg",el).scrollTop=1e4;
      const u=speak(t,{pitch:w==="A"?1.35:0.8,rate:1.05,voiceIdx:w==="A"?0:1,onend:()=>go(i+1)}); if(!u) setTimeout(()=>go(i+1),1500); };
    go(0); };
  $("#ps",el).onclick=()=>{ stop=true; speechSynthesis.cancel(); stage(""); };
},

/* ---------- M10 ---------- */
m10(el, done){
  const LG=["English","Español","日本語","中文","Français","Tiếng Việt","Deutsch","Português"];
  const rows=[["안녕하세요, 여러분!","¡Hola a todos!",false],["다인에듀에 오신 것을 환영합니다.","Bienvenidos a Educación Muchas Personas.",true],["오늘은 델레 에이투 시험을 준비해요.","Hoy nos preparamos para el examen DELE A2.",false],["매일 15분씩 함께 연습해요.","Practiquemos juntos 15 minutos cada día.",false]];
  el.innerHTML=`<span class="lbl">① 번역할 언어 (여러 개 선택)</span><div class="row" id="lg"></div>
  <span class="lbl">② 브랜드 용어집 — 번역하지 말아야 할 단어</span>
  <div class="row"><input id="gt" placeholder="예: 다인에듀" style="flex:1"><input id="gv" placeholder="고정 표기 (예: Dain Edu)" style="flex:1"><button class="btn sm" id="ga">＋ 추가</button></div>
  <div id="gl" style="margin-top:6px"></div>
  <span class="lbl">③ Proofread — 스페인어 번역 검수 (노란 줄을 고쳐 보세요)</span>
  <table class="t"><tr><th>#</th><th>원문</th><th>번역 (수정 가능)</th></tr>${rows.map((r,i)=>`<tr><td>${i+1}</td><td>${r[0]}</td><td><input data-r="${i}" value="${r[1]}" class="${r[2]?'flag':''}"></td></tr>`).join("")}</table>
  <div class="row" style="margin-top:8px"><button class="btn sm" id="ap">📘 용어집 자동 적용</button><span class="note" id="fx" style="margin:0"></span></div>
  <span class="lbl">④ 자막 파일</span><button class="btn sm pri" id="srt">📝 SRT 만들기</button><pre id="so" class="card" style="display:none;white-space:pre-wrap;font-size:13px;margin-top:8px"></pre>`;
  const gl=[];
  pills($("#lg",el),LG,(i,all)=>{ if(all.length>=2) done("langs"); },true);
  const drawG=()=>$("#gl",el).innerHTML=gl.map(g=>`<span class="token">🔒 ${esc(g[0])} → ${esc(g[1])}</span>`).join("");
  $("#ga",el).onclick=()=>{ const t=$("#gt",el).value.trim(); if(!t) return toast("단어를 입력하세요"); gl.push([t,$("#gv",el).value.trim()||t]); $("#gt",el).value=$("#gv",el).value=""; drawG(); done("gloss"); };
  const chk=()=>{ const v=$('[data-r="1"]',el).value; if(!/Muchas Personas|Educación/i.test(v) && /Dain|다인/i.test(v)){ $('[data-r="1"]',el).classList.remove("flag"); $("#fx",el).innerHTML='<span class="ok-msg">✔ 브랜드명이 올바르게 고쳐졌어요!</span>'; done("fix"); } };
  $('[data-r="1"]',el).oninput=chk;
  $("#ap",el).onclick=()=>{ const g=gl.find(g=>g[0].includes("다인")); if(!g) return toast("용어집에 '다인에듀'를 먼저 추가해 보세요"); $('[data-r="1"]',el).value=`Bienvenidos a ${g[1]==="다인에듀"?"Dain Edu":g[1]}.`; chk(); };
  $("#srt",el).onclick=()=>{ const ts=s=>`00:00:${String(s).padStart(2,"0")},000`; let t=0;
    const out=$$("[data-r]",el).map((inp,i)=>{ const a=t; t+=3; return `${i+1}\n${ts(a)} --> ${ts(t)}\n${inp.value}\n`; }).join("\n");
    $("#so",el).style.display="block"; $("#so",el).textContent=out; done("srt"); };
},

/* ---------- M11 ---------- */
m11(el, done){
  el.innerHTML=`<div class="grid g2">
   <div><b>✏️ 퀴즈 만들기</b>
    <span class="lbl">질문</span><input id="qq" placeholder="예: '고맙습니다'는 스페인어로?">
    ${[0,1,2].map(i=>`<div class="row" style="margin-top:6px"><input type="radio" name="ans" value="${i}" style="width:18px"><input class="opt-in" data-i="${i}" placeholder="보기 ${i+1}${i===2?' (선택)':''}" style="flex:1"></div>`).join("")}
    <p class="note">● 라디오 버튼으로 정답을 표시하세요</p>
    <span class="lbl">등장 시점: <b id="tv">8</b>초 / 20초</span><input type="range" id="ts" min="2" max="18" value="8" style="padding:0">
    <button class="btn sm" id="ex" style="margin-top:8px">💡 예시 채우기</button>
   </div>
   <div><div class="screen" id="pl"></div>
    <div class="progress-gen" style="margin-top:6px"><i id="pb"></i></div>
    <div class="row" style="margin-top:8px"><button class="btn pri sm" id="go">▶ 재생</button><button class="btn sm" id="sc">📦 SCORM 내보내기</button></div>
    <pre id="so" class="card" style="display:none;font-size:12.5px;margin-top:8px"></pre></div></div>`;
  const ok=()=>{ const o=$$(".opt-in",el).map(i=>i.value.trim()), a=$("input[name=ans]:checked",el);
    if($("#qq",el).value.trim() && o[0] && o[1] && a && o[+a.value]) done("q"); };
  $$("input",el).forEach(i=>i.addEventListener("input",ok)); $$("input[name=ans]",el).forEach(i=>i.onchange=ok);
  $("#ts",el).oninput=e=>{ $("#tv",el).textContent=e.target.value; done("time"); };
  $("#ex",el).onclick=()=>{ $("#qq",el).value="'고맙습니다'는 스페인어로?"; ["Hola","Gracias","Adiós"].forEach((v,i)=>$$(".opt-in",el)[i].value=v); $$("input[name=ans]",el)[1].checked=true; ok(); };
  const idle=()=>$("#pl",el).innerHTML=`<div style="position:absolute;inset:0;background:linear-gradient(135deg,#1d2b55,#111)"></div><div style="position:absolute;right:5%;bottom:0;width:36%">${avatarSVG({bg:"transparent"})}</div><div style="position:absolute;left:6%;top:20%;color:#fff;font-weight:900;font-size:clamp(18px,3vw,30px)">스페인어 기초 1강</div>`;
  idle(); let iv; window.__labCleanup=()=>clearInterval(iv);
  $("#go",el).onclick=()=>{ const q=$("#qq",el).value.trim(), opts=$$(".opt-in",el).map(i=>i.value.trim()), a=$("input[name=ans]:checked",el);
    if(!q||!opts[0]||!opts[1]||!a) return toast("먼저 왼쪽에서 퀴즈를 완성하세요");
    const at=+$("#ts",el).value; let t=0, asked=false; idle(); clearInterval(iv);
    iv=setInterval(()=>{ t+=.25; $("#pb",el).style.width=(t/20*100)+"%";
      if(!asked&&t>=at){ asked=true; clearInterval(iv);
        $("#pl",el).insertAdjacentHTML("beforeend",`<div id="ov" style="position:absolute;inset:0;background:rgba(10,10,30,.85);display:grid;place-items:center"><div style="width:80%"><b style="font-size:17px">❓ ${esc(q)}</b><div id="oo" style="margin-top:8px">${opts.map((o,i)=>o?`<button class="opt" data-i="${i}">${esc(o)}</button>`:"").join("")}</div></div></div>`);
        $$("#oo .opt",el).forEach(b=>b.onclick=()=>{ const right=+b.dataset.i===+a.value; b.classList.add(right?"right":"wrong");
          toast(right?"⭕ 정답! 영상이 이어서 재생돼요":"❌ 오답 — 브랜칭이면 복습 장면으로 이동!");
          setTimeout(()=>{ $("#ov",el).remove(); done("play"); iv=setInterval(()=>{ t+=.25; $("#pb",el).style.width=Math.min(100,t/20*100)+"%"; if(t>=20){ clearInterval(iv); toast("🎬 영상 끝"); } },60); },1100); }); }
    },60); };
  $("#sc",el).onclick=()=>{ $("#so",el).style.display="block"; $("#so",el).textContent="📦 spanish_lesson1_scorm.zip (모의)\n ├─ imsmanifest.xml\n ├─ index.html\n ├─ video/lesson1.mp4\n └─ quiz/interactions.json\n\n→ 학교·회사 LMS(Moodle, Canvas 등)에 업로드하면\n  학습 진도와 퀴즈 점수가 기록돼요."; done("scorm"); };
},

/* ---------- M12 ---------- */
m12(el, done){
  const exKB="Q: 수업료는 얼마인가요?\nA: 과정마다 달라요. 정확한 수강료는 상담에서 안내해 드릴게요.\nQ: 수업은 어떻게 진행되나요?\nA: 녹화 강의와 인터랙티브 연습 사이트로 언제든 공부할 수 있어요.\nQ: 무료 체험이 있나요?\nA: 네! 첫 수업은 무료 체험으로 들어 보실 수 있어요.\nQ: DELE 시험 대비도 하나요?\nA: 네, 델레 에이원부터 비투까지 시험 대비 과정이 있어요.";
  el.innerHTML=`<div class="grid g2">
   <div><span class="lbl">🎭 페르소나</span><textarea id="ps" rows="3" placeholder="예: 다인에듀 상담 도우미 '솔'. 밝고 친절한 존댓말. 가격 확정·개인정보 수집은 하지 않음."></textarea>
   <span class="lbl">📚 지식베이스 (Q:/A: 형식)</span><textarea id="kb" rows="7" placeholder="Q: 질문&#10;A: 답변"></textarea>
   <button class="btn sm" id="ex">💡 예시 지식베이스 넣기</button> <span class="note" id="kbc"></span></div>
   <div><div id="av" style="max-width:220px;margin:auto">${avatarSVG({suit:"#ff5ca8"})}</div>
   <div class="chat" id="ch" style="height:200px;margin-top:8px"><div class="msg a">안녕하세요! 무엇이든 물어보세요 😊</div></div>
   <div class="row" style="margin-top:8px"><input id="ask" placeholder="예: 무료 체험 있어요?" style="flex:1"><button class="btn pri sm" id="send">전송</button></div>
   <label class="note" style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="tts" checked style="width:16px"> 🔊 음성으로 답하기</label></div></div>`;
  let KB=[];
  const parse=()=>{ KB=[]; const v=$("#kb",el).value; let q=null; v.split("\n").forEach(l=>{ const m=l.match(/^\s*Q[:：]\s*(.+)/i), n=l.match(/^\s*A[:：]\s*(.+)/i); if(m) q=m[1]; else if(n&&q){ KB.push([q,n[1]]); q=null; } });
    $("#kbc",el).textContent=`인식된 Q&A: ${KB.length}개`; if(KB.length>=3) done("kb"); };
  $("#kb",el).oninput=parse; $("#ex",el).onclick=()=>{ $("#kb",el).value=exKB; parse(); };
  $("#ps",el).oninput=e=>{ if(e.target.value.trim().length>=15) done("persona"); };
  const big=s=>{ s=s.replace(/[\s?!.,~]/g,""); const g=new Set(); for(let i=0;i<s.length-1;i++) g.add(s.slice(i,i+2)); return g; };
  let mt; const talk=on=>{ clearInterval(mt); const m=$("#mouth",el); if(!m) return; if(!on){ m.setAttribute("d","M88 118 Q100 126 112 118"); return; } let k=0; mt=setInterval(()=>m.setAttribute("d",(k++%2)?"M88 118 Q100 132 112 118":"M88 118 Q100 122 112 118"),140); };
  window.__labCleanup=()=>clearInterval(mt);
  const send=()=>{ const q=$("#ask",el).value.trim(); if(!q) return; $("#ask",el).value="";
    const ch=$("#ch",el); ch.insertAdjacentHTML("beforeend",`<div class="msg u">${esc(q)}</div>`);
    if(!KB.length){ ch.insertAdjacentHTML("beforeend",`<div class="msg a">(지식베이스가 비어 있어요. 왼쪽에 Q&A를 넣어 주세요!)</div>`); ch.scrollTop=1e4; return; }
    const qg=big(q); let best=null, bs=0; KB.forEach(([kq,ka])=>{ const g=big(kq); let c=0; qg.forEach(x=>{ if(g.has(x)) c++; }); const s=c/Math.max(3,Math.min(qg.size,g.size)); if(s>bs){bs=s;best=ka;} });
    const persona=$("#ps",el).value.match(/'([^']+)'|"([^"]+)"/); const nm=persona?(persona[1]||persona[2]):"";
    let ans; if(bs>=0.34){ ans=best; done("hit"); } else { ans="그 부분은 제가 가진 정보로는 정확히 답변드리기 어려워요. 상담 예약을 도와드릴까요?"; done("miss"); }
    setTimeout(()=>{ ch.insertAdjacentHTML("beforeend",`<div class="msg a">${nm?`<b>${esc(nm)}</b> `:""}${esc(ans)}<br><small style="color:var(--ink3)">${bs>=0.34?"📚 지식베이스 근거":"🛟 모르는 질문 → 안전한 답변"}</small></div>`); ch.scrollTop=1e4;
      if($("#tts",el).checked){ speechSynthesis.cancel(); talk(true); if(!speak(ans,{rate:1.05,onend:()=>talk(false)})) talk(false); setTimeout(()=>talk(false),ans.length*140); } },500);
  };
  $("#send",el).onclick=send; $("#ask",el).onkeydown=e=>{ if(e.key==="Enter") send(); };
},

/* ---------- M13 ---------- */
m13(el, done){
  const TPL=[
   {n:"🎬 인트로 타이틀",title:"스페인어, 오늘 시작해요",code:`<style>
body{margin:0;height:100vh;display:grid;place-items:center;background:linear-gradient(135deg,#7c5cff,#ff5ca8);font-family:sans-serif;overflow:hidden}
h1{color:#ffffff;font-size:9vw;margin:0;animation:pop 1.2s ease-out both}
p{color:#fff3a8;font-size:4vw;text-align:center;animation:up 1s 1s both}
@keyframes pop{from{transform:scale(.2);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes up{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}
</style>
<div><h1>¡Hola!</h1><p>스페인어, 오늘 시작해요</p></div>`},
   {n:"✨ 단어 하이라이트 자막",title:"매일 15분이면 충분해요",code:`<style>
body{margin:0;height:100vh;display:grid;place-items:center;background:#111827;font-family:sans-serif}
.cap span{color:#ffffff;font-size:7vw;font-weight:900;padding:0 .2em;border-radius:.2em;animation:hi .6s both}
@keyframes hi{0%{background:transparent}30%{background:#ffd400;color:#111}100%{background:transparent}}
</style>
<div class="cap"><span style="animation-delay:.2s">매일</span><span style="animation-delay:.8s">15분이면</span><span style="animation-delay:1.4s">충분해요</span></div>`},
   {n:"⏱️ 카운트다운",title:"수업 시작!",code:`<style>
body{margin:0;height:100vh;display:grid;place-items:center;background:#0f766e;font-family:sans-serif;color:#ecfeff}
.n{position:absolute;font-size:28vw;font-weight:900;opacity:0;animation:c 1s both}
.go{position:absolute;font-size:10vw;font-weight:900;opacity:0;animation:c 1.5s 3s both}
@keyframes c{0%{opacity:0;transform:scale(2)}30%{opacity:1;transform:scale(1)}90%{opacity:1}100%{opacity:0}}
</style>
<div class="n" style="animation-delay:0s">3</div><div class="n" style="animation-delay:1s">2</div><div class="n" style="animation-delay:2s">1</div><div class="go">수업 시작!</div>`}];
  let cur=0;
  el.innerHTML=`<div class="row" id="tp"></div>
  <div class="grid g2" style="margin-top:10px"><textarea id="cd" class="codebox" spellcheck="false"></textarea>
  <div><iframe id="fr" class="iframebox" sandbox="allow-scripts" title="미리보기"></iframe>
  <div class="row" style="margin-top:8px"><button class="btn pri sm" id="run">▶ 미리보기 실행</button><span class="note" style="margin:0">1920×1080 렌더링 화면을 축소해 보여 줘요</span></div>
  <p class="note">💡 도전: 코드에서 문구를 바꾸고, #으로 시작하는 색상 코드를 바꾼 뒤 실행해 보세요. 막히면 위 '자막 스타일 컴포넌트' 프롬프트로 Claude에게 새 코드를 받아 붙여넣어도 돼요!</p></div></div>`;
  const load=i=>{ cur=i; $("#cd",el).value=TPL[i].code; };
  pills($("#tp",el),TPL.map(t=>t.n),i=>{ load(i); });
  $("#tp .pill",el).classList.add("on"); load(0);
  $("#run",el).onclick=()=>{ const c=$("#cd",el).value; $("#fr",el).srcdoc=c; done("run");
    const t=TPL[cur]; if(!c.includes(t.title)) done("text");
    const hex=s=>(s.match(/#[0-9a-fA-F]{3,6}\b/g)||[]).map(x=>x.toLowerCase()).sort().join(",");
    if(hex(c)!==hex(t.code)) done("color");
    if(cur>0) done("tpl"); };
  $("#fr",el).srcdoc=TPL[0].code;
},

/* ---------- M14 ---------- */
m14(el, done){
  const CMD="claude mcp add --transport http heygen https://mcp.heygen.com/mcp/v1/";
  const STEPS=[["⚙️","설정 열기","Claude 왼쪽 아래 프로필 → 설정"],["🔌","커넥터 메뉴","설정 → 커넥터(Connectors)"],["🔍","HeyGen 검색·연결","'HeyGen' 검색 → 연결(Connect)"],["🔐","OAuth 승인","HeyGen 계정 로그인 → 권한 허용"]];
  el.innerHTML=`<b>A. Claude 웹·데스크톱에서 연결하기 (순서대로 클릭)</b>
  <div class="step-flow" id="sf">${STEPS.map((s,i)=>`<button class="sf" data-i="${i}" style="color:var(--ink);cursor:pointer">${s[0]} ${s[1]}<br><small style="color:var(--ink3)">${s[2]}</small></button>`).join("")}</div>
  <div class="card" id="mock" style="min-height:70px"><p>👆 1단계부터 눌러 보세요.</p></div>
  <b style="display:block;margin-top:16px">B. Claude Code(터미널)에서 연결하기</b>
  <div class="row" style="margin-top:6px"><code class="card" style="flex:1;padding:10px;font-size:13px;overflow-x:auto;white-space:nowrap">${CMD}</code><button class="btn sm claude" id="cc">📋 복사</button></div>
  <b style="display:block;margin-top:16px">C. 연결 후 대화 시뮬레이터 — Claude가 어떤 HeyGen 도구를 부르는지 보세요</b>
  <div class="row" id="ex" style="margin:6px 0"></div>
  <div class="chat" id="ch"></div>
  <div class="row" style="margin-top:8px"><input id="ask" placeholder="예: HeyGen으로 30초 신입생 환영 영상 만들어 줘" style="flex:1"><button class="btn pri sm" id="send">보내기</button></div>
  <p class="note">사용한 도구: <span id="used">없음</span></p>
  <b style="display:block;margin-top:16px">D. 도구 매칭 퀴즈</b><div id="mq"></div><button class="btn sm pri" id="mc" style="margin-top:6px">채점하기</button> <span id="mr"></span>`;
  let sp=0;
  $$("#sf .sf",el).forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(i!==sp) return toast(`${sp+1}단계부터 차례로 눌러 주세요`);
    b.classList.add("on"); sp++;
    const mk=["<p>⚙️ 설정 화면이 열렸어요. 왼쪽 메뉴에 <b>커넥터</b>가 보여요.</p>","<p>🔌 커넥터 목록 — 'Google Drive', 'Gmail'… 검색창에 HeyGen을 입력해요.</p>","<p>🔍 <b>HeyGen</b> — AI avatar & video ・ <span class='pill on'>연결</span></p>","<p class='ok-msg'>🔐 HeyGen 로그인 → 권한 허용 완료! 이제 대화창에서 HeyGen 도구를 쓸 수 있어요. (API 키 필요 없음)</p>"];
    $("#mock",el).innerHTML=mk[i]; if(sp===4) done("setup"); });
  $("#cc",el).onclick=()=>{ navigator.clipboard&&navigator.clipboard.writeText(CMD).catch(()=>{}); toast("📋 명령어 복사! 터미널에 붙여넣고 로그인하면 끝"); done("cmd"); };
  const R=[
   [/크레딧|잔액|남은|요금|잔여/,"get_user_me",{},"남은 크레딧: 412 (예시) · 플랜: Creator"],
   [/자막|srt|vtt/i,"get_video_translate_caption",{video_translate_id:"vt_8f2…",format:"srt"},"SRT 자막을 가져왔어요. 오역 검토를 시작할게요."],
   [/언어 목록|어떤 언어|지원.*언어/,"list_video_translate_languages",{},"지원 언어 코드 목록을 가져왔어요 (en, es, ja, zh, fr …)"],
   [/번역/,"create_video_translate",{video_id:"v_31a…",output_languages:["en","ja"]},"번역 작업을 시작했어요. 완료되면 알려 드릴게요."],
   [/목소리 목록|음성 목록|보이스 목록|어떤 목소리/,"list_audio_voices",{language:"Korean",gender:"female"},"한국어 여성 음성 12개를 찾았어요."],
   [/읽어|음성 파일|tts|내레이션/i,"text_to_speech",{text:"…",voice_id:"ko_f_03"},"음성 파일 URL과 길이(00:18)를 받았어요."],
   [/삭제|지워/,"delete_video",{video_id:"v_9c1…"},"⚠️ 삭제는 되돌릴 수 없어요. 정말 삭제할까요? (실제 Claude도 이렇게 확인을 받도록 요청하세요)"],
   [/상태|다운로드|링크|됐어|완료/,"get_video",{video_id:"v_31a…"},"상태: completed · 다운로드 링크를 드릴게요."],
   [/목록|최근 영상|내 영상/,"list_videos",{limit:5},"최근 영상 5개: ① 신입생 환영 ② 숫자 1~10 …"],
   [/내 아바타|아바타.*지정|아바타로|목소리로/,"create_avatar_video",{avatar_id:"my_twin",voice_id:"my_voice",script:"(Claude가 쓴 대본)"},"지정한 아바타·음성으로 영상 생성을 시작했어요."],
   [/만들|영상|비디오|제작/,"create_video_agent",{prompt:"(Claude가 다듬은 프롬프트)"},"Video Agent에 요청했어요. video_id: v_31a… 몇 분 뒤 상태를 확인할게요."]];
  const used=new Set();
  const EX=["30초 환영 영상 만들어 줘","남은 크레딧 알려 줘","방금 영상 상태랑 다운로드 링크","영어·일본어로 번역해 줘","번역 SRT 자막 가져와","한국어 여성 음성 목록 보여 줘"];
  $("#ex",el).innerHTML=EX.map(e=>`<button class="pill">${e}</button>`).join("");
  $$("#ex .pill",el).forEach(b=>b.onclick=()=>{ $("#ask",el).value=b.textContent; send(); });
  const send=()=>{ const q=$("#ask",el).value.trim(); if(!q) return; $("#ask",el).value=""; const ch=$("#ch",el);
    ch.insertAdjacentHTML("beforeend",`<div class="msg u">${esc(q)}</div>`);
    const r=R.find(x=>x[0].test(q));
    if(!r){ ch.insertAdjacentHTML("beforeend",`<div class="msg a">HeyGen 도구가 필요 없는 요청 같아요. 대본·기획은 제가 바로 도와드릴게요! (영상·번역·음성·크레딧 관련 요청을 해 보세요)</div>`); ch.scrollTop=1e4; return; }
    const pre=r[1]==="create_video_agent"?"좋아요! 먼저 대본을 짜고 프롬프트를 다듬은 뒤 HeyGen을 호출할게요.":"HeyGen 도구를 사용할게요.";
    ch.insertAdjacentHTML("beforeend",`<div class="msg a">${pre}</div>`);
    setTimeout(()=>{ ch.insertAdjacentHTML("beforeend",`<div class="msg tool">🔧 heygen.${r[1]}(${esc(JSON.stringify(r[2]))})</div>`); ch.scrollTop=1e4;
      setTimeout(()=>{ ch.insertAdjacentHTML("beforeend",`<div class="msg a">${esc(r[3])}</div>`); ch.scrollTop=1e4; },600); },500);
    used.add(r[1]); $("#used",el).textContent=[...used].join(", "); if(used.size>=3) done("tools"); };
  $("#send",el).onclick=send; $("#ask",el).onkeydown=e=>{ if(e.key==="Enter") send(); };
  const MQ=[["프롬프트 한 줄로 대본·아바타까지 알아서 만든 영상","create_video_agent"],["내 디지털 트윈과 복제 음성을 '정확히 지정'해서 만든 영상","create_avatar_video"],["완성된 영상을 스페인어로 바꾸기","create_video_translate"],["생성이 끝났는지 확인하고 링크 받기","get_video"]];
  const TL=["create_video_agent","create_avatar_video","get_video","create_video_translate","text_to_speech","get_user_me"];
  $("#mq",el).innerHTML=MQ.map((m,i)=>`<div class="row" style="margin:6px 0"><span style="flex:1;min-width:200px;font-size:14px">${i+1}. ${m[0]}</span><select data-i="${i}" style="width:auto"><option value="">도구 선택…</option>${TL.map(t=>`<option>${t}</option>`).join("")}</select></div>`).join("");
  $("#mc",el).onclick=()=>{ let c=0; $$("#mq select",el).forEach(s=>{ const ok=s.value===MQ[+s.dataset.i][1]; s.style.borderColor=ok?"var(--mint)":"var(--red)"; if(ok)c++; });
    $("#mr",el).innerHTML=c===4?'<span class="ok-msg">4/4 완벽!</span>':`<span class="bad-msg">${c}/4 — 다시 도전!</span>`; if(c===4) done("match"); };
},

/* ---------- M15 ---------- */
m15(el, done){
  const P=["🧠 Claude: 목표·대상 기획","🧠 Claude: 대본 + 브랜드 보이스 적용","🎨 HeyGen: 브랜드 키트·아바타·음성 준비","🗂️ HeyGen: Video Agent 스토리보드 승인","🎬 HeyGen: 생성 & AI Studio로 다듬기","🔍 Claude: 번역 용어집·번역 검수","🌍 HeyGen: 번역·인터랙티브 퀴즈·내보내기","📈 Claude: 성과 분석 → 다음 기획"];
  el.innerHTML=`<b>STEP 1 — 파이프라인 조립: 아래 카드를 '먼저 할 일'부터 순서대로 누르세요</b>
  <div id="pool" style="margin:8px 0"></div><ol id="slots" style="padding-left:22px;margin:6px 0"></ol>
  <button class="btn sm ghost" id="rs">↺ 다시</button>
  <hr style="border-color:var(--line);margin:18px 0">
  <b>STEP 2·3 — 수료증</b>
  <div class="row" style="margin-top:6px"><input id="nm" placeholder="수료증에 들어갈 이름" style="max-width:260px" value="${esc(S.name||"")}"><button class="btn pri sm" id="dl">🖼️ PNG 내려받기</button></div>
  <canvas id="cv" width="1600" height="1000" style="width:100%;max-width:640px;display:block;margin-top:10px;border-radius:12px"></canvas>`;
  let step=0;
  const reset=()=>{ step=0; const sh=P.map((p,i)=>[p,i]).sort(()=>Math.random()-.5);
    $("#pool",el).innerHTML=sh.map(([p,i])=>`<span class="token" data-i="${i}">${p}</span>`).join(""); $("#slots",el).innerHTML="";
    $$("#pool .token",el).forEach(t=>t.onclick=()=>{ if(+t.dataset.i===step){ $("#slots",el).insertAdjacentHTML("beforeend",`<li class="ok-msg" style="margin:4px 0">${t.textContent}</li>`); t.remove(); step++;
        if(step===P.length){ done("pipe"); confetti(); toast("🏆 완벽한 파이프라인!"); } }
      else toast(step===0?"🤔 무엇을, 누구에게 만들지부터 정해야겠죠?":"🤔 그 전에 해야 할 일이 있어요. '생각은 먼저, 렌더링은 나중에'!"); }); };
  reset(); $("#rs",el).onclick=reset;
  const cv=$("#cv",el); drawCert(cv,S.name);
  $("#nm",el).oninput=e=>{ S.name=e.target.value; save(); drawCert(cv,S.name); if(S.name.trim().length>=2) done("name"); };
  if((S.name||"").trim().length>=2) setTimeout(()=>done("name"),300);
  $("#dl",el).onclick=()=>{ if((S.name||"").trim().length<2) return toast("이름을 먼저 입력하세요"); drawCert(cv,S.name); const a=document.createElement("a"); a.download="heygen_practice_certificate.png"; a.href=cv.toDataURL("image/png"); a.click(); done("cert"); };
}
};
