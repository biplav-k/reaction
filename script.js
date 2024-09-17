const shapes = [
    {
        name: 'circle',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="cyan" stroke-width="5" fill="black"/></svg>'
    },
    {
        name: 'square',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="80" stroke="red" stroke-width="5" fill="black"/></svg>'
    },
    {
        name: 'triangle',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90" stroke="green" stroke-width="5" fill="black"/></svg>'
    },
    {
        name: 'octagon',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" stroke="orange" stroke-width="5" fill="black"/></svg>'
    },
    {
        name: 'rhombus',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><polygon points="50,10 90,50 50,90 10,50" stroke="blue" stroke-width="5" fill="black"/></svg>'
    }
];

let targetShape = '';
let score = 0;
let placedShapes = [];
let shuffleInterval;
let gameTimer;
let timeLeft = 60;

const targetShapeEl = document.getElementById('targetShape');
const scoreEl = document.getElementById('score');
const shapesContainer = document.getElementById('shapesContainer');
const startButton = document.getElementById('startButton');
const timeLeftEl = document.getElementById('timeLeft');

function randomShape() {
    return shapes[Math.floor(Math.random() * shapes.length)];
}

function setTargetShape() {
    targetShape = randomShape();
    targetShapeEl.innerHTML = `Click: ${targetShape.svg}`;
}

function createShapeElements() {
    shapesContainer.innerHTML = '';
    placedShapes = [];
    shapes.forEach(shape => {
        const shapeEl = document.createElement('div');
        shapeEl.classList.add('shape');
        shapeEl.innerHTML = shape.svg;
        shapeEl.addEventListener('click', () => handleShapeClick(shape.name));
        shapesContainer.appendChild(shapeEl);
        positionShapeRandomly(shapeEl);
    });
}

function handleShapeClick(clickedShape) {
    const beepSound = document.getElementById('beepSound');

    if (clickedShape === targetShape.name) {
        score++;  // Increment score only on correct shape click
        beepSound.play();  // Play beep sound on correct click
    }

    scoreEl.textContent = score;  // Update the score display
}

function shuffleShapes() {
    const shuffledShapes = shapes.sort(() => 0.5 - Math.random());
    shapesContainer.innerHTML = '';
    placedShapes = [];
    shuffledShapes.forEach(shape => {
        const shapeEl = document.createElement('div');
        shapeEl.classList.add('shape');
        shapeEl.innerHTML = shape.svg;
        shapeEl.addEventListener('click', () => handleShapeClick(shape.name));
        shapesContainer.appendChild(shapeEl);
        positionShapeRandomly(shapeEl);
    });
}

function positionShapeRandomly(shapeEl) {
    const containerWidth = shapesContainer.offsetWidth;
    const containerHeight = shapesContainer.offsetHeight;
    let randomX, randomY;

    do {
        randomX = Math.floor(Math.random() * (containerWidth - shapeEl.offsetWidth));
        randomY = Math.floor(Math.random() * (containerHeight - shapeEl.offsetHeight));
    } while (isOverlapping({ x: randomX, y: randomY }));

    shapeEl.style.left = `${randomX}px`;
    shapeEl.style.top = `${randomY}px`;
    placedShapes.push({ x: randomX, y: randomY });
}

function isOverlapping(newPos, shapeSize = 80) {
    for (let pos of placedShapes) {
        const xOverlap = Math.abs(newPos.x - pos.x) < shapeSize;
        const yOverlap = Math.abs(newPos.y - pos.y) < shapeSize;
        if (xOverlap && yOverlap) {
            return true;
        }
    }
    return false;
}

function startGame() {
    startButton.style.display = 'none';
    targetShapeEl.style.display = 'block';
    shapesContainer.style.display = 'block';
    document.querySelector('.score-board').style.display = 'block';

    score = 0;
    timeLeft = 60;
    scoreEl.textContent = score;
    timeLeftEl.textContent = `Time Left: ${timeLeft}s`;
    setTargetShape();
    createShapeElements();

    shuffleInterval = setInterval(() => {
        shuffleShapes();
        setTargetShape();
    }, 500);

    gameTimer = setInterval(() => {
        timeLeft--;
        timeLeftEl.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    clearInterval(shuffleInterval);
    clearInterval(gameTimer);
    alert(`Game Over! Your final score: ${score}`);
    resetGame();
}

function resetGame() {
    startButton.style.display = 'block';
    targetShapeEl.style.display = 'none';
    shapesContainer.style.display = 'none';
    document.querySelector('.score-board').style.display = 'none';

    shapesContainer.innerHTML = '';
    score = 0;
    timeLeft = 60;
    timeLeftEl.textContent = `Time Left: ${timeLeft}s`;
}

startButton.addEventListener('click', startGame);
