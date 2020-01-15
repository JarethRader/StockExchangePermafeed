const arweaveInstance = require("./initArweave");
const jwk = require("../wallet.json");

module.exports = sendTransaction = (txData, symbol) => {
  return new Promise((resolve, reject) => {
    try {
      arweaveInstance
        .createTransaction(
          {
            data: JSON.stringify(txData)
          },
          jwk
        )
        .then(tx => {
          tx.addTag("symbol", symbol);
          tx.addTag("date", txData.date);
          arweaveInstance.transactions
            .sign(tx, jwk)
            .then(signedTx => {
              arweaveInstance.transactions
                .post(tx)
                .then(res => {
                  console.log(res.data);
                  resolve({ data: txData, receipt: res });
                })
                .catch(err => {
                  reject(new Error("Sending transaction failed " + err));
                });
            })
            .catch(err => {
              throw new Error("Signing transaction failed " + err);
            });
        })
        .catch(err => {
          reject(new Error("Creating Transaction Failed " + err));
        });
    } catch (err) {
      reject(new Error("Transaction failed to send " + err));
    }
  });
};
