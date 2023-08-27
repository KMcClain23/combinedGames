pageLoader();


function pageLoader(){
    console.log('Loading the page with functionality...');

    const colorButtonsContainer = document.getElementById('color-buttons-container');

    // Get the color buttons and add change background event listener
    const colorButtons = colorButtonsContainer.getElementsByClassName('light-dark-button');
    for (let btn of colorButtons){
        btn.addEventListener('click', changeBackgroundColor);
    }

    // Add the country finder when the form submits
    const findCountriesForm = document.querySelector('#find-countries-form');
    findCountriesForm.addEventListener('submit', (e) => findCountries(e, 1));
}

// Create a function that will change the background color
function changeBackgroundColor(e){
    console.log('clicked color button');
    console.log(e.target.value);
    if (e.target.value === 'Dark'){
        document.body.style.backgroundColor = '#000000';
        document.body.classList.add('dark-mode');
    } else {
        document.body.style.backgroundColor = '#ffffff';
        document.body.classList.remove('dark-mode');
    }
}

// Create a function to make this a Single Page App (SPA) by swapping visible divs
function changeView(event){
    // Turn off the element(s) that are visible
    const toTurnOff = document.getElementsByClassName('is-visible');
    for (let element of toTurnOff){
        console.log('Turning off', element);
        element.classList.replace('is-visible', 'is-invisible');
    }

    // Turn on the element based on the link that was clicked
    let idToTurnOn = event.target.name;
    const toTurnOn = document.getElementById(idToTurnOn);
    toTurnOn.classList.replace('is-invisible', 'is-visible');
}

function findCountries(event, pageNumber){
    event.preventDefault();
    // console.dir(event.target.country);
    const countryName = document.getElementsByName('country')[0].value;
    console.log(`Looking for countries in ${countryName}...`);
    const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    fetch(url)
        .then(response => response.json())
        .then(data => displayCountries(data, pageNumber))
        .catch(err => console.error(err))
}

// Callback Function for findCountries that will insert countries into table
// ... Your existing code ...

// Callback Function for findCountries that will insert countries into table
function displayCountries(data) {
    
    let table = document.getElementById('country-table');

    // TODO: Clear out the table of any current data
    clearTable(table);
    
    // Create the country table headers
    const thead = document.createElement('thead');
    table.append(thead);
    let tr = document.createElement('tr');
    thead.append(tr);
    const tableHeadings = ['Name', 'Official Currency', 'Capital', 'Languages', 'Flag','Coat of Arms'];
    for (let heading of tableHeadings) {
        let th = document.createElement('th');
        th.scope = 'col';
        th.innerText = heading;
        tr.append(th);
    }

    // Write a row for each country in data
    for (let country of data) {
        let tr = document.createElement('tr');
        tr.classList.add('table-row');
        table.append(tr);

        const td = document.createElement('td');
        const countryNameLink = document.createElement('a');
        countryNameLink.href = `https://www.google.com/search?q=${encodeURIComponent(country.name.common)}`;
        countryNameLink.target = '_blank';
        countryNameLink.textContent = country.name.common;
        td.appendChild(countryNameLink);
        tr.append(td);

        newDataCell(tr, formatCurrencies(country.currencies));
        newDataCell(tr, country.capital ? country.capital[0] : '-');
        newDataCell(tr, country.languages ? formatLanguages(country.languages) : '-');

       
        const flagImgTd = document.createElement('td');
        const flagImgLink = document.createElement('a');
        flagImgLink.href = country.flags.png; // Assuming this is the direct URL to the flag image
        flagImgLink.target = '_blank';
        const flagImg = document.createElement('img');
        flagImg.src = country.flags.png;
        flagImg.alt = `Flag of ${country.name.common}`;
        flagImgLink.appendChild(flagImg);
        flagImgTd.appendChild(flagImgLink);
        tr.appendChild(flagImgTd);

       
        resizeImage(flagImg, 100, 100);

     
        const coatOfArmsTd = document.createElement('td');
        const coatOfArmsLink = document.createElement('a');
        coatOfArmsLink.href = country.coatOfArms.png; // Assuming this is the direct URL to the coat of arms image
        coatOfArmsLink.target = '_blank';
        const coatOfArmsImg = document.createElement('img');
        coatOfArmsImg.src = country.coatOfArms.png;
        coatOfArmsImg.alt = `Coat of Arms of ${country.name.common}`;
        coatOfArmsLink.appendChild(coatOfArmsImg);
        coatOfArmsTd.appendChild(coatOfArmsLink);
        tr.appendChild(coatOfArmsTd);

      
        resizeImage(coatOfArmsImg, 100, 100);
    }
}

// Function to resize an image element
function resizeImage(imageElement, width, height) {
    imageElement.width = width;
    imageElement.height = height;

}

function createGoogleSearchLink(text) {
    const link = document.createElement('a');
    link.href = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    link.target = '_blank';
    link.textContent = text;
    return link;
}

function formatCurrencies(currencies) {
    const currencyNames = Object.values(currencies).map(currency => currency.name);
    return currencyNames.join(', ');
}

function formatLanguages(languages) {
    const languageNames = Object.values(languages).map(language => language);
    return languageNames.join(', ');
}

// Helper function to create a new data cell for table
function newDataCell(tr, value) {
    let td = document.createElement('td');

    if (typeof value === 'string') {
        td.innerText = value;
    } else if (Array.isArray(value)) {
        td.innerText = value.join(', ');
    } else {
        td.innerText = '-';
    }

    tr.append(td);
}

// Helper function to clear the country table
function clearTable(table){
    table.innerHTML = '';
    const buttonsToClear = document.querySelectorAll('.prev-next-btn');
    for (let btn of buttonsToClear){
        btn.remove()
    }
}