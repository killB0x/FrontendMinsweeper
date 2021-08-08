const form = document.querySelector('form');
const img = document.querySelector('img');
const board = document.querySelector('.board');

//add event listener for selecting the difficulty and starting the game
form.addEventListener('submit', (e) => {
    e.preventDefault();
    //make the initial screen elements dissapear
    form.classList.add('hidden');
    img.classList.add('hidden');
    //initalize html code for the game table
    let gameTable = '<div class = \'borderGhost\'><table class = \'displayTable\'><tr><td class = \'dataCell\'><span id = \'flagCount\' class = \'flagCount\'><img class = \'flagCountCell\' src=\'images/negative.png\'><img class = \'flagCountCell\' src=\'images/negative.png\'><img class = \'flagCountCell\' src=\'images/negative.png\'></span><span id = \'status\' class=\'status\'><img class=\'statusCell\' src=\'images/smiley.png\'></span><span id = \'timer\' class = \'timer\'><img class = \'timerCell\' src=\'images/timer0.png\'><img class = \'timerCell\' src=\'images/timer0.png\'><img class = \'timerCell\' src=\'images/timer0.png\'></span></td></tr><tr><td class=\'borderCell\'></td></tr><tr><td class = \'dataCell\'><table id = \'gameTable\' class = \'mineTable\'>';
    //modify the size of the table according to the selected difficulty level
    switch (form.difficulty.value) {
        case 'intermediate':
            flagCount = 40;
            for (let i = 0; i < 16; i++) {
                gameTable += '<tr>';
                for (let j = 0; j < 16; j++) {
                    let id = i * 16 + j;
                    gameTable += `<td id='cell${id}'></td>`;
                }
                gameTable += '</tr>';
            }
            generateTable(16, 16, 40);
            break;
        case 'difficult':
            flagCount = 99;
            for (let i = 0; i < 16; i++) {
                gameTable += '<tr>';
                for (let j = 0; j < 30; j++) {
                    let id = i * 30 + j;
                    gameTable += `<td id='cell${id}'></td>`;
                }
                gameTable += '</tr>';
            }
            generateTable(16, 30, 99);
            break;
        default:
            flagCount = 10;
            for (let i = 0; i < 9; i++) {
                gameTable += '<tr>';
                for (let j = 0; j < 9; j++) {
                    let id = i * 9 + j;
                    gameTable += `<td id='cell${id}'></td>`;
                }
                gameTable += '</tr>';
            }
            generateTable(9, 9, 10);
            break;
    }
    gameTable += '</table></td></tr></table></div>';
    //append the game table to the div element
    board.innerHTML = gameTable;
    //call method to add imaged to cells
    addImages();
    //call method to add event listeners to all cells
    addCellEventListeners();
    //call method to update the flagged cell count
    updateFlagCount();
})

const addCellEventListeners = () => {
    const gameTable = document.querySelector('table');
    const webPage = document.querySelector('body');

    gameTable.addEventListener('mousedown', (e) => {
        e.preventDefault();
        //if the smiley face icon is pressed change it to a version that lookes so
        if (e.target.classList.contains('statusCell')) {
            e.target.setAttribute('src', 'images/smileyPressed.png');
        }
        //if conditions are met and a cell is pressed, makes it look pressed down
        if (!animation && e.target.classList.contains('undiscovered') && e.button != 2 && !e.target.classList.contains('mine')) {
            e.target.setAttribute('src', 'images/0.png');
        }
    });

    webPage.addEventListener('mouseup', (e) => {
        e.preventDefault();
        //when the smiley face is released reset everything
        if (e.target.classList.contains('statusCell')) {
            location.replace('index.html');
        }
        //when the mouse button is released and the button is not pressed the images are reset to their intial state
        if (!animation) {
            syncUndiscoveredTiles();
        }
    });
    gameTable.addEventListener('click', (e) => {
        //click events will happen only if an animation has not started, the cell is not discovered and the cell is not flagged 
        if (!animation && e.target.classList.contains('undiscovered') && !e.target.classList.contains('mine')) {
            //get the id of the cell
            let id = e.target.parentNode.getAttribute('id');
            id = id.substring(4, id.length);
            //method to uncover all neighbouring cells according to the algorithm
            uncoverAll(Math.floor(id / table[0].length), id % table[0].length);
            //if cell pressed has a bomb
            if (table[(Math.floor(id / table[0].length))][id % table[0].length] == 'B') {
                //if it is the first click, the bomb is removed and the images and digits are refactored
                if (firstClick) {
                    flagCount--;
                    table[(Math.floor(id / table[0].length))][id % table[0].length] = null;
                    fillNumbers();
                    removeImages();
                    addImages();
                    uncoverAll(Math.floor(id / table[0].length), id % table[0].length);
                    //otherwise end the game
                } else {
                    e.target.parentNode.classList.add('endCell');
                    //call method for ending the game
                    revealMines(Math.floor(id / table[0].length), id % table[0].length);
                }
                //after every opened cell that is not a bomb check if the game has ended
            } else if (checkEnd()) {
                //call method for the win ending if the last pressed cell is not a bomb
                revealTilesWin();
            }
        }
        //after every click update the flag count
        updateFlagCount();
        //if the click was the first one, start the timer
        if (firstClick) {
            startTimer();
        }
        firstClick = false;
    });

    //events for right clicking
    gameTable.addEventListener('contextmenu', e => {
        //prevent showing the menu
        e.preventDefault();
        //if the cell is not discovered, an animation has not started and the first click has occured
        //then the flag status of the mine is changed
        if (e.target.classList.contains('undiscovered') && !animation && !firstClick) {
            let cell = e.target;
            //if the cell is flagged, remove the flag
            if (cell.classList.contains('mine')) {
                cell.classList.remove('mine');
                cell.classList.add('nomine');
                cell.setAttribute('src', 'images/notOpen.png');
                flagCount++;
                //if the cell is not flagged, add the flag
            } else {
                cell.classList.remove('nomine');
                cell.classList.add('mine');
                cell.setAttribute('src', 'images/flag.png');
                flagCount--;
            }
            //update the flag count afterwards
            updateFlagCount();
        }
    });
}
