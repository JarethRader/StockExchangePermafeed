const arweaveInstance = require("../utils/initArweave");
const { equals } = require("arql-ops");

module.exports = queryStocks = async (symbol, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      let stocks = [];
      let query = symbol
        ? equals("symbol", symbol)
        : date
        ? equals("date", date)
        : null;

      await arweaveInstance
        .arql(query)
        .then(async result => {
          for (let i = 0; i < result.length - 1; i++) {
            let data = JSON.parse(
              arweaveInstance.utils.b64UrlToString(
                await arweaveInstance.transactions.getData(result[i])
              )
            );
            stocks.push(data);
          }
          console.log(stocks);
          resolve(stocks);
        })
        .catch(err => {
          console.log(err);
          reject(new Error("Invalid query"));
        });
    } catch (err) {
      console.log(err);
      reject(new Error("Failed to fetch stock"));
    }
  });
};
