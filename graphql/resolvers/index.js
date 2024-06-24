const userResolvers = require("./user-resolvers");

module.exports = {
  Query: {
    ...userResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
  },
};
