const adminConfig = require('./config').adminConfig;
const fs = require('fs');
const { google } = require('googleapis');
const contacts = require('./contacts.js')
require('dotenv').config()

//google drive token path 
const TOKEN_PATH = 'token.json';


let runningMailHandler = false;

//TODO:Code Clean-Up 

// order array
let id = 0;
let emails = [];

/**
 * send the oder to whereever
 * @param {*} emailText 
 */
function saveEmail(emailText) {
    let trade = {}
    trade.email_text = emailText
    emails.push(trade);
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
 * @param mail the incoming mail object
 */
function handleMail(mail) {

    var email_text = ""
    if (mail.text) {
        email_text = mail.text
    }
    else if (mail.html) {
        email_text = mail.html
    }
    // E-Mail not from Natin
    if (!contacts.natin.find(contact => contact.email === mail.from[0].address.toString())) {
        console.log(`Email received from ${mail.from[0].address.toString()}. Ignoring since sender not Natin.`);
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
        if (mail.attachments) {
            const attachments = mail.attachments

            //read credentials
            const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
            const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

            //check if token is already stored
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) return getAccessToken(oAuth2Client, callback);
                oAuth2Client.setCredentials(JSON.parse(token));
                //upload each seperate attachement
                for (const file of attachments) {
                    uploadFile(oAuth2Client, file)
                }
            });


        }
        saveEmail(email_text);

    }
}

// upload file 
function uploadFile(auth, file) {
    const { fileName, contentType, path } = file
    const drive = google.drive({ version: 'v3', auth });

    var fileMetadata = {
        'name': fileName
    };
    var media = {
        mimeType: contentType,
        body: fs.createReadStream(path)
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log(file)
            console.log('File Id: ', file.id);
        }
    });

}

module.exports = { runOneAtATime, orders: emails }