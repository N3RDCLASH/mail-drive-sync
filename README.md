# Mail-Drive-Sync
A Node app that listens to incoming mail from my school and auto uploads the attachments to google drive.

Based on [**tradingview-mail-watcher**](https://github.com/pawiromitchel/tradingview-mail-watche) by [Mitchel Pawirodinomo](https://github.com/pawiromitchel/)



## How the email body is processed

> coming soon.

## Setup
1. A Tradingview study that sends this exact string to the desired email account. You can use dynamic alerts in TV.
2. Install NodeJS https://nodejs.org/en/
3. Run `npm i`
4. Edit the config.js file
5. run `node index.js` to setup google drive

## Start the app
`EMAIL="<email>" PASSWORD="<email_password>" node app.js`

> If you have two factor authentication enabled:
>- set up app passwords https://myaccount.google.com/apppasswords
>- use app password in the start command

## API Routes

> none currently.

## Features to implemented
- Mail sorting by subject.
- Uploading to specific folders.