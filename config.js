const adminConfig = {
    'mail': {
        'maxMailAge': 60
    },
    'retry': {
        'retries': 30,
        'minTimeout': 1000,
        'maxTimeout': 6000,
    },
    'tradingview': {
        'mail': 'noreply@tradingview.com'
    }
}

const mailConfig = {
    username: process.env.EMAIL,
    password: process.env.PASSWORD,
    host: "imap.gmail.com",
    port: 993, // imap port
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX", // mailbox to monitor
    markSeen: false, // all fetched email willbe marked as seen and not fetched next time
}

module.exports = { adminConfig, mailConfig }