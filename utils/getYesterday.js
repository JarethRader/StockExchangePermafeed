const axios = require("axios");
const uuidv4 = require("uuid/v4");
const sendTransaction = require("./sendTransaction");

module.exports = getYesterday = (symbol, range) => {
  return new Promise((resolve, reject) => {
    let url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}?interval=1d&range=2d`;

    try {
      axios
        .get(url)
        .then(res => {
          let output = res.data.chart.result;
          var months_arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
          var unixDate = new Date(output[0].timestamp[1] * 1000);
          var year = unixDate.getFullYear();
          var month = months_arr[unixDate.getMonth()];
          var day = unixDate.getDate();
          var convdataTime = year + "-" + month + "-" + day;

          let infoObj = {
            id: uuidv4(),
            symbol: symbol,
            date: convdataTime,
            open: parseFloat(output[0].indicators.quote[0].open[1]),
            high: parseFloat(output[0].indicators.quote[0].high[1]),
            low: parseFloat(output[0].indicators.quote[0].low[1]),
            close: parseFloat(output[0].indicators.quote[0].close[1]),
            volume: parseInt(output[0].indicators.quote[0].volume[1]),
            previous_close: parseFloat(output[0].indicators.quote[0].close[0]),
            change:
              parseFloat(output[0].indicators.quote[0].close[1]) -
              parseFloat(output[0].indicators.quote[0].close[0]),
            change_percent:
              (parseFloat(output[0].indicators.quote[0].close[1]) -
                parseFloat(output[0].indicators.quote[0].close[0])) /
              parseFloat(output[0].indicators.quote[0].close[0])
          };

          for (let j = 0; j < 3; j++) {
            try {
              sendTransaction(infoObj, symbol);
              break;
            } catch (err) {
              throw new Error("Sending transaction failed " + err);
            }
          }
        })
        .catch(err => {
          reject(new Error("Failed to get data from Yahoo Finance" + err));
        });
    } catch (err) {
      reject(new Error("Adding stock history failed " + err));
    }
    resolve({ success: true });
  });
};
