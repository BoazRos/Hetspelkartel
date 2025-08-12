let oldWidth;
const resizeFactor = 500;

async function insertSpellen(max) {
    const maxSpellenOnRow = max;
    const spelMenu = document.querySelector('#spel-menu');
    const spellen = await fetch('api/retrieveAllSpellen').then(rows => rows.json()).then(rows => { return rows }).catch(error => console.log(error)); 

    if (!spellen) return;
    const t = spellen.length / maxSpellenOnRow;
    for (let i = 0; i < t; i++) {
        const spellenContainer = createSpellenContainer();
        spelMenu.appendChild(spellenContainer);

        for (let j = i * maxSpellenOnRow; j < (i + 1) * maxSpellenOnRow; j++) {
            if (j + 1 > spellen.length) break;
            const spelContainer = createSpelContainer(spellen[j].name, spellen[j].imageName, spellen[j].price, spellen[j].id);
            spellenContainer.appendChild(spelContainer);
        }
    }
}

function createSpelContainer(name, imgPath, price, id) {
    const spelContainer = document.createElement('div');
    spelContainer.classList += 'spel-container';

    const imgContainer = document.createElement('img');
    if (imgPath != 'noImage') {
        imgContainer.src = 'images/' + imgPath;
    }

    const h3 = document.createElement('h3');
    h3.textContent += name;

    const p = document.createElement('p');
    p.textContent += '\u20AC' + price;

    const button = document.createElement('button');
    button.textContent += 'Toevoegen aan winkelwagen';
    button.onclick = () => setItemQuantity(id, 1);

    spelContainer.appendChild(h3);
    spelContainer.appendChild(imgContainer);
    spelContainer.appendChild(p); 
    spelContainer.appendChild(button);

    return spelContainer;
}

function createSpellenContainer() {
    const spellenContainer = document.createElement('div');
    spellenContainer.classList += 'spellen-container'; 
    return spellenContainer;
}

function clearSpelMenu() {
    const spelMenu = document.querySelector('#spel-menu');
    while (spelMenu.firstChild) {
        spelMenu.removeChild(spelMenu.firstChild);
    }
}

async function setItemQuantity(id, quantity) {
    fetch('/api/setItemQuantityCart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({'id': id, 'quantity': quantity})})
        .then(() => console.log("added to cart succesfully"))
        .catch(error => console.log('error adding to shopping cart', error));
}

document.addEventListener('DOMContentLoaded', function () {
    oldWidth = window.innerWidth;
    insertSpellen(Math.ceil(oldWidth / resizeFactor));
});

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const oldFactor = Math.ceil(oldWidth / resizeFactor);
    const newFactor = Math.ceil(width / resizeFactor);
    if (oldFactor != newFactor) {
        clearSpelMenu();
        insertSpellen(newFactor);
    }
    oldWidth = width;
});
