const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser')
const db = require('./database.js');
const factuur = require('./factuur.js');
const mail = require('./mail.js');
const PORT = 8080;

app.use(express.json(), express.urlencoded({ extended: true }), cookieParser(), express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/spelmenu', (req, res) => { 
    res.sendFile(path.join(__dirname, 'public', 'html', 'spelmenu.html'));
});

app.get('/checkout', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'checkout.html'));
});

app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'order.html'));
}) 

app.get('/api/retrieveAllSpellen', (req, res) => {
    db.retrieveAllSpellen().then(rows => res.send(rows)).catch(error => console.log('Error revreiving spellen at server: '+ error));
});
  
app.get('/api/retrieveCart', (req, res) => {
    const cookies = req.cookies.cart
    if (cookies === undefined) {
        res.send({})
    } else {
        res.send(cookies);
    }
});

app.get('/api/retrieveCartData', (req, res) => {
    const cartIdString = req.cookies.cart
    const obj = JSON.parse(cartIdString)

    db.retrieveAllSpellenData(obj)
        .then(cart => res.send(cart))
        .catch(err => console.log('something went wrong getting cart data', err));
});

app.get('/api/customer', (req, res) => {
    const customer = req.cookies.customer;
    res.status(200).send(customer);
});

app.post('/api/sendMail', (req, res) => {
    const mailData = req.body;
    mail.sendMail(mailData);
    res.status(200);
});

app.post('/api/createInvoice', (req, res) => {
    const data = req.body;
    const filePath = `${__dirname}/facturen/${data.customer.lastname}_${data.invoiceNumber}.pdf`;
    factuur.createInvoice(data, filePath);
    res.status(200).send({ filePath: filePath });
});

app.post('/api/setItemQuantityCart', (req, res) => {
    const id = req.body.id;
    const quantity = req.body.quantity;

    let cart;

    if (req.cookies.cart === undefined) {
        res.cookie('cart', JSON.stringify(new Map()));
        cart = new Map();
    } else {
       cart = new Map(Object.entries(JSON.parse(req.cookies.cart)));
    }

    if (quantity == 0) {
        cart.delete(id);
    } else {
        cart.set(id, quantity);
    }

    const cartString = JSON.stringify(Object.fromEntries(cart));
    res.cookie('cart', cartString);
    res.status(200).send('OK');
});

app.post('/set-customer', (req, res) => {
    const firstName = req.body.voornaam;
    const lastName = req.body.achternaam
    const email = req.body.email;
    const zipCode = req.body.postcode;
    const houseNumber = req.body.huisnummer;
    const city = req.body.stad;
    const paymentMenthod = req.body.betalingsmethode;
    const street = req.body.straatnaam;
    const address = `${street} ${houseNumber}, ${zipCode}, ${city}`;

    const customer = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        zipcode: zipCode,
        housenumber: houseNumber,
        city: city,
        paymentmenthod: paymentMenthod,
        street: street,
        address: address
    }

    res.cookie('customer', JSON.stringify(customer)); 
    res.redirect('/place-order');
});

app.get('/place-order', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'order-placed.html'));
});

app.post('/api/refresh', (req, res) => {
    res.redirect('/checkout');
});

app.use((req, res) => {
    res.status(404).send('404 - Pagina niet gevonden');
});

app.listen(PORT, () => {
    console.log("De server draait!");
});