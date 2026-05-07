const quizzes = {
  '1': { question:"蔵王ジャンプ台が建設されたのはいつでしょうか?", options:["1976年","1978年","1980年","1982年"], correct:1, hint:"受付で配ったパンフレットを見よう!" },
  '2': { question:"ジャンプ台の下から上までの標高差と近い高さの建物はどれでしょうか?", options:["山形市役所","山形県庁","上山スカイタワー","霞城セントラル"], correct:3, hint:"インフォメーションコーナー横の看板を見てみよう!" },
  '3': { question:"髙梨沙羅選手が蔵王ジャンプ台で出した最大の飛距離は？", options:["101.0m","103.5m","106.0m","108.5m"], correct:2, hint:"ジャンプ台に設置されている看板を見てみよう!" },
  '4': { question:"ランディングバーンの最大斜度は何度？", options:["35度","36.5度","38度","39.5度"], correct:1, hint:"受付で配ったパンフレットを見よう!" },
  '5': { question:"8月のサマージャンプ大会で第2位の内藤智文選手の勤務先は？", options:["蔵王温泉宿泊施設","蔵王温泉スキー場","山形県職員","山形市職員"], correct:3, hint:"受付テントの新聞コピーを見てみよう!" }
};

// 必要なコインの枚数（クイズの数）
const totalCoins = Object.keys(quizzes).length;

function playSound(id){
  const s=document.getElementById(id); 
  if(s){s.currentTime=0;s.play();}
}

function renderPage(){
  const container=document.getElementById("main-container");
  container.innerHTML='<div id="keyword-message"></div>';
  let qid=null;
  
  if(window.location.hash) qid=window.location.hash.replace("#q","");

  if(qid){
    // 個別クイズ画面の表示
    const quiz=quizzes[qid];
    if(!quiz){
      container.innerHTML+="<p>クイズが見つかりません。</p>";
    } else {
      let html=`<div class="question">${quiz.question}</div>`;
      html+=`<div class="options">`;
      quiz.options.forEach((opt,i)=>{
        html+=`<button onclick="checkAnswer(${i},'${qid}')">${opt}</button>`;
      });
      html+=`</div>`;
      html+=`<button onclick="document.getElementById('hint').style.display='block'">💡 ヒントを見る</button>`;
      html+=`<div class="hint" id="hint">${quiz.hint}</div>`;
      container.innerHTML+=html;
    }
  } else {
    // メイン画面（進捗・ゴール画面）の表示
    let collectedCoins = getCollectedCoinsCount();
    
    let html=`<h2>クイズに正解してコインを${totalCoins}枚集めよう！</h2>`;
    html+=`<div class="coin-display" style="font-size:24px; font-weight:bold; margin: 20px 0;">現在のコイン: 🪙 ${collectedCoins} / ${totalCoins} 枚</div>`;

    // 全てのコインを集めきったかどうかで分岐
    if(collectedCoins === totalCoins){
      html+=`<div id="final-step">
              <p id="final-result" class="success" style="font-size:20px; font-weight:bold;">🎉 ${totalCoins}枚のコインが集まりました！クリアおめでとう！</p>
              <div id="survey-link">
                <p><a href="https://docs.google.com/forms/d/1Bz52srduTq6eIsQ5wVxwftwYNuYEWrmZQH8yAFBcVb4/edit" target="_blank">次へ（アンケート）</a></p>
              </div>
            </div>`;
    } else {
      html+=`<p style="color:red; font-weight:bold;">⚠️ まだ全てのコインを集めていません！各問題に挑戦してね。</p>`;
    }
    container.innerHTML+=html;
  }

  // クイズ画面かメイン画面かでボトム表示制御
  if(qid){
    updateCollectedCoinsBottom(true);
  } else {
    updateCollectedCoinsBottom(false);
  }
}

function checkAnswer(selected,id){
  const quiz=quizzes[id];
  const buttons=document.querySelectorAll(".options button");
  const msgBox=document.getElementById("keyword-message");

  if(selected===quiz.correct){
    msgBox.innerHTML=`⭕ 正解！ コインを1枚ゲットしました！🪙`;
    msgBox.className="success";
    msgBox.style.display="block";

    // コイン獲得フラグを保存
    localStorage.setItem(`quiz${id}_cleared`, "true");
    playSound("correct-sound");
    
    // 全問クリアかチェックしてファンファーレ等を鳴らす判定
    if(getCollectedCoinsCount() === totalCoins) {
      playSound("goal-sound"); 
      if(typeof confetti === 'function') confetti();
    } else {
      if(typeof confetti === 'function') confetti();
    }
    
    updateCollectedCoinsBottom();
  } else {
    buttons.forEach(btn=>{btn.disabled=true; btn.style.opacity="0.5";});
    let count=5;
    msgBox.className="fail"; 
    msgBox.style.display="block"; 
    msgBox.innerHTML=`❌ 残念！ ${count}秒後に再挑戦できます`;
    playSound("wrong-sound");

    const interval=setInterval(()=>{
      count--;
      if(count>0) {
        msgBox.innerHTML=`❌ 残念！ ${count}秒後に再挑戦できます`;
      } else {
        clearInterval(interval);
        msgBox.style.display="none";
        buttons.forEach(btn=>{btn.disabled=false; btn.style.opacity="1";});
      }
    },1000);
  }
}

// 獲得したコインの枚数を計算する関数
function getCollectedCoinsCount(){
  let coins = 0;
  Object.keys(quizzes).forEach(id=>{
    if(localStorage.getItem(`quiz${id}_cleared`) === "true") coins++;
  }); 
  return coins;
}

// 画面下部に獲得コイン数を表示するHTMLを生成
function renderCollectedCoinsHTML_forBottom(){
  const coins = getCollectedCoinsCount(); 
  if(coins === 0) return '';
  return `<div class="label">獲得したコイン</div>
          <div class="coins" style="font-size:24px; font-weight:bold;">🪙 x ${coins}</div>`;
}

// 画面下部のコイン表示エリアを更新
function updateCollectedCoinsBottom(show=true){
  // HTML側で id="collected-keywords-bottom" となっている箇所をターゲットにしています。
  // 必要に応じて id="collected-coins-bottom" などに変更してください。
  const el=document.getElementById('collected-keywords-bottom');
  if(!el) return;
  if(!show){
    el.style.display='none'; 
    return;
  }
  const html=renderCollectedCoinsHTML_forBottom();
  if(html){
    el.innerHTML=html; 
    el.style.display='block';
  } else {
    el.innerHTML=''; 
    el.style.display='none';
  }
}

window.addEventListener("load", renderPage);
window.addEventListener("hashchange", renderPage);