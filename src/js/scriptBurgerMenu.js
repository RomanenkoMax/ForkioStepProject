
let button = document.getElementById("burgerMenuBtn");
let menu = document.querySelector('.menu');
button.addEventListener('click', ()=> {
    menu.classList.toggle('move');
});

