// あなたのmicroCMSのサービスドメインとAPIキーに書き換えてください
const SERVICE_DOMAIN = 'zaou0515'; // 例: my-local-site
const API_KEY = 'yEh5YWV11pGfkdBh3PgNT8uO90TiBqNmSUDU';

// ニュースを取得してHTMLに埋め込む関数
async function fetchNews() {
  const url = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/news`;
  
  try {
    // 1. microCMSからデータを取得する (Fetch API)
    const response = await fetch(url, {
      headers: {
        'X-MICROCMS-API-KEY': API_KEY
      }
    });
    const data = await response.json();

    // 2. HTMLの「空の箱（ニュースリスト）」を取得する
    const newsListElement = document.getElementById('news-list');
    
    // 中身を一旦空にする（「読み込み中...」の文字を消す）
    newsListElement.innerHTML = '';

    // 3. 取得したデータをループして、HTMLタグを生成して追加する
    data.contents.forEach(item => {
      // <li>タグを作る
      const li = document.createElement('li');
      
      // 日付を整える（例: 2026-05-11T... -> 2026/05/11）
      const date = new Date(item.publishedAt).toLocaleDateString('ja-JP');
      
      // HTMLの中身をセットする
      li.innerHTML = `<span class="date">${date}</span> <a href="detail.html?id=${item.id}">${item.title}</a>`;
      
      // 作った<li>をニュースリストに追加する
      newsListElement.appendChild(li);
    });

  } catch (error) {
    console.error('データの取得に失敗しました:', error);
    document.getElementById('news-list').innerHTML = '<li>読み込みに失敗しました。</li>';
  }
}

// ページが読み込まれたらニュース取得処理を実行する
fetchNews();