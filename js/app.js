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

// タスクの追加
var taskInput = document.getElementById('taskInput');
var addButton = document.getElementById('addButton');
var categorySelect = document.getElementById('categorySelect');
var taskList = document.getElementById('taskList');


function addTask() {
  var taskText = taskInput.value.trim();
  var category = categorySelect.value;

  if (taskText !== '') {
    var newTaskRef = tasksRef.push();
    newTaskRef.set({
      text: taskText,
      category:category,
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
    taskItem.setAttribute('data-task-id', taskId);

    var taskText = document.createElement('span');
    taskText.innerText = taskData.text;
     // カテゴリに応じてクラスを追加
     taskItem.classList.add('category-' + taskData.category);
    
    if (taskData.completed) {
      taskText.classList.add('completed');
    }
    taskItem.appendChild(taskText);


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

    taskList.appendChild(taskItem);

    var completeButton = document.createElement('i');
    completeButton.classList.add('fas', 'fa-check','complete-button'); // 追加
    completeButton.classList.add('btn1');


    completeButton.addEventListener('click', function() {
      toggleComplete(taskId, taskData.completed);
    });
    taskItem.appendChild(completeButton);
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
  var taskItem = document.querySelector(`li[data-task-id="${taskId}"]`);
  var taskText = taskItem.querySelector('span');
  var editButton = taskItem.querySelector('.edit-button');

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
  
}



