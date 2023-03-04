const divContainer = document.querySelector('#container');
const divGame = document.querySelector('#game');
const divGameNumber = document.querySelector('.game-number');
divGameNumber.innerText = 'Partie n° 0';
const buttonReset = document.querySelector('.button-reset');
const buttonPlay = document.querySelector('.button-play');
const inputNbBox = document.querySelector('#nb-box');
const inputDifficulty = document.querySelector('#difficulty');
const form = document.querySelector('form');
const divResult = document.querySelector('.result');

const dimBox = 50;

let boxPerLine;
let numberOfBox;
let dimGame;
let bombRate;
let gameNumber = 0;

let trapped = [];
let nonTrapped = [];
let found = [];

const rng = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const redim = (value) => {
    boxPerLine = value;
    numberOfBox = Math.pow(value, 2);
    dimGame = value * dimBox;
};

const setDifficulty = () => {
    bombRate = parseFloat(inputDifficulty.value);
    console.log(bombRate);
};

const rollBox = () => {
    redim(parseInt(inputNbBox.value));
    setDifficulty();
    gameNumber++;
    buttonPlay.innerText = 'Jouer !';
    divGame.innerHTML = '';
    divGame.style.cssText = `width: ${dimGame}px; height: ${dimGame}px`;
    divContainer.appendChild(divGame);
    divResult.classList.remove('lose', 'win');
    divResult.innerText = '';

    trapped = [];
    nonTrapped = [];
    for (let i = 0; i < Math.round(numberOfBox * bombRate); i++) {
        let rngNumber = rng(1, numberOfBox);
        while (trapped.includes(rngNumber)) rngNumber = rng(1, numberOfBox);
        trapped.push(rngNumber);
    }

    for (let i = 1; i < numberOfBox; i++) {
        if (!trapped.includes(i)) nonTrapped.push(i);
    }

    for (let i = 1; i < numberOfBox + 1; i++) {
        const divBox = document.createElement('div');
        divBox.setAttribute('class', 'box');
        divBox.setAttribute('id', `box${i}`);
        if (trapped.includes(i)) divBox.classList.add('bomb');
        divBox.style.cssText = `
            width: ${dimBox - 2}px;
            height: ${dimBox - 2}px
        `;
        //divBox.innerText = `${boxNumber}`;
        document.querySelector('#game').appendChild(divBox);
    }

    divGameNumber.innerText = `Partie n° ${gameNumber}`;
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
    buttonPlay.innerText = 'Jouer !';
};

const noBomb = (boxId) => {
    //console.log('boxId', boxId);
    const theBox = document.querySelector(`#${boxId}`);
    const boxIdNumber = Number(boxId.substring(3));

    const num = numberOfBomb(boxIdNumber);
    //console.log('num', num);

    theBox.classList.add('box-no-bomb');
    if (num > 0) theBox.classList.add(numberToClass(num));
    theBox.classList.remove('box');
    theBox.innerText = num > 0 ? `${num}` : '';

    if (num === 0) {
        let adjacentBoxId = getAdjacent(boxIdNumber);
        //console.log('adjacentBoxId', adjacentBoxId);
        for (let id of adjacentBoxId) {
            if (!trapped.includes(id) && document.querySelector(`#box${id}`).classList.contains('box')) noBomb(`box${id}`);
        }
    }

    nonTrapped = nonTrapped.filter(id => id !== boxIdNumber);
    if (nonTrapped.length === 0) endGame(boxId, 'win');

};

const getAdjacent = (boxId) => {
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

    return adjacentBox;
};

const numberOfBomb = (boxId) => {
    let nbBomb = 0;
    // console.log('tempBoxId', boxIdNumber);
    // console.log('boxPerLine', boxPerLine);

    let adjacentBox = getAdjacent(boxId);

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

const addFlag = (event) => {
    event.target.classList.toggle('flag');
    event.target.pointerEvents = 'none';
};

const endGame = (boxId, how) => {
    console.log('how', how);
    const allBox = divGame.childNodes;
    const theBox = document.querySelector(`#${boxId}`);

    divGame.style.pointerEvents = 'none';

    for (let box of allBox) {
        if (box.classList.contains('bomb')) {
            box.classList.remove('box');
            box.classList.add('box-no-bomb', 'bomb');
            box.style.backgroundImage = "url('https://esraa-alaarag.github.io/Minesweeper/images/bomb.png')";
        }

        box.classList.remove('flag');
    }

    if (how === 'lose') {

        theBox.style.backgroundColor = 'red';
        divResult.classList.add('lose');
        divResult.innerText = 'Perdu !';

    }
    else if (how === 'win') {
        divResult.classList.add('win');
        divResult.innerText = 'Gagné !';
    }

    buttonPlay.innerText = 'Rejouer !!';
};

buttonPlay.addEventListener('click', rollBox);
//buttonReset.addEventListener('click', resetGame);
form.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (buttonPlay.style.pointerEvents !== 'none') rollBox();
    }
});

inputNbBox.onblur = () => {
    redim(parseInt(inputNbBox.value));
};

inputDifficulty.onblur = () => {
    setDifficulty();
};

divGame.addEventListener('click', (event) => {
    const id = event.target.id;
    if (id.includes('box')) {
        if (event.target.classList.contains('flag')) return;

        const boxIdNumber = Number(id.substring(3));
        if (trapped.includes(boxIdNumber)) {
            endGame(id, 'lose');
        }
        else noBomb(id);
    }
});

divGame.addEventListener('mousedown', (event) => {
    //console.log(event);
    if (event.button === 2 && event.target.classList.contains('box')) addFlag(event);
});

divContainer.addEventListener('contextmenu', (event) => {
    event.preventDefault();
});