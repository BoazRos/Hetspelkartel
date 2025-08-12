async function placeOrder() {
    const cart = await fetch('/api/retrieveCartData')
        .then(data => data.json())
        .catch(err => console.log('something went wrong at fetching cartdata', err));

    const customer = await fetch('/api/customer')
        .then(data => data.json())
        .catch(err => console.log('something went wrong at fetching customer', err));

    const max = 10000000
    const invoiceNumber = Math.floor(Math.random() * max);

    console.log("cart");
    console.log(cart);

    const data = {
        customer: customer,
        invoiceNumber: invoiceNumber,
        date: new Date().toLocaleDateString('nl-NL'),
        games: cart
    }

    const factuurAddres = await fetch('/api/createInvoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(data => data.json())
        .catch(err => console.log('something went wrong at fetching invoiceAddres', err))

    mailData = {
        to: customer.email,
        attachments: [
            {
                filename: 'factuur.pdf',
                path: factuurAddres.filePath,
                contentType: 'application/pdf'
            }
        ]
    };

    await fetch('/api/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mailData)
    })
        .catch(err => console.log('something went wrong at fetching mail', err))
    

    console.log('order placed!');
};

function onDomLoaded() {
    placeOrder();
    console.log('called!!!');
}

document.addEventListener('DOMContentLoaded', onDomLoaded);