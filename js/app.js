// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBNGHxa_d0qCZaQyvB4vqgln4d0SIOUYEw",
  authDomain: "todo-app-6f566.firebaseapp.com",
  databaseURL: "https://todo-app-6f566-default-rtdb.firebaseio.com",
  projectId: "todo-app-6f566",
  storageBucket: "todo-app-6f566.appspot.com",
  messagingSenderId: "265205232312",
  appId: "1:265205232312:web:21896a2f2cb296d3de3a4d",
  measurementId: "G-31Y3R7HGSG"
};

// Firebaseの初期化
firebase.initializeApp(firebaseConfig);

// Firebase Realtime Databaseの参照
var database = firebase.database();
var tasksRef = database.ref('tasks');

// ページの読み込みが完了したときに実行される処理
window.addEventListener('DOMContentLoaded', (event) => {
  // キーボードの"/"キーが押されたときにテキストボックスにフォーカスを移動させる
  document.addEventListener('keydown', (event) => {
    if (event.key === '/') {
      event.preventDefault(); // デフォルトの動作をキャンセルする
      document.getElementById('taskInput').focus(); // テキストボックスにフォーカスを移動させる
    }
  });
  // 初回タスク数の更新
  updateTaskCount();

   // カテゴリ選択要素にイベントリスナーを追加
   categorySelect.addEventListener('change', filterTasks);
});





// タスクの追加
var taskInput = document.getElementById('taskInput');
var addButton = document.getElementById('addButton');
var categorySelect = document.getElementById('categorySelect');
var taskList = document.getElementById('taskList');

function addTask() {
  var taskText = taskInput.value.trim();
  var category = categorySelect.value;   // 選択されたジャンル

  if (taskText !== '') {
    var newTaskRef = tasksRef.push();
    newTaskRef.set({
      text: taskText,
      category:category,// ジャンルを保存
      completed: false
    });
    taskInput.value = '';

    var messageElement = document.getElementById('message');
    messageElement.textContent = 'タスクが追加されました';
    setTimeout(function() {
    messageElement.textContent = '';
    }, 2000);
  }

  addButton.classList.add('clicked');//クリック感をつける
  setTimeout(function() {
  addButton.classList.remove('clicked');
  },200)
  // タスクの数を更新
  updateTaskCount();
}

taskInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // デフォルトのEnterキーの挙動をキャンセルする
    addTask(); // タスクの追加処理を呼び出す
  }
});

// タスクの読み込み
tasksRef.on('value', function(snapshot) {
  taskList.innerHTML = '';

  snapshot.forEach(function(childSnapshot) {
    var taskId = childSnapshot.key;
    var taskData = childSnapshot.val();

    var taskItem = document.createElement('li');
    taskItem.classList.add('task');
    taskItem.setAttribute('data-task-id', taskId);

   
    // タスクテキストの表示
    var taskText = document.createElement('span');
    taskText.innerText = taskData.text;
     // カテゴリに応じてクラスを追加
     taskItem.classList.add('category-' + taskData.category);
    
     var categorySelect = document.createElement('select'); // ジャンル選択ボタン
     categorySelect.classList.add('btn1','selecter');
     categorySelect.addEventListener('change', function() {
       changeCategory(taskId, categorySelect.value); // ジャンルの変更処理を呼び出す
     });

      // ジャンル選択肢を追加
    var categories = ["未分類","study", "shopping", "challenge", "programming","work","DIY","hobby","circle"];
    for (var i = 0; i < categories.length; i++) {
      var option = document.createElement('option');
      option.value = categories[i];
      option.text = categories[i];
      categorySelect.appendChild(option);
    }
    categorySelect.value = taskData.category; // 現在のジャンルを設定
 

    if (taskData.completed) {
      taskText.classList.add('completed');
    }
    taskItem.appendChild(taskText);
    taskItem.appendChild(categorySelect); // ジャンル選択ボタンを追加

    var editButton = document.createElement('i');
        editButton.classList.add('fas', 'fa-edit','edit-button');
        editButton.classList.add('btn1');

        editButton.addEventListener('click', function() {
          enterEditMode(taskId);
        });
        taskItem.appendChild(editButton);


    var deleteButton = document.createElement('i');
    deleteButton.classList.add('fas', 'fa-trash','delete-button'); // 追加
    deleteButton.classList.add('btn1');

    deleteButton.addEventListener('click', function() {
      deleteTask(taskId);
    });
    taskItem.appendChild(deleteButton);

    

    var completeButton = document.createElement('i');
    completeButton.classList.add('fas', 'fa-check','complete-button'); // 追加
    completeButton.classList.add('btn1');


    completeButton.addEventListener('click', function() {
      toggleComplete(taskId, taskData.completed);
      if (!taskData.completed) {
        moveToCompleted(taskId, taskData);
      }
    });
    taskItem.appendChild(completeButton);

      // タスクのカテゴリを表示
  var category = taskData.category;
  taskItem.setAttribute('data-category', category);

  taskList.appendChild(taskItem);
  });


});

// タスクの完了状態の切り替えと移動
function toggleComplete(taskId, currentCompleted) {
  var taskRef = tasksRef.child(taskId);
  taskRef.update({
    completed: !currentCompleted
  });
}


 // 編集モードに入る処理
 function enterEditMode(taskId) {
  //タスクアイテムを取得する
  var taskItem = document.querySelector(`li[data-task-id="${taskId}"]`);
  //タスクのテキストを取得する
  var taskText = taskItem.querySelector('span');
  //編集ボタンを取得する
  var editButton = taskItem.querySelector('.edit-button');
 // クリックされた編集ボタンのスタイルを設定
 editButton.style.position = 'absolute';
 editButton.style.zIndex = '100';
  taskText.contentEditable = true;
  taskText.focus();



    // ボタンを切り替える
  editButton.innerText = 'Finish Edit';
  // クラスを変更する
  editButton.classList.remove('edit-button');
  editButton.classList.add('save-button');
 // イベントリスナーを変更する
  editButton.removeEventListener('click', enterEditMode);
  editButton.addEventListener('click', function() {
    // ページをリロードする
location.reload();

    exitEditMode(taskId);
    
  });
}

// 編集モードを終了する処理
function exitEditMode(taskId) {
  var taskItem = document.querySelector(`li[data-task-id="${taskId}"]`);
  var taskText = taskItem.querySelector('span');
  var editButton = taskItem.querySelector('.save-button');

  taskText.contentEditable = false;
   // ボタンを切り替える
   editButton.innerText = '';
   // クラスを変更する
  editButton.classList.remove('save-button');
  editButton.classList.add('edit-button');
// イベントリスナーを変更する
  editButton.removeEventListener('click', exitEditMode);
  editButton.addEventListener('click', function() {
    enterEditMode(taskId);
  });

  var newText = taskText.innerText.trim();
  if (newText !== '') {
    updateTaskText(taskId, newText);
  }

   // ボタンを元のi要素に戻す
   var originalButton = document.createElement('i');
   originalButton.classList.add('fas', 'fa-edit', 'edit-button');
   originalButton.classList.add('btn1');
   completeButton.addEventListener('click', function() {
    toggleComplete(taskId, taskData.completed);
  });
  taskItem.appendChild(completeButton);
 
   editButton.parentNode.replaceChild(originalButton, editButton);
}

// タスクのテキストを更新する処理
function updateTaskText(taskId, newText) {
  var taskRef = tasksRef.child(taskId);
  taskRef.update({
    text: newText
  });
}

// タスクの削除
function deleteTask(taskId) {
  var confirmation = confirm("本当にタスクを削除しますか？");
  if(confirmation) {
    var taskRef = tasksRef.child(taskId);
    taskRef.remove();
    var messageElement = document.getElementById('message');
messageElement.textContent = 'タスクが削除されました';
setTimeout(function() {
  messageElement.textContent = '';
}, 2000);
  }
  updateTaskCount();
}

// ジャンルの変更処理
function changeCategory(taskId, newCategory) {
  var taskRef = tasksRef.child(taskId);
  taskRef.update({
    category: newCategory
  });
}

// タスクの数を更新する処理
function updateTaskCount() {
  var taskCount = document.getElementById('taskCount');
  tasksRef.once('value', function(snapshot) {
    var count = snapshot.numChildren();
    taskCount.textContent = 'Tasks: ' + count;
  });
}

function filterTasks() {
  var categorySelect = document.getElementById('categorySelect');
  var selectedCategory = categorySelect.value;
  var taskItems = document.querySelectorAll('.task');

  taskItems.forEach(function (taskItem) {
    var category = taskItem.getAttribute('data-category');
    if (selectedCategory === 'all' || category === selectedCategory) {
      taskItem.style.display = 'block'; // カテゴリが一致する場合、表示
    } else {
      taskItem.style.display = 'none'; // カテゴリが一致しない場合、非表示
    }
  });
}

const toggler = document.querySelector(".toggle");

window.addEventListener("click", event => {
  if(event.target.className == "toggle" || event.target.className == "toggle") {
    document.body.classList.toggle("show-nav");
    document.getElementById("deleteconpo").classList.toggle("deleteclass")
  } else if (event.target.className == "overlay") {
    document.body.classList.remove("show-nav");
document.getElementById("deleteconpo").classList.toggle("deleteclass")
  }

});

// 'tasksRef'変数を完了したタスクを参照するように更新
var completedTasksRef = database.ref('completedTasks');
  
// タスクを完了済みタスクリストに移動する関数
function moveToCompleted(taskId, taskData) {
  var completedTaskRef = completedTasksRef.push();
  completedTaskRef.set(taskData);

  // オリジナルのリストからタスクを削除
  var taskRef = tasksRef.child(taskId);
  taskRef.remove();
}


// 完了済みタスクを表示する関数
function renderCompletedTasks() {
  completedTasksRef.on('value', function(snapshot) {
    var completedTaskList = document.getElementById('completedTaskList');
    completedTaskList.innerHTML = '';

    snapshot.forEach(function(childSnapshot) {
      var taskId = childSnapshot.key;
      var taskData = childSnapshot.val();

      var completedTaskItem = document.createElement('li');
      completedTaskItem.classList.add('completed-task');
      completedTaskItem.classList.add('task');
      completedTaskItem.textContent = taskData.text;

      completedTaskList.appendChild(completedTaskItem);
    });
  });
}

// 初めに完了済みタスクを表示するためにrenderCompletedTasks関数を呼び出します
renderCompletedTasks();
