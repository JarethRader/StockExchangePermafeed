const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require("graphql");
const getFullPast = require("../utils/getFullPast");
const getYesterday = require("../utils/getYesterday");
const queryStock = require("../queries/queryStock");
const queryStocks = require("../queries/queryStocks");
const stocks = require("../data/stockList");

const StockType = new GraphQLObjectType({
  name: "Stock",
  fields: () => ({
    id: { type: GraphQLString },
    symbol: { type: GraphQLString },
    open: { type: GraphQLFloat },
    high: { type: GraphQLFloat },
    low: { type: GraphQLFloat },
    close: { type: GraphQLFloat },
    volume: { type: GraphQLInt },
    date: { type: GraphQLString },
    previous_close: { type: GraphQLFloat },
    change: { type: GraphQLFloat },
    change_percent: { type: GraphQLFloat }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    stock: {
      type: StockType,
      args: {
        symbol: { type: GraphQLString },
        date: { type: GraphQLString }
      },
      async resolve(parentValue, args) {
        return await queryStock(args.symbol, args.date);
      }
    },
    stocks: {
      type: new GraphQLList(StockType),
      args: {
        symbol: { type: GraphQLString },
        date: { type: GraphQLString }
      },
      async resolve(parentValue, args) {
        return await queryStocks(args.symbol, args.date);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addNew: {
      type: new GraphQLList(StockType),
      args: {
        symbol: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parentValue, args) {
        await getYesterday(args.symbol, args.range)
          .then(res => {
            return res.data;
          })
          .catch(err => {
            return new Error("Failed to add new data");
          });
      }
    },
    addAllNew: {
      type: new GraphQLList(StockType),
      resolve(parentValue, args) {
        return new Promise((resolve, reject) => {
          Object.entries(stocks).forEach(element => {
            try {
              getYesterday(element[0], args.range);
            } catch (err) {
              reject(new Error("Failed to add data " + err));
            }
          });
          resolve();
        });
      }
    },
    addPast: {
      type: new GraphQLList(StockType),
      args: {
        symbol: { type: new GraphQLNonNull(GraphQLString) },
        range: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parentValue, args) {
        let validRanges = [
          "1d",
          "5d",
          "1mo",
          "3mo",
          "6mo",
          "1y",
          "2y",
          "5y",
          "10y",
          "max"
        ];
        return new Promise((resolve, reject) => {
          for (let i = 0; i < validRanges.length; i++) {
            if (validRanges[i] === args.range) {
              resolve(
                getFullPast(args.symbol, args.range)
                  .then(res => res.data)
                  .catch(err => new Error("Failed to add data " + err))
              );
            }
          }
          reject(new Error("Invalid range"));
        });
      }
    },
    addAllPast: {
      type: new GraphQLList(StockType),
      args: {
        range: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parentValue, args) {
        let validRanges = [
          "1d",
          "5d",
          "1mo",
          "3mo",
          "6mo",
          "1y",
          "2y",
          "5y",
          "10y",
          "max"
        ];
        return new Promise((resolve, reject) => {
          for (let i = 0; i < validRanges.length; i++) {
            if (validRanges[i] === args.range) {
              Object.entries(stocks).forEach(element => {
                try {
                  getFullPast(element[0], args.range);
                } catch (err) {
                  reject(new Error("Failed to add data " + err));
                }
              });
              resolve();
            }
          }
          reject("Invalid range");
        });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
