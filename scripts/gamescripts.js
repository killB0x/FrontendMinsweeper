let table;
let discovered;
let firstClick = true;
let animation = false;
let flagCount;
let endTimer = false;
//generate the table
const generateTable = (height, length, bombCount) => {
    table = new Array(height);
    for (let i = 0; i < height; i++) {
        table[i] = new Array(length);
    }
    let shuffle = [];
    for (let i = 0; i < length * height; i++) {
        shuffle[i] = i;
    }
    shuffle = arrayShuffle(shuffle);
    console.log(shuffle);
    for (let i = 0; i < bombCount; i++) {
        console.log(shuffle[i], height);
        table[Math.floor(shuffle[i] / length)][shuffle[i] % length] = 'B';
    }
    fillNull();
    fillNumbers();
    fillInitialTable(height, length);
    console.log(table);
};

//generate the table with the discovered elements
const fillInitialTable = (height, length) => {
    discovered = new Array(height);
    for (let i = 0; i < height; i++) {
        discovered[i] = new Array(length);
    }
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < length; j++) {
            // 0 represents a covered state
            discovered[i][j] = 0;
        }
    }
}

//shuffle the array
const arrayShuffle = arrayContent => {
    let currentIndex = arrayContent.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [arrayContent[currentIndex], arrayContent[randomIndex]] = [
            arrayContent[randomIndex], arrayContent[currentIndex]];
    }
    return arrayContent;
};

//fill empty spaces with null 
const fillNull = () => {
    let length = table[0].length;
    let height = table.length;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < length; j++) {
            if (table[i][j] != 'B') {
                table[i][j] = null;
            }
        }
    }
};

//fill in the numbers
const fillNumbers = () => {
    let length = table[0].length;
    let height = table.length;
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < length; j++) {
            if (table[i][j] !== 'B') {
                table[i][j] = countBombs(i, j);
            }
        }
    }
};

//count the number of bombs surrounding a cell
const countBombs = (x, y) => {
    let bombCount = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (table[x + i] == undefined || i == 0 && j == 0 || table[x + i][y + j] !== 'B') {
                continue;
            }
            bombCount++;
        }
    }
    return bombCount;
};

//add images to the game board
const addImages = () => {
    console.log(table);
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            if (table[i][j] !== null) {
                let cell = document.querySelector(`#cell${i * table[i].length + j}`);
                let img1 = document.createElement('img');
                let img2 = document.createElement('img');
                if (table[i][j] == 'B') {
                    img1.setAttribute('src', 'images/mine.png');
                } else {
                    img1.setAttribute('src', `images/${table[i][j]}.png`);
                }
                img1.setAttribute('class', 'cellImage');
                img1.classList.add('hidden');
                img1.setAttribute('draggable', 'false');
                img2.setAttribute('src', 'images/notOpen.png');
                img2.setAttribute('class', 'cellImage');
                img2.setAttribute('draggable', 'false');
                img2.classList.add('visible');
                img2.classList.add('undiscovered');
                cell.append(img1);
                cell.append(img2);
            }
        }
    }
};

//add images to the game board
const removeImages = () => {
    console.log(table);
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            if (table[i][j] !== null) {
                let cell = document.querySelector(`#cell${i * table[i].length + j}`);
                cell.innerHTML = "";
            }
        }
    }
};


const syncUndiscoveredTiles = () => {
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            let cell = document.querySelector(`#cell${i * table[i].length + j}`);
            if (!discovered[i][j] && !cell.childNodes[1].classList.contains('mine')) {
                cell.childNodes[1].setAttribute('src', 'images/notOpen.png');
            }
        }
    }
}
//updates the discovered tiles
const uncoverAll = (x, y) => {
    let cell = document.querySelector(`#cell${x * table[x].length + y}`);
    cell = cell.childNodes[1];
    if (table[x] == undefined || table[x][y] == undefined || table[x][y] == 'B' || cell.classList.contains('mine')) {
        console.log(cell);
        return;
    }
    discovered[x][y] = 1;
    if (table[x][y] != 0) {
        replaceStatus(x, y);
        return;
    }
    replaceStatus(x, y);
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (discovered[x + i] != undefined && discovered[x + i][y + j] != undefined && discovered[x + i][y + j] == 0) {
                uncoverAll(x + i, y + j)
            }
        }
    }
};

//helper method to replace the visual status of the cell when clicked
const replaceStatus = (x, y) => {
    const element = document.querySelector(`#cell${x * table[x].length + y}`);
    let img1 = element.childNodes[0];
    let img2 = element.childNodes[1];
    img2.classList.remove('undiscovered');
    img2.classList.remove('visible');
    img2.classList.add('hidden');
    img1.classList.remove('hidden');
    img1.classList.add('visible');
};

const revealTilesLose = () => {
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            replaceStatus(i, j);
        }
    }
}

const revealMines = (x, y) => {
    let mines = [];
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            const element = document.querySelector(`#cell${i * table[i].length + j}`);
            if (i == x && j == y) {
                continue;
            }
            if (element.childNodes[0].getAttribute('src') === 'images/mine.png') {
                mines.push(element);
            }
        }
    }
    mines = arrayShuffle(mines);
    explodeMines(document.querySelector(`#cell${x * table[x].length + y}`), mines);
    //revealTilesLose();
}

const explodeMines = (firstMine, mines) => {
    animation = true;
    endTimer = true;
    let status = document.querySelector('#status');
    status.childNodes[0].setAttribute('src', 'images/deadsmiley.png');
    endMineStatus(firstMine);
    setTimeout(() => {
        endMineStatus(mines[0]);
    }, 1250);
    setTimeout(() => {
        endMineStatus(mines[1]);
    }, 2500);
    for (let i = 2; i < mines.length; i++) {
        setTimeout(() => {
            endMineStatus(mines[i]);
        }, 2100 + i * 50);
    }
    setTimeout(() => {
        revealTilesLose();
        let gameOver = [new Audio('sounds/gameOver.mp3'),
        new Audio('sounds/annoying.mp3'),
        new Audio('sounds/backToWork.mp3'),
        new Audio('sounds/gottaHurt.mp3'),
        new Audio('sounds/shitHappens.mp3'),
        new Audio('sounds/youSuck.mp3')];
        gameOver = arrayShuffle(gameOver);
        gameOver[0].play();
    }, 3750 + mines.length * 50);

}

const endMineStatus = mine => {
    var explodeEffect = new Audio('sounds/kaboom.mp3');
    explodeEffect.play();
    mine.childNodes[0].classList.add('endCell');
    let id = mine.getAttribute('id');
    id = id.substring(4, id.length);
    replaceStatus(Math.floor(id / table[0].length), id % table[0].length);
}

const replaceStatusWin = (x, y) => {
    const element = document.querySelector(`#cell${x * table[x].length + y}`);
    let img2 = element.childNodes[1];
    img2.setAttribute('src', 'images/flag.png');
};

const revealTilesWin = () => {
    animation = true;
    endTimer = true;
    flagCount = 0;
    updateFlagCount();
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            const element = document.querySelector(`#cell${i * table[i].length + j}`);
            console.log(element.childNodes[1].classList);
            if (element.childNodes[1].classList.contains('undiscovered')) {
                replaceStatusWin(i, j);
            }
        }
    }
    setTimeout(() => {
        let gameOver = [new Audio('sounds/better.mp3'),
        new Audio('sounds/holyCow.mp3'),
        new Audio('sounds/holyShit.mp3'),
        new Audio('sounds/terminated.mp3')];
        gameOver = arrayShuffle(gameOver);
        let status = document.querySelector('#status');
        status.childNodes[0].setAttribute('src', 'images/sunglasses.png');
        gameOver[0].play();
    }, 1000);
}

const checkEnd = () => {
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            if (!discovered[i][j] && table[i][j] != 'B') {
                return false;
            }
        }
    }
    return true;
}

const startTimer = () => {
    const timer = document.querySelector('#timer');
    let counter = 0;
    for (let i = 0; i <= 9; i++) {
        for (let j = 0; j <= 9; j++) {
            for (let k = 0; k <= 9; k++) {
                setTimeout(() => {
                    if (endTimer) {
                        return;
                    }
                    timer.childNodes[0].setAttribute('src', `images/timer${i}.png`);
                    timer.childNodes[1].setAttribute('src', `images/timer${j}.png`);
                    timer.childNodes[2].setAttribute('src', `images/timer${k}.png`);
                }, 1000 * counter);
                counter++;
            }
        }
    }
}

const updateFlagCount = () => {
    let element = document.querySelector('#flagCount');
    let displayCount = flagCount;
    element.childNodes[2].setAttribute('src', `images/timer${displayCount % 10}.png`);
    displayCount /= 10;
    displayCount = Math.floor(displayCount);
    element.childNodes[1].setAttribute('src', `images/timer${displayCount % 10}.png`);
    displayCount /= 10;
    displayCount = Math.floor(displayCount);
    element.childNodes[0].setAttribute('src', `images/timer${displayCount % 10}.png`);
}