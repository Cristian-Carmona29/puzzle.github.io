document.addEventListener("DOMContentLoaded", () => {
    const puzzleContainer = document.getElementById("puzzle-container");
    const timerDisplay = document.getElementById("timer");
    const completionTimeDisplay = document.getElementById("completion-time");
    const successSound = document.getElementById("success-sound");
    const failSound = document.getElementById("fail-sound");
    const loseModal = document.getElementById("lose-modal");
    const winModal = document.getElementById("win-modal");
    const winMessage = document.getElementById("win-message");
    const restartButtonLose = document.getElementById("restart-button-lose");
    const restartButtonWin = document.getElementById("restart-button-win");
    let pieces = [];
    let startTime;
    let timer;
    const totalTime = 60;
    const pieceSize = 100;
    const numPieces = 25;
    let currentDraggedPiece = null;
    let targetPiece = null;

    restartButtonLose.addEventListener("click", restartGame);
    restartButtonWin.addEventListener("click", restartGame);

    function createPuzzle() {
        const image = "img/girasol.png";

        puzzleContainer.innerHTML = "";
        pieces = [];

        // Crear piezas
        for (let i = 0; i < numPieces; i++) {
            const piece = document.createElement("div");
            piece.className = "puzzle-piece";
            piece.style.backgroundImage = `url(${image})`;
            piece.style.backgroundPosition = `-${(i % 5) * pieceSize}px -${Math.floor(i / 5) * pieceSize}px`;
            piece.dataset.index = i;
            piece.draggable = true;
            piece.textContent = i + 1;

            piece.addEventListener("dragstart", dragStart);
            piece.addEventListener("dragover", dragOver);
            piece.addEventListener("drop", drop);
            piece.addEventListener("dragend", dragEnd);
            pieces.push(piece);
        }

        // Mezclar las piezas
        shuffleArray(pieces);

        // Añadir piezas al contenedor
        pieces.forEach((piece, index) => {
            piece.style.order = index;
            puzzleContainer.appendChild(piece);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startTimer() {
        let timeRemaining = totalTime;
        startTime = Date.now();

        timer = setInterval(() => {
            timeRemaining = Math.max(0, totalTime - Math.floor((Date.now() - startTime) / 1000));
            timerDisplay.textContent = `Tiempo restante: ${timeRemaining}`;

            if (timeRemaining === 0) {
                clearInterval(timer);
                failSound.play();
                showModal(loseModal);
            }
        }, 1000);
    }

    function dragStart(event) {
        currentDraggedPiece = event.target;
        event.dataTransfer.setData("text/plain", event.target.dataset.index);
        event.target.style.opacity = "0.5";
    }

    function dragOver(event) {
        event.preventDefault();
        targetPiece = event.target;
    }

    function drop(event) {
        event.preventDefault();
        if (currentDraggedPiece && targetPiece && currentDraggedPiece !== targetPiece) {
            // Intercambiar piezas
            const tempOrder = currentDraggedPiece.style.order;
            currentDraggedPiece.style.order = targetPiece.style.order;
            targetPiece.style.order = tempOrder;
        }
    }

    function dragEnd(event) {
        event.target.style.opacity = "1";
        currentDraggedPiece = null;
        targetPiece = null;
        checkCompletion();
    }

    function checkCompletion() {
        if (isPuzzleSolved()) {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            completionTimeDisplay.textContent = `¡Felicidades! Has resuelto el rompecabezas en ${timeTaken} segundos.`;
            successSound.play();
            clearInterval(timer);
            winMessage.textContent = `¡Felicidades! Has resuelto el rompecabezas en ${timeTaken} segundos.`;
            showModal(winModal);
        }
    }

    function isPuzzleSolved() {
        return pieces.every((piece) => {
            return piece.style.order == piece.dataset.index;
        });
    }

    function showModal(modal) {
        modal.style.display = "flex";
    }

    function hideModal(modal) {
        modal.style.display = "none";
    }

    function restartGame() {
        hideModal(loseModal);
        hideModal(winModal);
        createPuzzle();
        startTimer();
    }

    createPuzzle();
    startTimer();
});
