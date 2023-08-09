// データベースからのデータを処理
const firebaseConfig = {
    apiKey: "AIzaSyBoaYoHUVWQKEVsMSsalNnQfosy9r0RgBw",
    authDomain: "memo-app-a2ed1.firebaseapp.com",
    databaseURL: "https://memo-app-a2ed1-default-rtdb.firebaseio.com",
    projectId: "memo-app-a2ed1",
    storageBucket: "memo-app-a2ed1.appspot.com",
    messagingSenderId: "688120589661",
    appId: "1:688120589661:web:a34c3653a76f9b9fda0cb4",
    measurementId: "G-QM1RZCN12Q"
  };

  // Firebaseの初期化
firebase.initializeApp(firebaseConfig);

// Realtime Databaseの参照を取得
const db = firebase.database();
const memoList = document.getElementById('memo-list');












// データベースからのデータを処理
db.ref('memos').on('value', function(snapshot) {
    // 一度メモリストをクリア
    memoList.innerHTML = '';
  
    // snapshotを使ってデータを処理する
    snapshot.forEach(function(childSnapshot) {
      const memoData = childSnapshot.val();
      
      // メモを表示する要素を作成して追加
      const memoItem = document.createElement('div');
      memoItem.classList.add('memo-item');
      memoItem.textContent = memoData.text;
      memoList.appendChild(memoItem);
    });
  });
  
  // saveMemo関数を修正
  function saveMemo(text) {
    // メモデータを新しい参照で追加
    const newMemoRef = db.ref('memos').push();
    newMemoRef.set({
      text: text,
      timestamp: firebase.database.ServerValue.TIMESTAMP // タイムスタンプを保存
    });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const memoInput = document.getElementById('memo-input');
    const saveButton = document.getElementById('save-button');
    const memoList = document.getElementById('memo-list');
  
    saveButton.addEventListener('click', function () {
      const memoText = memoInput.value.trim();
      if (memoText !== '') {
        const memoItem = document.createElement('div');
        memoItem.classList.add('memo-item');
        memoItem.textContent = memoText;
        memoList.appendChild(memoItem);
        memoInput.value = '';
        
        // 保存処理を呼び出す
        saveMemo(memoText);
      }
    });
    // キーダウンイベントを追加
memoInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault(); // デフォルトのエンターキーの動作をキャンセル
  
      // エンターキーが押されたときの処理を記述
      const memoText = memoInput.value.trim();
      if (memoText !== '') {
        const memoItem = document.createElement('div');
        memoItem.classList.add('memo-item');
        memoItem.textContent = memoText;
        memoList.appendChild(memoItem);
        memoInput.value = '';
  
        // 保存処理を呼び出す
        saveMemo(memoText);
      }
    }
  });
  
  });

 

  // clearDatabase関数を定義
function clearDatabase() {
    var confirmation = confirm("本当にタスクを削除しますか？");
    if(confirmation) {
      
  // メモデータを含む"memos"の参照を取得
  const memosRef = db.ref('memos');

  // 参照のデータを全て削除
  memosRef.remove()
    var messageElement = document.getElementById('message');
  messageElement.textContent = 'タスクが削除されました';
  setTimeout(function() {
    messageElement.textContent = '';
  }, 2000);
}
}
    



// クリアボタンを取得
const clearButton = document.getElementById('clear-button');

// クリアボタンがクリックされた時の処理
clearButton.addEventListener('click', function () {
  // データベースをクリアする関数を呼び出す
  clearDatabase();
});
