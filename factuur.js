const PDFDocument = require('pdfkit');
const fs = require('fs');

function createInvoice(data, filePath) {
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(14).text('Het Spelkartel', { align: 'left' });
    doc.fontSize(10).text('Boenstoep 1\n2809 RX Gouda\nHetSpelakartelNL@gmai.com');
    doc.moveDown();

    doc.fontSize(12).text(`Factuur voor:\n${data.customer.firstname} ${data.customer.lastname} \n${data.customer.address}\n${data.customer.email}`, { align: 'left' });
    doc.moveDown();

    doc.fontSize(12).text(`Factuurnummer: ${data.invoiceNumber}`);
    doc.text(`Datum: ${data.date}`);
    doc.moveDown();

    const rowHeight = 20;
    let y = doc.y; // startpositie na 'Spelletjes:'

    doc.fontSize(12).text('Spelletjes:', { underline: true });
    y += rowHeight;

    doc.font('Helvetica-Bold');
    doc.text('Titel', 50, y);
    doc.text('ID', 250, y);
    doc.text('Prijs', 400, y);

    y += rowHeight;
    doc.font('Helvetica');

    let total = 0;

    // Elke rij netjes onder elkaar tekenen
    data.games.forEach(game => {
        doc.text(game.name, 50, y);
        doc.text(String(game.id), 250, y);
        doc.text(`€${game.price.toFixed(2)}`, 400, y);
        total += game.price;
        y += rowHeight;
    });

    // Totaal onderaan
    y += rowHeight;
    doc.font('Helvetica-Bold').text(`Totaal: €${total.toFixed(2)}`, 400, y);

    y += rowHeight * 3;

    doc.fontSize(14).font('Helvetica-Bold').text('Betalingsinstructies', 50, y);

    y += rowHeight;

    doc.fontSize(12).font('Helvetica').text(
        'Gelieve het bedrag overmaken naar het volgende rekeningnummer:\n' +
        'IBAN: NL43 RABO 0168 4641 28\n' +
        't.n.v. Het Spelkartel\n' +
        'Vermeld bij betaling het factuurnummer: ' + data.invoiceNumber,
        50, y
    );

    doc.end();
}

module.exports = {createInvoice}; 