const MailListener = require("mail-listener2-updated");
const mailConfig = require('./config').mailConfig;
const shared = require("./functions");
const express = require('express');
const app = express();
const port = 3000

// list all orders
app.get('/', (req, res) => res.send("Hello stranger ..."));
// app.get('/orders/latest', (req, res) => res.send(shared.orders[shared.orders.length - 1]));
// app.get('/orders/all', (req, res) => res.send(shared.orders));
app.get('/natin/all', (req, res) => res.send(shared.orders));




// start the express server
app.listen(port, () => console.log(`Natin Mail Listener running @ http://localhost:${port}`))

const mailListener = new MailListener(mailConfig);
mailListener.start(); // start listening

mailListener.on("server:connected", function () {
    console.log("imapConnected");
});

mailListener.on("server:disconnected", function () {
    console.log("imapDisconnected");
    mailListener.start();
});

mailListener.on("error", function (err) {
    console.log(err);
});

mailListener.on("mail", function (mail, seqno, attributes) {
    shared.runOneAtATime(mail)
});

