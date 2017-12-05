const config = {
    char_api: 'https://comicvine.gamespot.com/api/characters/?format=jsonp&json_callback=gotData&limit=1&api_key=494e2145fb4f91a34aba01d68fd14d413322eb28&filter=name:',
    random_char_api: 'https://comicvine.gamespot.com/api/characters/?format=jsonp&json_callback=gotData&limit=100&api_key=494e2145fb4f91a34aba01d68fd14d413322eb28&filter=offset:'
}

const ratingMessages = ["Not a fan", "It's okay", "Great work!", "Fabulous Page!"];
const heroesDC = ["superman", "batman", "wonder woman", "aquaman", "cyborg"];
const secButtons = document.getElementById("sec-buttons");
// const secButtons = document.getElementById("sec-buttons");
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const pageRating = document.getElementById("page-rating");
const bg = document.getElementById("bg");
const bg2 = document.getElementById("bg2");
const bgWrap = document.getElementById("bg-wrap");
const bgWrap2 = document.getElementById("bg-wrap2");
// const bgWrap2 = document.getElementById("bg-wrap2");
const buttonDC = document.getElementById("buttonDC");
const buttonRandom = document.getElementById("buttonRandom");
const copyrightInfo = document.getElementById("copyright-info");
const heroku = document.getElementById("heroku");
const footer = document.getElementsByTagName("footer")[0];

const heroDisplay = {
    logo: document.getElementById("hero-logo"),
    logoContainer: document.getElementById("logo-container"),
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



document.onload = (function() {
    // On Page load, we change to a random background image every 10 seconds.
    console.log("DOM fully loaded.");
    button2.onclick = "location.href='http://www.google.com'";

    checkHeroku(); // Checking if page is being visitted online on Heroku for better experience.
    getCopyrightData(); // Loading copyright data from copyright.html
    setSliderText(); // Setting text under Rating slider
    newBackground(bg); // Setting both moving backgrounds
    newBackground(bg2);
    setInterval(() => { // And Setting both moving backgrounds every 21 and 11 seconds
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
    buttonRandom.disabled = true;
    buttonRandom.value = "Loading...";
    getSuperHero();
});

pageRating.addEventListener("input", setSliderText);

footer.addEventListener("click", toggleCopyrightInfo);

function setSliderText() {
    let message = ratingMessages[pageRating.value - 1];
    rating.innerHTML = "<h2>" + message + "</h2>";
}

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
        n = Math.floor(Math.random() * 25) + 1; // Random int between 1 and 21
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

        // Fetching superhero data from Comicvine API using JQuery
        // Will be done just the 1st time pressing the 'Random Hero' button after loading the page, with 100 heros data.
        $.ajax({
            crossDomain: true,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            async: false,
            url: url,
            data: { symbol: 'ctsh' },
            dataType: "jsonp",
            jsonpCallback: 'gotData'
        });

    } else {
        // We have randomHeros already cached
        do {
            result = randomHeros[Math.floor(Math.random() * randomHeros.length)];
        } while (result.image == null); // To avoid heros without pictures from this API
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
    heroDisplay.logo.src = "";
    heroDisplay.logo.style.transform = "";
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

    if (heroesDC.includes(result.name.toLowerCase())) {
        heroDisplay.logoContainer.style.display = "";
        heroDisplay.logo.src = "img/logo/" + result.name.toLowerCase() + ".png";
    } else {
        heroDisplay.logoContainer.style.display = "none";
    }

    heroDisplay.name.innerHTML = "<h1>" + result.name + "</h1>";
    heroDisplay.nameRight.innerHTML = "<h2>" + result.name + "</h2>";
    heroDisplay.realName.innerHTML = result.real_name ? "<h3>Real name: " + result.real_name + "</h3>" : "<h3>Real name unknown.</h3>";

    let aliases = result.aliases ? "Aliases: " + result.aliases.split(/\n/).join(', ') : "";
    heroDisplay.aliases.innerHTML = "<h4>" + aliases + "</h4>";

    heroDisplay.birth.innerHTML = result.birth ? "<h3>Born: " + result.birth + "</h3>" : "";
    heroDisplay.desc.innerText = result.deck;
    heroDisplay.desc.innerHTML += "<br><br>(Source: <a href='https://comicvine.gamespot.com/api/documentation' target='_blank'>Comicvine</a>)";
}

function toggleCopyrightInfo() {
    copyrightInfo.style.display = copyrightInfo.style.display == "block" ? "none" : "block";

    // if (copyrightInfo.style.display == "block") {
    //     copyrightInfo.innerHTML = copyrightData;
    // }
}

function getCopyrightData() {
    $.ajax({
        url: "../copyright.html",
        async: true,
        success: function(data) {
            copyrightInfo.innerHTML = data;
            console.log("CopyRight data loaded.");
        }
    });
}

function checkHeroku() {
    heroku.style.display = document.URL.includes("justice-league-cit.herokuapp.com") ? "none" : "grid";
}