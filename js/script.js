document.addEventListener('DOMContentLoaded', () => {
  const symbols = ['🍎', '🍌', '🍇', '🍉', '🍍', '🥝', '🍓', '🍑'];
  let cards = [];
  let flipped = [];
  let matchedCount = 0;
  let moves = 0;
  let timer = 0;
  let interval;

  const board = document.getElementById('game-board');
  const moveDisplay = document.getElementById('move-count');
  const timerDisplay = document.getElementById('timer');
  const winMessage = document.getElementById('win-message');
  const resetBtn = document.getElementById('reset-btn');

  const matchSound = document.getElementById('match-sound');
  const failSound = document.getElementById('fail-sound');
  const winSound = document.getElementById('win-sound');

  const darkToggle = document.getElementById('dark-toggle');
  darkToggle.addEventListener('change', (e) => {
    document.body.classList.toggle('dark', e.target.checked);
  });

  function shuffle(array) {
    return array.concat(array).sort(() => 0.5 - Math.random());
  }

  function startGame() {
    board.innerHTML = '';
    winMessage.classList.add('hidden');
    matchedCount = 0;
    moves = 0;
    timer = 0;
    flipped = [];
    moveDisplay.textContent = moves;
    timerDisplay.textContent = timer;
    clearInterval(interval);
    interval = setInterval(() => {
      timer++;
      timerDisplay.textContent = timer;
    }, 1000);

    cards = shuffle(symbols);
    cards.forEach((symbol, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.symbol = symbol;
      card.dataset.index = index;
      card.textContent = '';
      board.appendChild(card);
    });
  }

  function handleCardClick(e) {
    const card = e.target;
    if (!card.classList.contains('card') || card.classList.contains('flipped')) return;
    if (flipped.length === 2) return;

    card.textContent = card.dataset.symbol;
    card.classList.add('flipped');
    flipped.push(card);

    if (flipped.length === 2) {
      moves++;
      moveDisplay.textContent = moves;
      const [card1, card2] = flipped;

      if (card1.dataset.symbol === card2.dataset.symbol) {
        matchSound.play();
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCount++;

        if (matchedCount === symbols.length) {
          clearInterval(interval);
          winMessage.classList.remove('hidden');
          winSound.play();
        }

        flipped = [];
      } else {
        failSound.play();
        setTimeout(() => {
          card1.textContent = '';
          card2.textContent = '';
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          flipped = [];
        }, 800);
      }
    }
  }

  board.addEventListener('click', handleCardClick);
  resetBtn.addEventListener('click', startGame);

  // Start the game after DOM is fully ready
  startGame();
});
