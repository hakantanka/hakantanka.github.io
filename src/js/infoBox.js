const general = document.querySelector('#general');
const wiki = document.querySelector('#wiki');
const anthem = document.querySelector('#anthem');
const wikiBox = document.querySelector('#wikiBox');
const generalCont = document.querySelector('#generalCont');
const wikiCont = document.querySelector('#wikiCont');
const anthemCont = document.querySelector('#anthemCont');

// to monitor which page is showing. Initial state of info box is showing general content
let infoBoxState = 'generalCont';

// show general content event
document.querySelector('#general').addEventListener('click', () =>  {
    if(infoBoxState !== 'generalCont') {infoBoxState = 'generalCont'; showGeneral(countryData);};
});

// show wiki content event
document.querySelector('#wiki').addEventListener('click', e =>  {
    if(infoBoxState !== 'wikiCont') {infoBoxState = 'wikiCont'; showWiki();};
});

// show anthem content event
document.querySelector('#anthem').addEventListener('click', e =>  {
    if(infoBoxState !== 'anthemCont') {infoBoxState = 'anthemCont'; showAnthem();};
});

let wikiData;
let wikiText;
let anthemTag;
let anthemName;

async function showInfoBox(countryData) {

    // show the info box
    // document.querySelector('.infoBox').style.zIndex = 2;
    document.querySelector('.infoBox').style.opacity = 1;
    document.querySelector('.infoBox').style.transform = 'translateX(0)';

    // get data from Wikipedia
    const wikiFetch = await fetch(`https://en.wikipedia.org//w/api.php?&origin=*&action=query&format=json&prop=extracts&titles=${countryData.name}&exintro=1`);
    wikiData = await wikiFetch.json();

    // get the anthem
    anthems.forEach(el => {
        if(el.country === countryData.name) { 
            anthemTag = el.tag; 
            anthemName = el.name;
        };
    });

    switch (infoBoxState) {
        case 'generalCont':
            showGeneral(countryData);
            break;
        case 'wikiCont':
            showWiki();
            break;
        case 'anthemCont':
            showAnthem();
            break;
    };
};

function showGeneral(countryData) {

    general.classList.add('selected');
    wiki.classList.remove('selected');
    anthem.classList.remove('selected');

    anthemCont.style.display = 'none';
    wikiBox.style.display = 'none';
    generalCont.style.display = 'block';
    
    let outPut = `
        <ul id="list">
            <li>Capital: <strong>${countryData.capital}</strong></li><hr>
            <li>Time zone: <strong>${countryData.timezones[0]}</strong></li><hr>
            <li>Native name: <strong>${countryData.nativeName}</strong></li><hr>
            <li>Population: <strong>${countryData.population}</strong></li><hr>
            <li>Currency: <strong>${countryData.currencies[0].name}</strong></li><hr>
            <li>Area: <strong>${countryData.area}</strong> km<sup>2</sup></li><hr>
        </ul>
    `;
    generalCont.innerHTML = outPut;  
};

function showWiki() {
    // get the key name
    const key = Object.keys(wikiData.query.pages);
    wikiText = wikiData.query.pages[key[0]].extract; 

    general.classList.remove('selected');
    wiki.classList.add('selected');
    anthem.classList.remove('selected');

    generalCont.style.display = 'none';
    anthemCont.style.display = 'none';
    wikiBox.style.display = 'block';
    
    wikiCont.innerHTML = wikiText;
};

function showAnthem() {

    general.classList.remove('selected');
    wiki.classList.remove('selected');
    anthem.classList.add('selected');

    generalCont.style.display = 'none';
    wikiBox.style.display = 'none';
    anthemCont.style.display = 'block';
 
    let insert = " onload=hideLoading()";
    let position = 7;
    anthemTag = [anthemTag.slice(0, position), insert, anthemTag.slice(position)].join('');

    anthemCont.innerHTML = `
        <p id="loading">loading...</p>
        ${anthemTag}
    `;
};

function hideLoading() {
    document.querySelector('#loading').textContent = anthemName;
}

function stopAnthem() {
    anthemCont.innerHTML = '';
}
