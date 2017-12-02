// import config from './config.js';

var config = {
    // api_key: '494e2145fb4f91a34aba01d68fd14d413322eb28',
    // api_url: 'https://comicvine.gamespot.com/api/',
    char_api: 'https://comicvine.gamespot.com/api/characters/?format=jsonp&json_callback=gotData&limit=1&api_key=494e2145fb4f91a34aba01d68fd14d413322eb28&filter=name:',
    random_char_api: 'https://comicvine.gamespot.com/api/characters/?format=jsonp&json_callback=gotData&limit=100&api_key=494e2145fb4f91a34aba01d68fd14d413322eb28&filter=offset:'
    // char_api: 'https://comicvine.gamespot.com/api/characters/?format=json&api_key=494e2145fb4f91a34aba01d68fd14d413322eb28&filter=name:'
}

const heroesDC = ["superman", "batman", "wonder woman", "aquaman", "cyborg"]
const heroesMarvel = ["spider-man", "deadpool", "iron man", "captain america", "vision", "Hulk", "Thor"];


var secButtons = document.getElementById("sec-buttons");
var secButtons = document.getElementById("sec-buttons");
var button1 = document.getElementById("button1");
var button2 = document.getElementById("button2");
var button3 = document.getElementById("button3");
var bg = document.getElementById("bg");
var bg2 = document.getElementById("bg2");
var bgWrap = document.getElementById("bg-wrap");
var bgWrap2 = document.getElementById("bg-wrap2");
var bgWrap2 = document.getElementById("bg-wrap2");
var buttonDC = document.getElementById("buttonDC");

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
heroDisplay.img.onload = function () {
    var imgRatio = heroDisplay.img.width / heroDisplay.img.height;
    var containerRatio = heroDisplay.imgContainer.clientWidth / heroDisplay.imgContainer.clientHeight;

    scale = Math.min(
        heroDisplay.imgContainer.clientWidth / heroDisplay.img.width,
        heroDisplay.imgContainer.clientHeight / heroDisplay.img.height
    );
    heroDisplay.img.style.transform = "scale(" + scale + ")";
};

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
    do {
        heroe = heroesDC[Math.floor(Math.random() * heroesDC.length)];
    } while (heroe == prevHeroe);
    prevHeroe = heroe;
    getSuperHero(heroe);
});

buttonMarvel.addEventListener("click", () => {
    getSuperHero();
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


    heroDisplay.img.src = "img/loading.jpg";
    heroDisplay.name.innerText = (name == "batman") ? "nanana . . ." : "";
    heroDisplay.nameRight.innerText = "";
    heroDisplay.realName.innerText = "";
    heroDisplay.aliases.innerText = "";
    heroDisplay.birth.innerText = "";
    heroDisplay.desc.innerText = "";

    if (name || (name == "" && randomHeros.length == 0)) {
        try {
            fetchJsonp(url);
        } catch (e) {
            console.log(e);
        }
    } else {
        // We have randomHeros already cached
        do {
            result = randomHeros[Math.floor(Math.random() * randomHeros.length)];
            // console.log("Random hero from cache:", result.name);
        } while (result.image == null);

        heroDisplay.img.src = result.image.small_url;
        heroDisplay.img.classList = ["slideIn"];

        heroDisplay.name.innerText = result.name;
        heroDisplay.nameRight.innerText = result.name;
        heroDisplay.realName.innerText = result.real_name ? "Real name: " + result.real_name : "Real name unknown.";

        let aliases = result.aliases ? "Aliases: " + result.aliases.split(/\n/).join(', ') : "";
        heroDisplay.aliases.innerHTML = aliases;

        heroDisplay.birth.innerText = result.birth ? "Born: " + result.birth : "";
        heroDisplay.desc.innerText = result.deck;
        heroDisplay.desc.innerHTML += "<br><br>(Source: <a href='https://comicvine.gamespot.com/api/documentation' target='_blank'>Comicvine</a>)";
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

    heroDisplay.img.src = result.image.small_url;
    heroDisplay.img.classList = ["slideIn"];

    heroDisplay.name.innerText = result.name;
    heroDisplay.nameRight.innerText = result.name;
    heroDisplay.realName.innerText = result.real_name ? "Real name: " + result.real_name : "Real name unknown.";

    let aliases = result.aliases ? "Aliases: " + result.aliases.split(/\n/).join(', ') : "";
    heroDisplay.aliases.innerHTML = aliases;

    heroDisplay.birth.innerText = result.birth ? "Born: " + result.birth : "";
    heroDisplay.desc.innerText = result.deck;
    heroDisplay.desc.innerHTML += "<br><br>(Source: <a href='https://comicvine.gamespot.com/api/documentation' target='_blank'>Comicvine</a>)";
}