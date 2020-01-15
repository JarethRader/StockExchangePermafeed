const arweaveInstance = require("../utils/initArweave");
const { and, equals } = require("arql-ops");

module.exports = queryStock = async (symbol, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      await arweaveInstance
        .arql(and(equals("symbol", symbol), equals("date", date)))
        .then(async result => {
          let data = JSON.parse(
            arweaveInstance.utils.b64UrlToString(
              await arweaveInstance.transactions.getData(result[0])
            )
          );
          resolve(data);
        })
        .catch(err => {
          reject(new Error("No stock found " + err));
        });

      resolve();
    } catch (err) {
      reject(new Error("Failed to fetch stock " + err));
    }
  });
};
