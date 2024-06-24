const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { mongoose } = require("mongoose");
const typeDefs = require("./graphql/typesDefs");
const resolvers = require("./graphql/resolvers");
require("dotenv").config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("MongoDb Connected");
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
});
