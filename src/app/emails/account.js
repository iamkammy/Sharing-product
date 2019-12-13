const config = require('../../environment/environment');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.senGridApiKey);


const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: 'faizan.axovel@gmail.com',
        subject: 'Thanks For joining',
        text: `Welcome ${name} to Product sharing app `
    }
    try {
        sgMail.send(msg);
    } catch (e) {
        console.log(e.message);
    }
}
module.exports = {
    sendWelcomeEmail
}