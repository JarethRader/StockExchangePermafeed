const schedule = require("node-schedule");
const stocks = require("../data/stockList");
const getYesterday = require("../utils/getYesterday");

module.exports = {
  fetchNew: () => {
    {
      var j = schedule.scheduleJob("0 0 0 * * *", function() {
        Object.entries(stocks).forEach(element => {
          try {
            getYesterday(element[0], args.range);
          } catch (err) {
            throw new Error("Failed to add data " + err);
          }
        });
      });
    }
  }
};
