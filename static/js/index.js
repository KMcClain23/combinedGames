pageLoader();


// Function to load our page and set event listeners
function pageLoader(){

    const colorButtonsContainer = document.getElementById('color-buttons-container');

    // Get the color buttons and add change background event listener
    const colorButtons = colorButtonsContainer.getElementsByClassName('light-dark-button');
    for (let btn of colorButtons){
        btn.addEventListener('click', changeBackgroundColor);
    };

    // Get the nav links and add the changeView event listener
    const navLinks = document.getElementsByClassName('nav-link');
    for (let link of navLinks){
        link.addEventListener('click', changeView);
    }

    // Add the brew finder when the form submits
    const findBrewsForm = document.querySelector('#find-brews-form');
    findBrewsForm.addEventListener('submit', (e) => findBreweries(e, 1));
    
    // Add drag and drop for the beer and coaster
    const droppable = document.getElementById('droppable');
    droppable.addEventListener('dragover', allowDrop);
    droppable.addEventListener('drop', drop);
    const draggable = document.getElementById('draggable');
    draggable.addEventListener('dragstart', drag);

    // Add click listeners to the Bubbles to show how events propogate
    const bubbles = document.getElementsByClassName('bubble');
    bubbles[0].addEventListener('click', event => console.log("You clicked outer ... propogated from:", event.target.id));
    bubbles[1].addEventListener('click', event => {
        console.log("You clicked middle ... propogated from:", event.target.id);
        // event.stopPropagation(); // Will stop the event from also calling the outer event
    });
    bubbles[2].addEventListener('click', event => console.log("You clicked inner ... propogated from:", event.target.id));
}

// Create a function that will change the background color
function changeBackgroundColor(e){
    console.log('clicked color button');
    console.log(e.target.value);
    if (e.target.value === 'Dark'){
        document.body.style.backgroundColor = '#623509';
        document.body.classList.add('dark-mode');
    } else {
        document.body.style.backgroundColor = '#fbcea2';
        document.body.classList.remove('dark-mode');
    }
}


// Create a function to make this a Single Page App (SPA) by swapping visible divs
function changeView(event){
    // Turn off the element(s) that are visible
    const toTurnOff = Array.from(document.getElementsByClassName('is-visible'));
    for (let i = toTurnOff.length - 1; i >= 0; i--) {
        console.log('Turning off', toTurnOff[i]);
        toTurnOff[i].classList.replace('is-visible', 'is-invisible');
        toTurnOff[i].classList.remove('is-visible-flex');
        let navLink = document.getElementsByName(toTurnOff[i].id)[0];
        navLink.classList.remove('active');
    }
       
    // Turn on the element based on the link that was clicked
    let idToTurnOn = event.target.name;
    console.log(idToTurnOn)
    const toTurnOn = document.getElementById(idToTurnOn);
    if (idToTurnOn === 'find-brews') {
        toTurnOn.classList.replace('is-invisible', 'is-visible'); 
        toTurnOn.classList.add('is-visible-flex');
    } else {
        toTurnOn.classList.replace('is-invisible', 'is-visible');
    }
    event.target.classList.add('active');
    
    // Toggle beer movement
    if (idToTurnOn === 'grab'){
        startBeerMove();
    } else {
        endBeerMove();
    }
}


function findBreweries(event, pageNumber){
    event.preventDefault();
    // console.dir(event.target.city);
    const cityName = document.getElementsByName('city')[0].value;
    console.log(`Looking for breweries in ${cityName}...`);
    const url = `https://api.openbrewerydb.org/v1/breweries?by_city=${cityName}&per_page=10&page=${pageNumber}`;
    
    fetch(url)
    .then(response => response.json())
    .then(data => displayBreweries(data, pageNumber))
    .catch(err => console.error(err))
}


// Callback Function for findBreweries that will insert breweries into table
function displayBreweries(data, pageNumber){
    data.sort( (a, b) => {
        if (a.city > b.city){return 1}
        else if (a.city < b.city){ return -1}
        else { return 0}
    })
    let table = document.getElementById('brewery-table');
    
    // TODO: Clear out the table of any current data
    clearTable(table);
    
    if (data.length){
        // Create the brewery table headers
        const thead = document.createElement('thead');
        table.append(thead);
        let tr = document.createElement('tr');
        thead.append(tr);
        const tableHeadings = ['Name', 'Type', 'Street Address', 'City', 'State'];
        for (let heading of tableHeadings){
            let th = document.createElement('th');
            th.scope = 'col';
            th.innerText = heading;
            tr.append(th);
        }
        
        // write a row for each brewery in data
        for (let brewery of data){
            let tr = document.createElement('tr');
            tr.classList.add('table-row');
            table.append(tr);
            
            const td = document.createElement('td');
            td.innerHTML = `<a href=${brewery.website_url} target="_blank">${brewery.name}</a>`
            tr.append(td);
            
            newDataCell(tr, brewery.brewery_type);
            newDataCell(tr, brewery.street);
            newDataCell(tr, brewery.city);
            newDataCell(tr, brewery.state);
        }
    } else {
        let noMore = document.createElement('h4');
        noMore.innerText = pageNumber > 1 ? 'There are no breweries' : 'No Breweries in this city';
        noMore.classList.add('text-center')
        table.append(noMore);
    }
    
    const findBrewsForm = document.querySelector('#find-brews-form');

    // Add a next button if there is data
    if (data.length >= 0 && data.length == 10){
        let nextButton = document.createElement('button');
        nextButton.classList.add('prev-next-btn', 'next-button', 'btn', 'btn-primary', 'mx-2');
        nextButton.innerText = 'Next';
        nextButton.addEventListener('click', e => findBreweries(e, pageNumber + 1));
        findBrewsForm.after(nextButton);
    }

    // Add a previous button for all pages past page 1
    if (pageNumber > 1){
        let prevButton = document.createElement('button');
        prevButton.classList.add('prev-next-btn', 'prev-button', 'btn', 'btn-danger');
        prevButton.innerText = 'Prev';
        prevButton.addEventListener('click', e => findBreweries(e, pageNumber - 1))
        findBrewsForm.after(prevButton);
    }
}


// Helper function to create a new data cell for table
function newDataCell(tr, value){
    let td = document.createElement('td');
    td.innerText = value ?? '-';
    tr.append(td);
}

// Helper function to clear the brewery table
function clearTable(table){
    table.innerHTML = '';
    const buttonsToClear = document.querySelectorAll('.prev-next-btn');
    for (let btn of buttonsToClear){
        btn.remove()
    }
}

// All drop events by stopping the default behavior for dragging
function allowDrop(e){
    console.log('Allowing drop on:', e.target);
    e.preventDefault()
}

// Set up drag to transfer the element's ID
function drag(e){
    console.log('Dragging beer...');
    e.dataTransfer.setData('text', e.target.id);
    console.log(e.dataTransfer);
}

function drop(e){
    console.log('Dropping beer...');
    const beerId = e.dataTransfer.getData('text');
    console.log(beerId);
    const draggable = document.getElementById(beerId);
    e.target.append(draggable);
}

// Move the glass with key strokes by changing it's absolute position
function handleBeerMove(event){
    console.log(event.key);
    const arrowKeys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
    // If the user presses one of the arrow keys
    if (arrowKeys.includes(event.key)){
        // Move the beer glass 5px in that direction
        const glass = document.querySelector('.beerglass');
        switch(event.key){
            case 'ArrowUp':
                glass.style.top = parseInt(glass.style.top.substring(0, glass.style.top.length-2)) - 5 + 'px';
                break;
            case 'ArrowDown':
                glass.style.top = parseInt(glass.style.top.substring(0, glass.style.top.length-2)) + 5 + 'px';
                break;
            case 'ArrowLeft':
                glass.style.left = parseInt(glass.style.left.substring(0, glass.style.left.length-2)) - 5 + 'px';
                break;
            case 'ArrowRight':
                glass.style.left = parseInt(glass.style.left.substring(0, glass.style.left.length-2)) + 5 + 'px';
                break;
        }
        // If the beer glass is in the coaster, show a message
        if (glass.style.top === '200px' && glass.style.left === '450px'){
            setTimeout(() => {
                alert('Enjoy a nice cold beer!')
            });
        }
    }
}

// Functions to turn on and off the beer mover
function startBeerMove(){
    console.log('listening for beer movement');
    document.addEventListener('keydown', handleBeerMove);
}

function endBeerMove(){
    console.log('No longer listening for beer movement');
    document.removeEventListener('keydown', handleBeerMove);
}



