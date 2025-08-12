
async function displayItemsInCart() {
    console.log('called');
    const tbody = document.querySelector('#checkout-body')
    const itemsInCart = await getItemsinCart().catch(err => {console.log('Error fetching cart items', err)});
    console.log(itemsInCart, 'cart');

    let total = 0;

    itemsInCart.forEach(item => {
        const tr = document.createElement('tr');
        const idTd = document.createElement('td');
        idTd.textContent += item.id;

        const nameTd = document.createElement('td');
        nameTd.textContent += item.name;

        const priceTd = document.createElement('td');
        priceTd.textContent += item.price;
        total += item.price;

        const imageTd = document.createElement('td');
        const img = document.createElement('img');
        if (item.imageName = 'noImage') item.imageName += '.png';
        img.src = '/images/' + item.imageName;
        imageTd.appendChild(img);

        const quantityTd = document.createElement('td');
        quantityTd.textContent += item.quantity;

        const removeTd = document.createElement('td');
        const removeBtn = document.createElement('button');
        removeBtn.textContent += 'X'
        removeBtn.classList += 'removeButton';
        removeBtn.addEventListener('click', function () {
            removeFromCart(item.id);
            location.href = document.location.href;
        }); 
        removeTd.appendChild(removeBtn);

        tr.appendChild(idTd);
        tr.appendChild(imageTd);
        tr.appendChild(nameTd);
        tr.appendChild(quantityTd);
        tr.appendChild(priceTd);
        tr.appendChild(removeTd);

        tbody.appendChild(tr);
    });

    const totalElement = document.querySelector('.total');
    totalElement.textContent += total;
}

async function removeFromCart(itemId) {
    fetch('/api/setItemQuantityCart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: itemId }) })
        .then(() => console.log("removed from cart succesfully"))
        .catch(error => console.log('error removing from shopping cart', error));
}

async function setItemQuantity(id, quantity) {
    fetch('/api/setItemQuantityCart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id, 'quantity': quantity }) })
        .then(() => console.log("added to cart succesfully"))
        .catch(error => console.log('error adding to shopping cart', error));
}

async function getItemsinCart() {
    const itemsIdInCart = (await fetch('/api/retrieveCart')
        .then(data => data.json())
        .catch(error => console.log('something went wrong when loading cart: ', error)));
    const allItems = await fetch('/api/retrieveAllSpellen')
        .then(data => data.json())
        .catch(error => console.log('something went wrong when loading all items: ', error));

    const itemsInCart = [];

    const itemsIdInCartMap = new Map(Object.entries(itemsIdInCart));
    const itemsIdCartArr = Array.from(itemsIdInCartMap.keys());
    
    for (let j = 0; j < allItems.length; j++) {
        if (itemsIdCartArr.includes(String(allItems[j].id))) {
            allItems[j].quantity = itemsIdInCartMap.get(String(allItems[j].id));
            itemsInCart.push(allItems[j]);
        }
    }

    return itemsInCart;
}

function onDomLoaded() {
    document.querySelector('.pay-button').addEventListener('click', function () {
        getItemsinCart().then(function (items) {
            if (items.length > 0) {
                window.location.href = '/order';
            } else {
                alert('Je moet minimaal 1 product in je winkelwagen hebben om te bestellen');
            }
        }).catch(err => console.log('something went wrong with the order'));
    });
    displayItemsInCart();
}

document.addEventListener('DOMContentLoaded', onDomLoaded);