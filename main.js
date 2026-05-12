// 1. 設定情報
const SERVICE_DOMAIN = 'zaou0515'; 
const API_KEY = 'yEh5YWV11pGfkdBh3PgNT8uO90TiBqNmSUDU';

// --- ニュースを取得して表示する関数 ---
async function fetchNews() {
  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/news`;
  try {
    const response = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': API_KEY } });
    const data = await response.json();
    const newsListElement = document.getElementById('news-list');
    if (!newsListElement) return;

    newsListElement.innerHTML = '';
    data.contents.forEach(item => {
      const li = document.createElement('li');
      const date = new Date(item.publishedAt).toLocaleDateString('ja-JP');
      li.innerHTML = `<span class="date">${date}</span> <a href="detail.html?id=${item.id}">${item.title}</a>`;
      newsListElement.appendChild(li);
    });
  } catch (error) { console.error('ニュース取得失敗:', error); }
}

// --- イベントを取得して表示する関数 ---
async function fetchEvents() {
  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/event`;
  try {
    const response = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': API_KEY } });
    const data = await response.json();
    const eventListElement = document.getElementById('event-list');
    if (!eventListElement) return;

    eventListElement.innerHTML = '';
    data.contents.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="event-detail.html?id=${item.id}">${item.title}</a>`;
      eventListElement.appendChild(li);
    });
  } catch (error) { console.error('イベント取得失敗:', error); }
}

// --- 季節のおすすめを取得して表示する関数 ---
async function fetchSeasonal() {
  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/seasonal`;
  try {
    const response = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': API_KEY } });
    const data = await response.json();
    const seasonalContainer = document.getElementById('seasonal-content');
    if (!seasonalContainer) return;

    seasonalContainer.innerHTML = '';

    if (data.contents.length > 0) {
      const item = data.contents[0];
      // 画像タグを削除し、タイトルとリンクのみにする
      seasonalContainer.innerHTML = `
        <div class="seasonal-item">
          <a href="seasonal.html?id=${item.id}">${item.title}</a>
        </div>
      `;
    } else {
      seasonalContainer.innerHTML = '<p>現在おすすめはありません</p>';
    }
  } catch (error) { 
    console.error('季節のおすすめ取得失敗:', error);
    document.getElementById('seasonal-content').innerHTML = 'データがありません';
  }
}

// --- クイズのやつを取得して表示する関数 ---
async function fetchQuizList() {
  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/quiz`;
  try {
    const response = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': API_KEY } });
    const data = await response.json();
    const quizContainer = document.getElementById('quiz-content'); // HTMLのIDに合わせてください
    if (!quizContainer) return;

    quizContainer.innerHTML = '';
    data.contents.forEach(item => {
      const div = document.createElement('div');
      div.style.marginBottom = "10px";
      // quiz-detail.html へのリンクを作成
      div.innerHTML = `
        <a href="quiz-detail.html?id=${item.id}" class="quiz-link-item">
          📝 ${item.title}
        </a>
      `;
      quizContainer.appendChild(div);
    });
  } catch (error) { console.error('クイズ一覧取得失敗:', error); }
}

// --- 天気を取得して表示する関数 ---
async function fetchWeather() {
  // 例として東京（緯度:35.67, 経度:139.65）の天気を取得
  // あなたの地域の緯度経度に変えることもできます
  const url = `https://api.open-meteo.com/v1/forecast?latitude=38.17159&longitude=140.4027017&current_weather=true&timezone=Asia%2FTokyo`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const weather = data.current_weather;
    const weatherBox = document.getElementById('weather');

    // 天気コードをアイコン（絵文字）に変換
    const weatherIcons = {
      0: "☀️", 1: "🌤", 2: "⛅", 3: "☁️",
      45: "🌫", 48: "🌫", 51: "🌦", 61: "🌧",
      71: "❄️", 95: "⚡"
    };
    const icon = weatherIcons[weather.weathercode] || "☁️";

    weatherBox.innerHTML = `
      <div>蔵王の天気</div>
      <div>
        <span style="font-size: 1.5rem;">${icon}</span>
        <span class="weather-temp">${weather.temperature}℃</span>
      </div>
    `;
  } catch (error) {
    document.getElementById('weather').innerHTML = "天気取得失敗";
  }
}

// 実行
fetchWeather();
fetchQuizList();
fetchNews();
fetchEvents();
fetchSeasonal();
