# tradingview-mail-watcher
A Node app that listens to incoming mail from TradingView

## How the email body is processed
```javascript
const pair = /(?<=#PAIR#)(.*?)(?=#PAIR#)/mg;
const orderType = /(?<=#ORDER#)(.*?)(?=#ORDER#)/mg;
const tp = /(?<=#TP#)(.*?)(?=#TP#)/mg;
const sl = /(?<=#SL#)(.*?)(?=#SL#)/mg;
```

The regex you see above is used to parse this string 
`#BOT_START##PAIR#EURUSD#PAIR##ORDER#0#ORDER##TP#1.0819057676206305#TP##SL#1.0822350985690543#SL#`
You can always change it to your desires.

## Setup
1. A Tradingview study that sends this exact string to the desired email account. You can use dynamic alerts in TV.
2. Install NodeJS https://nodejs.org/en/
3. Run `npm i`
4. Edit the config.js file

## Start the app
`EMAIL="<email>" PASSWORD="<email_password>" node app.js`

## API Routes

```
/orders/latest ~> This will show the newest alert
/orders/all ~> This will show all the alerts since the app started
```
