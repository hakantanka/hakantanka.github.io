const svg = document.querySelector('#africa');

let countryData;
let countryID;
let clickedMap = false;

// fire event only when the path element is clicked
svg.addEventListener('click', e => {if(e.target.id.length === 2) loadInfo(e.target);});

// set body height
document.body.style.height = window.innerHeight;

// set margin left of the map according to viewport width
window.addEventListener('resize', () => {  
    document.body.style.height = window.innerHeight; 
    if(window.innerWidth > 1600) {svg.style.marginLeft = '0px'}
    else if(window.innerWidth > 1300) {
        if(clickedMap) {
            svg.style.animation = 'mapRight 0.7s ease';
            svg.style.marginLeft = '40vw';
            document.querySelector('#mobileBG').style.display = 'none';
            document.querySelector('#close').style.display = 'none';
        } else { svg.style.marginLeft = '20vw' }
    } else if(window.innerWidth > 850){
        if(clickedMap) {
            svg.style.marginLeft = '5vw';
            document.querySelector('#mobileBG').style.display = 'block';
            document.querySelector('#close').style.display = 'block';
            document.querySelector('.nameAndFlag').style.zIndex = 3;
            document.querySelector('.infoBox').style.zIndex = 3;
        } else { svg.style.marginLeft = '5vw' }
    }
});

// select form submit buton click
document.querySelector('#submitBtn').addEventListener('click', (e) => {
    let selectedCountry = document.querySelector('#select').value;
    let paths = document.querySelectorAll('#africa path');
    paths = Array.from(paths);
    
    for(let i = 0; i < paths.length; i++) {
        if(selectedCountry === paths[i].id) {
            path = paths[i];
            break;
        }
    }
    loadInfo(path);

    e.preventDefault();
});


async function loadInfo(target) {
    clickedMap = true; 

    // set transition after removed by close button
    document.querySelector('.infoBox').style.transition = 'opacity 0.7s ease';   
    // move map to right if vieport 1301 - 1600
    if(window.innerWidth > 1301 && window.innerWidth < 1601) {
        svg.style.animation = 'mapRight 0.7s ease';
        setTimeout(() => svg.style.marginLeft = '40vw', 700);
    }     
    // reset the path color to transparent
    document.querySelectorAll('path').forEach(path => path.style.color = 'transparent'); 
    // change svg path color of selected country
    target.style.color = '#ee2b2b';    
    // get country data from API
    let response = await fetch(`https://restcountries.eu/rest/v2/alpha/${target.id.toLowerCase()}`);
    countryData = await response.json();
    // adjust names of countries to get required search results form Wiki
    if(countryData.alpha2Code === 'CD') { countryData.name = 'Democratic Republic of the Congo'};
    if(countryData.alpha2Code === 'CG') { countryData.name = 'Republic of the Congo'};
    if(countryData.alpha2Code === 'TZ') { countryData.name = 'Tanzania'};
    if(countryData.alpha2Code === 'CI') { countryData.name = 'Ivory Coast'};
    if(countryData.alpha2Code === 'SZ') { countryData.name = 'Eswatini'};

    if(window.innerWidth < 1301) { 
        // close tablet view
        document.querySelector('#close').addEventListener('click', closeTabletInfo);
        showTabletInfo() };

    // adjust info box height
    document.querySelector('.infoBox').style.height = '450px';

    // set country display name
    showCountryName(countryData.name);
    showInfoBox(countryData);
};

async function getCountryData(e) {
    let response = await fetch(`https://restcountries.eu/rest/v2/alpha/${e.target.id.toLowerCase()}`);
    countryData = await response.json();
};

// show country name
function showCountryName(countryName) {
    // remove previous flag
    document.querySelector('#flag').remove();

    // create an array out of the name
    const splitText = countryName.split("");
    // clear previous country
    document.querySelector('#countryName').innerHTML = '';
    for(let i = 0; i < splitText.length; i++) {
        document.querySelector('#countryName').innerHTML += `<span>${splitText[i]}</span>`;
    };
    let char = 0;
    let timer = setInterval(letterLoad, 50);

    function letterLoad() {
        const span = document.querySelectorAll('#countryName span')[char];
        span.classList.add('letterLoad');
        char++;
        if(char === splitText.length) {complete(); return;};
    };

    function complete() {
        clearInterval(timer);
        timer = null;
        showFlag()
    };
};

function showFlag() {
    showedFlag = true;
    // set flag
    const img = document.createElement('img');
    img.id = 'flag';
    img.setAttribute('src', `${countryData.flag}`);
    const parret = document.querySelector('.nameAndFlag');
    parret.appendChild(img);
    img.style.animation = 'flagAnimation 2s ease';
}

function showTabletInfo() {
    document.querySelector('.nameAndFlag').style.zIndex = 3;
    document.querySelector('#mobileBG').style.display = 'block';
    document.querySelector('#close').style.display = 'block';
    document.querySelector('.infoBox').style.zIndex = 3;
}

function closeTabletInfo() {
    clickedMap = false;
    document.querySelector('.nameAndFlag').style.zIndex = 1;
    document.querySelector('#mobileBG').style.display = 'none';
    document.querySelector('#close').style.display = 'none';
    document.querySelector('.infoBox').style.zIndex = 2;
    document.querySelector('.infoBox').style.transition = 'opacity 0s';
    document.querySelector('.infoBox').style.opacity = 0;
    document.querySelector('.infoBox').style.height = '100px';
    document.querySelector('#flag').style.opacity = 0;
    document.querySelectorAll('#countryName span').forEach(span => span.style.opacity = 0);
    document.querySelectorAll('path').forEach(path => path.style.color = 'transparent'); 
    stopAnthem();
}

