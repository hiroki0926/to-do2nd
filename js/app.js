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

  var tasksArray = []; // タスクを格納する配列

  snapshot.forEach(function(childSnapshot) {
    var taskId = childSnapshot.key;
    var taskData = childSnapshot.val();
    tasksArray.push({ id: taskId, data: taskData }); // タスクを配列に追加
  });

  // タスクを逆順にソート
  tasksArray.reverse();

  tasksArray.forEach(function(task) {
    var taskId = task.id;
    var taskData = task.data;



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
    var categories = ["未分類","study", "shopping", "challenge", "programming","work","DIY","hobby","circle","knowledge"];
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

// タスク数を更新し、色を変更するための関数
function updateTaskCountColor(count) {
  var taskCountElement = document.getElementById('taskCount');
  taskCountElement.textContent = 'タスク: ' + count;

  if (count > 100) {
    taskCountElement.style.color = 'red';
  } else if (count > 50) {
    taskCountElement.style.color = 'blue';
  } else {
    taskCountElement.style.color = 'black';
  }
}

// Update the task count initially
updateTaskCount();

// タスクの数を更新する処理
function updateTaskCount() {
  var taskCount = document.getElementById('taskCount');
  tasksRef.once('value', function(snapshot) {
    var count = snapshot.numChildren();
    taskCount.textContent = 'Tasks: ' + count;
    updateTaskCountColor(count);
    
  });
}
// Update the task count whenever tasks change
tasksRef.on('value', function(snapshot) {
  var count = 0; // タスク数の初期値を0に設定
  snapshot.forEach(function(childSnapshot) {
    var taskData = childSnapshot.val();
    if (!taskData.completed) {
      count++; // 未完了のタスクの場合のみカウントを増やす
    }
  });
  updateTaskCountColor(count);
});

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


completedTasksRef.on('value', function(snapshot) {
  var completedTaskList = document.getElementById('completedTaskList');
  completedTaskList.innerHTML = '';

  snapshot.forEach(function(childSnapshot) {
    var completedtaskId = childSnapshot.key;
    var completedtaskData = childSnapshot.val();

   
    var completedTaskItem = document.createElement('li');
    completedTaskItem.classList.add('completed-task',"completed");
    completedTaskItem.setAttribute('data-completedtask-id', completedtaskId);

     // タスクテキストの表示
     var completedtaskText = document.createElement('span');
     completedtaskText.innerText = completedtaskData.text;


    var uncompleteButton = document.createElement('i');
    uncompleteButton.classList.add('fas', 'fa-check','complete-button'); // 追加
    uncompleteButton.classList.add('btn1');

// 完了ボタンのクリックを処理するためのイベントリスナーを追加
uncompleteButton.addEventListener('click', function() {
// タスクの完了状態を切り替えるロジックを実装します

// 完了済みタスクから通常のタスクリストに戻すアクションを実行
moveToTasks(completedtaskId, completedtaskData);

});
completedTaskItem.appendChild(uncompleteButton);

//完了済みタスクから通常のタスクリストに戻す関数
function moveToTasks(taskId, taskData) {
var taskRef = tasksRef.push();
taskRef.set({
  text: taskData.text,
  category: taskData.category,
  completed: false
});

// 完了済みタスクから削除
var completedTaskRef = completedTasksRef.child(taskId);
completedTaskRef.remove();
}




    completedTaskItem.appendChild(completedtaskText);

    completedTaskList.appendChild(completedTaskItem);
  });
});

// 完了済みタスクを全て削除する関数
function deleteAllCompletedTasks() {
  var confirmation = confirm("本当に完了済みタスクを全て削除しますか？");
  if (confirmation) {
    completedTasksRef.remove(); // 完了済みタスクを全て削除

    // 完了済みタスクのリストをクリア
    var completedTaskList = document.getElementById('completedTaskList');
    completedTaskList.innerHTML = '';

   
  }
}


// const nodemailer = require('nodemailer');
// const firebase = require('firebase');




// // Firebase Realtime Databaseの参照
// const database = firebase.database();
// const tasksRef = database.ref('tasks');

// // メール送信に関する設定
// const transporter = nodemailer.createTransport({
//   service: 'Gmail', // SMTPサービスプロバイダを指定
//   auth: {
//     user: 'hiroki.fujii0926@gmail.com', // 送信元のメールアドレス
//     pass: '19960622' // 送信元のメールアドレスのパスワード
//   }
// });

// // 未完了のタスクを取得
// tasksRef.orderByChild('completed').equalTo(false).once('value', (snapshot) => {
//   const tasks = [];
//   snapshot.forEach((childSnapshot) => {
//     const taskId = childSnapshot.key;
//     const taskData = childSnapshot.val();
//     tasks.push({ id: taskId, data: taskData });
//   });

//   // 未完了のタスクをメールで送信する処理をここに追加
//   // メールの本文にタスク情報を含めるなどのカスタマイズが可能
// });
