const form = document.querySelector('form');
const img = document.querySelector('img');
const board = document.querySelector('.board');

//add event listener for selecting the difficulty and starting the game
form.addEventListener('submit', (e) => {
    e.preventDefault();

    form.classList.add('hidden');
    img.classList.add('hidden');
    let gameTable = '<div class = \'borderGhost\'><table class = \'displayTable\'><tr><td class = \'dataCell\'><span id = \'flagCount\' class = \'flagCount\'><img class = \'flagCountCell\' src=\'images/negative.png\'><img class = \'flagCountCell\' src=\'images/negative.png\'><img class = \'flagCountCell\' src=\'images/negative.png\'></span><span id = \'status\' class=\'status\'><img class=\'statusCell\' src=\'images/smiley.png\'></span><span id = \'timer\' class = \'timer\'><img class = \'timerCell\' src=\'images/timer0.png\'><img class = \'timerCell\' src=\'images/timer0.png\'><img class = \'timerCell\' src=\'images/timer0.png\'></span></td></tr><tr><td class=\'borderCell\'></td></tr><tr><td class = \'dataCell\'><table id = \'gameTable\' class = \'mineTable\'>';
    switch (form.difficulty.value) {
        case 'intermediate':
            console.log('medium');
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
            console.log('hard');
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
            console.log('easy');
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
    board.innerHTML = gameTable;
    addImages();
    addCellEventListeners();
    updateFlagCount();
})

const addCellEventListeners = () => {
    const gameTable = document.querySelector('table');
    const webPage = document.querySelector('body');
    console.log(gameTable);
    gameTable.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (!animation && e.target.classList.contains('undiscovered') && e.button != 2 && !e.target.classList.contains('mine')) {
            e.target.setAttribute('src', 'images/0.png');
        }
    });
    webPage.addEventListener('mouseup', (e) => {
        if (!animation) {
            syncUndiscoveredTiles();
        }
    });
    gameTable.addEventListener('click', (e) => {
        console.log(e.button);
        if (!animation && e.target.classList.contains('undiscovered') && !e.target.classList.contains('mine')) {
            console.log(e);
            let id = e.target.parentNode.getAttribute('id');
            id = id.substring(4, id.length);
            console.log(table[(Math.floor(id / table[0].length))][id % table[0].length]);
            uncoverAll(Math.floor(id / table[0].length), id % table[0].length);
            if (table[(Math.floor(id / table[0].length))][id % table[0].length] == 'B') {
                if (firstClick) {
                    flagCount--;
                    table[(Math.floor(id / table[0].length))][id % table[0].length] = null;
                    fillNumbers();
                    removeImages();
                    addImages();
                    console.log(table);
                    uncoverAll(Math.floor(id / table[0].length), id % table[0].length);
                } else {
                    e.target.parentNode.classList.add('endCell');
                    //revealTilesLose();
                    revealMines(Math.floor(id / table[0].length), id % table[0].length);
                    //board.innerHTML += '<div class = "endScreen"><div class = "gameOver"> GAME OVER! </div> <a href="index.html"><div class="homeButton"><p class = "center">Home</p></div></a></div>';
                }
            } else if (checkEnd()) {
                revealTilesWin();
                //board.innerHTML += '<div class = "endScreen"><div class = "youWin"> YOU WIN! </div> <a href="index.html"><div class="homeButton"><p class = "center">Home</p></div></a></div>';
            }
        }
        updateFlagCount();
        if (firstClick) {
            startTimer();
        }
        firstClick = false;
    });

    gameTable.addEventListener('contextmenu', e => {
        e.preventDefault();
        if (e.target.classList.contains('undiscovered') && !animation && !firstClick) {
            let cell = e.target;
            console.log(cell);
            if (cell.classList.contains('mine')) {
                cell.classList.remove('mine');
                cell.classList.add('nomine');
                cell.setAttribute('src', 'images/notOpen.png');
                flagCount++;
            } else {
                cell.classList.remove('nomine');
                cell.classList.add('mine');
                cell.setAttribute('src', 'images/flag.png');
                flagCount--;
            }
            updateFlagCount();
        }
    });
}
