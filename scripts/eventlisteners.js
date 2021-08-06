const form = document.querySelector('form');
const img = document.querySelector('img');
const board = document.querySelector('.board');

//add event listener for selecting the difficulty and starting the game
form.addEventListener('submit', (e) => {
    e.preventDefault();

    form.classList.add('hidden');
    img.classList.add('hidden');
    let gameTable = '<table id = \'gameTable\' class = \'mineTable\'>';
    switch (form.difficulty.value) {
        case 'intermediate':
            console.log('medium');
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
    gameTable += '</table>';
    board.innerHTML = gameTable;
    addImages();
    addCellEventListeners();
})

const addCellEventListeners = () => {
    const gameTable = document.querySelector('table');
    console.log(gameTable);
    gameTable.addEventListener('click', (e) => {
        console.log(e.button);
        if (e.target.classList.contains('undiscovered') && !e.target.classList.contains('mine')) {
            console.log(e);
            let id = e.target.parentNode.getAttribute('id');
            id = id.substring(4, id.length);
            console.log(table[(Math.floor(id / table[0].length))][id % table[0].length]);
            uncoverAll(Math.floor(id / table[0].length), id % table[0].length);
            if (table[(Math.floor(id / table[0].length))][id % table[0].length] == 'B') {
                if (firstClick) {
                    table[(Math.floor(id / table[0].length))][id % table[0].length] = null;
                    fillNumbers();
                    removeImages();
                    addImages();
                    console.log(table);
                    uncoverAll(Math.floor(id / table[0].length), id % table[0].length);
                } else {
                    e.target.parentNode.classList.add('endCell');
                    board.innerHTML += '<div class = "endScreen"><div class = "gameOver"> GAME OVER! </div> <a href="index.html"><div class="homeButton"><p class = "center">Home</p></div></a></div>';
                    revealTiles();
                }
            } else if (checkEnd()) {
                board.innerHTML += '<div class = "endScreen"><div class = "youWin"> YOU WIN! </div> <a href="index.html"><div class="homeButton"><p class = "center">Home</p></div></a></div>';
                revealTiles();
            }
        }
        firstClick = false;
    })

    gameTable.addEventListener('contextmenu', e => {
        e.preventDefault();
        if (e.target.classList.contains('undiscovered')) {
            let cell = e.target;
            console.log(cell);
            if (cell.classList.contains('mine')) {
                cell.classList.remove('mine');
                cell.classList.add('nomine');
                cell.setAttribute('src', 'images/notOpen.png');
            } else {
                cell.classList.remove('nomine');
                cell.classList.add('mine');
                cell.setAttribute('src', 'images/flag.png');
            }
        }
    })
}
