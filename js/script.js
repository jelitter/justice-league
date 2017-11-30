var secButtons = document.getElementById("sec-buttons");
var secButtons = document.getElementById("sec-buttons");
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");
var button3 = document.getElementById("button3");
var bg = document.getElementById("bg");


document.onload = (function() {
    // On Page load, we change to a random background image every 10 seconds.
    newBackground();
    setInterval(() => {
        newBackground();
    }, 10000);
})();

button1.addEventListener("click", () => {
    button1.classList.toggle('activebutton1');
    // secButtons.classList.toggle('activesecButtons');    

    // secButtons.classList.toggle('activesecButtons');


    if (button1.classList.contains('activebutton1')) {
        showSecButtons();
    } else {
        hideSecButtons();
    }
    newBackground();
});


function showSecButtons() {
    // secButtons.style.transform = "scale(1)";
    // button2.style.border = "solid 2px yellow";
    // console.log("active");
    // secButtons.classList = ["active"];
    button2.classList = ["slideIn"];
    button3.classList = ["slideIn"];
}

function hideSecButtons() {
    // secButtons.style.transform = "scale(0.1)";
    // secButtons.style.transform = "rotateY(90)";
    // button2.style.border = "none";
    // console.log("inactive");
    // secButtons.classList = ["inactive"];
    button3.classList = ["slideOut"];
    button2.classList = ["slideOut"];
}

function newBackground() {

    let n = Math.floor(Math.random() * 9) + 1; // Random int between 1 and 9

    bg.classList = ["fadeOut"];
    setTimeout(() => {
        bg.src = "img/bg" + n + ".jpg";
    }, 700);
    setTimeout(() => {
        bg.classList = ["fadeIn"];
    }, 1000);
}