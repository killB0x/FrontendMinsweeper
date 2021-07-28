let table;

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
        table[Math.floor(shuffle[i] / height)][shuffle[i] % length] = 'B';
    }
    fillNull();
    fillNumbers();
};


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