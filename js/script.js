// import config from './config.js';

var config = {
    // api_key: '494e2145fb4f91a34aba01d68fd14d413322eb28',
    // api_url: 'https://comicvine.gamespot.com/api/',
    char_api: 'https://comicvine.gamespot.com/api/characters/?format=jsonp&json_callback=gotData&limit=10&api_key=494e2145fb4f91a34aba01d68fd14d413322eb28&filter=name:'
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
    img: document.getElementById("hero-img"),
    data: document.getElementById("hero-data"),
    desc: document.getElementById("hero-description"),
    realName: document.getElementById("hero-real-name"),
    birth: document.getElementById("hero-birth"),
}

var prevBackground = -1;
var prevHeroe = "";


document.onload = (function() {
    // On Page load, we change to a random background image every 10 seconds.

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
    console.log("Getting heroe:", heroe);
    getSuperHero2(heroe);
});

buttonMarvel.addEventListener("click", () => {
    let heroe = "";
    do {
        heroe = heroesMarvel[Math.floor(Math.random() * heroesMarvel.length)];
    } while (heroe == prevHeroe);
    prevHeroe = heroe;
    console.log("Getting heroe:", heroe);
    getSuperHero2(heroe);
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
        n = Math.floor(Math.random() * 21) + 1; // Random int between 1 and 21
    } while (n == prevBackground);
    prevBackground = n;

    element.src = "";
    element.classList = ["fadeOut"];
    setTimeout(() => {
        element.src = "img/bg" + n + ".jpg";
        element.classList = element.id == "bg" ? ["fadeInOut"] : ["fadeInOut2"];
    }, 1000);
}

function getSuperHero(name) {

    console.log(`Getting superhero info...`);

    const url = config.char_api + name;

    fetch(url, { mode: 'cors' }).then((response) => {
        console.log(response);
    });
}

function getSuperHero2(name) {
    const url = config.char_api + name;

    heroDisplay.img.src = "img/loading.jpg";
    heroDisplay.name.innerText = (name == "batman") ? "nanana..." : "...";
    heroDisplay.realName.innerText = "";
    heroDisplay.birth.innerText = "";
    heroDisplay.desc.innerText = "";

    try {
        fetchJsonp(url);
    } catch (e) {
        console.log(e);
    }
    // .then(res => res.json())
    // .then(json => console.log(json));
}

function gotData(data) {
    // console.log(data.results[0].description);
    // console.log(data.results[0].name);

    let n, result;
    do {
        n = Math.floor(Math.random() * data.results.length);
        result = data.results[n];
        console.log(`${result.name} => ${n}/${data.results.length}`);
    } while (result.image.small_url == null)


    heroDisplay.img.src = result.image.small_url;
    heroDisplay.name.innerText = result.name;
    heroDisplay.realName.innerText = result.real_name ? "Real name: " + result.real_name : "Real name unknown.";
    heroDisplay.birth.innerText = result.birth ? "Born: " + result.birth : "";
    heroDisplay.desc.innerText = result.deck;
    heroDisplay.desc.innerText += "\n\n(Source: https://comicvine.gamespot.com/api)";
}