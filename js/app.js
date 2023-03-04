

const divContainer = document.querySelector('#container');
const divGame = document.querySelector('#game');
const divGameNumber = document.querySelector('.game-number');
divGameNumber.innerText = 'Partie n° 0';
const buttonReset = document.querySelector('.button-reset');
const buttonPlay = document.querySelector('.button-play');
const inputNbBox = document.querySelector('#nb-box');
const form = document.querySelector('form');
const divResult = document.querySelector('.result');

const dimBox = 50;

let boxPerLine;
let numberOfBox;
let dimGame;
let gameNumber;

let bombRate = 0.25;

let trapped = [];
let found = [];

const rng = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const redim = (value) => {
    boxPerLine = value;
    numberOfBox = Math.pow(value, 2);
    dimGame = value * dimBox;
};

const setBomb = () => {
    trapped = [];
    for (let i = 0; i < Math.round(numberOfBox * bombRate); i++) {
        let rngNumber = rng(1, numberOfBox);
        while (trapped.includes(rngNumber)) rngNumber = rng(1, numberOfBox);
        trapped.push(rngNumber);
    }
    console.log(trapped);
};

const addBox = (boxNumber) => {
    const divBox = document.createElement('div');
    divBox.setAttribute('class', 'box');
    divBox.setAttribute('id', `box${boxNumber}`);
    if (trapped.includes(boxNumber)) divBox.classList.add('bomb');
    divBox.style.cssText = `
        width: ${dimBox - 2}px;
        height: ${dimBox - 2}px
    `;
    divBox.innerText = `${boxNumber}`;
    document.querySelector('#game').appendChild(divBox);
};

const rollBox = () => {
    redim(parseInt(inputNbBox.value));
    gameNumber++;
    divGame.innerHTML = '';
    divGame.style.cssText = `width: ${dimGame}px; height: ${dimGame}px`;
    divContainer.appendChild(divGame);

    setBomb();
    //console.log(trapped);

    for (let i = 1; i < numberOfBox + 1; i++) {
        addBox(i);
    }

    divGameNumber.innerHTML = `Partie n° ${gameNumber}`;
};

const resetGame = () => {
    rollBox();
    gameNumber = 0;
    divGameNumber.innerHTML = `Partie n° ${gameNumber}`;
    inputNbBox.value = '';
    divGame.innerText = '';
    divGame.setAttribute('style', '');
    divResult.classList.remove('lose', 'win');
    divResult.innerText = '';
    buttonPlay.style.color = 'revert-layer';
    buttonPlay.style.boxShadow = 'revert-layer';
    buttonPlay.style.pointerEvents = 'revert-layer';
};

const noBomb = (boxId) => {
    const theBox = document.querySelector(`#${boxId}`);
    //console.log('boxId', boxId);
    const num = numberOfBomb(boxId);
    //console.log('num', num);
    theBox.classList.add('box-no-bomb');
    if (num > 0) theBox.classList.add(numberToClass(num));
    theBox.classList.remove('box');
    theBox.innerText = num > 0 ? `${num}` : '';
};

const itsbomb = (boxId) => {
    const theBox = document.querySelector(`#${boxId}`);
    theBox.classList.add('box-no-bomb', 'bomb');
    theBox.classList.remove('box');
    theBox.style.backgroundColor = '#red';
    lose();
};

const lose = () => {
    divResult.classList.add('lose');
    divResult.innerText = 'Perdu !';
    divGame.style.pointerEvents = 'none';
    buttonPlay.style.pointerEvents = 'none';
    buttonPlay.style.color = '#a1a4a7';
    buttonPlay.style.boxShadow = 'inset 0 0 0 2px #a1a4a7';
};

const numberOfBomb = (boxId) => {
    let nbBomb = 0;
    boxId = Number(boxId.substring(3));
    // console.log('tempBoxId', boxIdNumber);
    // console.log('boxPerLine', boxPerLine);
    let adjacentBox = [];
    if (boxId === 1) { //top left
        adjacentBox = [ boxId + 1,
        boxId + (boxPerLine + 1),
        boxId + boxPerLine, ];
    }
    else if (boxId === boxPerLine) { //top right
        adjacentBox = [ boxId + boxPerLine,
        boxId + (boxPerLine - 1),
        boxId - 1, ];
    }
    else if (boxId === numberOfBox) { // bot right
        adjacentBox = [ boxId - boxPerLine,
        boxId - 1,
        boxId - (boxPerLine + 1) ];
    }
    else if (boxId === numberOfBox - boxPerLine + 1) {  //bot left
        adjacentBox = [ boxId - boxPerLine,
        boxId - (boxPerLine - 1),
        boxId + 1 ];
    }
    else if (boxId - boxPerLine < 0) {  //top
        adjacentBox = [ boxId + 1,
        boxId + (boxPerLine + 1),
        boxId + boxPerLine,
        boxId + (boxPerLine - 1),
        boxId - 1 ];
    }
    else if (boxId % boxPerLine === 0) {  //right
        adjacentBox = [ boxId - boxPerLine,
        boxId + boxPerLine,
        boxId + (boxPerLine - 1),
        boxId - 1,
        boxId - (boxPerLine + 1) ];
    }
    else if (boxId + boxPerLine > numberOfBox) {  //bot
        adjacentBox = [ boxId - boxPerLine,
        boxId - (boxPerLine - 1),
        boxId + 1,
        boxId - 1,
        boxId - (boxPerLine + 1) ];
    }
    else if (boxId % boxPerLine === 1) {  //left
        adjacentBox = [ boxId - boxPerLine,
        boxId - (boxPerLine - 1),
        boxId + 1,
        boxId + (boxPerLine + 1),
        boxId + boxPerLine, ];
    }
    else {  // les cases du milieu
        adjacentBox = [ boxId - boxPerLine,
        boxId - (boxPerLine - 1),
        boxId + 1,
        boxId + (boxPerLine + 1),
        boxId + boxPerLine,
        boxId + (boxPerLine - 1),
        boxId - 1,
        boxId - (boxPerLine + 1) ];
    }

    for (let box of adjacentBox) {
        if (box > dimGame) adjacentBox.splice(--i, 1);
    }

    for (let i = 0; i < adjacentBox.length; i++) {
        if (trapped.includes(adjacentBox[ i ])) nbBomb++;
    }
    //console.log('nbBomb', nbBomb);
    return nbBomb;
};

const numberToClass = (number) => {
    switch (number) {
        case 1:
            return 'one-bomb';
        case 2:
            return 'two-bomb';
        case 3:
            return 'tree-bomb';
        case 4:
            return 'four-bomb';
        case 5:
            return 'five-bomb';
        case 6:
            return 'six-bomb';
        case 7:
            return 'seven-bomb';
        case 8:
            return 'eight-bomb';
    }
};

buttonPlay.addEventListener('click', rollBox);
buttonReset.addEventListener('click', resetGame);
form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (buttonPlay.style.pointerEvents !== 'none') rollBox();
    }
});

inputNbBox.onblur = () => {
    redim(parseInt(inputNbBox.value));
};

divGame.addEventListener('click', (event) => {
    const id = event.target.id;
    if (id.includes('box')) {
        if (trapped.includes(Number(id.substring(3)))) itsbomb(id);
        else noBomb(id);
    }
});

divGame.addEventListener('mousedown', (event) => {
    //console.log(event);
});
divGame.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});