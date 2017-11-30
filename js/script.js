var secButtons = document.getElementById("sec-buttons");
var secButtons = document.getElementById("sec-buttons");
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");
var button3 = document.getElementById("button3");
var bg = document.getElementById("bg");
var bg2 = document.getElementById("bg2");
var bgWrap = document.getElementById("bg-wrap");
var bgWrap2 = document.getElementById("bg-wrap2");
var prevBackground = -1;
var prevBackground2 = -1;


document.onload = (function() {
    // On Page load, we change to a random background image every 10 seconds.
    newBackground();
    setInterval(() => {
        newBackground();
    }, 21000);
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
});


function showSecButtons() {
    button2.classList = ["slideIn"];
    button3.classList = ["slideIn"];
}

function hideSecButtons() {
    button3.classList = ["slideOut"];
    button2.classList = ["slideOut"];
}

function newBackground() {

    var n;
    do {
        n = Math.floor(Math.random() * 21) + 1; // Random int between 1 and 21
        n2 = Math.floor(Math.random() * 21) + 1; // Random int between 1 and 21
    } while (n == prevBackground || n2 == prevBackground2 || n == n2);
    prevBackground = n;
    prevBackground2 = n2;
    console.log("New backgrounds:", n, n2);

    bg.src = "";
    bg2.src = "";
    bg.classList = ["fadeOut"];
    bg2.classList = ["fadeOut"];

    setTimeout(() => {
        bg.src = "img/bg" + n + ".jpg";
        bg2.src = "img/bg" + n2 + ".jpg";
        bg.classList = ["fadeInOut"];
        bg2.classList = ["fadeInOut2"];
    }, 1000);
}