const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('connected to the db');
    }
});

function Init() {
    db.run(`CREATE TABLE IF NOT EXISTS spel (
	    id INT AUTO_INCREMENT PRIMARY KEY,
	    name VARCHAR(100) NOT NULL,
	    price FLOAT NOT NULL,
        quantity int NOT NULL,
	    imageName VARCHAR(100) NOT NULL
    );
    `);
}

async function retrieveAllSpellen() {
    return await new Promise((resolve, reject) => db.all(`SELECT * FROM spel`, (err, rows) => {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
    }));
}

async function changeSpelQuantity(spelId) {
    try {
        const quantity = db.all(`SELECT quantity FROM spel WHERE id = ?`, [spelId])
        db.run(`UPDATE spel SET quantity = ? WHERE id = ?`, [quantity, spelId]);
    } catch(err) {
        console.log('Error changing quantity of spel', err);
    }
}

async function retrieveAllSpellenData(items) {
    const allItems = await retrieveAllSpellen().then().catch(err => console.log('something went wrong in database', err));
    const itemsMap = new Map(Object.entries(items));
    const keys = Array.from(itemsMap.keys());

    console.log('items');
    console.log(items)

    console.log('KEYS')
    console.log(keys);

    itemObjArr = []

    for (let j = 0; j < allItems.length; j++) {
        if (keys.includes(String(allItems[j].id))) {
            allItems[j].quantity = itemsMap.get(String(allItems[j].id));
            itemObjArr.push(allItems[j]);
        }
    }

    return itemObjArr;
}

Init();
module.exports = {retrieveAllSpellen, changeSpelQuantity, retrieveAllSpellenData}