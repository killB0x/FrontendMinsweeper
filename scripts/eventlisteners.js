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
        if (e.target.classList.contains('undiscovered')) {
            console.log(e);
            /*let img1 = e.target.previousSibling;
            let img2 = e.target;
            img2.classList.remove('undiscovered');
            img2.classList.remove('visible');
            img2.classList.add('hidden');
            img1.classList.remove('hidden');
            img1.classList.add('visible');*/
            let id = e.target.parentNode.getAttribute('id');
            id = id.substring(4, id.length)
            console.log(table[(Math.floor(id / table[0].length))][id % table[0].length]);
            uncoverAll(Math.floor(id / table[0].length), id % table[0].length);
        }
    })
}