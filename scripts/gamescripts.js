let table;
let discovered;
let firstClick = true;
let animation = false;
let flagCount;
let endTimer = false;

//generate the table
const generateTable = (height, length, bombCount) => {
    //create 2d array according to the given dimensions
    table = new Array(height);
    for (let i = 0; i < height; i++) {
        table[i] = new Array(length);
    }
    //prepare array for random mine locations
    let shuffle = [];
    for (let i = 0; i < length * height; i++) {
        shuffle[i] = i;
    }
    //shuffle the array
    shuffle = arrayShuffle(shuffle);
    //set all elements that are bombs as B
    for (let i = 0; i < bombCount; i++) {
        table[Math.floor(shuffle[i] / length)][shuffle[i] % length] = 'B';
    }
    //fill with null all elements that are not bombs
    fillNull();
    //fill all elements with their corresponding numbers
    fillNumbers();
    //generates the array with the discovered elements
    fillInitialTable(height, length);
};

//generate the table for the discovered elements
const fillInitialTable = (height, length) => {
    discovered = new Array(height);
    for (let i = 0; i < height; i++) {
        discovered[i] = new Array(length);
    }
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < length; j++) {
            // 0 represents an undisovered state
            discovered[i][j] = 0;
        }
    }
}

//shuffle the array
const arrayShuffle = arrayContent => {
    let currentIndex = arrayContent.length, randomIndex;
    //go through all indexes, swap every current index with a random one
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [arrayContent[currentIndex], arrayContent[randomIndex]] = [
            arrayContent[randomIndex], arrayContent[currentIndex]];
    }
    //return the shuffled array
    return arrayContent;
};

//fill empty spaces with null values
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

//fill in the corresponding numbers for cells surrounding the bombs
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
    //for all cells check all 8 surrounding positions to count the number of mines
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
            //check if element is not null
            if (table[i][j] !== null) {
                //fetch the cell element
                let cell = document.querySelector(`#cell${i * table[i].length + j}`);
                //prepare the image elements
                let img1 = document.createElement('img');
                let img2 = document.createElement('img');
                //set the image below the tile to the corresponding one 
                if (table[i][j] == 'B') {
                    img1.setAttribute('src', 'images/mine.png');
                } else {
                    img1.setAttribute('src', `images/${table[i][j]}.png`);
                }
                //make the image with the value hidden
                img1.setAttribute('class', 'cellImage');
                img1.classList.add('hidden');
                img1.setAttribute('draggable', 'false');
                //cover the image with another one
                img2.setAttribute('src', 'images/notOpen.png');
                img2.setAttribute('class', 'cellImage');
                img2.setAttribute('draggable', 'false');
                img2.classList.add('visible');
                img2.classList.add('undiscovered');
                //append the elements to the cell
                cell.append(img1);
                cell.append(img2);
            }
        }
    }
};

//remove images from all the cells
//this method is needed in case it is required to recalulate all values for cells
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

//method that recalculates the hidden status of the cells
//this is required for when the user relaeases the pressed cell in a different place
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

//uncoveres all the tiles that have to be uncovered after a click
const uncoverAll = (x, y) => {
    let cell = document.querySelector(`#cell${x * table[x].length + y}`);
    cell = cell.childNodes[1];
    //if cell is a bomb or is undefined
    if (table[x] == undefined || table[x][y] == undefined || table[x][y] == 'B' || cell.classList.contains('mine')) {
        return;
    }
    //set cell to discovered
    discovered[x][y] = 1;
    //if cell is not an empty cell, uncover it but don't continue the algorithm
    if (table[x][y] != 0) {
        replaceStatus(x, y);
        return;
    }
    //uncover the cell
    replaceStatus(x, y);
    //call this function recursevly for all 8 neighbouring cells
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

//method to reveal the image corresponding to the value of each cell
const revealTilesLose = () => {
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            replaceStatus(i, j);
        }
    }
}

//method to reveal the mines when the player loses
const revealMines = (x, y) => {
    let mines = [];
    //add all the mines inside the array
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
    //shuffle the array containing the mines
    mines = arrayShuffle(mines);
    //call the function that triggers an animation that makes the mines explode
    explodeMines(document.querySelector(`#cell${x * table[x].length + y}`), mines);
}

//function that triggers animation that makes mines explode
const explodeMines = (firstMine, mines) => {
    //enter the animation state
    animation = true;
    //stop the timer
    endTimer = true;
    let status = document.querySelector('#status');
    status.childNodes[0].setAttribute('src', 'images/deadsmiley.png');
    //blow first mine
    endMineStatus(firstMine);
    //blow second mine
    setTimeout(() => {
        if (mines[0] !== undefined) {
            endMineStatus(mines[0]);
        }
    }, 1250);
    //blow third mine
    setTimeout(() => {
        if (mines[1] !== undefined) {
            endMineStatus(mines[1]);
        }
    }, 2500);
    //blow the rest of the mines quickly
    for (let i = 2; i < mines.length; i++) {
        setTimeout(() => {
            endMineStatus(mines[i]);
        }, 2100 + i * 50);
    }
    setTimeout(() => {
        //reveal all the tiles
        revealTilesLose();
        //play random audio for losing the game
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

//method for blowing up a mine
const endMineStatus = mine => {
    //play audio with explosion effect
    var explodeEffect = new Audio('sounds/kaboom.mp3');
    explodeEffect.play();
    //change background color to red and reveal the mine
    mine.childNodes[0].classList.add('endCell');
    let id = mine.getAttribute('id');
    id = id.substring(4, id.length);
    replaceStatus(Math.floor(id / table[0].length), id % table[0].length);
}

//make cell display the mine flag
const replaceStatusWin = (x, y) => {
    const element = document.querySelector(`#cell${x * table[x].length + y}`);
    let img2 = element.childNodes[1];
    img2.setAttribute('src', 'images/flag.png');
};

//method for revealing the tiles when the player wins
const revealTilesWin = () => {
    //set animation status to true
    animation = true;
    //end the timer
    endTimer = true;
    //set flag count to 0
    flagCount = 0;
    //update the flag count
    updateFlagCount();
    //add a flag to all the left cells that do not have a flag
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
        //play victory tune
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

//method for checking whether the game has ended
const checkEnd = () => {
    //checks if there are any cells that are not bombs and are not yet discovered
    for (let i = 0; i < table.length; i++) {
        for (let j = 0; j < table[i].length; j++) {
            if (!discovered[i][j] && table[i][j] != 'B') {
                return false;
            }
        }
    }
    //if no cells described above are found, then the game has ended
    return true;
}

//method for starting the timer
const startTimer = () => {
    const timer = document.querySelector('#timer');
    let counter = 0;
    for (let i = 0; i <= 9; i++) {
        for (let j = 0; j <= 9; j++) {
            for (let k = 0; k <= 9; k++) {
                //every second increase the counter
                setTimeout(() => {
                    //if endTimer variable is false then the timer ends
                    if (endTimer) {
                        return;
                    }
                    //set each image representing the timer to the corresponding digit
                    timer.childNodes[0].setAttribute('src', `images/timer${i}.png`);
                    timer.childNodes[1].setAttribute('src', `images/timer${j}.png`);
                    timer.childNodes[2].setAttribute('src', `images/timer${k}.png`);
                }, 1000 * counter);
                counter++;
            }
        }
    }
}

//method to update the flag count
const updateFlagCount = () => {
    let element = document.querySelector('#flagCount');
    let displayCount = flagCount;
    //set each image representing the flag counter to the corresponding digit
    element.childNodes[2].setAttribute('src', `images/timer${displayCount % 10}.png`);
    displayCount /= 10;
    displayCount = Math.floor(displayCount);
    element.childNodes[1].setAttribute('src', `images/timer${displayCount % 10}.png`);
    displayCount /= 10;
    displayCount = Math.floor(displayCount);
    element.childNodes[0].setAttribute('src', `images/timer${displayCount % 10}.png`);
}