const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    switch (form.difficulty.value) {
        case 'intermediate':
            console.log('medium');
            break;
        case 'difficult':
            console.log('hard');
            break;
        default:
            console.log('easy');
            break;
    }
})