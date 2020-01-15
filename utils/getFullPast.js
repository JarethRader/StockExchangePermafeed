const axios = require("axios");
const uuidv4 = require("uuid/v4");
const sendTransaction = require("./sendTransaction");
const { and, equals } = require("arql-ops");
const arweaveInstance = require("../utils/initArweave");

module.exports = getFullPast = (symbol, range) => {
  return new Promise(async (resolve, reject) => {
    let url = `https://query2.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}?interval=1d&range=${range}`;
    try {
      axios
        .get(url)
        .then(res => {
          let fullOutput = res.data.chart.result[0];
          let i = 0;
          fullOutput.timestamp.forEach(element => {
            var months_arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            var unixDate = new Date(fullOutput.timestamp[i] * 1000);
            var year = unixDate.getFullYear();
            var month = months_arr[unixDate.getMonth()];
            var day = unixDate.getDate();
            var convdataTime = year + "-" + month + "-" + day;

            let infoObj = {
              id: uuidv4(),
              symbol: symbol,
              date: convdataTime,
              open: parseFloat(fullOutput.indicators.quote[0].open[i]),
              high: parseFloat(fullOutput.indicators.quote[0].high[i]),
              low: parseFloat(fullOutput.indicators.quote[0].low[i]),
              close: parseFloat(fullOutput.indicators.quote[0].close[i]),
              volume: parseInt(fullOutput.indicators.quote[0].volume[i]),
              previous_close:
                i === 0
                  ? parseFloat(fullOutput.indicators.quote[0].close[i])
                  : parseFloat(fullOutput.indicators.quote[0].close[i - 1]),
              change:
                parseFloat(fullOutput.indicators.quote[0].close[i]) -
                (i === 0
                  ? parseFloat(fullOutput.indicators.quote[0].close[i])
                  : parseFloat(fullOutput.indicators.quote[0].close[i - 1])),
              change_percent:
                (parseFloat(fullOutput.indicators.quote[0].close[i]) -
                  (i === 0
                    ? parseFloat(fullOutput.indicators.quote[0].close[i])
                    : parseFloat(
                        fullOutput.indicators.quote[0].close[i - 1]
                      ))) /
                (i === 0
                  ? parseFloat(fullOutput.indicators.quote[0].close[i])
                  : parseFloat(fullOutput.indicators.quote[0].close[i - 1]))
            };
            try {
              arweaveInstance
                .arql(
                  and(equals("symbol", symbol), equals("date", convdataTime))
                )
                .then(result => {
                  if (!result[0]) {
                    for (let j = 0; j < 3; j++) {
                      try {
                        sendTransaction(infoObj, symbol);
                      } catch (err) {
                        // reject(new Error("Sending transacton failed " + err));
                      }
                    }
                  }
                })
                .catch(err => {
                  reject(new Error("Unable to find stock found " + err));
                });
            } catch (err) {
              reject(new Error("Unable to add new stock " + err));
            }
            i++;
          });
        })
        .catch(err => {
          reject(new Error("Could not fetch data from Yahoo Finance" + err));
        });
    } catch (err) {
      reject(new Error("Adding stock history failed " + err));
    }
    resolve({ success: true });
  });
};
