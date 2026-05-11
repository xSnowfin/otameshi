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
  // エンドポイントを seasonal に変更
  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/seasonal`;
  try {
    const response = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': API_KEY } });
    const data = await response.json();
    const seasonalContainer = document.getElementById('seasonal-content');
    if (!seasonalContainer) return;

    seasonalContainer.innerHTML = ''; // 読み込み中をクリア

    // 最新の1件だけ表示する例
    if (data.contents.length > 0) {
      const item = data.contents[0];
      // 画像(item.image.url)とタイトルを表示
      seasonalContainer.innerHTML = `
        <div class="seasonal-item">
          <img src="${item.image.url}" alt="${item.title}" style="width: 100%; border-radius: 5px; margin-bottom: 10px;">
          <p><strong>${item.title}</strong></p>
          <a href="seasonal-detail.html?id=${item.id}" style="font-size: 0.9rem;">詳しく見る →</a>
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

// --- ページ読み込み時にすべて実行 ---
fetchNews();
fetchEvents();
fetchSeasonal();