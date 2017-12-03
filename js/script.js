var config = {
    char_api: 'https://comicvine.gamespot.com/api/characters/?format=jsonp&json_callback=gotData&limit=1&api_key=494e2145fb4f91a34aba01d68fd14d413322eb28&filter=name:',
    random_char_api: 'https://comicvine.gamespot.com/api/characters/?format=jsonp&json_callback=gotData&limit=100&api_key=494e2145fb4f91a34aba01d68fd14d413322eb28&filter=offset:'
}

const ratingMessages = ["Not a fan","It's okay","Great work!","Fabulous Page!"];

const heroesDC = ["superman", "batman", "wonder woman", "aquaman", "cyborg"]
var secButtons = document.getElementById("sec-buttons");
var secButtons = document.getElementById("sec-buttons");
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");
var button3 = document.getElementById("button3");
var pageRating = document.getElementById("page-rating");
var bg = document.getElementById("bg");
var bg2 = document.getElementById("bg2");
var bgWrap = document.getElementById("bg-wrap");
var bgWrap2 = document.getElementById("bg-wrap2");
var bgWrap2 = document.getElementById("bg-wrap2");

var buttonDC = document.getElementById("buttonDC");
var buttonRandom = document.getElementById("buttonRandom");

var heroDisplay = {
    name: document.getElementById("hero-name"),
    nameRight: document.getElementById("hero-name-right"),
    aliases: document.getElementById("hero-aliases"),
    img: document.getElementById("hero-img"),
    imgContainer: document.getElementById("hero-img-container"),
    data: document.getElementById("hero-data"),
    desc: document.getElementById("hero-description"),
    realName: document.getElementById("hero-real-name"),
    birth: document.getElementById("hero-birth"),
}

var randomHeros = [];
var prevBackground = -1;
var prevHeroe = "";
var scale = 1;


window.addEventListener("load", () => {
    console.log("Page fully loaded.");
});


// On hero image load, we calculate aspect radio to make it fix the container.
// Used part of: https://css-tricks.com/scaled-proportional-blocks-with-css-and-javascript/
heroDisplay.img.addEventListener("load", function(event) {
    // Equivalent to:
    // heroDisplay.img.onload = function (event) {
    // heroDisplay.img.onload = (event) => {
    var imgRatio = heroDisplay.img.width / heroDisplay.img.height;
    var containerRatio = heroDisplay.imgContainer.clientWidth / heroDisplay.imgContainer.clientHeight;

    scale = Math.min(
        heroDisplay.imgContainer.clientWidth / heroDisplay.img.width,
        heroDisplay.imgContainer.clientHeight / heroDisplay.img.height
    );
    heroDisplay.img.style.transform = "scale(" + scale + ")";
});

document.onload = (function () {
    // On Page load, we change to a random background image every 10 seconds.
    console.log("DOM fully loaded.");
    button2.onclick = "location.href='http://www.google.com'";

    newBackground(bg);
    newBackground(bg2);
    setInterval(() => {
        newBackground(bg);
    }, 21000);
    setInterval(() => {
        newBackground(bg2);
    }, 11000);
})();

button1.addEventListener("click", () => {
    button1.classList.toggle('activebutton1');

    if (button1.classList.contains('activebutton1')) {
        showSecButtons();
    } else {
        hideSecButtons();
    }
});

buttonDC.addEventListener("click", () => {
    let heroe = "";
    buttonDC.disabled = true;
    buttonDC.value = "Loading...";
    do {
        heroe = heroesDC[Math.floor(Math.random() * heroesDC.length)];
    } while (heroe == prevHeroe);
    prevHeroe = heroe;
    getSuperHero(heroe);
});

buttonRandom.addEventListener("click", () => {
    // buttonRandom.setAttribute("disabled", "disabled");
    buttonRandom.disabled = true;
    buttonRandom.value = "Loading...";
    getSuperHero();
    // buttonRandom.disabled = false;
});

pageRating.addEventListener("input", (event) => {
    let message = ratingMessages[pageRating.value -1];
    rating.innerHTML = "<h2>" + message + "</h2>";
});

function showSecButtons() {
    button2.classList = ["slideIn"];
    button3.classList = ["slideIn"];
}

function hideSecButtons() {
    button3.classList = ["slideOut"];
    button2.classList = ["slideOut"];
}

function newBackground(element) {
    var n;
    do {
        n = Math.floor(Math.random() * 22) + 1; // Random int between 1 and 21
    } while (n == prevBackground);
    prevBackground = n;

    element.src = "";
    element.classList = ["fadeOut"];
    setTimeout(() => {
        element.src = "img/bg" + n + ".jpg";
        element.classList = element.id == "bg" ? ["fadeInOut"] : ["fadeInOut2"];
    }, 1000);
}

function getSuperHero(name = "") {

    const url = name ? config.char_api + name : config.random_char_api + Math.floor(Math.random() * 1000);

    clearHero();

    if (name || (name == "" && randomHeros.length == 0)) {
        fetchJsonp(url);
    } else {
        // We have randomHeros already cached
        do {
            result = randomHeros[Math.floor(Math.random() * randomHeros.length)];
            // console.log("Random hero from cache:", result.name);
        } while (result.image == null);
        render(result);
        buttonRandom.disabled = false;
        buttonRandom.value = "Random Hero (All Universes)!";
    }
}

function gotData(data) {
    let n, result;
    do {
        n = Math.floor(Math.random() * data.results.length);
        result = data.results[n];
    } while (result.image == null);

    if (randomHeros.length == 0 && data.results.length > 5) {
        randomHeros = data.results;
    }

    if (data.results.length > 5) {
        buttonRandom.disabled = false;
        buttonRandom.value = "Random Hero (All Universes)!";
    } else {
        buttonDC.disabled = false;
        buttonDC.value = "Random Justice League Member!";
    }
    render(result);
}

function clearHero() {
    heroDisplay.img.src = "img/loading.jpg";
    heroDisplay.name.innerText = (name == "batman") ? "nanana . . ." : "";
    heroDisplay.nameRight.innerText = "";
    heroDisplay.realName.innerText = "";
    heroDisplay.aliases.innerText = "";
    heroDisplay.birth.innerText = "";
    heroDisplay.desc.innerText = "";
}

function render(result) {
    heroDisplay.img.src = result.image.small_url;
    heroDisplay.img.classList = ["slideIn"];

    heroDisplay.name.innerHTML = "<h1>" + result.name + "</h1>";
    heroDisplay.nameRight.innerHTML = "<h2>" + result.name + "</h2>";
    heroDisplay.realName.innerHTML = result.real_name ? "<h3>Real name: " + result.real_name + "</h3>" : "<h3>Real name unknown.</h3>";

    let aliases = result.aliases ? "Aliases: " + result.aliases.split(/\n/).join(', ') : "";
    heroDisplay.aliases.innerHTML = "<h4>" + aliases + "</h4>";

    heroDisplay.birth.innerHTML = result.birth ? "<h3>Born: " + result.birth + "</h3>" : "";
    heroDisplay.desc.innerText = result.deck;
    heroDisplay.desc.innerHTML += "<br><br>(Source: <a href='https://comicvine.gamespot.com/api/documentation' target='_blank'>Comicvine</a>)";
}