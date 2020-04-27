const adminConfig = require('./config').adminConfig;

let runningMailHandler = false;

// REGEX to parse the email
const pair = /(?<=#PAIR#)(.*?)(?=#PAIR#)/mg;
const orderType = /(?<=#ORDER#)(.*?)(?=#ORDER#)/mg;
const tp = /(?<=#TP#)(.*?)(?=#TP#)/mg;
const sl = /(?<=#SL#)(.*?)(?=#SL#)/mg;

// order array
let id = 0;
let orders = [];

/**
 * send the oder to whereever
 * @param {*} emailText 
 */
function saveOrder(emailText) {
    let trade = {}

    trade.id = id++;
    trade.type = emailText.match(orderType)[0] == "1" ? "BUY" : "SELL";
    trade.ticker = emailText.match(pair)[0];
    trade.take_profit = emailText.match(tp)[0];
    trade.stop_loss = emailText.match(sl)[0];
    trade.date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // add the order
    orders.push(trade);
}

/**
 * Make sure that only one mail is being handled at a time
 */
function runOneAtATime(mail) {
    if (runningMailHandler) {
        setTimeout(runOneAtATime, 100, mail);
    }
    else {
        runningMailHandler = true;
        handleMail(mail);
        console.log('Listening for new TradeingView notifications...');
        runningMailHandler = false;
    }
}

/**
 * Handle new incoming emails
 * @param mail
 */
function handleMail(mail) {
    var email_text = ""
    if (mail.text) {
        email_text = mail.text
    }
    else if (mail.html) {
        email_text = mail.html
    }
    // E-Mail not from TradingView
    if (mail.from[0].address.toString() !== adminConfig.tradingview.mail) {
        console.log(`Email received from ${mail.from[0].address.toString()}. Ignoring since sender not TradingView.`);
        return;
    }
    // Old email -  do nothing
    if (new Date(mail.receivedDate) < new Date(Date.now() - adminConfig.mail.maxMailAge * 1000)) {
        console.log(`Email received from ${mail.from[0].address.toString()} but email already older than ${adminConfig.mail.maxMailAge}sec. Ignoring email. `);
        return;
    }
    // R-Mail content not readable - do nothing
    if (email_text === "") {
        console.log(`Email received from ${mail.from[0].address.toString()} but email content not readable. Ignoring email. `);
        return;
    }
    else {
        if (email_text.includes("#BOT_START#")) {
            console.log("[😎] PROCESSING ORDER");
            saveOrder(email_text);
        }
    }
}

module.exports = { runOneAtATime, orders }