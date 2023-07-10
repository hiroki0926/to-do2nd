class Flashcard {
    constructor(word, meaning) {
      this.word = word;
      this.meaning = meaning;
    }
  }
  
  class FlashcardApp {
    constructor() {
      this.flashcards = [];
    }
  
    addFlashcard(word, meaning) {
      const flashcard = new Flashcard(word, meaning);
      this.flashcards.push(flashcard);
      this.displayFlashcards();
    }
  
    removeFlashcard(word) {
      const index = this.flashcards.findIndex(flashcard => flashcard.word === word);
      if (index !== -1) {
        this.flashcards.splice(index, 1);
        this.displayFlashcards();
      }
    }
  
    displayFlashcards() {
      const flashcardContainer = document.getElementById("flashcard-container");
      flashcardContainer.innerHTML = "";
  
      if (this.flashcards.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No flashcards available.";
        flashcardContainer.appendChild(message);
      } else {
        this.flashcards.forEach(flashcard => {
          const wordElement = document.createElement("p");
          wordElement.textContent = `Word: ${flashcard.word}`;
  
          const meaningElement = document.createElement("p");
          meaningElement.textContent = `Meaning: ${flashcard.meaning}`;
  
          flashcardContainer.appendChild(wordElement);
          flashcardContainer.appendChild(meaningElement);
          flashcardContainer.appendChild(document.createElement("hr"));
        });
      }
    }
  }
  
  // メインの処理
  const app = new FlashcardApp();
  
  document.getElementById("add-form").addEventListener("submit", event => {
    event.preventDefault();
    const wordInput = document.getElementById("word-input");
    const meaningInput = document.getElementById("meaning-input");
    app.addFlashcard(wordInput.value, meaningInput.value);
    wordInput.value = "";
    meaningInput.value = "";
  });
  
  document.getElementById("remove-form").addEventListener("submit", event => {
    event.preventDefault();
    const wordInput = document.getElementById("remove-word-input");
    app.removeFlashcard(wordInput.value);
    wordInput.value = "";
  });
  