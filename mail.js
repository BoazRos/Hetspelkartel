const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'HetSpelKartelNL',
        pass: 'kpvm aovl krgy uewn'
    }
});

function sendMail(mailOptions) {
    mailOptions.from = 'Het Spelkartel';
    mailOptions.subject = 'Factuur';
    mailOptions.text = 'Bedankt voor uw bestelling. Hieronder vind u de factuur met alle informatie en betalingsinstructies. Fijne dag!';

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('E-mail verzonden: ' + info.response);
        }
    });

}

module.exports = { sendMail };