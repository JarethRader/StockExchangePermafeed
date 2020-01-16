# StockExchangePermafeed
***Fetch stock data and cache it on the permaweb via Arweave***

The wallet address used for this project is CoT25r-ZdcP4r59JBsW0LdtteqTCt9O6VMOu0bbSwYQ
# Using this for your projects
While in theory it is possible to feed the thousands of stocks listed on todays exchange through this app, in practice it simply takes too long to be plausible. I highly reccomend editing ```./data/stockList.json``` and add only the stocks you wish to watching.

# Data
Here is a sample of the data schema
```
{
  "id": "7366665c-5ac2-4219-8f03-73b33de3e281",
  "symbol": "TSLA",
  "open": 493.5,
  "high": 525.6300048828125,
  "low": 492,
  "close": 524.8599853515625,
  "volume": 26517600,
  "date": "2020-1-13",
  "previous_close": 478.1499938964844,
  "change": 46.709991455078125,
  "change_percent": 0.09768899310116996
}
```
# Queries
This project uses graphql running on port 4000
Queries can be performed with both a symbol and a date, which will return a single object
Note that dates are in the YYYY-MM-DD format without leading zeros
```
{
  stock(symbol:"AMD", date: "2020-1-13") {
    id
    symbol
    open
    high
    low
    close
    volume
    date
    previous_close
    change
    change_percent
  }
}
```
Or queries can be performed with just a symbol for a stock, or a date
```
{
  stocks(symbol:"GOOG"){
    id
    symbol
    open
    high
    low
    close
    volume
    date
    previous_close
    change
    change_percent
  }
}
```
```
{
  stocks(date: "2020-1-13"){
    id
    symbol
    open
    high
    low
    close
    volume
    date
    previous_close
    change
    change_percent
  }
}
```
# Installation
run the following commands
```
  npm install
  npm run dev:server
```
