
let button = document.getElementById("burgerMenuBtn");
let menu = document.querySelector('.menu');
button.addEventListener('click', ()=> {
    menu.classList.toggle('move');
});


$(document).ready(function(){
    $(".carousel__list").slick({
        nextArrow:'<div class="arr-next">&gt</div>',
        prevArrow:'<div class="arr-prev">&lt</div>'
    })
});